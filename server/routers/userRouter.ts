import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { signUserByGoogleToken } from '../services/CRUD/userService';

export const userRouter = router({

    signUserByGoogleToken: publicProcedure
    .input(z.object({ google_token: z.string() }))
    .mutation(async (opts) => {
      return await signUserByGoogleToken(opts.input.google_token);
    }),
});