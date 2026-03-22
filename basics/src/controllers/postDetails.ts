import type { Request, Response } from 'express';
import { logger } from "../utils/pino.js";
import { db } from "../db/index.js";
import { post } from "../db/schema.js";

export const createPost = async (req: Request, res: Response) => {
    try {
        const { title, content, userId } = req.body;
        if (!title || !content || !userId) {
            return res.status(400).json({ message: "title, content, and userId are required" });
        }
        const [createdPost] = await db.insert(post).values({
            title,
            content,
            userId
        }).returning();
        res.status(201).json(createdPost);
    } catch (error) {
        logger.error({ err: error }, "Failed to save post");
        res.status(500).json({ message: "Failed to save post" });
    }
};

export const getAllPosts = async (_req: Request, res: Response) => {
    try {
        const posts = await db.select().from(post);
        res.json(posts);
    } catch (error) {
        logger.error({ err: error }, "Failed to fetch posts");
        res.status(500).json({ message: "Failed to fetch posts" });
    }
};
