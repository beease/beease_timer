import {PayloadOnAuthJWT} from '../../shared/interfaces/queryInterfaces'
import { PrismaClient, Role } from '@prisma/client';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';

const prisma = new PrismaClient();

export const GET_TOKEN = async (req:Request, res:Response) => {
  const password = req.query.password as string;
  const email = req.query.email as string;
  try {
    // Vérifiez si l'utilisateur existe
    const credential = await prisma.credential.findUnique({ 
        where: { email: email } 
    });
    if (!credential) {
      return res.status(400).json({ msg: 'Email or password incorrect' });
    }

    const isMatch = await argon2.verify(credential.password, password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Email or password incorrect' });
    }

    // Générez le jeton JWT
    const payload = {
      user: {
        id: credential.userId,
        role: credential.role,
      },
    };
    return res.status(200).json({ accessToken: signJwt(payload) });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
};

export const VERIFY_TOKEN = async (token:string, roles:Role[]) => {
    // Check if no token
    if (!token) {
        return {data:{}, status:401, msg:'No token, authorization denied'}
    }
    // Verify token
    try {
        const payload:PayloadOnAuthJWT | null = verifyJwt(token);
        if (payload?.user?.role && roles.includes(payload.user.role)) {
            return {data:{}, status: 401, msg: 'Wrong role or not authorized' };
        } else {
            return {data:payload, status:200, msg:'success'}
        }
    } catch (err) {
      console.log(err)
      return {data:{},status:500,msg:'Server Error'}
    }
}

export const signJwt = (payload: Object) => {
  return jwt.sign(payload,process.env.ACCESS_TOKEN_PRIVATE_KEY as 'Secret | GetPublicKeyOrSecret',{ expiresIn: '30 days' });
};

export const verifyJwt = <T>(
  token: string,
): T | null => {
  try {
    return jwt.verify(token,process.env.ACCESS_TOKEN_PRIVATE_KEY as 'Secret | GetPublicKeyOrSecret') as T;
  } catch (error) {
    console.log(error);
    return null;
  }
};