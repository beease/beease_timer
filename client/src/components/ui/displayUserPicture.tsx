import { colorByLetter } from "../../utils/function";

interface Props {
  className: string;
  user: any;
}

export const DisplayUserPicture = ({ className, user }: Props) => {
  const { picture, name } = user;

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
