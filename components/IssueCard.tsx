"use client";
import { Issue, User } from "@prisma/client";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter
} from "./ui/card";
import { Badge } from "./ui/badge";
import UserAvatar from "./UserAvatar";

const priorityColor = {
    LOW: "border-green-600",
    MEDIUM: "border-yellow-300",
    HIGH: "border-orange-400",
    URGENT: "border-red-400",
};

type IssueCardProps = {
    issue: Issue & { assignee : User  };
    showStatus: boolean;
    onDelete: VoidFunction;
    onUpdate: VoidFunction;
};

const IssueCard = ({
    issue,
    showStatus = false,
    onDelete,
    onUpdate,
}: IssueCardProps) => {
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>{issue.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    {showStatus && <Badge>{issue.status}</Badge>}
                    <Badge variant="outline" className="ml-1">
                        {issue.priority}
                    </Badge>

                </CardContent>
                <CardFooter>
                    <UserAvatar user={issue.assignee}  />
                </CardFooter>
            </Card>
        </>
    );
};

export default IssueCard;
