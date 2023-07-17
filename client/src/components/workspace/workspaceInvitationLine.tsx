import { useState } from "react";
import { BasicButton } from "../ui/basicButton";
import { trpc } from "../../trpc";
import { MyUser, Member } from "../../libs/interfaces";
import { DisplayUserPicture } from "../ui/displayUserPicture";
import bin from "../../assets/bin.svg";
import { ConfirmationPopup } from "../ui/comfirmationPopup";

interface PropsLine {
    member: Member;
    myUser: MyUser;
    workspaceId: string;
  }
  

export const WorkspaceInvitationLine = ({member, myUser, workspaceId}: PropsLine) => {
    const [isConfirmationPopupActive, setIsConfirmationPopupActive] =
    useState(false);

    const mutation = trpc.memberWorkspace.deleteMemberWorkspace.useMutation()
    const utils = trpc.useContext();

    const role = member.role;
  const user = member.user;
  
  const isMe = myUser.id === member.user.id;
  const isDeletable = isMe 
  ? (myUser.role !== 'OWNER') 
  : (myUser.role === 'OWNER' || (myUser.role === 'ADMIN' ? role === 'MEMBER' : false));
  
  const handleDeleteUser = () => {
    mutation.mutate({
        workspaceId: workspaceId,
        userId: user.id
    },
    {
        onSuccess: (deletedMember) => {
            if (!deletedMember) return;
            utils.workspace.getWorkspaceList.setData(
              { workspaceId: workspaceId },
              (oldQueryData) => {
                if (!oldQueryData) return;
                return {
                  ...oldQueryData,
                  membersWorkspace: oldQueryData.membersWorkspace.filter((member) => member.id !== deletedMember.id),
                };
              }
            );
          },
    }
    
    )
  }
  
    return(
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
            onConfirm={handleDeleteUser}
          />
        )}
        </div>
    )
}
