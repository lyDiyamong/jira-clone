"use server";
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Issue } from "@prisma/client";

export async function createIssue(projectId: Issue["projectId"], data: Issue) {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    const lastIssue = await db.issue.findFirst({
        where: { projectId, status: data.status },
        orderBy: { order: "desc" },
    });

    const newOrder = lastIssue ? lastIssue.order + 1 : 0;

    const issue = await db.issue.create({
        data: {
            title: data.title,
            description: data.description,
            status: data.status,
            priority: data.priority,
            projectId,
            sprintId: data.sprintId,
            reporterId: data.reporterId,
            assigneeId: data.assigneeId || null,
            order: newOrder,
        },
        include: {
            assignee: true,
            reporter: true,
        },
    });

    return issue;
}
