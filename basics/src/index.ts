import express from "express";
import path from "path";
import dotenv from "dotenv"
import swaggerUi from "swagger-ui-express"
import swaggerJsDoc from "swagger-jsdoc"
import { router as userRouter } from "./routes/users.js";
import { router as productsRouter } from "./routes/products.js";
import { rootDir } from "./utils/path.js";
import { redisConnect } from "./utils/redis.js";
import { logger } from "./utils/pino.js";
import { requestLogger } from "./middlewares/api-performance.js";

dotenv.config()

const app = express();
const PORT = 8000;
const routeFiles = [
    path.join(rootDir, "../", "routes", "*.ts"),
    path.join(rootDir, "../", "routes", "*.js"),
];

app.set("view engine", "pug");
app.set("views", path.join(rootDir, "../", "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(requestLogger);
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

