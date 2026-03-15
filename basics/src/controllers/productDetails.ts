import type { Request, Response } from 'express';

export const getProductById = (req: Request, res: Response) => {
    const { productId } = req.params;
    // Here you would fetch the product from a database or data source
    // For demonstration, just return the id
    res.send(`<h1>Product Details for ID: ${productId}</h1>`);
};
