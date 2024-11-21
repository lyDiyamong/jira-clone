import { Issue, User } from "@prisma/client";
import { useState } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useOrganization, useUser } from "@clerk/nextjs";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { ExternalLink } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { deleteIssue, updateIssue } from "@/actions/issue";
import { BarLoader } from "react-spinners";
import statuses from "@/data/status.json";
import MDEditor from "@uiw/react-md-editor";
import UserAvatar from "./UserAvatar";

const priorityOptions = ["LOW", "MEDIUM", "HIGH", "URGENT"];

type IssueDialogDetailProps = {
    isOpen: boolean;
    onClose: VoidFunction;
    issue: Issue & { assignee: User; reporter: User };
    onDelete: VoidFunction;
    onUpdate: VoidFunction;
    borderCol: string;
    router: AppRouterInstance;
};

const IssueDetailDialog = ({
    isOpen,
    onClose,
    issue,
    onDelete,
    onUpdate,
    borderCol,
    router,
}: IssueDialogDetailProps) => {
    const [status, setStatus] = useState(issue.status);
    const [priority, setPriority] = useState(issue.priority);

    const { user } = useUser();
    const { membership } = useOrganization();

    const pathName = usePathname();

    const {
        loading: deleteLoading,
        error: deleteError,
        fn: deleteIssueFn,
        data: deletedData,
    } = useFetch(deleteIssue);

    const {
        loading: updateLoading,
        error: updateError,
        fn: updateIssueFn,
        data: updatedData,
    } = useFetch(updateIssue);

    const handleStatusChange = async (newStatus: Issue["status"]) => {
        setStatus(newStatus);
        updateIssueFn(issue.id, { status: newStatus, priority });
        router.refresh();
    };
    const handlePriorityChange = async (newPriority: Issue["priority"]) => {
        setPriority(newPriority);
        updateIssueFn(issue.id, { priority: newPriority, status });
        router.refresh();
    };

    // Handle delete issue
    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this issue?")) {
            deleteIssueFn(issue.id);
        }
    };

    const canChange =
        user?.id === issue.reporter.clerkUserId ||
        membership?.role === "org:admin";

    const handleGoToProject = () => {
        router.push(`/project/${issue.projectId}?sprint=${issue.sprintId}`);
    };

    const isProjectPage = pathName.startsWith("/project/");
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <div className="flex justify-between items-center">
                        <DialogTitle>{issue?.title}</DialogTitle>
                    </div>
                    {isProjectPage && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleGoToProject}
                            title="Go to Project"
                        >
                            <ExternalLink className="size-4" />
                        </Button>
                    )}
                </DialogHeader>
                {(updateLoading || deleteLoading) && (
                    <BarLoader
                        width={"100%"}
                        className="mt-2"
                        color="#36d7b7"
                    />
                )}
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Select
                            value={status}
                            onValueChange={handleStatusChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statuses.map((option) => (
                                    <SelectItem
                                        key={option.key}
                                        value={option.key}
                                    >
                                        {option.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            value={priority}
                            onValueChange={handlePriorityChange}
                            disabled={!canChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                {priorityOptions.map((option) => (
                                    <SelectItem key={option} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Markdown fetching */}
                    <div className="">
                        <h4 className="font-semibold">Description</h4>
                        <MDEditor.Markdown
                            className="rounded px-2 py-1"
                            source={issue.description || "--"}
                        />
                    </div>
                    {/* User profile */}
                    <div className="flex justify-between">
                        {/* Assignee avatar */}
                        <div className="flex flex-col gap-2">
                            <h4 className="font-semibold">Assignee</h4>
                            {/* Reporter avatar */}
                            <UserAvatar user={issue.assignee} />
                            <div className="flex flex-col gap-2">
                                <h4 className="font-semibold">Reporter</h4>
                                <UserAvatar user={issue.reporter} />
                            </div>
                        </div>
                    </div>
                    {canChange && (
                        <Button
                            onClick={handleDelete}
                            disabled={deleteLoading}
                            variant="destructive"
                        >
                            {deleteLoading ? "Deleting..." : "Delete Issue"}
                        </Button>
                    )}
                    {(deleteError || updateError) && (
                        <p className="text-red-500">
                            {deleteError?.message || updateError?.message}
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default IssueDetailDialog;
