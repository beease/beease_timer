import { DotsButton } from "../ui/dotsButton";
import { useState, useEffect } from "react";
import { TitleTimer } from "../ui/titleTimer";
import { AnimationCard } from "../animationCard";

import { projectStore, ProjectStore } from "../../stores/projectStore";
import { WorkspaceMoreInfos } from "./workspaceMoreInfos";
import { WorkspaceEdit } from "./workspaceEdit";

interface Props {
  workspace: {
    name: string;
    color: string;
    id: string;
  };
}

export const WorkspaceHeader = ({ workspace }: Props) => {
  const isPlaying = projectStore(
    (state: ProjectStore) => state.PlayingProjectId
  );

  const [isDotsButtonActive, setIsDotsButtonActive] = useState(false);
  const bottomDistance = isDotsButtonActive ? "0" : "56";
  
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
};
