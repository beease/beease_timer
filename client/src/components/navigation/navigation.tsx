import React from 'react'

import { LogoutButton } from './logoutButton';
import { WorkspacesList } from './workspacesList';
import { AddWorkspaceButton } from './addWorkspaceButton';

interface Props {
  selectedWorkspace: string;
  setSelectedWorkspace: (workspace: string) => void;
  setIsAddingNewWorkspace: (isAddingNewWorkspace: boolean) => void;
}

export const Navigation = ({selectedWorkspace, setSelectedWorkspace, setIsAddingNewWorkspace}: Props) => {

  return (
    <div id='navigation'>
      <LogoutButton />
      <WorkspacesList
        selectedWorkspace={selectedWorkspace}
        setSelectedWorkspace={setSelectedWorkspace}
      />
      <AddWorkspaceButton 
        setIsAddingNewWorkspace={setIsAddingNewWorkspace}
      />
    </div>
  )
}
