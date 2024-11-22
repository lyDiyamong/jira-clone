"use client";
import React, { useEffect, useState } from "react";
import { SprintBoardProps } from "./SprintBoard";
import { Sprint } from "@prisma/client";
import { isAfter, isBefore, format, formatDistanceToNow } from "date-fns";
// shadcn import
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useFetch from "@/hooks/use-fetch";
import { SprintStatus, updateSprintStatus } from "@/actions/sprint";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";
import { useSearchParams, useRouter } from "next/navigation";

type SprintManagerProps<Type> = {
    sprint: Type;
    setSprint: React.Dispatch<React.SetStateAction<Type | undefined>>;
} & Pick<SprintBoardProps<Type>, "sprints" | "projectId">;

const SprintManager = <Type extends Sprint>({
    sprint,
    setSprint,
    sprints,
    projectId,
}: SprintManagerProps<Type>) => {
    const [status, setStatus] = useState(sprint.status);

    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const sprintId = searchParams.get("sprint");

        if (sprintId && sprintId !== sprint.id) {
            const selectedSprint = sprints.find(
                (sprint) => sprint.id === sprintId
            );
            if (selectedSprint) {
                setSprint(selectedSprint);
                setStatus(selectedSprint.status);
            }
        }
    }, [searchParams, sprints]);

    // Sprint Date
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);
    const now = new Date();

    const canStart =
        isBefore(now, endDate) &&
        isAfter(now, startDate) &&
        status === "PLANNED";

    // Server action
    const {
        fn: updateStatusFn,
        loading,
        data: updatedStatus,
    } = useFetch(updateSprintStatus);

    // Handler
    const handleSprintChange = (value: string): void => {
        const selectedSprint = sprints?.find((select) => select.id === value);
        if (selectedSprint) {
            setSprint(selectedSprint);
            setStatus(selectedSprint.status); // Only update status if selectedSprint is defined)
            router.replace(`/project/${projectId}`, undefined, {
                shallow: true,
            });
        } else {
            setSprint(undefined); // Handle cases where no sprint is found
            setStatus("PLANNED"); // Or any default status you want to use
        }
    };
    const handleStatusChange = async (newStatus: SprintStatus) => {
        await updateStatusFn(sprint.id, newStatus);
    };

    useEffect(() => {
        if (updatedStatus) {
            setStatus(updatedStatus.status);
            setSprint({
                ...sprint,
                status: updatedStatus.status,
            });
            toast.success("Sprint updated successfully ");
        }
    }, [updatedStatus, loading]);

    const getStatusText = (): string | null => {
        if (status === "COMPLETED") {
            return `Sprint Ended`;
        }
        if (status === "ACTIVE" && isAfter(now, endDate)) {
            return `Overdue by ${formatDistanceToNow(endDate)}`;
        }
        if (status === "PLANNED" && isBefore(now, startDate)) {
            return `Starts in ${formatDistanceToNow(startDate)}`;
        }
        return null;
    };

    const canEnd = status === "ACTIVE";
    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <Select
                    defaultValue={sprint.id}
                    onValueChange={handleSprintChange}
                >
                    <SelectTrigger className="bg-slate-950 self-start">
                        <SelectValue placeholder="Select Sprint" />
                    </SelectTrigger>
                    <SelectContent>
                        {sprints?.map((sprint) => {
                            return (
                                <SelectItem key={sprint.id} value={sprint.id}>
                                    {sprint.name} (
                                    {format(sprint.startDate, "MMM d, yyyy")})
                                    to {format(sprint.endDate, "MMM d, yyyy")}
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>

                {canStart && (
                    <Button
                        className="w-full md:w-32 bg-green-900 text-white"
                        onClick={() => handleStatusChange("ACTIVE")}
                        disabled={loading}
                    >
                        Start Sprint
                    </Button>
                )}
                {canEnd && (
                    <Button
                        className="w-full md:w-32"
                        onClick={() => handleStatusChange("COMPLETED")}
                        variant={"destructive"}
                        disabled={loading}
                    >
                        End Sprint
                    </Button>
                )}
            </div>

            {loading && (
                <BarLoader width={"100%"} className="mt-2" color="#36d7b7" />
            )}

            {getStatusText() && (
                <Badge className="mt-3 ml-1 self-start">
                    {getStatusText()}
                </Badge>
            )}
        </>
    );
};

export default SprintManager;
