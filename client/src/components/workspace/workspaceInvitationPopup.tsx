import { BasicButton } from "../ui/basicButton";
import { trpc } from "../../trpc";
import { workspaceStore, WorkspaceState } from "../../stores/workspaceStore";
import { Workspace } from "../../libs/interfaces";
import send from "../../assets/send_w.svg";
import { WorkspaceInvitationLine } from "./workspaceInvitationLine";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface Props {
  workspace: Workspace;
}

const validationSchema = z.object({
  invitedMail: z.string().email(),
});

export const UserList = ({ workspaceId }: { workspaceId: string }) => {
  const {
    data: workspace,
    error,
    isLoading,
  } = trpc.workspace.getWorkspaceList.useQuery({
    workspaceId: workspaceId,
  });

  if (error) return;

  if (isLoading) return <div className="Invitation_line skeleton"></div>;

  if (workspace) {
    return workspace.membersWorkspace.map((member) => (
      <WorkspaceInvitationLine 
      member={member} 
      myUser={workspace.myUser}
      workspaceId={workspace.id}
      />
    ));
  }
};

export const InvitationPopup = ({ workspace }: Props) => {
  const toggleInvitationActive = workspaceStore(
    (state: WorkspaceState) => state.toggleInvitationActive
  );

  const handleInvitationContClick = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.id === "Invitation_popup") {
      toggleInvitationActive();
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setError,
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      invitedMail: "",
    },
  });
  
  const mutationInvitation = trpc.invitation.sendInvitationEmail.useMutation({
    onError: (error) => {
      setError("invitedMail", {
        type: "server",
        message: error.message,
      });
    },
  });

  return (
    <div id="Invitation_popup" onClick={handleInvitationContClick}>
      <div className="Invitation_cont">
        <form 
        className="invite_user" 
        onSubmit={handleSubmit(async (values) => {
          await mutationInvitation.mutateAsync({
            invitedMail: values.invitedMail,
            workspaceId: workspace.id,
          });
          reset();
        })}>
          <input
            autoFocus 
            {...register("invitedMail")}
            placeholder="Invite by mail"
          />
          <BasicButton
            icon={send}
            style={{
              backgroundColor: isValid ? workspace.color : "#d7d7e0",
              height: "36px",
              width: "36px",
            }}
            type={"submit"}
          />
        </form>
        {errors.invitedMail?.message && (
            <div className="input_error">{errors.invitedMail?.message}</div>
          )}
        <div className="invite_user_list">
          <UserList workspaceId={workspace.id} />
        </div>
      </div>
    </div>
  );
};
