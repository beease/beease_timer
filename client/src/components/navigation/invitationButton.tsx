import React from "react";
import { trpc } from "../../trpc";
import send from "../../assets/send.svg";
import { workspaceStore, WorkspaceState } from "../../stores/workspaceStore";

export const InvitationButton = () => {
  const setInvitationBoxActive = workspaceStore(
    (state: WorkspaceState) => state.setInvitationBoxActive
  );

  const { data: invitations } =
    trpc.invitation.getInvitationByUserId.useQuery();

  if (invitations && invitations.length > 0) {
    return (
      <div>
        <div className="Invitation_count_cont">
          <div className="Invitation_count">{invitations.length}</div>
        </div>

        <div
          className="Invitation_button"
          onClick={() => setInvitationBoxActive(true)}
        >
          <img src={send} />
        </div>
      </div>
    );
  }
};
