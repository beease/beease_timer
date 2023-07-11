import { DotsButton } from "../ui/dotsButton";
import { useState } from "react";
import { TitleTimer } from "../ui/titleTimer";
import { AnimationCard } from "../animationCard";

import { projectStore, ProjectStore } from "../../stores/projectStore";
import { WorkspaceMoreInfos } from "./workspaceMoreInfos";
import { trpc } from '../../trpc';

interface Props{
  selectedWorkspaceId: string;
}

export const WorkspaceHeader = ({selectedWorkspaceId}: Props) => {
  const [isDotsButtonActive, setIsDotsButtonActive] = useState(false);
  const {data: workspace, error, isLoading} = trpc.workspace.getWorkspaceById.useQuery({
    workspaceId: selectedWorkspaceId
  })

  const isPlaying = projectStore(
    (state: ProjectStore) => state.PlayingProjectId
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
          <WorkspaceMoreInfos/>
          <div className="WorkspaceHeader_content">
            <TitleTimer title={workspace.name} timestamp={0} />
            <AnimationCard isStarted={isPlaying} color={workspace.color}/>
          </div>
        </div>
      </div>
    );
  }
};
