import { z } from "zod";
import { router, publicProcedure, authorizedProcedure } from "../trpc";
import { Prisma, PrismaClient } from "@prisma/client";
import {
  deleteProject,
  deleteProjectsByWorkspaceId,
  getProjectsByWorkspaceId,
  updateProject,
} from "../services/CRUD/projectService";
const prisma = new PrismaClient();

export const projectRouter = router({
  getProjectsByWorkspaceId: authorizedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(async (opts) => {
      const { workspaceId } = opts.input;
      return await getProjectsByWorkspaceId(workspaceId);
    }),
  updateProject: authorizedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          name: z.string().optional(),
          color: z.string().optional(),
          hourByDay: z.number().optional(),
          dailyPeriod: z.number().optional(),
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
