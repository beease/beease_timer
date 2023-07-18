import jwt from 'jsonwebtoken';
import { PayloadOnAuthJWT } from '../../../shared/interfaces/queryInterfaces';

type PayloadOnJwtInvitation = {
  workspaceId: string;
  invitedUserId?: string;
  inviterUserId: string;
  iat: number;
};

const generatePayloadOnAuthJWT = (userId:string,given_name:string) => {
  const payload:PayloadOnAuthJWT = {
      userId: userId,
      given_name: given_name,
      iat: Math.floor(Date.now() / 1000),
  };
  return payload;
}

export const signJwt = (userId:string,given_name:string) => {
  return jwt.sign(generatePayloadOnAuthJWT(userId,given_name),String(process.env.ACCESS_TOKEN_PRIVATE_KEY),{ expiresIn: '90 days' });
};

export const signInvitationJwt = (workspaceId:string,inviterUserId:string,invitedUserId?:string) => {
  return jwt.sign({ workspaceId,inviterUserId,invitedUserId },String(process.env.INVITATION_TOKEN_PRIVATE_KEY),{ expiresIn: '30 days' });
}


export const verifyJwt = <T>(
  token: string,
): PayloadOnAuthJWT | null => {
  try {
    return jwt.verify(token,String(process.env.ACCESS_TOKEN_PRIVATE_KEY)) as PayloadOnAuthJWT;
  } catch (error:any) {
    throw new Error(error.message);
  }
};

export const verifyJwtInvitation = <T>(
  token: string,
): PayloadOnJwtInvitation | null => {
  try {
    return jwt.verify(token,String(process.env.INVITATION_TOKEN_PRIVATE_KEY)) as PayloadOnJwtInvitation;
  } catch (error:any) {
    throw new Error(error.message);
  }
};
