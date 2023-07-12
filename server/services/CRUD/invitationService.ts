import { Prisma, PrismaClient } from "@prisma/client";
import { asyncFunctionErrorCatcher } from "../utils/errorHandler";

const prisma = new PrismaClient();

export const sendInvitationService = async (
  inviterId: string,
  invitedId: string,
  workspaceId: string
) => {
  asyncFunctionErrorCatcher(
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
