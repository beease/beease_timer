import { PrismaClient,Role } from '../../server/node_modules/@prisma/client'

export type PrismaKeys = keyof PrismaClient;

export interface PayloadOnAuthJWT {
    user: {
        id: String;
        role: Role;
    }
}