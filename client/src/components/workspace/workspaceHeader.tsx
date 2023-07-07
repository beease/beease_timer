import { DotsButton } from "../ui/dotsButton";
import { useState } from "react";
import { TitleTimer } from "../ui/titleTimer";
import { AnimationCard } from "../animationCard";
import stats from "../../assets/stats.svg";
import edit from "../../assets/edit.svg";
import { BasicButton } from "../ui/basicButton";
import { Filters } from "../../libs/interfaces";
import { memo } from "react";

interface Props {
  workspace: {
    name: string;
    color: string;
    id: string;
  };
  isStarted: null | string;
  setIsStarted: (isStarted: null | string) => void;
  setWorkspaceFilter: (status: Filters) => void;
  workspaceFilter: Filters;
}

interface ContentProps {
  workspaceName: string;
  isStarted: null | string;
}

const Content = memo(function Content({
  workspaceName,
  isStarted,
}: ContentProps) {
  console.log("content rerender");
  return (
    <div className="WorkspaceHeader_content">
      <TitleTimer title={workspaceName} timestamp={0} />
      <AnimationCard isStarted={isStarted} />
    </div>
  );
});

export const WorkspaceHeader = ({
  workspace,
  setWorkspaceFilter,
  workspaceFilter,
  isStarted,
  setIsStarted,
}: Props) => {
  const [isDotsButtonActive, setIsDotsButtonActive] = useState(false);

  const MoreInfos = () => {
    const handleFilters = (filterName: keyof Filters) => {
      setWorkspaceFilter({
        ...workspaceFilter,
        [filterName]: !workspaceFilter[filterName],
      });
    };

    return (
      <div className="WorkspaceHeader_moreInfos">
        <BasicButton
          // onClick={() => {

          // }}
          variant="clear"
          icon={stats}
        />
        <div className="WorkspaceHeader_moreInfos_filter">
          <div
            className={`WorkspaceHeader_moreInfos_filter_item ${
              workspaceFilter.archives && "selected"
            }`}
            onClick={() => handleFilters("archives")}
          >
            Archives
          </div>
          <div
            className={`WorkspaceHeader_moreInfos_filter_item ${
              workspaceFilter.enCours && "selected"
            }`}
            onClick={() => handleFilters("enCours")}
          >
            En cours
          </div>
        </div>
        <BasicButton
          // onClick={() => {

          // }}
          variant="clear"
          icon={edit}
        />
      </div>
    );
  };

  return (
    <div className="WorkspaceHeader">
      <DotsButton
        isDotsButtonActive={isDotsButtonActive}
        setIsDotsButtonActive={setIsDotsButtonActive}
        style={{ backgroundColor: workspace.color }}
      />
      <div
        className="WorkspaceHeader_animation_cont"
        style={{
          bottom: `${isDotsButtonActive ? "0" : "56"}px`,
        }}
      >
        <MoreInfos />
        <Content workspaceName={workspace.name} isStarted={isStarted} />
      </div>
    </div>
  );
};
