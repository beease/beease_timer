import { PrismaClient, Prisma, Role } from "@prisma/client";
import { asyncFunctionErrorCatcher } from "../utils/errorHandler";
const prisma = new PrismaClient();

type updateProjectData = {
  name?: string;
  color?: string;
  hourByDay?: number;
  dailyPrice?: number;
  isArchived?: boolean;
};

export const createProject = async (
  name: string,
  color: string,
  workspaceId: string,
) => {
  try {
    const Project = await prisma.project.create({
      data: {
        name: name,
        color: color,
        workspaceId: workspaceId,
      },
      include: {
        memberSessions:{
          include: {
            memberWorkspace: {
              select: {
                user: {
                  select: {
                    id: true,
                    given_name: true,
                    picture: true
                  }
                }
              }
            }
          }
        }
      }
    });
    return Project;
  } catch (err) {
    throw new Error(`Failed creating project : ${err}`);
  }
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
        data,
        include: {
          memberSessions: {
            include: {
              memberWorkspace: {
                select: {
                  user: {
                    select: {
                      id: true,
                      given_name: true,
                      picture: true
                    }
                  }
                }
              }
            }
          }
        }
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
