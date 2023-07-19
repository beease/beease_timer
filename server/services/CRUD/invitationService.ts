import { Prisma, PrismaClient } from "@prisma/client";
import { asyncFunctionErrorCatcher } from "../utils/errorHandler";
import { TRPCError } from "@trpc/server";

const prisma = new PrismaClient();

export const getInvitationByUserId = async (
  userId: string,
) => {
  return asyncFunctionErrorCatcher(
    () =>
      prisma.invitation.findMany({
        where: {
          invitedId: userId,
        },
        include: {
          inviter: {
            select: {
              given_name: true,
            }
          },
          workspace: {
            select: {
              name: true,
              color: true,
            }
          },
        },
      }),
    "Failed to create invitation."
  );
};

export const sendInvitationService = async (
  inviterId: string,
  invitedId: string,
  workspaceId: string
) => {
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
  invitedId: string,
  inviterId: string,
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
      select: {
        workspace: true,
        role: true,
      },
    });
    const data = await prisma.$transaction([acceptInvitationFn, addToWorkspace]);
    return { 
      workspace: { ...data[1].workspace, role: data[1].role},
      invitation: data[0],
    } 
  } catch (err) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Accept invitation failed : ${err}`,
    });
  }
};


export const denyInvitation = async (
  invitedId: string,
  inviterId: string,
  workspaceId: string
) => {
  try {
    const denyInvitation = prisma.invitation.delete({
      where: {
        invitedId_inviterId_workspaceId: {
          invitedId: invitedId,
          inviterId: inviterId,
          workspaceId: workspaceId,
        },
      },
    });
    
    return denyInvitation
  } catch (err) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Deny invitation failed : ${err}`,
    });
  }
};


