// middleware/logger.ts
import type { Request, Response, NextFunction } from "express";
import { logger } from "../utils/pino.js";
import crypto from "crypto";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
    const start = process.hrtime.bigint();

    const requestId = crypto.randomUUID();

    const log = logger.child({
        requestId,
        method: req.method,
        path: req.originalUrl,
    });

    // attach logger to request
    (req as any).log = log;

    res.on("finish", () => {
        const end = process.hrtime.bigint();
        const durationMs = Number(end - start) / 1_000_000;

        const contentLength = res.getHeader("content-length");

        log.info(
            {
                status: res.statusCode,
                durationMs,
                size: contentLength,
            },
            "Request completed"
        );

        // slow request detection
        if (durationMs > 500) {
            log.warn({ durationMs }, "Slow request");
        }
    });

    res.on("error", (err) => {
        log.error({ err }, "Response error");
    });

    next();
}