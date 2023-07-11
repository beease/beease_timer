import { colorByLetter } from "../../utils/function";
import { trpc } from "../../trpc";
import { cachingTimes } from "../../libs/cachingTimes";

interface Props {
  className: string;
}

export const DisplayMyPicture = ({ className }: Props) => {
  const { data: user, error, isLoading, } = trpc.user.getMyUser.useQuery(undefined, {
    staleTime: cachingTimes.myUserPicture.staleTime,
    cacheTime: cachingTimes.myUserPicture.cachingTimes,
  });

  if (isLoading) {
    return <div className={`${className} skeleton`}></div>;
  }

  if (error) {
    console.error(error);
    return <div>Error</div>;
  }
  const { picture, name } = user ?? {};

  if (picture) {
    return <img className={className} src={picture} />;
  }

  if (name) {
    const color = colorByLetter(name[0]);
    return (
      <div
        className={className}
        style={{
          backgroundColor: color,
        }}
      >
        {name[0]}
      </div>
    );
  }

  return null;
};
