import "../App.scss";
import { useState } from "react";
import { Navigation } from "../components/navigation/navigation";
import { AddWorkspace } from "../components/workspace/addWorkspace";
import { Workspace } from "../components/workspace/workspace";


export function Home() {
    const [selectedWorkspace, setSelectedWorkspace] = useState<string>("")
    const [isAddingNewWorkspace, setIsAddingNewWorkspace] = useState<boolean>(false)

    return (
      <div id="home">
        <Navigation 
          selectedWorkspace={selectedWorkspace}
          setSelectedWorkspace={setSelectedWorkspace}
          setIsAddingNewWorkspace={setIsAddingNewWorkspace}
        />
        <div id="workspaces_cont">
        {
          isAddingNewWorkspace ?
          <AddWorkspace 
            setIsAddingNewWorkspace={setIsAddingNewWorkspace}
          />
          : selectedWorkspace &&
          <Workspace 
            selectedWorkspace={selectedWorkspace}
          />
        }
        </div>
        
      </div>
    );
}
