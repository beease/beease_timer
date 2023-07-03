import { PrismaClient, Prisma } from "@prisma/client";
import { fetchGoogleUserInfo } from "../google/googleApis";
import { asyncFunctionErrorCatcher } from "../utils/errorHandler";
const prisma = new PrismaClient();

export const signUserByGoogleToken = async (google_token: string) => {
  const userInfo = await asyncFunctionErrorCatcher(
    () => fetchGoogleUserInfo(google_token),
    "Failed to fetch user info from Google."
  );

  return asyncFunctionErrorCatcher(
    () =>
      prisma.user.create({
        data: {
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
    "Failed to create user with Prisma."
  );
};
