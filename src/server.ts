import "dotenv/config";
import { createApp } from "./app.js";

async function startServer(): Promise<void> {
  const { httpServer } = await createApp();
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