import { PrismaClient, Prisma, Role } from "@prisma/client";
import { asyncFunctionErrorCatcher } from "../utils/errorHandler";
import {
  deleteProjectsByWorkspaceId,
  getProjectsByWorkspaceId,
} from "./projectService";
import { getSessionsByProjectId } from "./sessionService";
const prisma = new PrismaClient();

export const createWorkspace = async (
  name: string,
  color: string,
  userId: string
) => {
  try {
    const workspace = await prisma.workspace.create({
      data: {
        name: name,
        color: color,
      },
    });
    const memberWorkspace = await prisma.memberWorkspace.create({
      data: {
        role: Role.OWNER,
        workspaceId: workspace.id,
        userId: userId,
      },
    });
    return [workspace, memberWorkspace];
  } catch (err) {
    throw new Error(`Failed creating workspace : ${err}`);
  }
};

export const getWorkspaceById = async (id: string) => {
  return asyncFunctionErrorCatcher(
    () =>
      prisma.workspace.findUnique({
        where: {
          id: id,
        },
        select: {
          id: true,
          name: true,
          color: true,
        },
      }),
    "Failed to get workspace by id"
  );
};

export const getWorkspaceList = async (workspaceId: string) => {
  try {
    const fullWorkspace = await prisma.workspace.findUnique({
      where: {
        id: workspaceId,
      },
      include: {
        projects: {
          include: {
            memberSessions: true,
          },
        },
      },
    });

    return fullWorkspace;
  } catch (err) {
    throw new Error(`Failed to get workspace list : ${err}`);
  }
};

export const updateWorkspace = async () => {};

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
};
