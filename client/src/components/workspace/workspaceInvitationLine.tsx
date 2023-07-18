import { useState } from "react";
import { BasicButton } from "../ui/basicButton";
import { trpc } from "../../trpc";
import { MyUser, Member } from "../../libs/interfaces";
import { DisplayUserPicture } from "../ui/displayUserPicture";
import bin from "../../assets/bin.svg";
import { ConfirmationPopup } from "../ui/comfirmationPopup";
import { workspaceStore, WorkspaceState } from "../../stores/workspaceStore";

interface PropsLine {
  member: Member;
  myUser: MyUser;
  workspaceId: string;
}

export const WorkspaceInvitationLine = ({
  member,
  myUser,
  workspaceId,
}: PropsLine) => {
  const setSelectedWorkspaceId = workspaceStore((state: WorkspaceState) => state.setSelectedWorkspaceId);
  const toggleInvitationActive = workspaceStore((state: WorkspaceState) => state.toggleInvitationActive);

  const [isConfirmationPopupActive, setIsConfirmationPopupActive] =
    useState(false);

  const mutation = trpc.memberWorkspace.deleteMemberWorkspace.useMutation({
    onSuccess: (deletedMember) => {
      if (!deletedMember) return;
      utils.workspace.getWorkspaceList.setData(
        { workspaceId: workspaceId },
        (oldQueryData) => {
          if (!oldQueryData) return;
          return {
            ...oldQueryData,
            membersWorkspace: oldQueryData.membersWorkspace.filter(
              (member) => member.id !== deletedMember.id
            ),
          };
        }
      );
    },
  });
  const utils = trpc.useContext();

  const role = member.role;
  const user = member.user;

  const isMe = myUser.id === member.user.id;
  const isDeletable = isMe
    ? myUser.role !== "OWNER"
    : myUser.role === "OWNER" ||
      (myUser.role === "ADMIN" ? role === "MEMBER" : false);

  return (
    <div className="Invitation_line">
      <DisplayUserPicture user={user} className="Invitation_user_picture" />
      <div className="Invitation_user_name">{user.given_name}</div>
      <BasicButton
        icon={bin}
        variant={isDeletable ? "grey" : "disable"}
        onClick={() => {
          setIsConfirmationPopupActive(true);
        }}
        size="small"
        style={{
          height: "36px",
          width: "36px",
        }}
      />
      {isConfirmationPopupActive && (
        <ConfirmationPopup
          open={isConfirmationPopupActive}
          setOpen={setIsConfirmationPopupActive}
          text={`Delete ${user.given_name}?`}
          onConfirm={async () => {
            await mutation.mutateAsync({
              workspaceId: workspaceId,
              userId: user.id,
            })
            if(isMe) {
              toggleInvitationActive()
              setSelectedWorkspaceId(null)
            }
          }}
        />
      )}
    </div>
  );
};
