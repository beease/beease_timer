import { useEffect, useState, useRef } from "react";
import { BasicButton } from "../ui/basicButton";
import plus from "../../assets/Plus.svg";
import less from "../../assets/Less.svg";
import check from "../../assets/check_w.svg";
import { ColorPickerPopup } from "../ui/colorPicker";
import { wait } from "../../utils/function";
import { trpc } from "../../trpc";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface Props {
  selectedWorkspaceId: string;
}

const validationSchema = z.object({
  name: z.string().nonempty("Please enter a project name"),
  color: z.string().nonempty(),
});

export const ProjectAdd = ({ selectedWorkspaceId }: Props) => {
  const [isAddProjectDisplay, setIsAddProjectDisplay] = useState(false);
  const [colorProjectPopup, setColorProjectPopup] = useState(false);

  const addProjectFormRef = useRef<HTMLFormElement>(null);
  const addProjectContRef = useRef<HTMLDivElement>(null);

  const utils = trpc.useContext();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset,
    setFocus,
    setValue,
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: "",
      color: "#4969fb",
    },
  });

  const mutationCreate = trpc.project.createWorkspace.useMutation({
    onSuccess: (newProject) => {
      if (!newProject) return;
      utils.workspace.getWorkspaceList.setData(
        { workspaceId: selectedWorkspaceId },
        (oldQueryData) =>
          oldQueryData && {
            ...oldQueryData,
            projects: [...oldQueryData.projects, newProject],
          }
      );
    },
  });

  useEffect(() => {
    const animation = async () => {
      const refsExist = addProjectFormRef.current && addProjectContRef.current;
      if (!refsExist) return;

      if (isAddProjectDisplay) {
        addProjectContRef.current.style.width = "100%";
        addProjectFormRef.current.style.opacity = "0";
        await wait(100);
        addProjectFormRef.current.style.display = "flex";
        addProjectFormRef.current.style.opacity = "1";
        setFocus("name");
      } else {
        addProjectFormRef.current.style.opacity = "0";
        await wait(100);
        addProjectContRef.current.style.width = "64px";
        addProjectFormRef.current.style.display = "none";
        reset();
      }
    };

    animation();
  }, [isAddProjectDisplay, reset, setFocus]);

  return (
    <div ref={addProjectContRef} className="ProjectAdd">
      <BasicButton
        icon={isAddProjectDisplay ? less : plus}
        variant="grey"
        size="small"
        style={{
          width: "48px !important",
          height: "48px !important",
        }}
        onClick={() => {
          setIsAddProjectDisplay(!isAddProjectDisplay);
        }}
      />
      <form
        ref={addProjectFormRef}
        className="ProjectAdd_form"
        onSubmit={handleSubmit(async (values) => {
          await mutationCreate.mutateAsync({ ...values, workspaceId: selectedWorkspaceId });
          reset();
          setIsAddProjectDisplay(false);
        })}
      >
        <div className="input_cont ProjectAdd_input">
          <input {...register("name")} placeholder="My project name" />
          {errors.name?.message && (
            <div className="input_error">{errors.name?.message}</div>
          )}
        </div>
        <ColorPickerPopup
           setColor={(color: string) => setValue('color', color)}
           color={watch('color')}
          colorPopup={colorProjectPopup}
          setColorPopup={setColorProjectPopup}
          style={{
            width: "48px",
            height: "48px",
          }}
        />
        <BasicButton
          icon={check}
          variant={isValid ? "confirm" : "grey"}
          type={"submit"}
        />
      </form>
    </div>
  );
};
