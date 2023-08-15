import { WorkspacesList } from "./workspacesList";
import plus from "../../assets/plus.svg";
import { workspaceStore, WorkspaceState } from "../../stores/workspaceStore";
import Power from "../../assets/power.svg";
import { DisplayMyPicture } from "../ui/displayMyPicture";
import { useContext } from 'react';
import { AuthContext } from '../../App';
import { InvitationButton } from "./invitationButton";
import { WorkspaceInvitationBox } from "../workspace/workspaceInvitationBox";
import { projectStore, ProjectStore } from "../../stores/projectStore";
import { trpc } from "../../trpc";
import { useEffect } from "react";
export const Navigation = () => {
  const {data: user } = trpc.user.getMyUser.useQuery()

  const PlayingProject = projectStore((state: ProjectStore) => state.PlayingProject)
  const toggleIsPlaying = projectStore((state: ProjectStore) => state.toggleIsPlaying)

  useEffect(()=> {
    if(user && PlayingProject && PlayingProject.projectId === null && user.currentSession !== null && user.currentSession?.memberWorkspace){
      toggleIsPlaying({
        projectId: user.currentSession.projectId,
        workspaceId: user.currentSession.memberWorkspace.workspaceId,
        startedAt: user.currentSession.startedAt
      })
    }else if(user && PlayingProject && PlayingProject.projectId !== null && user.currentSession === null){
      toggleIsPlaying({
        projectId: null,
        workspaceId: null,
        startedAt: null
      })
    }
  },[user])

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
