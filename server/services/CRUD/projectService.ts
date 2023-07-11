import { PrismaClient, Prisma, Role } from "@prisma/client";
import { asyncFunctionErrorCatcher } from "../utils/errorHandler";
const prisma = new PrismaClient();


export const getProjectsByWorkspaceId = async (workspaceId:string) => {
    return asyncFunctionErrorCatcher(
        () => prisma.project.findMany({
            where: {
                workspaceId: workspaceId
            }
        })
    )
}


export const deleteProject = async (projectId:string) => {
    return asyncFunctionErrorCatcher(
        async () =>
       await prisma.project.delete({
            where: {
                id: projectId,
            }
            }),
    )
}

export const deleteProjectsByWorkspaceId = async (workspaceId:string) => {
    return asyncFunctionErrorCatcher(
        async () =>
        await prisma.project.findMany({
                where: {
                    workspaceId: workspaceId
                }
            })
    )
}
