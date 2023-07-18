import { PrismaClient, Prisma, Role } from "@prisma/client";
import { asyncFunctionErrorCatcher } from "../utils/errorHandler";
const prisma = new PrismaClient();

type updateMemberWorkspaceData = {
  role?: Role;
};


export const createMemberWorkspace = async (
  userId: string,
  workspaceId: string
) => {
  return asyncFunctionErrorCatcher(
    () =>
      prisma.memberWorkspace.create({
        data: {
          userId: userId,
          workspaceId: workspaceId,
        },
      }),
    "Failed to add member to workspace"
  );
};

export const deleteMemberWorkspace = async (
  emitterId: string,
  userId: string,
  workspaceId: string
) => {
  const memberWorkspaceEmitter = await prisma.memberWorkspace.findFirst({
    where: {
      userId: emitterId,
      workspaceId: workspaceId,
    },
  });
  if (
    memberWorkspaceEmitter
    // (memberWorkspaceEmitter.role === "OWNER" ||
    //   memberWorkspaceEmitter.role === "ADMIN")
  ) {
    return asyncFunctionErrorCatcher(
      () =>
        prisma.memberWorkspace.delete({
          where: {
            workspaceId_userId: {
              userId: userId,
              workspaceId: workspaceId,
            },
          },
        }),
      "Failed to delete member from workspace"
    );
  } else {
    throw new Error(
      "Failed to delete member from workspace : Emitter is not allowed to delete member from workspace"
    );
  }
};

export const getMembersWorkspaceByWorkspaceId = async (workspaceId: string) => {
  return asyncFunctionErrorCatcher(
    () =>
      prisma.memberWorkspace.findMany({
        where: {
          workspaceId: workspaceId,
        },
        select:{
          role: true,
          user: {
            select: {
              id: true,
              given_name: true,
              name: true,
              family_name: true,
              picture: true,
              // memberWorkspaces: {
              //   select: {
              //     role: true
              //   }
              // }
            }
          }
        }
      }),
    "Failed to get members workspace by workspaceId"
  );
};

export const getMemberWorkspaceByWorkspaceIdAndUserId = async (
  workspaceId: string,
  userId: string
) => {
  return asyncFunctionErrorCatcher(
    () =>
      prisma.memberWorkspace.findFirst({
        where: {
          workspaceId: workspaceId,
          userId: userId,
        },
      }),
    "Failed to get member workspace by workspaceId and userId"
  );
};

export const getUsersByWorkspaceId = async (workspaceId: string) => {
  const membersWorkspace = await prisma.memberWorkspace.findMany({
    where: {
      workspaceId: workspaceId,
    },
  })
  return asyncFunctionErrorCatcher(
    () =>
      prisma.user.findMany({
        where: {
          id: {
            in: membersWorkspace.map(memberWorkspace => memberWorkspace.userId)
          }
        }
      })
    ,
    "Failed to get members workspace by workspaceId"
  );
};

export const updateRoleMemberWorkspace = async (
  emitterUserId: string,
  memberWorkspaceId: string,
  data: updateMemberWorkspaceData
) => {
  const memberWorkspaceEmitter = await prisma.memberWorkspace.findFirst({
    where: {
      id: emitterUserId,
    },
  });
  if (memberWorkspaceEmitter && memberWorkspaceEmitter.role === "OWNER") {
    return asyncFunctionErrorCatcher(() =>
      prisma.memberWorkspace.update({
        where: {
          id: memberWorkspaceId,
        },
        data: data,
      })
    );
  } else {
    throw new Error("Emitter is not allowed to change role of an user");
  }
};
