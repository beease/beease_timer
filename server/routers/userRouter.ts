import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import * as userService from '../services/CRUD/userService';

export const userRouter = router({

    signUserByGoogleToken: publicProcedure
    .input(z.object({ google_token: z.string() }))
    .mutation(async (opts) => {
      return await userService.signUserByGoogleToken(opts.input.google_token);
    }),

    getUserById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      return await userService.getUserById(opts.input.id);
    }),

    getUserList: publicProcedure
    .input(z.object({}))
    .query(async () => {
      return await userService.getUserList();
    }),

});