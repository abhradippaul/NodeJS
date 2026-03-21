import express, { Router } from "express"
import { getProducts } from "../controllers/products.js"
import { getProductById } from "../controllers/productDetails.js"
import { getSearchQuery } from "../controllers/searchQuery.js"

const router: Router = express.Router()

router.get('/', getProducts);

// Dynamic route for product details
router.get('/product/:productId', getProductById);

// Route with query parameter
router.get('/search', getSearchQuery);

export { router }