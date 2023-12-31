import { PrismaClient, Prisma, Role } from "@prisma/client";
import { asyncFunctionErrorCatcher } from "../utils/errorHandler";
import { getProjectsByWorkspaceId } from "./projectService";
import { TRPCError } from "@trpc/server";
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
    return {...workspace, role: Role.OWNER };
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

export const getWorkspaceList = async (workspaceId: string, userId: string) => {
  try {
    const fullWorkspace = await prisma.workspace.findUnique({
      where: {
        id: workspaceId,
      },
      select: {
        id: true,
        membersWorkspace: {
          select: {
            role: true,
            id: true,
            user: {
              select: {
                id: true,
                family_name: true,
                name: true,
                given_name: true,
                picture: true,
              },
            },
          },
        },
        projects: {
          include: {
            memberSessions: {
              include: {
                memberWorkspace: {
                  select: {
                    user: {
                      select: {
                        id: true,
                        family_name: true,
                        name: true,
                        given_name: true,
                        picture: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!fullWorkspace) return;
    const FullWorkspaceWithMyRole = {
      ...fullWorkspace,
      myUser: {
        role: fullWorkspace.membersWorkspace.find(
          (member) => member.user.id === userId
        )?.role,
        id: userId,
      },
    };

    return FullWorkspaceWithMyRole;
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
            user: true,
          },
        },
      },
    });

    const users = sessions.map((session) => session.memberWorkspace?.user);
    const uniqueUsers = Array.from(new Set(users.map((u) => u?.id))).map(
      (id) => users.find((u) => u?.id === id) || {}
    );

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
  if (
    memberWorkspaceEmitter &&
    (memberWorkspaceEmitter.role === "ADMIN" ||
      memberWorkspaceEmitter.role === "OWNER")
  ) {
try{
  const workspace = await prisma.workspace.update({
    where: {
      id: id,
    },
    data,
  })
  return {...workspace, role: Role.OWNER };
}
catch(err){
  throw new Error(`Failed to update workspace : ${err}`);
}
      
  
  } else {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Member from workspace is not allowed to update workspace",
    });
  }
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
      "Failed to delete workspace"
    );
  } else {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Member is not allowed to delete workspace",
    });
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
    const workspaces = user?.memberWorkspaces.map((mw) => { 
      return {...mw.workspace, role: mw.role}
    });
    return workspaces;
  } catch (err) {
    throw new Error(`Failed to get workspaces user by id : ${err}`);
  }
};

export const getWorkspacesUsers = async (workspaceId: string) => {
  try {
    const users = await prisma.memberWorkspace.findMany({
      where: {
        workspaceId: workspaceId,
      },
      include: {
        user: true,
      },
    });
    return users;
  } catch (err) {
    throw new Error(`Failed to get workspaces users : ${err}`);
  }
}



