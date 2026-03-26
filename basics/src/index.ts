import express from "express";
import path from "path";
import dotenv from "dotenv"
import swaggerUi from "swagger-ui-express"
import swaggerJsDoc from "swagger-jsdoc"
import client from "prom-client";
import { Worker } from "worker_threads"
import { router as userRouter } from "./routes/users.js";
import { router as productsRouter } from "./routes/products.js";
import { rootDir } from "./utils/path.js";
import { redisConnect } from "./utils/redis.js";
import { logger } from "./utils/pino.js";

dotenv.config()

const app = express();
const PORT = 8000;
const routeFiles = [
    path.join(rootDir, "../", "routes", "*.ts"),
    path.join(rootDir, "../", "routes", "*.js"),
];
const httpRequestDuration = new client.Histogram({
    name: "http_request_duration_ms",
    help: "Duration of HTTP requests in ms",
    labelNames: ["method", "route", "status"],
});

app.set("view engine", "pug");
app.set("views", path.join(rootDir, "../", "views"));

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

app.use((req, res, next) => {
    const end = httpRequestDuration.startTimer();

    res.on("finish", () => {
        end({ method: req.method, route: req.url, status: res.statusCode });
    });

    next();
});

app.use((req, res, next) => {
    const start = process.hrtime();

    res.on("finish", () => {
        const diff = process.hrtime(start);
        const ms = diff[0] * 1000 + diff[1] / 1e6;

        logger.info(`${req.method} ${req.url} - ${ms.toFixed(2)}ms`);
    });

    next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(requestLogger);
app.use("/users", userRouter);
app.use("/posts", productsRouter);
app.use(express.static(path.join(rootDir, "../", "public")));

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'API documentation',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
    },
    apis: routeFiles,
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/non-blocking", (_req, res) => {
    res.json({ message: "Non-blocking route response" });
});

app.get("/blocking", (_req, res) => {
    const worker = new Worker(new URL("./utils/worker.ts", import.meta.url), {
        execArgv: ["--import", "tsx"]
    });
    worker.on('message', (result) => {
        res.json({ message: "Blocking route done", result });
    })
    worker.on("error", (msg) => {
        res.json({ message: "Blocking route done", msg });
    });
});

app.get("/metrics", async (req, res) => {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
});

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(rootDir, "../", "views", "404.html"));
});

redisConnect().then(() => {
    app.listen(PORT, () => {
        logger.info(`Express server is running at http://localhost:${PORT}`);
    });
}).catch((err) => {
    logger.error("Redis connection error: ", err)
})

