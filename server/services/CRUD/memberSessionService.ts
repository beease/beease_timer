import { PrismaClient, Prisma, Role } from "@prisma/client";
import { asyncFunctionErrorCatcher } from "../utils/errorHandler";
import { TRPCError } from "@trpc/server";
const prisma = new PrismaClient();

type updateMemberSessionData = {
  startedAt?: Date;
  endedAt?: Date;
};

export const createMemberSession = async (
  userId: string,
  projectId: string,
  startedAt: string
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
export const deleteMemberSession = async (
  emitterId: string,
  sessionId: string
) => {
  const memberSession = await prisma.memberSession.findFirst({
    where: {
      id: sessionId,
    },
  });
  if (memberSession && memberSession.projectId) {
    const project = await prisma.project.findFirst({
      where: {
        id: memberSession?.projectId,
      },
    });
    const memberWorkspace = await prisma.memberWorkspace.findFirst({
      where: {
        userId: emitterId,
        workspaceId: project?.workspaceId,
      },
    });

    if (
      memberSession.memberWorkspaceId !== memberWorkspace?.id &&
      memberWorkspace?.role !== Role.ADMIN &&
      memberWorkspace?.role !== Role.OWNER
    ) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Unauthorized : member from workspace is not allowed to delete session",
      });
    }
  }

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
  sessionId: string,
  endedAt: string
) => {
  const memberSession = await prisma.memberSession.findFirst({
    where: {
      id: sessionId,
    },
  });
  if (memberSession && memberSession.projectId) {
    const project = await prisma.project.findFirst({
      where: {
        id: memberSession?.projectId,
      },
    });
    if (project && project.workspaceId) {
      const memberWorkspace = await prisma.memberWorkspace.findUnique({
        where: {
          workspaceId_userId: {
            userId: emitterId,
            workspaceId: project.workspaceId,
          },
        },
      });
      if (memberSession.memberWorkspaceId !== memberWorkspace?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "Unauthorized : member from workspace is not allowed to stop session",
        });
      }
    }
  }

  return asyncFunctionErrorCatcher(
    () =>
      prisma.memberSession.update({
        where: {
          id: sessionId,
        },
        data: {
          endedAt: endedAt,
        },
      }),
    "Failed to stop session"
  );
};
