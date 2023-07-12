import { signJwt, verifyJwt } from "../auth/jwt";
import { PayloadOnAuthJWT } from "../../../shared/interfaces/queryInterfaces";
import { PrismaClient } from "@prisma/client";
import {
  asyncFunctionErrorCatcher,
  functionErrorCatcher,
} from "../utils/errorHandler";
import argon2 from "argon2";
import { sendEmailTo } from "./emailService";

const prisma = new PrismaClient();

export const verifyEmail = async (email: string, isVerified: boolean) => {
  if (isVerified) {
    await asyncFunctionErrorCatcher(
      () =>
        prisma.user.update({
          where: {
            email: email,
          },
          data: {
            verified_email: isVerified,
          },
        }),
      "Email not verified."
    );
  }
};

export const getTokenByCredential = async (email: string, password: string) => {
  const user = await asyncFunctionErrorCatcher(
    () =>
      prisma.user.findUnique({
        where: {
          email: email,
        },
        select: {
          id: true,
          given_name: true,
          verified_email: true,
          credential: {
            select: {
              password: true,
            },
          },
        },
      }),
    "Failed to find user from prisma."
  );
  if (!user?.verified_email) {
    await sendEmailTo(email);
    throw new Error("Email not verified");
  }
  if (user?.credential) {
    //compare the provided password with the hashed password
    const isMatch = await argon2.verify(user.credential.password, password);
    if (!isMatch) throw new Error("Email or password incorrect");
  } else {
    throw new Error("auth method not implemented");
  }

  return signJwt(user.id, user.given_name);
};

export const verifyAccessToken = async (accessToken: string) => {
  const payload: PayloadOnAuthJWT | null = functionErrorCatcher(() =>
    verifyJwt(accessToken)
  );
  if (!payload) throw new Error("Invalid token");
  return payload;
};

export const registerByEmail = async (email: string, password: string) => {
  const hashPassword = await argon2.hash(password);

  const user = await asyncFunctionErrorCatcher(() =>
    prisma.user.create({
      data: {
        email: email,
        given_name: email.split("@")[0],
        credential: {
          create: {
            password: hashPassword,
          },
        },
      },
      select: {
        id: true,
        given_name: true,
      },
    })
  );
  await sendEmailTo(email);
  return signJwt(user.id, user.given_name);
};
