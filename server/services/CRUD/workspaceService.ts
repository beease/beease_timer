import { PrismaClient, Prisma, Role } from "@prisma/client";
import { asyncFunctionErrorCatcher } from "../utils/errorHandler";
import {
  deleteProjectsByWorkspaceId,
  getProjectsByWorkspaceId,
} from "./projectService";
const prisma = new PrismaClient();

type WorkspaceUpdateData = {
  name?: string;
  color?: string;
};

export const createWorkspace = async (
  name: string,
  color: string,
  userId: string
) => {
  try {
    const workspace = await prisma.workspace.create({
      data: {
        name: name,
        color: color,
      },
    });
    const memberWorkspace = await prisma.memberWorkspace.create({
      data: {
        role: Role.OWNER,
        workspaceId: workspace.id,
        userId: userId,
      },
    });
    return workspace;
  } catch (err) {
    throw new Error(`Failed creating workspace : ${err}`);
  }
};

export const getWorkspaceById = async (id: string) => {
  return asyncFunctionErrorCatcher(
    () =>
      prisma.workspace.findUnique({
        where: {
          id: id,
        },
        select: {
          id: true,
          name: true,
          color: true,
        },
      }),
    "Failed to get workspace by id"
  );
};

export const getWorkspaceList = async (workspaceId: string) => {
  try {
    const fullWorkspace = await prisma.workspace.findUnique({
      where: {
        id: workspaceId,
      },
      include: {
        projects: {
          include: {
            memberSessions: {
              include: {
                memberWorkspace: {
                  select: {
                    user: {
                      select: {
                        given_name: true,
                        picture: true
                      }
                    }
                  }
                }
              }
            },
          },
        },
      },
    });

    return fullWorkspace;
  } catch (err) {
    throw new Error(`Failed to get workspace list : ${err}`);
  }
};

export const getUsersWithSessions = async (workspaceId: string) => {
  try {
    const sessions = await prisma.memberSession.findMany({
      where: {
        memberWorkspace: {
          workspaceId: workspaceId,
        },
      },
      include: {
        memberWorkspace: {
          include: {
            user: true
          }
        }
      }
    });

    const users = sessions.map(session => session.memberWorkspace?.user);
    const uniqueUsers = Array.from(new Set(users.map(u => u?.id))).map(id => users.find(u => u?.id === id) || {});

    return uniqueUsers;
  } catch (err) {
    throw new Error(`Failed to get users with sessions : ${err}`);
  }
};

export const updateWorkspace = async (
  emitterId: string,
  id: string,
  data: WorkspaceUpdateData
) => {
  const memberWorkspaceEmitter = await prisma.memberWorkspace.findFirst({
    where: {
      userId: emitterId,
      workspaceId: id,
    },
  });
  return asyncFunctionErrorCatcher(
    () =>
      prisma.workspace.update({
        where: {
          id: id,
        },
        data,
      }),
    "Failed to update workspace"
  );
};

export const deleteWorkspace = async (emitterId: string, id: string) => {
  const memberWorkspaceEmitter = await prisma.memberWorkspace.findFirst({
    where: {
      userId: emitterId,
      workspaceId: id,
    },
  });
  if (memberWorkspaceEmitter && memberWorkspaceEmitter.role === "OWNER") {
    return asyncFunctionErrorCatcher(
      () =>
        prisma.workspace.delete({
          where: {
            id,
          },
        }),
      "Failed to delete user by id"
    );
  }
};

export const getMyWorkspaces = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        memberWorkspaces: {
          include: {
            workspace: true,
          },
        },
      },
    });
    const workspaces = user?.memberWorkspaces.map((mw) => mw.workspace) ?? [];
    return workspaces;
  } catch (err) {
    throw new Error(`Failed to get workspaces user by id : ${err}`);
  }
};
