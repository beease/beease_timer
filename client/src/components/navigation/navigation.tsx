import { WorkspacesList } from "./workspacesList";
import plus from "../../assets/plus.svg";
import { workspaceStore, WorkspaceState } from "../../stores/workspaceStore";
import Power from "../../assets/power.svg";
import { DisplayMyPicture } from "../ui/displayMyPicture";
import { useContext } from 'react';
import { AuthContext } from '../../App';
import { InvitationButton } from "./invitationButton";
import { WorkspaceInvitationBox } from "../workspace/workspaceInvitationBox";

export const Navigation = () => {
  const setSettingWorkspace = workspaceStore(
    (state: WorkspaceState) => state.setSettingWorkspace
  );    
  const isInvitationBoxActive = workspaceStore(
    (state: WorkspaceState) => state.isInvitationBoxActive
  );

  const { logout } = useContext(AuthContext);

  return (
    <div id="navigation">
      <div id="logout_cont" onClick={() => {logout()}}>
        <div id="logout_bouton_cont">
          <div id="logout_bouton">
            <img src={Power} />
          </div>
        </div>
        <DisplayMyPicture className={"logout_picture"} />
      </div>
      <WorkspacesList />
      <InvitationButton />
      {isInvitationBoxActive && <WorkspaceInvitationBox/>}
      <div id="addWorkspaceButton" onClick={() => setSettingWorkspace("add")}>
        <img src={plus} />
      </div>
    </div>
  );
};
