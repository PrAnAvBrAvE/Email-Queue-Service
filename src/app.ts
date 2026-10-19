import express from "express";
import cors from "cors";
import http from "node:http";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@as-integrations/express5";
import { typeDefs } from "./graphql/type-defs.js";
import { resolvers } from "./graphql/resolvers.js";

export async function createApp() {
  const app = express();
  const httpServer = http.createServer(app);

  const graphqlServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await graphqlServer.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(graphqlServer),
  );

  return { app, httpServer, graphqlServer };
}