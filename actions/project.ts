"use server"
import db from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Project } from "@prisma/client";

export async function createProject(data: Project) {
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
