import type { Request, Response } from 'express';
import fs from 'fs';

interface ProductType {
    title: string;
}

const products: ProductType[] = [];

export const getAddProduct = (req: Request, res: Response) => {
    res.send(`
        <html>
            <head><title>Add Product</title></head>
            <body>
                <form action="/admin/add-product" method="POST">
                    <input type="text" name="product" />
                    <button type="submit">Add Product</button>
                </form>
            </body>
        </html>
    `);
};

export const postAddProduct = (req: Request, res: Response) => {
    const { product } = req.body;
    if (product) {
        products.push({ title: product });
        fs.writeFile('product.txt', product, (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.redirect('/');
        });
    } else {
        res.status(400).send('Product is required');
    }
};

export const getProducts = (req: Request, res: Response) => {
    res.render('shop', { products: products });
};
