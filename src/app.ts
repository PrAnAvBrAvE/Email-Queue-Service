import express from "express"
import cors from "cors";
import { expressMiddleware } from "@as-integrations/express5";
import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./graphql/type-defs.js";
import { resolvers } from "./graphql/resolvers.js";

export async function createApp() {
  const app = express();

  const graphqlServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await graphqlServer.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(graphqlServer),
  );

  return { app, graphqlServer };
}