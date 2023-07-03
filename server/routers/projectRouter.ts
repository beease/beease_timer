import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const projectRouter = router({});