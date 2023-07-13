import { BasicButton } from "../ui/basicButton";
import bin from "../../assets/bin.svg";
import plus from "../../assets/plus_w.svg";
import { DisplayMyPicture } from "../ui/displayMyPicture";
import { DisplayUserPicture } from "../ui/displayUserPicture";
import { ProjectSessionsLine } from "./projectSessionsLine";
import { projectStore, ProjectStore } from '../../stores/projectStore';
import type { Project } from "../../libs/interfaces";
import { trpc } from "../../trpc";
import { ProjectSessionsAdd } from "./projectSessionsAdd";
import dayjs from 'dayjs';
import { useEffect } from "react";

interface Props {
  project: Project;
  selectedWorkspaceId: string;
}

export const ProjectSessions = ({ project, selectedWorkspaceId }: Props) => {
  const sessions = project.memberSessions;

  const { data: user } = trpc.user.getMyUser.useQuery();

  const PlayingProject = projectStore((state: ProjectStore) => state.PlayingProject);
  const toggleIsPlaying = projectStore((state: ProjectStore) => state.toggleIsPlaying);

  useEffect(() => {
    if(PlayingProject?.projectId === null){
      sessions.map((session) => {
        if(!session.endedAt && session.memberWorkspace?.user.id === user?.id){
            toggleIsPlaying({
              projectId: project.id,
              workspaceId: selectedWorkspaceId
            })
        }
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={`ProjectSessions ${sessions.length > 2 && 'scroll'}`}>
      <ProjectSessionsAdd projectId={project.id}/>
      {sessions.sort((a, b) => dayjs(b.startedAt).unix() - dayjs(a.startedAt).unix())
          .map((session) => (
            <ProjectSessionsLine session={session} projectId={project.id} />
          ))
      }
    </div>
  );
};
