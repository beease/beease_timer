import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { tap } from '@trpc/server/observable';
import type { AppRouter } from '../../server/router.ts';

const url = `http://localhost:3001/trpc`;
// @ts-ignore
const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    () =>
      ({ op, next }) => {
        console.log('->', op.type, op.path, op.input);

        return next(op).pipe(
          tap({
            next(result) {
              console.log('<-', op.type, op.path, op.input, ':', result);
            },
          }),
        );
      },
    httpBatchLink({ url }),
  ],
});

export default trpc;