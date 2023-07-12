import { z } from "zod";
import { router, publicProcedure, authorizedProcedure } from "../trpc";
import { Prisma, PrismaClient } from "@prisma/client";
import {
  createMemberSession,
  deleteMemberSession,
  getMemberSessionById,
  getMemberSessionsByProjectId,
  stopSession,
} from "../services/CRUD/memberSessionService";

const prisma = new PrismaClient();

export const memberSessionRouter = router({
  createSession: authorizedProcedure
    .input(
      z.object({
        projectId: z.string(),
        startedAt: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { ctx } = opts;
      if (ctx.tokenPayload) {
        const { projectId, startedAt } = opts.input;
        const emitterId = ctx.tokenPayload.userId;
        return await createMemberSession(emitterId, projectId, startedAt);
      }
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
  stopSession: authorizedProcedure
    .input(
      z.object({
        projectId: z.string(),
        endedAt: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { ctx } = opts;
      const { projectId, endedAt } = opts.input;

      if (ctx.tokenPayload) {
        const emitterId = ctx.tokenPayload.userId;
        return await stopSession(emitterId, projectId, endedAt);
      }
    }),
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
