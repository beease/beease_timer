import { PrismaClient, Prisma } from "@prisma/client";
import { fetchGoogleUserInfo, verifyGoogleToken } from "../google/googleApis";
import { asyncFunctionErrorCatcher } from "../utils/errorHandler";
import { createMemberWorkspace } from "./memberWorkspaceService";
import { signJwt, verifyJwtInvitation  } from "../auth/jwt";
const prisma = new PrismaClient();

export const loginByGoogleToken = async (google_token: string) => {
  const userInfo = await asyncFunctionErrorCatcher(
    () => fetchGoogleUserInfo(google_token),
    "Failed to fetch user info from Google."
  );
  const upsertUser = await asyncFunctionErrorCatcher(
    () =>
      prisma.user.upsert({
        where: {
          google_id: userInfo.id,
        },
        update: {
          name: userInfo.name,
          email: userInfo.email,
          verified_email: userInfo.verified_email,
          picture: userInfo.picture,
          locale: userInfo.locale,
          family_name: userInfo.family_name,
          given_name: userInfo.given_name,
        },
        create: {
          google_id: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          verified_email: userInfo.verified_email,
          picture: userInfo.picture,
          locale: userInfo.locale,
          family_name: userInfo.family_name,
          given_name: userInfo.given_name,
        },
      }),
    "Failed to update user info with Prisma."
  );
  return {
    user: upsertUser,
    token: signJwt(upsertUser.id, upsertUser.given_name),
  };
};

export const signByGoogleCredentialToJoinWorkspace =async (googleCredentialToken:string,joinWorkspaceToken:string) => {

const userInfo = await verifyGoogleToken(googleCredentialToken);
if(!userInfo) throw new Error("Failed to verify google token.");

const createUser = await asyncFunctionErrorCatcher(
  () =>
    prisma.user.create({
      data: {
        google_id: userInfo.sub,
        email: userInfo.email,
        verified_email: userInfo.email_verified,
        picture: userInfo.picture,
        family_name: userInfo.family_name,
        given_name: userInfo.given_name,
        name: userInfo.name,
      },
    }),
  "Failed to update user info with Prisma."
);
const joinWorkspaceTokenPayload = await verifyJwtInvitation(joinWorkspaceToken)
if(!joinWorkspaceTokenPayload) throw new Error("Failed to verify join workspace token.")
return await createMemberWorkspace(createUser.id,joinWorkspaceTokenPayload.workspaceId)
}

export const getUserList = async () => {
  return asyncFunctionErrorCatcher(() =>
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        verified_email: true,
        picture: true,
        locale: true,
        family_name: true,
        given_name: true,
      },
    })
  );
};

export const getUserByMail = async (email: string) => {
  return asyncFunctionErrorCatcher(
    () =>
      prisma.user.findUnique({
        where: {
          email: email,
        },
        select: {
          id: true,
          name: true,
          email: true,
          verified_email: true,
          picture: true,
          locale: true,
          family_name: true,
          given_name: true,
        },
      }),
    "Failed to get user by id with Prisma."
  );
};

export const getUserById = async (id: string) => {
  return asyncFunctionErrorCatcher(
    () =>
      prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          verified_email: true,
          picture: true,
          locale: true,
          family_name: true,
          given_name: true,
        },
      }),
    "Failed to get user by id with Prisma."
  );
};

export const updateUserById = async (
  id: string,
  data: Prisma.UserUpdateInput
) => {
  return asyncFunctionErrorCatcher(
    () =>
      prisma.user.update({
        where: {
          id,
        },
        data,
      }),
    "Failed to update user by id with Prisma."
  );
};

export const deleteUserById = async (id: string) => {
  return asyncFunctionErrorCatcher(
    () =>
      prisma.user.delete({
        where: {
          id,
        },
      }),
    "Failed to delete user by id with Prisma."
  );
};
