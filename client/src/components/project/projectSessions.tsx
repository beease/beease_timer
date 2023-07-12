import { BasicButton } from "../ui/basicButton";
import bin from "../../assets/bin.svg";
import plus from "../../assets/plus_w.svg";
import { DisplayMyPicture } from "../ui/displayMyPicture";
import { DisplayUserPicture } from "../ui/displayUserPicture";
import { ProjectSessionsLine } from "./projectSessionsLine";
import type { Project } from "../../libs/interfaces";

interface Props {
  project: Project;
}

const sessions = [
  {
    id: "12344123ZAERAZER",
    startedAt: "2021-05-12T09:00:00.000Z",
    endedAt: "2021-05-12T10:00:00.000Z",
    member:{
        id: "1234412erER",
        name: "John Doe",
        picture: "https://picsum.photos/200",
    }
  },
  {
    id: "12344123ZAERAZzertzeR",
    startedAt: "2021-05-12T11:00:00.000Z",
    endedAt: "2021-05-12T12:00:00.000Z",
    member:   {
        id: "1234412erER",
        name: "John Doe",
        picture: "https://picsum.photos/200",
    }
  },
  {
    id: "1234zertRAZzertzeR",
    startedAt: "2021-05-12T11:00:00.000Z",
    endedAt: "2021-05-12T12:00:00.000Z",
    member:   {
        id: "1234412erER",
        name: "John Doe",
        picture: "https://picsum.photos/200",
    }
  },
  {
    id: "123eee23ZAERAZzertzeR",
    startedAt: "2021-05-12T11:00:00.000Z",
    endedAt: "2021-05-12T12:00:00.000Z",
    member:   {
        id: "1234412erER",
        name: "John Doe",
        picture: "https://picsum.photos/200",
    }
  },
];

export const ProjectSessions = ({ project }: Props) => {
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
