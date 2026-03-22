
/**
 * @swagger
 * /posts/create-post:
 *   post:
 *     summary: Create a new post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Sample Product"
 *               content:
 *                 type: string
 *                 example: "This is a sample product description."
 *               userId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Post created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *
 * /posts/get-posts:
 *   get:
 *     summary: Get all posts
 *     responses:
 *       200:
 *         description: A list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "Sample Product"
 *         content:
 *           type: string
 *           example: "This is a sample product description."
 *         userId:
 *           type: integer
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-03-22T12:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-03-22T12:00:00.000Z"

*/

import express, { Router } from "express";
import { createPost, getAllPosts } from "../controllers/postDetails.js";

const router: Router = express.Router();

router.post("/create-post", createPost);
router.get("/get-posts", getAllPosts);

export { router };