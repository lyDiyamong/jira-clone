"use client";
import { Issue, IssuePriority, User } from "@prisma/client";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "./ui/card";
import { Badge } from "./ui/badge";
import UserAvatar from "./UserAvatar";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useRouter } from "next/navigation";
import IssueDetailDialog from "./IssueDetailDialog";

const priorityColor = {
    LOW: "border-green-600",
    MEDIUM: "border-yellow-300",
    HIGH: "border-orange-400",
    URGENT: "border-red-400",
};

type IssueCardProps = {
    issue: Issue & { assignee: User };
    showStatus: boolean;
    onDelete: VoidFunction;
    onUpdate: VoidFunction;
};

const IssueCard = ({
    issue,
    showStatus = true,
    onDelete = () => {},
    onUpdate = () => {},
}: IssueCardProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const router = useRouter();

    const onDeleteHandler = (...params) => {
        router.refresh();
        onDelete(...params);
    };
    const onUpdateHandler = (...params) => {
        router.refresh();
        onUpdate(...params);
    };

    const created = formatDistanceToNow(new Date(issue.createdAt), {
        // format to x ago like : hours ago, days ago
        addSuffix: true,
    });

    return (
        <>
            <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setIsDialogOpen(true)}
            >
                <CardHeader
                    className={`border-t-2 ${
                        priorityColor[issue.priority]
                    } rounded-lg`}
                >
                    <CardTitle>{issue.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    {showStatus && <Badge>{issue.status}</Badge>}
                    <Badge
                        variant="outline"
                        className={`ml-1 ${priorityColor[issue.priority]}`}
                    >
                        {issue.priority}
                    </Badge>
                </CardContent>
                <CardFooter className="flex flex-col items-start space-y-3">
                    <UserAvatar user={issue.assignee} />

                    <div className="text-xs text-gray-400 w-full">
                        Created {created}
                    </div>
                </CardFooter>
            </Card>
            {isDialogOpen && (
                <>
                    <IssueDetailDialog
                        isOpen={isDialogOpen}
                        onClose={() => setIsDialogOpen(false)}
                        issue={issue}
                        onDelete={onDeleteHandler}
                        onUpdate={onUpdateHandler}
                        borderCol={
                            priorityColor[IssuePriority[issue?.priority]]
                        }
                        router={router}
                    />
                </>
            )}
        </>
    );
};

export default IssueCard;
