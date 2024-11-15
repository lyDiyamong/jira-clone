// User
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

// Sprint
export const sprintSchema = z.object({
    name: z
        .string()
        .min(1, "Sprint name is required")
        .max(100, "Sprint name must be 100 characters or less"),
    startDate: z.date({
        required_error: "Start Date is required"
    }),
    endDate: z.date({
        required_error: "End Date is required"
    }),
});

// Infer TypeScript type from Zod schema
export type SprintZod = z.infer<typeof sprintSchema>;

// Project
export const projectSchema = z.object({
    name: z
        .string()
        .min(1, "Project name is required")
        .max(100, "Project name must be 100 characters or less"),
    key: z
        .string()
        .min(2, "Project key is required")
        .max(10, "Project key must be 10 characters or less"),
    description: z
        .string()
        .max(500, "Description must be 500 characters or less")
        .optional()
});

// Infer TypeScript type from Zod schema
export type Project = z.infer<typeof projectSchema>;
