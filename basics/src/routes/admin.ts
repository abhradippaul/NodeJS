import express, { Router } from "express"
import { getAddProduct, postAddProduct } from "../controllers/products.js"

const router: Router = express.Router()

router.get('/add-product', getAddProduct);

router.post('/add-product', postAddProduct);

export { router }