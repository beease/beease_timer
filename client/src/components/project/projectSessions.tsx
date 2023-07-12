import { BasicButton } from "../ui/basicButton";
import bin from "../../assets/bin.svg";
import plus from "../../assets/plus_w.svg";
import { DisplayMyPicture } from "../ui/displayMyPicture";
import { DisplayUserPicture } from "../ui/displayUserPicture";
import { ProjectSessionsLine } from "./projectSessionsLine";
import type { Project } from "../../libs/interfaces";
import { trpc } from "../../trpc";

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
      <div className="ProjectSessions_line">
        <DisplayMyPicture className="ProjectSessions_picture" />
        <input className="ProjectSessions_add_input" placeholder="Sec" />
        <input className="ProjectSessions_add_input" placeholder="Min" />
        <input className="ProjectSessions_add_input" placeholder="Hour" />
        <BasicButton
          icon={plus}
          variant="confirm"
          size='small'
          style={{
            height: "36px",
            width: "36px",
          }}
        />
      </div>
      {sessions.map((session) => (
        <ProjectSessionsLine session={session} />
      ))}
    </div>
  );
};
