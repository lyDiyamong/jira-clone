import { currentUser } from "@clerk/nextjs/server";
import db from "./db";
import { User, userSchema } from "@/lib/schemas";

export const checkUser = async (): Promise<User | null> => {
    const user = await currentUser();

    if (!user) {
        return null;
    }

    try {
        // Check if the user already exists in the database
        const loggedInUser = await db.user.findUnique({
            where: {
                clerkUserId: user.id,
            },
        });

        if (loggedInUser) {
            return userSchema.parse(loggedInUser); // Validate with Zod schema
        }

        // Create the new user with combined name and image URL from Clerk
        const name = `${user.firstName} ${user.lastName}`;

        const newUser = await db.user.create({
            data: {
                clerkUserId: user.id,
                name,
                imageUrl: user.imageUrl || null,
                email: user.emailAddresses[0].emailAddress
            },
        });

        return userSchema.parse(newUser); // Validate with Zod schema
    } catch (err) {
        console.error("Error creating or finding user:", err);
        return null;
    }
};
