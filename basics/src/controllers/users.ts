import type { Request, Response } from "express";
import { logger } from "../utils/pino.js";
import { db } from "../db/index.js";
import { user, post } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { getRedisValue, setRedisValue } from "../utils/redis.js";

export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, age, email } = req.body;
        if (!name || !email || age === undefined) {
            return res.status(400).json({
                message: "name, age, and email are required",
                data: null,
                error: "Missing required fields"
            });
        }
        if (typeof age !== 'number' && isNaN(Number(age))) {
            return res.status(400).json({
                message: "age must be a number",
                data: null,
                error: "Invalid age type"
            });
        }
        const [isExist] = await db.select({ id: user.id }).from(user).where(eq(user.email, email))

        if (isExist?.id) {
            return res.status(400).json({
                message: "User already exists",
                data: null,
                error: "Duplicate user"
            });
        }

        const [createdUser] = await db.insert(user).values({
            name,
            age: Number(age),
            email,
        }).returning();
        return res.status(201).json({
            message: "User created successfully",
            data: createdUser,
            error: null
        });
    } catch (error: any) {
        if (error?.message?.includes('duplicate key')) {
            return res.status(409).json({
                message: "Email already exists",
                data: null,
                error: error.message || error
            });
        }
        logger.error({ err: error }, "Failed to create user");
        return res.status(500).json({
            message: "Failed to create user",
            data: null,
            error: error.message || error
        });
    }
};

export const getUsers = async (_req: Request, res: Response) => {
    try {
        const isCached = await getRedisValue("users")

        if (isCached) {
            logger.info("Cache HIT")
            return res.json({
                message: "Users fetched successfully",
                data: JSON.parse(isCached),
                error: null
            });
        }

        logger.info("Cache MISS")
        const rows = await db.select().from(user).leftJoin(post, eq(user.id, post.userId))
        const result = Object.values(
            rows.reduce((acc, row) => {
                const id = row.users.id;

                if (!acc[id]) {
                    acc[id] = { ...row.users, posts: [] };
                }

                if (row.posts) {
                    acc[id].posts.push(row.posts);
                }

                return acc;
            }, {} as Record<string, any>)
        );

        await setRedisValue("users", JSON.stringify(result), 60)

        return res.json({
            message: "Users fetched successfully",
            data: result,
            error: null
        });
    } catch (error) {
        logger.error({ err: error }, "Failed to fetch users");
        return res.status(500).json({
            message: "Failed to fetch users",
            data: null,
            error: error
        });
    }
};
