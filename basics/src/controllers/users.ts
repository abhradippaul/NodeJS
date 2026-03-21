import type { Request, Response } from "express";
import { AppDataSource } from "../config/data-source.js";
import { User } from "../schema/user.entity.js";

export const createUser = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, age } = req.body;

        if (!firstName || !lastName || age === undefined) {
            res.status(400).json({
                message: "firstName, lastName and age are required",
            });
            return;
        }

        const userRepository = AppDataSource.getRepository(User);
        const user = userRepository.create({
            firstName: String(firstName),
            lastName: String(lastName),
            age: Number(age),
        });

        if (Number.isNaN(user.age)) {
            res.status(400).json({ message: "age must be a number" });
            return;
        }

        const savedUser = await userRepository.save(user);
        res.status(201).json(savedUser);
    } catch (error) {
        console.error("Failed to create user", error);
        res.status(500).json({ message: "Failed to create user" });
    }
};

export const getUsers = async (_req: Request, res: Response) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const users = await userRepository.find();
        res.json(users);
    } catch (error) {
        console.error("Failed to fetch users", error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
};
