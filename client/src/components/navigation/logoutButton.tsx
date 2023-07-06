import { trpc } from "../../trpc";
import Power from "../../assets/power.svg";
import { colorByLetter } from "../../utils/function";
import { cachingTimes } from "../../libs/cachingTimes";

export const LogoutButton = () => {
  const DisplayUserImage = () => {
    const { data: user, error, isLoading } = trpc.user.getMyUser.useQuery(undefined, {
        staleTime: cachingTimes.lougoutButtonUser,
        cacheTime: cachingTimes.lougoutButtonUser,
    });

    if (error) {
      console.log(error)
      return <div>error</div>;
    }

    if (isLoading) {
      return <div className="logout_picture skeleton"></div>;
    }

    if (user) {
      if (user.picture) {
        return <img className="logout_picture" src={user.picture} />;
      } else if (user.name) {
        const color = colorByLetter(user?.name[0]);
        return (
          <div
            className="logout_picture"
            style={{
              backgroundColor: color,
            }}
          >
            {user.name[0]}
          </div>
        );
      }
    }
  };

  return (
    <div id="logout_cont">
      <div id="logout_bouton_cont">
        <div id="logout_bouton">
          <img src={Power} />
        </div>
      </div>
      <DisplayUserImage />
    </div>
  );
};
