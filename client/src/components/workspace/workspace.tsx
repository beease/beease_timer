import { useState } from "react";
import { ProjectCard } from "../project/projectCard";
import { WorkspaceHeader } from "./workspaceHeader";
import { Filters } from "../../libs/interfaces";
import { ProjectList } from "../project/projectList";

export const Workspace = () => {
  const workspace = {
    id: "aZERAZERQSDF342",
    name: "beease test",
    color: "#FF9E4C",
  };

  return (
    <div className="workspace">
      <WorkspaceHeader 
        workspace={workspace} 
      />
      <ProjectList 
      />
      {/* <ProjectCard
        projectMoreInfos={projectMoreInfos}
        setProjectMoreInfos={setProjectMoreInfos}
        project={workspace}
      /> */}
    </div>
  );
};
