import { z } from 'zod';
import { router, publicProcedure, isAuthed } from '../trpc';
import * as workspaceService from '../services/CRUD/workspaceService';
import * as userService from '../services/CRUD/userService' 

export const workspaceRouter = router({
    createWorkspace: publicProcedure.input(z.object({ name: z.string(), color: z.string(), userId: z.string() })).mutation(async (opts) => {
        return await workspaceService.createWorkspace(opts.input.name, opts.input.color, opts.input.userId);
    }),
    getWorkspaceById: publicProcedure.input(z.object({ id: z.string() })).query(async (opts) =>{
        return await workspaceService.getWorkspaceById(opts.input.id);
    }),
    getMyWorkspace: publicProcedure.use(isAuthed)
    .query(async (opts) => {
      if (opts.ctx.tokenPayload) {
        return await userService.getWorkspaceUserById(opts.ctx.tokenPayload.userId);
      }
    })
})


