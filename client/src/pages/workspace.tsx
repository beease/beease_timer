/* global chrome */
import '../App.scss';
import { Login, Logout } from '../utils/Auth/Auth';
import { useEffect, useState } from 'react';
import Logo from '../assets/google.png'; 
import { trpc } from '../trpc';

function Loading() {
  return (
      <div>loading google</div>
  )
}

export function Workspace() {
  const [CurrentUserId, setCurrentUserId] = useState('');
  const [loadingGoogle, setloadingGoogle] = useState(false);
  const mutation = trpc.signUserByGoogleToken.useMutation();
  useEffect(() => {
    chrome.storage.local.get(['userId'], function(result) {
      if (!chrome.runtime.lastError) {
        setCurrentUserId(result.userId)
      }
    });
  }, []);

  const handleLogout = async () => {
    setloadingGoogle(false)
    await Logout();
    setCurrentUserId('')
  };

  const handleLogin = async () => {

    setloadingGoogle(true)
    
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      console.log(token)            
    });

    Login().then((googleAuthResult) => {
      const token = googleAuthResult.token;
      console.log(token)
      token && mutation.mutate({ google_token: token });        
      setloadingGoogle(false)
    });
    
  };

  const LoginButton = () => {
    return (
      <div id='app_logout'>
        <button id='google_connect' onClick={() => {handleLogin()}}>
        {mutation.status}
            {
              !loadingGoogle ?
                <div className='google_connect_cont'>
                  <img alt='google_logo' src={Logo} />
                  <div id='google_connect_text'>Connexion avec google</div>
                </div>
              :
              <div className='google_loading_cont'>                 
                  <Loading/>
                </div>
            }
        </button>
      </div>)
  }

  const [currentOption, setCurrentOption] = useState<number>(0);
  const [colorWorkSpace, setColorWorkSpace] = useState('');
  const [colorWorkSpacePopup, setColorWorkSpacePopup] = useState(false);
console.log(colorWorkSpace)
  return (
    <div id='app'>
      {/* <div style={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        
        <ColorPickerPopup
              setColor={setColorWorkSpace}
              colorPopup={colorWorkSpacePopup}
              setColorPopup={setColorWorkSpacePopup}
              color={colorWorkSpace || '#4969fb'}
            />
        <Switch 
          width={200}
          height={48}
          options={['En cours', 'Archives']}
          color={'#4969fb'}
          currentOption={currentOption}
          setCurrentOption={setCurrentOption}
        />
      </div> */}
      {CurrentUserId ? (
          <div>
            <div>logged</div>
            <div onClick={() => {handleLogout()}}>logout</div>
          </div>
      ) : (
        <div id='app_logout'>
           <LoginButton/>
        </div>
      )}
    </div>
  );
}