import { trpc } from './trpc';

export function Router() {
    const hello = trpc.greeting.useQuery();
    if (hello.isLoading) return <div>Loading...</div>;
    if(hello.error) return <div>Error: {hello.error.message}</div>;
    return (
      <div>
        <p>{hello.data}</p>
      </div>
    );
}