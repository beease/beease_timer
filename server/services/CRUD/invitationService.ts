import { Prisma, PrismaClient } from "@prisma/client";
import { asyncFunctionErrorCatcher } from "../utils/errorHandler";
import { TRPCError } from "@trpc/server";

const prisma = new PrismaClient();

export const sendInvitationService = async (
  inviterId: string,
  invitedId: string,
  workspaceId: string
) => {
  const memberWorkspace = await prisma.memberWorkspace.findUnique({
    where: {
      workspaceId_userId: {
        userId: inviterId,
        workspaceId: workspaceId,
      },
    },
  });
  if (memberWorkspace?.role !== "OWNER" && memberWorkspace?.role !== "ADMIN") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Member is not allowed to send invitation",
    });
  }
  return asyncFunctionErrorCatcher(
    () =>
      prisma.invitation.create({
        data: {
          inviterId: inviterId,
          invitedId: invitedId,
          workspaceId: workspaceId,
        },
      }),
    "Failed to create invitation."
  );
};

export const acceptInvitation = async (
  inviterId: string,
  invitedId: string,
  workspaceId: string
) => {
  try {
    const acceptInvitationFn = prisma.invitation.delete({
      where: {
        invitedId_inviterId_workspaceId: {
          invitedId: invitedId,
          inviterId: inviterId,
          workspaceId: workspaceId,
        },
      },
    });
    const addToWorkspace = prisma.memberWorkspace.create({
      data: {
        userId: invitedId,
        workspaceId: workspaceId,
      },
    });
    return await prisma.$transaction([acceptInvitationFn, addToWorkspace]);
  } catch (err) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Accept invitation failed : ${err}`,
    });
  }
};
