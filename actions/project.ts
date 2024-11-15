"use server";
import db from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Project, Sprint } from "@prisma/client";

export async function createProject(data: Project): Promise<Project> {
    const { userId, orgId } = auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }
    if (!orgId) {
        throw new Error("No Organization Selected");
    }

    const { data: membership } =
        await clerkClient().organizations.getOrganizationMembershipList({
            organizationId: orgId,
        });

    const userMembership = membership.find(
        (member) => member.publicUserData?.userId === userId
    );

    if (!userMembership || userMembership.role !== "org:admin") {
        throw new Error("Only organization admins can create projects");
    }

    try {
        const project = await db.project.create({
            data: {
                name: data.name,
                key: data.key,
                description: data.description,
                organizationId: orgId,
            },
        });
        return project;
    } catch (err: unknown) {
        if (err instanceof Error) {
            throw new Error("Error creating project: " + err.message);
        } else {
            throw new Error(
                "An unknown error occurred while creating the project."
            );
        }
    }
}

export async function getProjects(orgId: string): Promise<Project[]> {
    const authResult = auth();
    if (!authResult || !authResult.userId || !authResult.orgId) {
        throw new Error("Unauthorized");
    }
    const { userId } = authResult;

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const projects = await db.project.findMany({
        where: {
            organizationId: orgId,
        },
        orderBy: { createdAt: "desc" },
    });

    return projects;
}

export async function deleteProject(
    projectId: string
): Promise<{ success: boolean }> {
    const authResult = auth();
    if (!authResult || !authResult.userId || !authResult.orgId) {
        throw new Error("Unauthorized");
    }
    const { userId, orgId, orgRole } = authResult;

    if (!userId) {
        throw new Error("Unauthorized");
    }

    if (orgRole !== "org:admin") {
        throw new Error("Only organization admins can delete projects");
    }

    const project = await db.project.findUnique({
        where: { id: projectId },
    });

    if (!project || project.organizationId !== orgId) {
        throw new Error(
            "Project not found or you don't have a permission to delete it"
        );
    }

    await db.project.delete({
        where: { id: projectId },
    });
    return { success: true };
}

export async function getOneProject(
    projectId: string
): Promise<(Project & { Sprint: Sprint[] }) | null> {
    const authResult = auth();
    if (!authResult || !authResult.userId || !authResult.orgId) {
        throw new Error("Unauthorized");
    }
    const { userId, orgId } = authResult;

    if (!userId || !orgId) {
        throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const project = await db.project.findUnique({
        where: {
            id: projectId,
        },
        include: {
            Sprint: {
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });

    if (!project) {
        return null;
    }

    return project;
}
