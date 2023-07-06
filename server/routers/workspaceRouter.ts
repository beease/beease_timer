import { z } from 'zod';
import { router, publicProcedure, isAuthed } from '../trpc';
import { Prisma, PrismaClient } from '@prisma/client';
import * as workspaceService from '../services/CRUD/workspaceService';

const prisma = new PrismaClient();

export const workspaceRouter = router({
    getMyWorkspaces: publicProcedure.use(isAuthed)
    .query(async (opts) => {
      if (opts.ctx.tokenPayload) {
        return await workspaceService.getWorkspacesByUserId(opts.ctx.tokenPayload.userId);
      }
    }),
});
