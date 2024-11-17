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
export type SprintStatus = "PLANNED" | "ACTIVE" | "COMPLETED";

export async function updateSprintStatus(
    sprintId: string,
    newStatus: SprintStatus
): Promise<Sprint> {
    const { userId, orgId, orgRole } = auth();

    if (!userId || !orgId) {
        throw new Error("Unauthorized");
    }

    try {
        const sprint = await db.sprint.findUnique({
            where: { id: sprintId },
            include: { project: true },
        });

        if (!sprint) {
            throw new Error("Sprint not found");
        }
        if (sprint.project.organizationId !== orgId) {
            throw new Error("Unauthorized");
        }

        if (orgRole !== "org:admin") {
            throw new Error("Only Admin can make this change");
        }

        const now = new Date();
        const startDate = new Date(sprint.startDate);
        const endDate = new Date(sprint.endDate);

        // Validate status transitions
        if (newStatus === "ACTIVE" && (now < startDate || now > endDate)) {
            throw new Error("Cannot start sprint outside of its date range");
        }

        // Tackle undefined when dealing with enum
        if (!["PLANNED", "ACTIVE", "COMPLETED"].includes(newStatus)) {
            throw new Error(`Invalid status: ${newStatus}`);
        }

        const updatedSprint = await db.sprint.update({
            where: { id: sprintId },
            data: { status: newStatus },
        });

        return updatedSprint;
    } catch (err: unknown) {
        if (err instanceof Error) {
            throw new Error("Error updating sprint: " + err.message);
        } else {
            throw new Error(
                "An unknown error occurred while updating the sprint."
            );
        }
    }
}

