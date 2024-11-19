"use client";

import { Button } from "@/components/ui/button";
import { sprintSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { addDays, format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { CalendarIcon } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { createSprint } from "@/actions/sprint";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sprint } from "@prisma/client";

// Date range Props
type DateRange = {
    to: Date
    from: Date
}

const SprintCreationForm = ({
    projectTitle,
    projectKey,
    projectId,
    sprintKey,
}: {
    projectTitle: string;
    projectKey: string;
    projectId: string;
    sprintKey: number;
}) => {
    // State
    const [showForm, setShowForm] = useState(false);
    const [dateRange, setDateRange] = useState<DateRange>({
        from: new Date(),
        to: addDays(new Date(), 14),
    });

    const router = useRouter();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<Sprint>({
        resolver: zodResolver(sprintSchema),
        defaultValues: {
            name: `${projectKey}-${sprintKey}`,
            startDate: dateRange.from,
            endDate: dateRange.to,
        },
    });

    const { loading: createSprintLoading, fn: createSprintFn } =
        useFetch(createSprint);

    const onSubmit: SubmitHandler<Sprint> = async (data: Sprint) => {
        await createSprintFn(projectId, {
            ...data,
            startDate: dateRange.from,
            endDate: dateRange.to,
        });
        setShowForm(false);
        toast.success("Sprint Create successfully");
        router.refresh();
    };

    return (
        <>
            <div className="flex justify-between">
                <h1 className="gradient-title text-5xl font-bold mb-8">
                    {projectTitle}
                </h1>
                <Button
                    className="mt-2"
                    onClick={() => setShowForm(!showForm)}
                    variant={showForm ? "destructive" : "default"}
                >
                    {showForm ? "Cancel" : "Create New Sprint"}
                </Button>
            </div>

            {showForm && (
                <>
                    <Card className="pt-4 mb-4">
                        <CardContent>
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                action=""
                                className="flex gap-4 items-end"
                            >
                                <div className="flex-1">
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium mb-1"
                                    >
                                        Sprint Name
                                    </label>
                                    <Input
                                        readOnly
                                        className="bg-slate-950"
                                        id="name"
                                        {...register("name")}
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>
                                {/* Start date */}
                                <div className="">
                                    <label
                                        htmlFor=""
                                        className="block text-sm font-medium mb-1"
                                    >
                                        Sprint Duration
                                    </label>
                                    <Controller
                                        control={control}
                                        name="dateRange"
                                        render={({ field }) => {
                                            return (
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className={`w-full justify-start text-left font-normal bg-slate-950 ${
                                                                !dateRange &&
                                                                "text-muted-foreground"
                                                            }`}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {dateRange.from &&
                                                            dateRange.to ? (
                                                                format(
                                                                    dateRange.from,
                                                                    "LLL dd, y"
                                                                ) +
                                                                " - " +
                                                                format(
                                                                    dateRange.to,
                                                                    "LLL dd, y"
                                                                )
                                                            ) : (
                                                                <span>
                                                                    Pick a Date
                                                                </span>
                                                            )}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent
                                                        className="w-auto bg-slate-900"
                                                        align="start"
                                                    >
                                                        <DayPicker
                                                            mode="range"
                                                            selected={dateRange}
                                                            onSelect={(
                                                                range: DateRange
                                                            ) => {
                                                                if (
                                                                    range?.from &&
                                                                    range.to
                                                                ) {
                                                                    setDateRange(
                                                                        range
                                                                    );
                                                                    field.onChange(
                                                                        range
                                                                    );
                                                                }
                                                            }}
                                                            classNames={{
                                                                chevron:
                                                                    "fill-blue-500",
                                                                range_start:
                                                                    "bg-blue-700",
                                                                range_end:
                                                                    "bg=blue-800",
                                                                range_middle:
                                                                    "bg-blue-400",
                                                                day_button:
                                                                    "border-none",
                                                                today: "border-2 border-blue-700",
                                                            }}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            );
                                        }}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={createSprintLoading}
                                    className=""
                                >
                                    {createSprintLoading
                                        ? "Creating..."
                                        : "Create Sprint"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </>
            )}
        </>
    );
};

export default SprintCreationForm;
