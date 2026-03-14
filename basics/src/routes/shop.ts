import express, { Router } from "express"
import { getProducts } from "../controllers/products.js"

const router: Router = express.Router()

router.get('/', getProducts);

export { router }