import Item from '../models/item.js';
import type { Request, Response } from 'express';

export const getItems = async (req: Request, res: Response) => {
    try {
        const items = await Item.find();
        return res.status(200).json({
            message: "Item fetched successfully",
            data: items
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch items' });
    }
};

export const createItem = async (req: Request, res: Response) => {
    try {
        // Only allow expected fields
        const { name, description, price, category, inStock, tags } = req.body;
        const isExist = await Item.exists({ name })
        console.log(isExist)
        if (isExist?._id) {
            return res.status(400).json({
                message: "Item already exists"
            })
        }
        const newItem = new Item({
            name,
            description,
            price,
            category,
            inStock,
            tags: tags || [],
        });
        const isCreated = await newItem.save();
        if (!isCreated._id) {
            return res.status(400).json({
                message: "Failed to create item"
            })
        }
        return res.status(201).json({
            message: "Item created successfully",
            data: newItem
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Failed to create item', err });
    }
};
