// src/schemas/user.ts
import { z } from "zod";

export const userSchema = z.object({
    id: z.string(),
    clerkUserId: z.string(),
    name: z.string().nullable(), // Assuming name can be null
    imageUrl: z.string().nullable(), // Assuming imageUrl can be null
    createdAt: z.date(),
    updatedAt: z.date(),
});

// Infer TypeScript type from Zod schema
export type User = z.infer<typeof userSchema>;
