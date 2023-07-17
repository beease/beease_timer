import React from "react";
import { FiltersState, filtersStore } from "../../stores/filterStore";
import { workspaceStore, WorkspaceState } from "../../stores/workspaceStore";
import { BasicButton } from "../ui/basicButton";
import stats from "../../assets/stats.svg";
import stats_w from "../../assets/stats_w.svg";
import edit from "../../assets/edit.svg";
import { Workspace } from "../../libs/interfaces";
import plus from "../../assets/Plus.svg";
import { WorkspaceInvitationButton } from "./workspaceInviationButton";

interface Props{
  workspace: Workspace;
}

export const WorkspaceMoreInfos = ({workspace}: Props) => {

console.log(workspace)

  const setFilters = filtersStore((state: FiltersState) => state.setFilters);
  const filters = filtersStore((state: FiltersState) => state.filters);
  const setSettingWorkspace = workspaceStore((state: WorkspaceState) => state.setSettingWorkspace);
  const isStatisticActive = workspaceStore((state: WorkspaceState) => state.isStatisticActive);
  const toggleStatisticActive = workspaceStore((state: WorkspaceState) => state.toggleStatisticActive);
  const toggleInvitationActive = workspaceStore((state: WorkspaceState) => state.toggleInvitationActive);
  return (
    <div className="WorkspaceHeader_moreInfos">
      <BasicButton
        onClick={() => {
            toggleStatisticActive()
        }}
        size="small"
        variant={isStatisticActive ? "darkGrey" : "clear"}
        icon={isStatisticActive ? stats_w : stats}
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
      <WorkspaceInvitationButton
      workspaceId={workspace.id}
      onClick={() => {
        toggleInvitationActive();
      }}
      />
      {
        workspace.role === 'ADMIN' || workspace.role === 'OWNER'
        && <BasicButton
        onClick={() => {
            setSettingWorkspace('edit')
        }}
        size="small"
        variant="clear"
        icon={edit}
      />
      }
      
    </div>
  );
};
