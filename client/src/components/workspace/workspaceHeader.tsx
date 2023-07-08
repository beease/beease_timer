import { DotsButton } from "../ui/dotsButton";
import { useState } from "react";
import { TitleTimer } from "../ui/titleTimer";
import { AnimationCard } from "../animationCard";
import stats from "../../assets/stats.svg";
import edit from "../../assets/edit.svg";
import { BasicButton } from "../ui/basicButton";
import { Filters } from "../../libs/interfaces";
import { memo } from "react";
import {
  FiltersState,
  filtersStore,
} from "../../stores/filterStore";
import {
  projectStore, 
  ProjectStore,
} from "../../stores/projectStore";

interface Props {
  workspace: {
    name: string;
    color: string;
    id: string;
  };
}

interface ContentProps {
  workspaceName: string;
}

const Content = memo(function Content({
  workspaceName,
}: ContentProps) {
  const isPlaying = projectStore((state: ProjectStore) => state.PlayingProjectId);

  return (
    <div className="WorkspaceHeader_content">
      <TitleTimer title={workspaceName} timestamp={0} />
      <AnimationCard isStarted={isPlaying} />
    </div>
  );
});

export const WorkspaceHeader = ({
  workspace,
}: Props) => {


  const setFilters = filtersStore((state: FiltersState) => state.setFilters);
  const filters = filtersStore((state: FiltersState) => state.filters);

  const [isDotsButtonActive, setIsDotsButtonActive] = useState(false);

  const MoreInfos = () => {
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
              filters.archives && "selected"
            }`}
            onClick={() => setFilters("archives")}
          >
            Archives
          </div>
          <div
            className={`WorkspaceHeader_moreInfos_filter_item ${
              filters.current && "selected"
            }`}
            onClick={() => setFilters("current")}
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
        <Content workspaceName={workspace.name} />
      </div>
    </div>
  );
};
