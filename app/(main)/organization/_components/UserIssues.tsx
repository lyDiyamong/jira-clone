import { getUserIssues } from "@/actions/issue";
import IssueCard, { IssueCardProps } from "@/components/IssueCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Issue, User } from "@prisma/client";
import { Suspense } from "react";
import { BarLoader } from "react-spinners";
const UserIssues = async ({ userId }: { userId: string }) => {
    const issues = await getUserIssues(userId);

    if (issues.length === 0) {
        return null;
    }

    const assignedIssues = issues.filter(
        (issue) => issue.assignee?.clerkUserId === userId
    );

    const reportedIssues = issues.filter(
        (issue) => issue.reporter?.clerkUserId === userId
    );
    return (
        <>
            <h1 className="text-4xl font-bold gradient-title mb-4">
                My Issues
            </h1>
            <Tabs defaultValue="assigned">
                <TabsList>
                    <TabsTrigger value="assigned">Assignee</TabsTrigger>
                    <TabsTrigger value="reported">Reporter</TabsTrigger>
                </TabsList>
                <TabsContent value="assigned">
                    <Suspense
                        fallback={<BarLoader width={"100%"} color="#36d7b7" />}
                    >
                        <IssueGrid issues={assignedIssues} />
                    </Suspense>
                </TabsContent>
                <TabsContent value="reported">
                    <IssueGrid issues={reportedIssues} />
                </TabsContent>
            </Tabs>
        </>
    );
};

function IssueGrid({ issues }: { issues: IssueCardProps["issue"][] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {issues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} showStatus />
            ))}
        </div>
    );
}

export default UserIssues;
