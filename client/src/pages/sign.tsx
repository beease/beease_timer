import { getGoogleToken } from '../utils/Auth/Auth';
import { useContext } from 'react';
import { AuthContext } from '../App';
import Logo from '../assets/google.png'; 
import { trpc } from '../trpc';

export function Sign() {
  
  const {login} = useContext(AuthContext);
  const mutation = trpc.user.loginByGoogleToken.useMutation();
  const handleLogin = async () => {
    getGoogleToken().then((googleAuthResult) => {
      const token = googleAuthResult.token;
      if (token) {
        mutation.mutate({ google_token: token }, {
          onSuccess: (data) => {
            login(data.token)
          },
          onError: (error) => {
            console.log(error);
          }
        }); 
      }
    });
  };

  const LoginButton = () => {
    return (
      <div id='app_logout'>
        <button id='google_connect' onClick={() => {handleLogin()}}>
        {mutation.status}
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