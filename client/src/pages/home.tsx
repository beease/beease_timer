import { Navigation } from "../components/navigation/navigation";
import { Workspace } from "../components/workspace/workspace";

export function Home() {
  return (
    <div id="home">
      <Navigation />
      <Workspace />
    </div>
  );
}
