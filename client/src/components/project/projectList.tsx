import { useState } from "react";
import { ProjectCard } from "./projectCard";
import { ProjectAdd } from "./projectAdd";
import { workspaceStore, WorkspaceState } from "../../stores/workspaceStore";
import { trpc } from "../../trpc";

interface Props {
  selectedWorkspaceId: string;
}

export const ProjectList = ({ selectedWorkspaceId }: Props) => {
  const { data: worspace, error, isLoading } = trpc.workspace.getWorkspaceList.useQuery({
    workspaceId: selectedWorkspaceId
  });

  const isStatisticActive = workspaceStore(
    (state: WorkspaceState) => state.isStatisticActive
  );

  if(error) return;

  if(isLoading) return (
    <div className="ProjectList">
      <div className="ProjectCard skeleton"></div>
      <div className="ProjectCard skeleton"></div>
      <div className="ProjectCard skeleton"></div>
    </div>
  )

  if(worspace){
    if(isStatisticActive) {
      return(
        <div>stats</div>
      )
    }
    return (
      <div className="ProjectList">
        {worspace.projects.map((project) => (
          <ProjectCard
            project={project}
          />
        ))}
        <ProjectAdd selectedWorkspaceId={selectedWorkspaceId} />
      </div>
    );
  }

};
