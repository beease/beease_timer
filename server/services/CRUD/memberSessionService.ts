import { PrismaClient, Prisma, Role } from "@prisma/client";
import { asyncFunctionErrorCatcher } from "../utils/errorHandler";
import { TRPCError } from "@trpc/server";
import Dayjs from "dayjs";

const prisma = new PrismaClient();

export const createMemberSession = async (
  userId: string,
  {
    projectId,
    startedAt,
    endedAt,
  }: {
    projectId: string;
    startedAt: string;
    endedAt?: string;
  }
) => {
  try {
  const workspace = await prisma.project.findUnique({
    where:{
      id: projectId
    },
    select: {
      workspaceId: true,
    }
  })
  if (! workspace?.workspaceId) {
    throw new Error("No workspace found");
  }
  const getMemberWorkspace = await prisma.memberWorkspace.findUnique({
    where: {
      workspaceId_userId: {
        userId: userId,
        workspaceId: workspace.workspaceId
      }
    },
  });

  const newSession = await prisma.memberSession.create({
    data: {
      memberWorkspaceId: getMemberWorkspace?.id,
      projectId: projectId,
      startedAt: startedAt,
      endedAt: endedAt,
    },
    include: {
      memberWorkspace: {
        select: {
          user: {
            select: {
              id: true,
              given_name: true,
              picture: true,
            },
          },
        },
      },
    },
  })

  const updateUser = await prisma.user.update({
    where:{
      id: userId
    },
    data: {
      currentSession: {
        connect: {
          id: newSession.id
        }
      }
    },
    select: {
      currentSession: {
        select: {
          projectId: true,
          startedAt: true,
          memberWorkspace: {
            select: {
              workspaceId: true,
            }
          }
        }
      },
    }
  })

    return { 
      newSession: newSession,
      updateUser: updateUser,
    } 
  } catch (err) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Accept invitation failed : ${err}`,
    });
  }
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
  projectId: string,
  endedAt: string
) => {
  const workspace = await prisma.project.findUnique({
    where:{
      id: projectId
    },
    select: {
      workspaceId: true,
    }
  })
  if (! workspace?.workspaceId) {
    throw new Error("No workspace found");
  }
  const getMemberWorkspace = await prisma.memberWorkspace.findUnique({
    where: {
      workspaceId_userId: {
        userId: emitterId,
        workspaceId: workspace.workspaceId
      }
    },
  });
  if (!getMemberWorkspace?.id) {
    throw new Error("No member workspace found");
  }
  const sessionsToStop = await prisma.memberSession.findMany({
    where: {
      projectId: projectId,
      memberWorkspaceId: getMemberWorkspace.id,
      endedAt: null,
    },
  });

  if (sessionsToStop.length === 0) {
    throw new Error("No sessions to stop");
  }
  sessionsToStop.sort(
    (a, b) => Dayjs(b.startedAt).unix() - Dayjs(a.startedAt).unix()
  );
  const [lastSession, ...otherSessions] = sessionsToStop;
  if (otherSessions.length > 0) {
    await prisma.memberSession.updateMany({
      where: { id: { in: otherSessions.map((session) => session.id) } },
      data: { endedAt: endedAt },
    });
  }

   const updateSession = await prisma.memberSession.update({
        where: {
          id: lastSession.id,
        },
        data: {
          endedAt: endedAt,
        },
        include: {
          memberWorkspace: {
            select: {
              user: {
                select: {
                  id: true,
                  given_name: true,
                  picture: true,
                },
              },
            },
          },
        },
      })

      const updateUser = await prisma.user.update({
        where:{
          id: emitterId
        },
        data: {
          currentSession: {
            disconnect: true
          }
        }
      })
    
        return { 
          newSession: updateSession,
          updateUser: updateUser,
        } 

};
