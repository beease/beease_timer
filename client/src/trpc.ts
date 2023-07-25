import { createTRPCReact  } from '@trpc/react-query';
import type { AppRouter } from '../../server/routers/router.ts';
export const trpc = createTRPCReact<AppRouter>();

