import { initTRPC, inferAsyncReturnType, TRPCError } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { verifyJwt } from "./services/auth/jwt";
import { PayloadOnAuthJWT } from "../shared/interfaces/queryInterfaces";
// You can use any variable name you like.
// We use t to keep things simple.

export async function createContext({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) {
  async function getUserFromHeader() {
    if (req.headers.authorization?.split(" ")[1]) {
      const tokenPayload = await verifyJwt(
        req.headers.authorization.split(" ")[1]
      );
      return tokenPayload;
    }
    return null;
  }
  const tokenPayload = await getUserFromHeader();
  return {
    req,
    res,
    tokenPayload,
  };
}
export type Context = inferAsyncReturnType<typeof createContext>;

export const t = initTRPC.context<Context>().create();

export const isAuthed = t.middleware(async (opts) => {
  const { ctx } = opts;
  if (!ctx.tokenPayload) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return opts.next({
    ctx: {
      user: ctx.tokenPayload,
    },
  });
});
export const authorizedProcedure = t.procedure.use(isAuthed);
export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;
export const mergeRouters = t.mergeRouters;
