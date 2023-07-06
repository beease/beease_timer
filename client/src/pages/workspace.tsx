
import '../App.scss';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../App';
import Logo from '../assets/google.png'; 
import { trpc } from '../trpc';

function Loading() {
  return (
      <div>loading google</div>
  )
}

export function Workspace() {
  const {logout} = useContext(AuthContext);
  const {data: user, error, isLoading} = trpc.user.getMyUser.useQuery();
  const [currentOption, setCurrentOption] = useState<number>(0);
  const [colorWorkSpace, setColorWorkSpace] = useState('');
  const [colorWorkSpacePopup, setColorWorkSpacePopup] = useState(false);
  console.log(colorWorkSpace)

  if(error){
    console.log(error)
    return <div>Error</div>
  }

  if(isLoading || !user){
    return <div>Loading</div>
  }
 
  if(user){   return (
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
            <div>
              <div>logged</div>
           
              welcome {user.given_name}
              <div onClick={() => {logout()}}>logout</div>
            </div>
      </div>
    );
  }
}