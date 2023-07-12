import React, { useEffect, useState, useRef } from "react";
import { BasicButton } from "../ui/basicButton";
import plus from "../../assets/Plus.svg";
import less from "../../assets/Less.svg";
import check from "../../assets/check_w.svg";
import { ColorPickerPopup } from "../ui/colorPicker";
import { wait } from "../../utils/function";
import { trpc } from '../../trpc';

interface Props{
  selectedWorkspaceId: string;
}

export const ProjectAdd = ({selectedWorkspaceId}: Props) => {
  const [isAddWorkspaceDisplay, setIsAddWorkspaceDisplay] = useState(false);
  const [colorProject, setColorProject] = useState("#4969fb");
  const [colorProjectPopup, setColorProjectPopup] = useState(false);

  const addProjectFormRef = useRef<HTMLDivElement>(null);
  const addProjectInputRef = useRef<HTMLInputElement>(null);
  const addProjectContRef = useRef<HTMLDivElement>(null);

  const utils = trpc.useContext();
  // const mutation = trpc.project.

  const handleAddProject = () => {
    const projectName = addProjectInputRef.current?.value;
    if (!projectName) return;
    mutation.mutate(
      {
        name: projectName,
        color: colorProject,
      },
      {
        onSuccess: (newProject) => {
          if(!newProject) return;
          console.log(newProject)
          utils.workspace.getWorkspaceList.setData({workspaceId: selectedWorkspaceId}, (oldQueryData: any) => {
            return oldQueryData.projects.push(newProject)
          })
        },
      }
    );
  };

  useEffect(() => {
    const animation = async () => {
      const refsExist =
        addProjectFormRef.current &&
        addProjectInputRef.current &&
        addProjectContRef.current;
      if (!refsExist) return;

      if (isAddWorkspaceDisplay) {
        addProjectContRef.current.style.width = "100%";
        addProjectFormRef.current.style.opacity = "0";
        await wait(100);
        addProjectFormRef.current.style.display = "flex";
        addProjectFormRef.current.style.opacity = "1";
        addProjectInputRef.current.focus();
      } else {
        addProjectFormRef.current.style.opacity = "0";
        await wait(100);
        addProjectContRef.current.style.width = "64px";
        addProjectFormRef.current.style.display = "none";
        addProjectInputRef.current.value = "";
      }
    };

    animation();
  }, [isAddWorkspaceDisplay]);

  return (
    <div ref={addProjectContRef} className="ProjectAdd">
      <BasicButton
        icon={isAddWorkspaceDisplay ? less : plus}
        variant="grey"
        size="small"
        style={{
          width: "48px !important",
            height: "48px !important",
        }}
        onClick={() => {
          setIsAddWorkspaceDisplay(!isAddWorkspaceDisplay);
        }}
      />
      <div ref={addProjectFormRef} className="ProjectAdd_form">
        <input
          ref={addProjectInputRef}
          className="ProjectAdd_input"
          placeholder="Mon top projet :3"
        />
        <ColorPickerPopup
          setColor={setColorProject}
          colorPopup={colorProjectPopup}
          setColorPopup={setColorProjectPopup}
          color={colorProject}
          style={{
            width: "48px",
            height: "48px",
          }}
        />
        <BasicButton 
        icon={check} 
        onClick={() => {
          handleAddProject()
        }}
        variant="confirm"
         />
      </div>
    </div>
  );
};
