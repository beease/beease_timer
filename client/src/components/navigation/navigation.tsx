import React from 'react'

import { LogoutButton } from './logoutButton';
import { WorkspacesList } from './workspacesList';
import { AddWorkspaceButton } from './addWorkspaceButton';

export const Navigation = () => {

  return (
    <div id='navigation'>
      <LogoutButton />
      <WorkspacesList/>
      <AddWorkspaceButton/>
    </div>
  )
}
