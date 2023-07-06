import { PrismaClient, Prisma } from "@prisma/client";
import { fetchGoogleUserInfo } from "../google/googleApis";
import { asyncFunctionErrorCatcher } from "../utils/errorHandler";
import { signJwt } from "../auth/jwt";
const prisma = new PrismaClient();

export const getWorkspacesByUserId = async (userId: string) => {
    return asyncFunctionErrorCatcher(async () =>
        {const workspaces = await prisma.member.findMany({
            where: {
              userId: userId
            },
            include: {
              workspace: true
            }
          })
        
          const userWorkspaces = workspaces.map(member => member.workspace);
          
          return userWorkspaces},
        "Failed to get workspaces by userId with Prisma."
    );
}

