import { useState } from "react";
import { ProjectCard } from "../project/projectCard";
import { WorkspaceHeader } from "./workspaceHeader";
import { Filters } from "../../libs/interfaces";
import { ProjectList } from "../project/projectList";

interface Props {
  selectedWorkspace: string;
}

export const Workspace = ({ selectedWorkspace }: Props) => {
    const [isStarted, setIsStarted] = useState<null | string>(null);

  const workspace = {
    id: "aZERAZERQSDF342",
    name: "beease test",
    color: "#FF9E4C",
  };

  const [workspaceFilter, setWorkspaceFilter] = useState<Filters>({
    archives: false,
    enCours: true
  });

  console.log('workspace rerender')

  return (
    <div className="workspace">
      <WorkspaceHeader 
        isStarted={isStarted}
        setIsStarted={setIsStarted}
        workspace={workspace} 
        setWorkspaceFilter={setWorkspaceFilter}
        workspaceFilter={workspaceFilter}
      />
      <ProjectList 
        isStarted={isStarted}
        setIsStarted={setIsStarted}
      />
      {/* <ProjectCard
        projectMoreInfos={projectMoreInfos}
        setProjectMoreInfos={setProjectMoreInfos}
        project={workspace}
      /> */}
    </div>
  );
};
