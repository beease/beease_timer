// import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
// import { tap } from '@trpc/server/observable';
// import type { AppRouter } from '../../server/router.ts';

// const url = `${String(process.env.REACT_APP_SERVER_URL)}/trpc`;
// // @ts-ignore
// const trpc = createTRPCProxyClient<AppRouter>({
//   links: [
//     () =>
//       ({ op, next }) => {
//         console.log('->', op.type, op.path, op.input);

//         return next(op).pipe(
//           tap({
//             next(result) {
//               console.log('<-', op.type, op.path, op.input, ':', result);
//             },
//           }),
//         );
//       },
//     httpBatchLink({ url }),
//   ],
// });

// export default trpc;

import { createTRPCReact  } from '@trpc/react-query';
import type { AppRouter } from '../../server/routers/router.ts';
export const trpc = createTRPCReact<AppRouter>();

