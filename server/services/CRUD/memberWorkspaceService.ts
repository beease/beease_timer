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

export const getMembersWorkspaceByWorkspaceId = async (workspaceId: string) => {
  return asyncFunctionErrorCatcher(
    () =>
      prisma.memberWorkspace.findMany({
        where: {
          workspaceId: workspaceId,
        },
      }),
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
