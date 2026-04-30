import { config } from "dotenv";
import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./schema/graphql-schema.js";
import cors from "cors";
import bodyParser from "body-parser";
import express from "express";
import connectDB from "./db/index.js";
import restRoutes from "./routes/rest.js";
import { buildSchema } from "graphql";
import { logger } from "./utils/pino.js";
import { startStandaloneServer } from "@apollo/server/standalone";
import Item from "./models/item.js";

config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const resolvers = {
  Query: {
    items: async () => {
      return await Item.find();
    },
    item: async (_: any, { id }: { id: string }) => {
      return await Item.findById(id);
    },
    orders() {
      return [];
    },
  },
  Mutation: {
    createItem: async (_: any, { input }: { input: any }) => {
      const newItem = new Item(input);
      return await newItem.save();
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// app.use("/graphql", cors(), bodyParser.json(), expressMiddleware(server));

// Home endpoint
app.get("/", (req, res) => {
  res.json({ message: "Welcome to api architectures" });
});

// Mount REST API routes under /rest
app.use("/rest", restRoutes);

// Connect to MongoDB
connectDB()
  .then(async () => {
    // await server.start();
    // app.listen(PORT, () => {
    //   logger.info(`Server is running on port ${PORT}`);
    // });
    const { url } = await startStandaloneServer(server, {
      listen: { port: Number(PORT) },
    });
    logger.info(`🚀  Server ready at: ${url}`);
  })
  .catch((e) => {
    logger.error(`Server facing error ${e}`);
  });
