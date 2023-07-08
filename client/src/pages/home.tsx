import "../App.scss";
import { useState } from "react";
import { Navigation } from "../components/navigation/navigation";
import { AddWorkspace } from "../components/workspace/addWorkspace";
import { Workspace } from "../components/workspace/workspace";
import { workspaceStore, WorkspaceState } from "../stores/workspaceStore";

export function Home() {
  const isAddingWorkspace = workspaceStore(
    (state: WorkspaceState) => state.isAddingWorkspace
  );
  const selectedWorkspaceId = workspaceStore(
    (state: WorkspaceState) => state.selectedWorkspaceId
  );

  return (
    <div id="home">
      <Navigation />
      <div id="workspaces_cont">
        {isAddingWorkspace ? (
          <AddWorkspace />
        ) : (
          selectedWorkspaceId && <Workspace />
        )}
      </div>
    </div>
  );
}
