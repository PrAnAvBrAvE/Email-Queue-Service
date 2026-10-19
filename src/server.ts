
import "dotenv/config";

import express from "express";
import http from "node:http";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@as-integrations/express5";
import cors from "cors";

import { typeDefs } from "./graphql/type-defs.js";
import { resolvers } from "./graphql/resolvers.js";

async function startServer(): Promise<void> {
  const app = express();
  const httpServer = http.createServer(app);

  const graphqlServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
    ],
  });

  await graphqlServer.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(graphqlServer),
  );

  const port = Number(process.env.PORT ?? 4000);

  await new Promise<void>((resolve) => {
    httpServer.listen(port, resolve);
  });

  console.log(`GraphQL server running at http://localhost:${port}/graphql`);
}

startServer().catch((error: unknown) => {
  console.error("Failed to start server:", error);
  process.exitCode = 1;
});