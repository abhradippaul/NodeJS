import express, { Router } from "express";
import { createUser, getUsers } from "../controllers/users.js";

const router: Router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);

export { router };
