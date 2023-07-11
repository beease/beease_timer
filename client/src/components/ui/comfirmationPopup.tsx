import bin from "../../../public/asset/bin_w.svg";
import cross from "../../../public/asset/cross.svg";
import { wait } from "../../utils/function";
import { useRef, useEffect } from "react";
import { BasicButton } from "./basicButton";
interface Props {
  open: boolean;
  setOpen: (statut: boolean) => void;
  onConfirm: () => void;
  text: string;
}

export const ConfirmationPopup = ({
  open,
  setOpen,
  onConfirm,
  text,
}: Props) => {
  const popupRef = useRef<HTMLDivElement>(null);

  const handleConfirm = async () => {
    await animation(false);
    setOpen(false);
    onConfirm();
  };

  const animation = async (statut: boolean) => {
    if (!popupRef.current) return;
    if (statut) {
      await wait(30);
      popupRef.current.style.opacity = "1";
    } else {
      await wait(30);
      popupRef.current.style.opacity = "0";
      await wait(150);
    }
  };

  useEffect(() => {
    animation(true);
  }, [open]);

  return (
    <div ref={popupRef} id="popup_confirmation">
      <div id="popup_confirmation_cont">
        <div id="popup_confirmation_text">
          <img alt="bin" src={bin} /> <div>{text}</div>
        </div>
        <div id="popup_confirmation_action">
          <BasicButton
            icon={cross}
            onClick={() => {
              setOpen(false);
            }}
            variant={"grey"}
            style={{
              width: "calc(50% - 5px)",
            }}
          />
          <BasicButton
            icon={bin}
            onClick={() => {
              handleConfirm();
            }}
            variant="alert"
            style={{
              width: "calc(50% - 5px)",
            }}
          />
        </div>
      </div>
    </div>
  );
};
