import React from "react";
import { trpc } from "../../trpc";
import { BasicButton } from "../ui/basicButton";
import plus from "../../assets/Plus.svg";
import { DisplayUserPicture } from "../ui/displayUserPicture";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  workspaceId: string;
}

export const WorkspaceInvitationButton = ({ workspaceId, ...props }: Props) => {
  const {
    data: workspace,
    error,
    isLoading,
  } = trpc.workspace.getWorkspaceList.useQuery({
    workspaceId: workspaceId,
  });

  if (error) return;

  if (isLoading) return <div className="ui_add_people skeleton"></div>;

  if (workspace) {
    return (
      <div {...props} className="WorkspaceInvitationButton">
        <BasicButton variant="clear">
          <div className="WorkspaceInvitationButton_imgs">
            {workspace.membersWorkspace.slice(0, 3).map((member) => {
              return (
                <div className="WorkspaceInvitationButton_img_cont">
                  <DisplayUserPicture user={member.user} className="" />
                </div>
              );
            })}
          </div>
          <img src={plus} />
        </BasicButton>
      </div>
    );
  }
};
