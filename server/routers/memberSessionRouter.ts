import { z } from "zod";
import { router, publicProcedure, authorizedProcedure } from "../trpc";
import { Prisma, PrismaClient } from "@prisma/client";
import {
  createMemberSession,
  deleteMemberSession,
  getMemberSessionById,
  getMemberSessionsByProjectId,
} from "../services/CRUD/memberSessionService";

const prisma = new PrismaClient();

export const memberSessionRouter = router({
  createSession: authorizedProcedure
    .input(
      z.object({
        userId: z.string(),
        projectId: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { userId, projectId } = opts.input;
      return await createMemberSession(userId, projectId);
    }),
  deleteSession: authorizedProcedure
    .input(
      z.object({
        sessionId: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { sessionId } = opts.input;
      return await deleteMemberSession(sessionId);
    }),
  updateSession: authorizedProcedure.input(
    z.object({
      sessionId: z.string(),
      data: z.object({}),
    })
  ),
  getSessionsByProjectId: authorizedProcedure
    .input(
      z.object({
        projectId: z.string(),
      })
    )
    .query(async (opts) => {
      const { projectId } = opts.input;
      return await getMemberSessionsByProjectId(projectId);
    }),
  getSessionById: authorizedProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async (opts) => {
      const { sessionId } = opts.input;
      return await getMemberSessionById(sessionId);
    }),
});
