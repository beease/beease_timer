import { PrismaClient, Prisma, Role } from "@prisma/client";
import { asyncFunctionErrorCatcher } from "../utils/errorHandler";
const prisma = new PrismaClient();

export const createSession = async (userId: string, projectId: string) => {
  const getMemberWorkspace = await prisma.memberWorkspace.findFirst({
    where: {
      userId: userId,
    },
  });
  return asyncFunctionErrorCatcher(
    () =>
      prisma.memberSession.create({
        data: {
          memberWorkspaceId: getMemberWorkspace?.id,
          projectId: projectId,
        },
      }),
    "Failed to create session"
  );
};
export const deleteSession = async (sessionId: string) => {
  return asyncFunctionErrorCatcher(
    () =>
      prisma.memberSession.delete({
        where: {
          id: sessionId,
        },
      }),
    "Failed to delete session"
  );
};

export const getSessionsByProjectId = async (projectId: string) => {
  return asyncFunctionErrorCatcher(() =>
    prisma.memberSession.findMany({
      where: {
        projectId: projectId,
      },
    })
  );
};

export const getSessionById = async (sessionId: string) => {
  return asyncFunctionErrorCatcher(
    () =>
      prisma.memberSession.findUnique({
        where: {
          id: sessionId,
        },
        select: {
          id: true,
          startedAt: true,
          endedAt: true,
        },
      }),
    "Failed to get session by id"
  );
};
