import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import {
  CreateHTTPContextOptions,
  createHTTPServer,
} from '@trpc/server/adapters/standalone';
import { z } from 'zod';
const PORT = Number(process.env.PORT) || 3001
// Initialize a context for the server
function createContext(opts: CreateHTTPContextOptions) {
  return {};
}

// Get the context type
type Context = inferAsyncReturnType<typeof createContext>;

// Initialize tRPC
const t = initTRPC.context<Context>().create();

// Create main router
const appRouter = t.router({
  // Greeting procedure
  greeting: t.procedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .query(({ input }) => `Hello, ${input.name}!`),
});

// Export the app router type to be imported on the client side
export type AppRouter = typeof appRouter;

// Create HTTP server
const { listen } = createHTTPServer({
  router: appRouter,
  createContext,
});

listen(PORT);