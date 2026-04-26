import { z } from "zod";

export const itemSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name too long"),

    description: z
        .string()
        .max(500, "Description too long")
        .optional(),

    price: z
        .number("Price must be a number")
        .min(0, "Price must be non-negative"),

    category: z
        .string()
        .min(2, "Category must be at least 2 characters"),

    inStock: z.boolean().optional(),

    tags: z.array(
        z.string().max(30, "Tag too long")
    ).optional(),
});