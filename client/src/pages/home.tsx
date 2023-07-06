import "../App.scss";
import { useEffect, useState, useContext } from "react";
import { Logout } from "../utils/Auth/Auth";
//import { AuthContext } from '../App';
import Logo from "../assets/google.png";
import { trpc } from "../trpc";
import { Switch } from "../ui/switch";
import { ColorPickerPopup } from "../ui/colorPicker";
import { Navigation } from "../components/navigation/navigation";

function Loading() {
  return <div>loading google</div>;
}

export function Home() {
  //const {logout} = useContext(AuthContext);
  const { data: user, error, isLoading } = trpc.user.getMyUser.useQuery();
  const [currentOption, setCurrentOption] = useState<number>(0);
  const [colorWorkSpace, setColorWorkSpace] = useState("");
  const [colorWorkSpacePopup, setColorWorkSpacePopup] = useState(false);
  console.log(colorWorkSpace);

  if (error) {
    console.log(error);
    return <div>Error</div>;
  }

  if (isLoading || !user) {
    return <div>Loading</div>;
  }

  if (user) {
    console.log(user);
    return (
      <div id="home">
        <Navigation />
        {/* <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ColorPickerPopup
            setColor={setColorWorkSpace}
            colorPopup={colorWorkSpacePopup}
            setColorPopup={setColorWorkSpacePopup}
            color={colorWorkSpace || "#4969fb"}
          />
          <Switch
            width={200}
            height={48}
            options={["En cours", "Archives"]}
            color={"#4969fb"}
            currentOption={currentOption}
            setCurrentOption={setCurrentOption}
          />
        </div>
        <div>
          <div>logged</div>
          welcome {user.given_name}
          <div
            onClick={() => {
              Logout();
            }}
          >
            logout
          </div>
        </div> */}
      </div>
    );
  }
}
