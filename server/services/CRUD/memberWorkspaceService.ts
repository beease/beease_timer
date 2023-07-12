import { PrismaClient, Prisma, Role } from "@prisma/client";
import { asyncFunctionErrorCatcher } from "../utils/errorHandler";
const prisma = new PrismaClient();

type updateMemberWorkspaceData = {
  role?: Role;
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

export const updateMemberWorkspace = async (
  memberWorkspaceId: string,
  data: updateMemberWorkspaceData
) => {
  return asyncFunctionErrorCatcher(() =>
    prisma.memberWorkspace.update({
      where: {
        id: memberWorkspaceId,
      },
      data: data,
    })
  );
};
