import { useState } from "react";
import { ProjectCard } from "./projectCard";
import { ProjectAdd } from "./projectAdd";
import { workspaceStore, WorkspaceState } from "../../stores/workspaceStore";

interface Props {
  selectedWorkspaceId: string;
}

export const ProjectList = ({ selectedWorkspaceId }: Props) => {
  const isStatisticActive = workspaceStore(
    (state: WorkspaceState) => state.isStatisticActive
  );

  const projects = [
    {
      id: "1234FDQZSR1234",
      name: "project test1",
      description: "azerihaopzier hazerh",
      color: "#add8ab",
    },
    {
      id: "12345EZR",
      name: "gms industrie",
      description: "azerihaopzier hazerh",
      color: "#5ac5d5",
    },
    {
      id: "zert342345",
      name: "gms industrie",
      description: "azerihaopzier hazerh",
      color: "#5ac5d5",
    },
  ];

  if(isStatisticActive) {
    return(
      <div>stats</div>
    )
  }
  
  return (
    <div className="ProjectList">
      {projects.map((project: any, index: number) => (
        <ProjectCard
          key={index}
          project={project}
        />
      ))}
      <ProjectAdd />
    </div>
  );
};
