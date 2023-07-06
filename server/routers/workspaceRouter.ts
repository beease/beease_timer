import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import * as workspaceService from '../services/CRUD/workspaceService';

export const workspaceRouter = router({
    createWorkspace: publicProcedure.input(z.object({ name: z.string(), color: z.string() })).mutation(async (opts) => {
        return await workspaceService.createWorkspace(opts.input.name, opts.input.color);
    }),
    getWorkspaceById: publicProcedure.input(z.object({ id: z.string() })).query(async (opts) =>{
        return await workspaceService.getWorkspaceById(opts.input.id);
    })
});


