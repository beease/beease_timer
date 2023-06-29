import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from 'react-query';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { tap } from '@trpc/server/observable';
import type { AppRouter } from '../../server/router.ts';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, 
    },
  },
})

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
  trpc.createUser.mutate({name:"xxx"}).then((result) => {
    console.log(result);
  });





ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App /> 
    </QueryClientProvider>
  </React.StrictMode>,
)
