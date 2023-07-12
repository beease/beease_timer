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

export const verifyEmail = async (email: string) => {
  try {
    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        verified_email: true,
      },
    });
  } catch (err) {
    throw new Error(`Error while verifying email : ${err}`);
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
    await sendEmailTo(email, {
      subject: "Beease Timer - Confirmation Adresse mail.",
      html: `<body>
      <h1 style="color: #333333;">Veuillez confirmer votre adresse e-mail</h1>
      <p style="color: #666666;">Merci de vous être inscrit. Veuillez confirmer votre adresse e-mail en cliquant sur le lien ci-dessous :</p>
      <a href="http://localhost:3001/api/renderVerifiedEmail?emailTo=${email}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #4caf50; color: #ffffff; text-decoration: none; border-radius: 4px;">Confirmer</a>
      <p style="color: #666666;">Si vous n'avez pas créé de compte sur notre site, veuillez ignorer cet e-mail.</p>
      <p style="color: #333333;">Cordialement,<br>Votre équipe Beease</p>
    </body>`,
    });
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
  await sendEmailTo(email, {
    subject: "Beease Timer - Confirmation Adresse mail.",
    html: `<body>
    <h1 style="color: #333333;">Veuillez confirmer votre adresse e-mail</h1>
    <p style="color: #666666;">Merci de vous être inscrit. Veuillez confirmer votre adresse e-mail en cliquant sur le lien ci-dessous :</p>
    <a href="http://localhost:3001/api/renderVerifiedEmail?emailTo=${email}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #4caf50; color: #ffffff; text-decoration: none; border-radius: 4px;">Confirmer</a>
    <p style="color: #666666;">Si vous n'avez pas créé de compte sur notre site, veuillez ignorer cet e-mail.</p>
    <p style="color: #333333;">Cordialement,<br>Votre équipe Beease</p>
  </body>`,
  });
  return signJwt(user.id, user.given_name);
};
