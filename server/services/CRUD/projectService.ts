import { PrismaClient, Prisma, Role } from "@prisma/client";
import { asyncFunctionErrorCatcher } from "../utils/errorHandler";
import { TRPCError } from "@trpc/server";
const prisma = new PrismaClient();

type updateProjectData = {
  name?: string;
  color?: string;
  hourByDay?: number;
  dailyPrice?: number;
  isArchived?: boolean;
};

export const createProject = async (
  emitterId: string,
  name: string,
  color: string,
  workspaceId: string
) => {
  const memberWorkspace = await prisma.memberWorkspace.findUnique({
    where: {
      workspaceId_userId: {
        userId: emitterId,
        workspaceId: workspaceId,
      },
    },
  });

  if (memberWorkspace?.role !== "OWNER" && memberWorkspace?.role !== "ADMIN") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Member is not alowed to update project",
    });
  }

  try {
    const Project = await prisma.project.create({
      data: {
        name: name,
        color: color,
        workspaceId: workspaceId,
      },
      include: {
        memberSessions: {
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
        },
      },
    });
    return Project;
  } catch (err) {
    throw new Error(`Failed creating project : ${err}`);
  }
};

export const getProject = async (id: string) => {
  return asyncFunctionErrorCatcher(() =>
    prisma.project.findUnique({
      where: {
        id: id,
      },
    })
  );
};

export const getProjectsByWorkspaceId = async (workspaceId: string) => {
  return asyncFunctionErrorCatcher(() =>
    prisma.project.findMany({
      where: {
        workspaceId: workspaceId,
      },
    })
  );
};

export const updateProject = async (
  emitterId: string,
  projectId: string,
  data: updateProjectData
) => {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
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

    if (
      memberWorkspace?.role !== "OWNER" &&
      memberWorkspace?.role !== "ADMIN"
    ) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Member is not alowed to update project",
      });
    }
  }

  return asyncFunctionErrorCatcher(
    () =>
      prisma.project.update({
        where: {
          id: projectId,
        },
        data,
        include: {
          memberSessions: {
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
          },
        },
      }),
    "Failed to update project."
  );
};

export const deleteProject = async (emitterId: string, projectId: string) => {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
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

    if (
      memberWorkspace?.role !== "OWNER" &&
      memberWorkspace?.role !== "ADMIN"
    ) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Member is not alowed to delete project",
      });
    }
  }

  return asyncFunctionErrorCatcher(
    async () =>
      await prisma.project.delete({
        where: {
          id: projectId,
        },
      })
  );
};
