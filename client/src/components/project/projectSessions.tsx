import { BasicButton } from "../ui/basicButton";
import bin from "../../assets/bin.svg";
import plus from "../../assets/plus_w.svg";
import { DisplayMyPicture } from "../ui/displayMyPicture";
import { DisplayUserPicture } from "../ui/displayUserPicture";
import { ProjectSessionsLine } from "./projectSessionsLine";
import type { Project } from "../../libs/interfaces";
import { trpc } from "../../trpc";
import { ProjectSessionsAdd } from "./projectSessionsAdd";
import dayjs from 'dayjs';

interface Props {
  project: Project;
  selectedWorkspaceId: string;
}

export const ProjectSessions = ({ project, selectedWorkspaceId }: Props) => {
  const sessions = project.memberSessions;

  const {data: workspacePictures} = trpc.workspace.getUsersWithSessions.useQuery({
    workspaceId: selectedWorkspaceId,
  })

  console.log(workspacePictures)

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
