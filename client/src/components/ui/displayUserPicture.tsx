import { colorByLetter } from "../../utils/function";

interface Props {
  className: string;
  user: {
    picture?: string | null;
    given_name?: string | null;
  };
}

export const DisplayUserPicture = ({ className, user }: Props) => {
  const { picture, given_name } = user;

  if (picture) {
    return <img className={className} src={picture} />;
  }

  if (given_name) {
    const color = colorByLetter(given_name[0]);
    return (
      <div
        className={className}
        style={{
          backgroundColor: color,
        }}
      >
        {given_name[0]}
      </div>
    );
  }

  return null;
};
