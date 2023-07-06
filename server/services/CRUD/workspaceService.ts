import { PrismaClient, Prisma } from "@prisma/client";
import { fetchGoogleUserInfo } from "../google/googleApis";
import { asyncFunctionErrorCatcher } from "../utils/errorHandler";
import { signJwt } from "../auth/jwt";
const prisma = new PrismaClient();

export const createWorkspace = async (name:string, color:string, userId:string) => {

    return asyncFunctionErrorCatcher(
        () => prisma.workspace.create({
            data: ({
                createdAt: new Date(),
                name: name,
                color: color,
                userId: userId,
            })
        })
    )

};

export const getWorkspaceById = async (id:string) => {
    return asyncFunctionErrorCatcher(
        () =>
        prisma.workspace.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                name: true,
                createdAt: true,
                color: true,     
                projects: true           
            },
        }),
        
    );
};


export const updateWorkspace = async () => {}

export const deleteWorkspace = async (id: string) => {
    return asyncFunctionErrorCatcher(
        () =>
        prisma.workspace.delete({
            where: {
             id,
            },
        }),
        "Failed to delete user by id with Prisma."
    );
}
