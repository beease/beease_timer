import { BasicButton } from "../ui/basicButton";
import bin from "../../assets/bin.svg";
import plus from "../../assets/plus_w.svg";
import { DisplayMyPicture } from "../ui/displayMyPicture";
import { DisplayUserPicture } from "../ui/displayUserPicture";
import { ProjectSessionsLine } from "./projectSessionsLine";
import { projectStore, ProjectStore } from '../../stores/projectStore';
import type { Project, MyUser } from "../../libs/interfaces";
import { trpc } from "../../trpc";
import { ProjectSessionsAdd } from "./projectSessionsAdd";
import dayjs from 'dayjs';
import { useEffect } from "react";

interface Props {
  project: Project;
  selectedWorkspaceId: string;
  myUser: MyUser
}

export const ProjectSessions = ({ project, myUser }: Props) => {
  const sessions = project.memberSessions;

  const sortedSessionsByDate = sessions.sort((a, b) => dayjs(b.startedAt).unix() - dayjs(a.startedAt).unix())
  
  return (
    <div className={`ProjectSessions ${sessions.length > 2 && 'scroll'}`}>
      <ProjectSessionsAdd projectId={project.id}/>
      {sortedSessionsByDate.map((session) => (
        <ProjectSessionsLine myUser={myUser} session={session} projectId={project.id} />
      ))}
    </div>
  );
};
