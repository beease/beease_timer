import { Sign } from './pages/sign';
import { Workspace } from './pages/workspace';
export function AppRouter() {
  //check if user is logged
  const isLogged = false;
  return (
    <>
   {isLogged ? <Workspace/> : <Sign/>}
    </>
  );
}