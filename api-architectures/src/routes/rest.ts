import { Router } from "express";
import * as restController from "../controllers/restController.js";
import { itemSchema } from "../validators/item.validator.js";
import { validate } from "../middlewares/validate.js";

const router: Router = Router();

// Example REST endpoint
router.get("/items", restController.getItems);
router.post("/items", validate(itemSchema), restController.createItem);

export default router;
