import { DotsButton } from "../ui/dotsButton";
import { useState } from "react";
import { TitleTimer } from "../ui/titleTimer";
import { AnimationCard } from "../animationCard";

import { projectStore, ProjectStore } from "../../stores/projectStore";
import { workspaceStore, WorkspaceState } from "../../stores/workspaceStore";
import { WorkspaceMoreInfos } from "./workspaceMoreInfos";
import { trpc } from '../../trpc';
import { InvitationPopup } from "./workspaceInvitationPopup";

interface Props{
  selectedWorkspaceId: string;
}

export const WorkspaceHeader = ({selectedWorkspaceId}: Props) => {
  const [isDotsButtonActive, setIsDotsButtonActive] = useState(false);
  const {data: workspaces, error, isLoading} = trpc.workspace.getMyWorkspaces.useQuery()
  
  const workspace = workspaces ? workspaces.find(ws => ws.id === selectedWorkspaceId) : null;

  const isPlaying = projectStore(
    (state: ProjectStore) => state.PlayingProject
  );

  const isInvitationActive = workspaceStore(
    (state: WorkspaceState) => state.isInvitationActive
  );

  const bottomDistance = isDotsButtonActive ? "0" : "56";

  if(error) return;

  if(isLoading) return <div className="WorkspaceHeader skeleton"></div>

  if(workspace){
    return (
      <div className="WorkspaceHeader">
        <DotsButton
          isDotsButtonActive={isDotsButtonActive}
          setIsDotsButtonActive={setIsDotsButtonActive}
          style={{ backgroundColor: workspace.color }}
        />
        <div
          className="WorkspaceHeader_animation_cont"
          style={{
            bottom: `${bottomDistance}px`,
          }}
        >
          <WorkspaceMoreInfos workspace={workspace}/>
          <div className="WorkspaceHeader_content">
            <TitleTimer title={workspace.name} isPlaying={isPlaying?.workspaceId === selectedWorkspaceId} />
            <AnimationCard isStarted={isPlaying?.workspaceId === selectedWorkspaceId} color={workspace.color}/>
          </div>
        </div>
        {isInvitationActive && <InvitationPopup workspace={workspace}/>}
      </div>
    );
  }
};
