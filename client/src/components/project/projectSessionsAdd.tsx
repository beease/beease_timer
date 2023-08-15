import { BasicButton } from "../ui/basicButton";
import plus from "../../assets/plus_w.svg";
import dayjs from "dayjs";
import { trpc } from "../../trpc";
import { workspaceStore, WorkspaceState } from "../../stores/workspaceStore";
import { DisplayMyPicture } from "../ui/displayMyPicture";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface Props {
  projectId: string;
}

const validationSchema = z.object({
  hours: z.string().transform((val) => (val === "" ? undefined : +val)).optional(),
  mins: z.string().transform((val) => (val === "" ? undefined : +val)).optional(),
  secs: z.string().transform((val) => (val === "" ? undefined : +val)).optional(),
}).refine(data => data.hours !== undefined || data.mins !== undefined || data.secs !== undefined, {
  message: "At least one field should be filled",
  path: ['hours', 'mins', 'secs'], 
});

export const ProjectSessionsAdd = ({ projectId }: Props) => {
  const selectedWorkspaceId = workspaceStore(
    (state: WorkspaceState) => state.selectedWorkspaceId
  );

  const utils = trpc.useContext();

  const {
    register,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      hours: undefined,
      mins: undefined,
      secs: undefined,
    },
  });

  const mutationCreateSession = trpc.memberSession.createSession.useMutation({
    onSuccess: (newSession) => {
      if (!newSession || !selectedWorkspaceId) return;
      utils.workspace.getWorkspaceList.setData(
        { workspaceId: selectedWorkspaceId },
        (oldQueryData) => {
          if (!oldQueryData) return;
          const newProjects = oldQueryData.projects.map((project) => {
            if (project.id === projectId) {
              return {
                ...project,
                memberSessions: [...project.memberSessions, newSession.newSession],
              };
            } else {
              return project;
            }
          });
          return {
            ...oldQueryData,
            projects: newProjects,
          };
        }
      );
    },
  });

  const handleCreateSession = async (values: z.infer<typeof validationSchema>) => {
    const now = dayjs();

    const newDate = now
      .subtract(values.secs ?? 0, "second")
      .subtract(values.mins ?? 0, "minute")
      .subtract(values.hours ?? 0, "hour");

    await mutationCreateSession.mutateAsync(
      {
        projectId: projectId,
        startedAt: newDate.format(),
        endedAt: now.format(),
      })
    reset();
  };

  return (
    <form 
    className="ProjectSessions_line"
    onSubmit={handleSubmit((values) => {
      handleCreateSession(values)
    })}
    >
      <DisplayMyPicture className="ProjectSessions_picture" />
      <input
        className="ProjectSessions_add_input"
        placeholder="Hour"
        {...register("hours")}
      />
      <input
        className="ProjectSessions_add_input"
        placeholder="Min"
        {...register("mins")}
      />
      <input
        className="ProjectSessions_add_input"
        placeholder="Sec"
        {...register("secs")}
      />
      <BasicButton
        icon={plus}
        variant={isValid ? "confirm" : "grey"}
        size="small"
        style={{
          height: "36px",
          width: "36px",
        }}
        type="submit"
      />
    </form>
  );
};
