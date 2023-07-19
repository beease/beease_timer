import React from "react";
import { workspaceStore, WorkspaceState } from "../../stores/workspaceStore";
import { trpc } from "../../trpc";
import { BasicButton } from "../ui/basicButton";
import check from "../../assets/check_w.svg";
import cross from "../../assets/cross.svg";

const InvitationsLines = () => {
  const setSelectedWorkspaceId = workspaceStore(
    (state: WorkspaceState) => state.setSelectedWorkspaceId
  );
  const setInvitationBoxActive = workspaceStore(
    (state: WorkspaceState) => state.setInvitationBoxActive
  );

  const { data: invitations } =
    trpc.invitation.getInvitationByUserId.useQuery();

  const utils = trpc.useContext();

  const acceptInvitationMutation = trpc.invitation.acceptInvitation.useMutation(
    {
      onSuccess: (newWorkspace) => {
        if (!newWorkspace) return;
        utils.workspace.getMyWorkspaces.setData(
          undefined,
          (oldQueryData = []) => {
            return [...oldQueryData, newWorkspace.workspace];
          }
        );
        utils.invitation.getInvitationByUserId.setData(
          undefined,
          (oldQueryData = []) => {
            return oldQueryData.filter(
              (invitation) => invitation.id !== newWorkspace.invitation.id
            );
          }
        );
      },
    }
  );

  const denyInvitationMutation = trpc.invitation.denyInvitation.useMutation({
    onSuccess: (deletedInvitation) => {
      if (!deletedInvitation) return;
      utils.invitation.getInvitationByUserId.setData(
        undefined,
        (oldQueryData = []) => {
          return oldQueryData.filter(
            (invitation) => invitation.id !== deletedInvitation.id
          );
        }
      );
    },
  });

  if (invitations) {
    return invitations.map((invitation, index) => (
      <div className="Invitation_box_line" key={index}>
        <div className="Invitation_box_line_title">
          <div
            className="Invitation_box_line_name"
            style={{ backgroundColor: invitation.workspace.color }}
          >
            {invitation.workspace.name}
          </div>
          <div className="Invitation_box_line_inviter">
            Invited by {invitation.inviter.given_name}
          </div>
        </div>
        <div className="Invitation_box_line_actions">
          <BasicButton 
          icon={cross} 
          variant="grey" 
            onClick={async () => {
                await denyInvitationMutation.mutateAsync({
                    inviterId: invitation.inviterId,
                    workspaceId: invitation.workspaceId,
                });
                if(invitations.length <= 1) setInvitationBoxActive(false);
                console.log('invitations.length', invitations.length)
            }}
          />
          <BasicButton
            icon={check}
            variant="confirm"
            onClick={async () => {
              await acceptInvitationMutation.mutateAsync({
                inviterId: invitation.inviterId,
                workspaceId: invitation.workspaceId,
              });
              setInvitationBoxActive(false);
              setSelectedWorkspaceId(invitation.workspaceId);
            }}
          />
        </div>
      </div>
    ));
  }
};

export const WorkspaceInvitationBox = () => {
  const setInvitationBoxActive = workspaceStore(
    (state: WorkspaceState) => state.setInvitationBoxActive
  );

  const handleInvitationContClick = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.id === "Invitation_box_popup") {
      setInvitationBoxActive(false);
    }
  };

  return (
    <div id="Invitation_box_popup" onClick={handleInvitationContClick}>
      <div className="Invitation_box_cont">
        <InvitationsLines />
      </div>
    </div>
  );
};
