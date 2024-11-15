"use server";

import db from "@/lib/db";
import { SprintZod } from "@/lib/schemas";
import { auth } from "@clerk/nextjs/server";
import { Sprint } from "@prisma/client";

export async function createSprint(
    projectId: string,
    data: Sprint
): Promise<Sprint | SprintZod> {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        throw new Error("Unauthorized");
    }

    const project = await db.project.findUnique({
        where: {
            id: projectId,
        },
    });

    if (!project || project.organizationId !== orgId) {
        throw new Error("Project not found");
    }

    try {
        const sprint = await db.sprint.create({
            data: {
                name: data.name,
                startDate: data.startDate,
                endDate: data.endDate,
                status: "PLANNED",
                projectId,
            },
        });
        return sprint;
    } catch (err: unknown) {
        if (err instanceof Error) {
            throw new Error("Error creating sprint: " + err.message);
        } else {
            throw new Error(
                "An unknown error occurred while creating the sprint."
            );
        }
    }
}
