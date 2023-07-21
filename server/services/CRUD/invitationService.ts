import { Prisma, PrismaClient } from "@prisma/client";
import { asyncFunctionErrorCatcher } from "../utils/errorHandler";
import { TRPCError } from "@trpc/server";

const prisma = new PrismaClient();

export const getInvitationByUserId = async (
  userId: string,
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      email: true,
    }
  })
  if (user?.email) {
  return asyncFunctionErrorCatcher(
    () =>
      prisma.invitation.findMany({
        where: {
          invitedMail: user.email,
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
}
};

export const getInvitationByEmailAndWorkspaceId = async (
  invitedMail: string,
  workspaceId: string
) => {
  return asyncFunctionErrorCatcher(
    () =>
      prisma.invitation.findFirst({
        where: {
            invitedMail: invitedMail,
            workspaceId: workspaceId,
        },
      }),
    "Failed to get invitation."
  );
};

export const sendInvitationService = async (
  inviterId: string,
  invitedMail: string,
  workspaceId: string
) => {
  return asyncFunctionErrorCatcher(
    () =>
      prisma.invitation.create({
        data: {
          inviterId: inviterId,
          invitedMail: invitedMail,
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
  const user = await prisma.user.findUnique({
    where: {
      id: invitedId,
    },
    select: {
      email: true,
    }
  })
  if (!user?.email) return;
  try {
    const acceptInvitationFn = prisma.invitation.delete({
      where: {
        invitedMail_inviterId_workspaceId: {
          invitedMail: user.email,
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
  const user = await prisma.user.findUnique({
    where: {
      id: invitedId,
    },
    select: {
      email: true,
    }
  })
  if (!user?.email) return;
  try {
    const denyInvitation = prisma.invitation.delete({
      where: {
        invitedMail_inviterId_workspaceId: {
          invitedMail: user.email,
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


