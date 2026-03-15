import type { Request, Response } from 'express';

export const getSearchQuery = (req: Request, res: Response) => {
    const query = req.query.q;
    res.send(`<h2>Search Query: ${query ? query : 'No query provided'}</h2>`);
};
