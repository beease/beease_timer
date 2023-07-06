import { getGoogleToken } from '../utils/Auth/Auth';
import { useContext } from 'react';
import { AuthContext } from '../App';
import Logo from '../assets/google.png'; 
import { trpc } from '../trpc';

export function Sign() {
  
  const {login} = useContext(AuthContext);
  const {mutate, data:userAuthData, error, isLoading } = trpc.user.loginByGoogleToken.useMutation();
  const handleLogin = async () => {
   const googleToken =  (await getGoogleToken()).token
      if (googleToken) {
        mutate({ google_token: googleToken })
      }
  };

  if(userAuthData?.token){
    login(userAuthData.token)
  }

  // if(error){
  //   return <div>error</div>
  // }

  // if(isLoading){
  //   return <div>loading</div>
  // }

  const LoginButton = () => {
    return (
      <div id='app_logout'>
        <button id='google_connect' onClick={() => {handleLogin()}}>
            {
                <div className='google_connect_cont'>
                  <img alt='google_logo' src={Logo} />
                  <div id='google_connect_text'>Connexion avec google</div>
                </div>           
            }
        </button>
      </div>)
  }
  return (
    <div id='app'>       
        <div id='app_logout'>
           <LoginButton/>
        </div>  
    </div>
  );
}