import { z } from "zod";
import { router, publicProcedure, authorizedProcedure } from "../trpc";
import { Prisma, PrismaClient } from "@prisma/client";
import {
  createProject,
  deleteProject,
  deleteProjectsByWorkspaceId,
  getProject,
  getProjectsByWorkspaceId,
  updateProject,
} from "../services/CRUD/projectService";
const prisma = new PrismaClient();

export const projectRouter = router({
  createWorkspace: authorizedProcedure
  .input(z.object({ 
    name: z.string(), 
    color: z.string(), 
    workspaceId: z.string()
   }))
  .mutation(async (opts) => {
    return await createProject(
      opts.input.name,
      opts.input.color,
      opts.input.workspaceId,
    );
  }),
  getProjectsByWorkspaceId: authorizedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(async (opts) => {
      const { workspaceId } = opts.input;
      return await getProjectsByWorkspaceId(workspaceId);
    }),
  getProject: authorizedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async (opts) => {
      const { id } = opts.input;
      return await getProject(id);
    }),
  updateProject: authorizedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          name: z.string().optional(),
          color: z.string().optional(),
          hourByDay: z.number().optional(),
          dailyPrice: z.number().optional(),
        }),
      })
    )
    .mutation(async (opts) => {
      const { id, data } = opts.input;
      return await updateProject(id, data);
    }),
  deleteProject: authorizedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async (opts) => {
      const { id } = opts.input;
      return await deleteProject(id);
    }),
  deleteProjectsByWorkspaceId: authorizedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .mutation(async (opts) => {
      const { workspaceId } = opts.input;
      return await deleteProjectsByWorkspaceId(workspaceId);
    }),
});

export type ProjectRouter = typeof projectRouter;