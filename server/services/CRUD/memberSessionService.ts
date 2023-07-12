import { PrismaClient, Prisma, Role } from "@prisma/client";
import { asyncFunctionErrorCatcher } from "../utils/errorHandler";
const prisma = new PrismaClient();

type updateMemberSessionData = {
  startedAt?: Date;
  endedAt?: Date;
};

export const createMemberSession = async (
  userId: string,
  projectId: string,
  startedAt: string,
) => {
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
          startedAt: startedAt,
        },
      }),
    "Failed to create session"
  );
};
export const deleteMemberSession = async (sessionId: string) => {
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

export const getMemberSessionsByProjectId = async (projectId: string) => {
  return asyncFunctionErrorCatcher(() =>
    prisma.memberSession.findMany({
      where: {
        projectId: projectId,
      },
    })
  );
};

export const getMemberSessionById = async (sessionId: string) => {
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

export const stopSession = async (
  emitterId: string,
  projectId: string,
  endedAt: string,
) => {
  const memberWorkspace = await prisma.memberWorkspace.findFirst({
    where: {
      userId: emitterId,
    },
  });
  return asyncFunctionErrorCatcher(
    () =>
      prisma.memberSession.updateMany({
        where: {
          projectId: projectId,
          memberWorkspaceId: memberWorkspace?.id,
          endedAt: null
        },
        data: {
          endedAt: endedAt,
        },
      }),
    "Failed to update session"
  );
};
