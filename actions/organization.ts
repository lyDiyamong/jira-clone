"use server";

import db from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getOrganization } from "@/actions/organization";
import { Project } from "@prisma/client";

export async function getOrganization(slug: string) {
    const { userId } = auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }
    // find user by id
    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) {
        throw new Error("User not found");
    }
    // find org by their slug
    const organization = await clerkClient().organizations.getOrganization({
        slug,
    });

    if (!organization) {
        return null;
    }
    // find the membership in the org
    const { data: memberShip } =
        await clerkClient().organizations.getOrganizationMembershipList({
            organizationId: organization.id,
        });

    const userMembership = memberShip.find(
        (member) => member.publicUserData?.userId === userId
    );
    // if user is not member
    if (!userMembership) {
        return null;
    }

    return organization;
}

export async function getOrganizationUsers(orgId: Project["organizationId"]) {
    const { userId } = auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }
    // find user by id
    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const organizationMemberships =
        await clerkClient().organizations.getOrganizationMembershipList({
            organizationId: orgId,
        });

    const userIds = organizationMemberships.data.map(
        (memberShip) => memberShip.publicUserData?.userId
    );

    const users = await db.user.findMany({
        where: {
            clerkUserId: {
                in: userIds,
            },
        },
    });

    return users;
}
