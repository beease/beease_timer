import { PrismaClient, Prisma, Role } from "@prisma/client";
import { asyncFunctionErrorCatcher } from "../utils/errorHandler";
const prisma = new PrismaClient();

type updateProjectData = {
  name?: string;
  color?: string;
  hourByDay?: number;
  dailyPrice?: number;
};

export const getProject = async (id: string) => {
  return asyncFunctionErrorCatcher(() =>
    prisma.project.findUnique({
      where: {
        id: id,
      },
    })
  );
};

export const getProjectsByWorkspaceId = async (workspaceId: string) => {
  return asyncFunctionErrorCatcher(() =>
    prisma.project.findMany({
      where: {
        workspaceId: workspaceId,
      },
    })
  );
};

export const updateProject = async (
  projectId: string,
  data: updateProjectData
) => {
  return asyncFunctionErrorCatcher(
    () =>
      prisma.project.update({
        where: {
          id: projectId,
        },
        data: data,
      }),
    "Failed to update project."
  );
};

export const deleteProject = async (projectId: string) => {
  return asyncFunctionErrorCatcher(
    async () =>
      await prisma.project.delete({
        where: {
          id: projectId,
        },
      })
  );
};

export const deleteProjectsByWorkspaceId = async (workspaceId: string) => {
  return asyncFunctionErrorCatcher(
    async () =>
      await prisma.project.deleteMany({
        where: {
          workspaceId: workspaceId,
        },
      })
  );
};
