import { inferAsyncReturnType,initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */

export const createContext = ({
    req,
    res,
  }: trpcExpress.CreateExpressContextOptions) => {
    const getUser = () => {
      if (req.headers.authorization !== 'secret') {
        return null;
      }
      return {
        name: 'alex',
      };
    };
  
    return {
      req,
      res,
      user: getUser(),
    };
  };

type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */

export const router = t.router;
export const publicProcedure = t.procedure;