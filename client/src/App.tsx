// /* global chrome */
// import './App.scss';
// import { Login, Logout } from './utils/Auth/Auth';
// import AppLogged from './AppLogged'
// import { useQuery } from 'react-query';
// import React, { useEffect, useState } from 'react';
// import Logo from './assets/google.png'; 
// import { Switch } from './ui/switch';
// import { ColorPickerPopup } from './ui/colorPicker';
// import { trpc } from './trpc';

// function Loading() {
//   return (
//       <div>loading google</div>
//   )
// }

// exportfunction App() {
//   const [CurrentUserId, setCurrentUserId] = useState('');
//   const [loadingGoogle, setloadingGoogle] = useState(false);
//   useEffect(() => {
//     chrome.storage.local.get(['userId'], function(result) {
//       if (!chrome.runtime.lastError) {
//         setCurrentUserId(result.userId)
//       }
//     });
//   }, []);

//   const handleLogout = async () => {
//     setloadingGoogle(false)
//     await Logout();
//     setCurrentUserId('')
//   };

//   const handleLogin = async () => {

//     setloadingGoogle(true)
//     const mutation = trpc.useMutation(['createUser']);
//     trpc.createUser.mutate({name:"xxx"}).then((result) => {
//       console.log(result);
//     });

//     chrome.identity.getAuthToken({ interactive: true }, function (token) {
//       console.log(token)
//     });

//     const logged = await Login();
//     setCurrentUserId(logged)
//   };

//   const LoginButton = () => {
//     return (
//       <div id='app_logout'>
//         <button id='google_connect' onClick={() => {handleLogin()}}>
//             {
//               !loadingGoogle ?
//                 <div className='google_connect_cont'>
//                   <img alt='google_logo' src={Logo} />
//                   <div id='google_connect_text' >Connexion avec google</div>
//                 </div>
//               :
//               <div className='google_loading_cont'>                 
//                   <Loading/>
//                 </div>
//             }
//         </button>
//       </div>)
//   }

//   const [currentOption, setCurrentOption] = useState<number>(0);
//   const [colorWorkSpace, setColorWorkSpace] = useState('');
//   const [colorWorkSpacePopup, setColorWorkSpacePopup] = useState(false);
// console.log(colorWorkSpace)
//   return (
//     <div id='app'>
//       {/* <div style={{
//         display: 'flex',
//         width: '100vw',
//         height: '100vh',
//         justifyContent: 'center',
//         alignItems: 'center'
//       }}>
        
//         <ColorPickerPopup
//               setColor={setColorWorkSpace}
//               colorPopup={colorWorkSpacePopup}
//               setColorPopup={setColorWorkSpacePopup}
//               color={colorWorkSpace || '#4969fb'}
//             />
//         <Switch 
//           width={200}
//           height={48}
//           options={['En cours', 'Archives']}
//           color={'#4969fb'}
//           currentOption={currentOption}
//           setCurrentOption={setCurrentOption}
//         />
//       </div> */}
//       {CurrentUserId ? (
//           <div>
//             <div>logged</div>
//             <div onClick={() => {handleLogout()}}>logout</div>
//           </div>
//       ) : (
//         <div id='app_logout'>
//            <LoginButton/>
//         </div>
//       )}
//     </div>
//   );
// }


// import { useState, useEffect, createContext, ReactNode } from 'react';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { httpBatchLink } from '@trpc/client';
// import { AppRouter } from './router';
// import { trpc } from './trpc';
// import { getAuthCookie } from './utils/Auth/Auth';

// export function App() {

//   const [queryClient] = useState(() => new QueryClient());
//   const [authCookieToken, setAuthCookieToken] = useState<string>("");
//   const [trpcClient, setTrpcClient] = useState<any | null>(null);
//   const [isLogged,setIsLogged] = useState<boolean>(false)

//   useEffect(() => {
//     getAuthCookie().then(token => {
//       if (token) {
//         setAuthCookieToken(token);
//       }
//     });
//   }, []);
  
//   useEffect(() => {   
//     console.log("token: ", authCookieToken) 
//       setTrpcClient(
//       trpc.createClient({
//             links: [
//               httpBatchLink({
//                 url: `${import.meta.env.VITE_SERVER_URL}/api`,
//                 // You can pass any HTTP headers you wish here
//                 headers: {
//                     authorization: `Bearer ${authCookieToken}`,                  
//                 },
//               }),
//             ],
//           })
//       )
//   }, [authCookieToken]);

//   useEffect(() => {
//     if (authCookieToken) {
//       fetch(`${import.meta.env.VITE_SERVER_URL}/api/credential.isLogged`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${authCookieToken}`
//         }
//       })
//       .then(response => response.json())
//       .then(data => setIsLogged(data.result.data))
//       .catch(error => console.error('Error:', error));
//     }else{
//       setIsLogged(false)
//     }
//   }, [trpcClient]);

//   return (
//     <trpc.Provider client={trpcClient} queryClient={queryClient}>
//       <QueryClientProvider client={queryClient}>
//          <AppRouter isLogged={isLogged} />
//       </QueryClientProvider>
//     </trpc.Provider>
//   );
// }

import { useState, useEffect, createContext, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { AppRouter } from './router';
import { trpc } from './trpc';



const getAuthCookie = () => {
  return new Promise<string>((resolve) => {
      chrome.cookies.get({ url: import.meta.env.VITE_CLIENT_URL, name: "auth" }, (cookie) => {
          if (cookie) {
              resolve(cookie.value);
          } else {
              resolve("");
          }
      });
  });
  //set token
};

const setAuthCookie = async (value: string) => {
  return await chrome.cookies.set({ url: import.meta.env.VITE_CLIENT_URL, name: "auth", value: value }, (cookie) => {
      if (cookie) {
          return cookie.value
      } else {
          return null
      }
  })
}

const removeAuthCookie = async () => {
  return await chrome.cookies.remove({ url: import.meta.env.VITE_CLIENT_URL, name: "auth" })
}

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

  const regenerateTrpc =(token:string)=> {setTrpcClient(
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${import.meta.env.VITE_SERVER_URL}/api`,
          headers: {
            authorization: `Bearer ${token}`,
          },
        }),
      ],
    })
  );}

  const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLogged, setIsLogged] = useState<boolean>(false);
  
   var isAccessTokenValidAndSetLogged = (accessToken:string) => {
        fetch(`${import.meta.env.VITE_SERVER_URL}/api/credential.isLogged`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
              }
            })
            .then(response => response.json())
            .then(data => {
              setIsLogged(data.result.data)
              setAuthCookie(accessToken);
              regenerateTrpc(accessToken)
            })
            .catch(error => console.error('Error:', error));        
        }
  
    useEffect(() => {
      getAuthCookie().then(token => {
        if (token) {
          isAccessTokenValidAndSetLogged(token)
        }
      });
    }, []);
  
    const logout = async () => {
      removeAuthCookie();
      setIsLogged(false);
      regenerateTrpc("")
    }
  
    const login = async (token: string) => {
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
          <AppRouter />
        </AuthProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}