import { BasicButton } from "../ui/basicButton";
import plus from "../../assets/Plus.svg";
import { useState } from "react";
import { trpc } from "../../trpc";
import { workspaceStore, WorkspaceState } from "../../stores/workspaceStore";
import { User, Workspace } from "../../libs/interfaces";
import send from "../../assets/send_w.svg";
import { DisplayUserPicture } from "../ui/displayUserPicture";
import bin from "../../assets/bin.svg";

interface Props {
  workspace: Workspace;
}

export const UserList = ({ workspaceId }: { workspaceId: string }) => {
  const {
    data: userList,
    error,
    isLoading,
  } = trpc.memberWorkspace.getMembersWorkspaceByWorkspaceId.useQuery({
    workspaceId: workspaceId,
  });

  if (error) return;

  if (isLoading) return <div className="Invitation_line skeleton"></div>;

  if (userList) {
    return userList.map(({ user }) => (
      <div className="Invitation_line">
        <DisplayUserPicture user={user} className="Invitation_user_picture" />
        <div className="Invitation_user_name">{user.given_name}</div>
        <BasicButton
          icon={bin}
          variant="grey"
          size="small"
          style={{
            height: "36px",
            width: "36px",
          }}
        />
      </div>
    ));
  }
};

export const InvitationPopup = ({ workspace }: Props) => {
  const [email, setEmail] = useState<string>("");

  const toggleInvitationActive = workspaceStore(
    (state: WorkspaceState) => state.toggleInvitationActive
  );

  const handleInvitationContClick = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.id === "Invitation_popup") {
      toggleInvitationActive();
    }
  };

  const mutationInvitation = trpc.invitation.sendInvitationEmail.useMutation();

  const handleInvite = () => {
    if (!email) return;
    mutationInvitation.mutate(
      {
        invitedMail: email,
        workspaceId: workspace.id,
      },
      {
        onSuccess: (newInvitation) => {
          if (!newInvitation) return;
          console.log(newInvitation);
        },
      }
    );
  };

  return (
    <div id="Invitation_popup" onClick={handleInvitationContClick}>
      <div className="Invitation_cont">
        <div className="invite_user">
          <input
            placeholder="Invite by mail"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          ></input>
          <BasicButton
            icon={send}
            style={{
              backgroundColor: workspace.color,
              height: "36px",
              width: "36px",
            }}
            onClick={() => {
              handleInvite();
            }}
          />
        </div>
        {/* <div
            id="invite_user_error"
            style={{
              display: invationMessage.display ? "block" : "none",
              color: invationMessage.color,
            }}
          >
            {invationMessage.message}
          </div> */}
        <div id="invite_user_list">
          <UserList workspaceId={workspace.id} />
        </div>
      </div>
    </div>
  );
};
