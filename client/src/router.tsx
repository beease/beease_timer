import { Sign } from './pages/sign';
//import { useContext } from 'react';
//import { AuthContext } from './App';
import { Home } from './pages/home';

export function AppRouter({isLogged}:any) {
  //const { isLogged } = useContext(AuthContext);

  return (
    <>
   {isLogged ? <Home/> : <Sign/>}
    </>
  );
}