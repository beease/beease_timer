import { useState, useEffect, createContext, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { AppRouter } from './router';
import { trpc } from './trpc';
import { getAuthCookie, setAuthCookie, removeAuthCookie } from './utils/Auth/Auth';

interface AuthContextProps {
  logout: () => void;
  login: (token: string) => void;
  isLogged: boolean;
}

export const AuthContext = createContext<AuthContextProps>({
  logout: () => {},
  login: () => {},
  isLogged: false,
});

export function App() {

  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient, setTrpcClient] = useState<any | null>(null);
  const [isLogged, setIsLogged] = useState<boolean>(false);

  const generateTrpcClient = (token?:string)=> {
    setTrpcClient(
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${import.meta.env.VITE_SERVER_URL}/api`,
          headers: {
            authorization: `Bearer ${token || ""}`,
          },
        }),
      ],
    })
  );}

  const isAccessTokenValidAndSetLogged = async (accessToken: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/credential.isLogged`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      setIsLogged(data.result.data);
      generateTrpcClient(data.result.data && accessToken || "");
      data.result.data ? setAuthCookie(accessToken) : removeAuthCookie();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    getAuthCookie().then(token => {
      if (token) {
        isAccessTokenValidAndSetLogged(token)      
      }else{
        generateTrpcClient()
      }
    });
  }, []);

  const AuthProvider = ({ children }: { children: ReactNode }) => {
    
    const logout = () => {
      setIsLogged(false);
      removeAuthCookie();
      generateTrpcClient()
    }
  
    const login = (token: string) => {
      isAccessTokenValidAndSetLogged(token)
    }
  
    return (
      <AuthContext.Provider value={{ login, logout, isLogged }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
        {trpcClient && <AppRouter /> || "login"}
        </AuthProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}