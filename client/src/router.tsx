import { Sign } from './pages/sign';
//import { useContext } from 'react';
//import { AuthContext } from './App';
import { Workspace } from './pages/workspace';

export function AppRouter({isLogged}:any) {
  //const { isLogged } = useContext(AuthContext);

  return (
    <>
   {isLogged ? <Workspace/> : <Sign/>}
    </>
  );
}