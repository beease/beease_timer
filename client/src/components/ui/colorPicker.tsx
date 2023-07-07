import { useRef } from 'react';
import {wait} from '../../utils/function'
import {colors} from '../../libs/colors'
interface Props extends React.HTMLAttributes<HTMLDivElement>{
    setColor: (color: string) => void;
    colorPopup: boolean;
    setColorPopup: (etat: boolean) => void;
    color: string;
}

export const ColorPickerPopup = ({
    setColor,
    colorPopup,
    setColorPopup,
    color,
    ...props
}: Props) => {
    const colorPopupRef = useRef<HTMLDivElement | null>(null);

    const DisplayPopupAnimation = async (etat: boolean) => {
        if (etat) {
            setColorPopup(true);
            await wait(30);
            if (colorPopupRef.current){
                colorPopupRef.current.style.opacity = '1';
            } 
        } else if (colorPopupRef.current) {
            colorPopupRef.current.style.opacity = '0';
            await wait(200);
            setColorPopup(false);
        }
    }

    const handleChooseColor = async (color: string) => {
        await DisplayPopupAnimation(false)
        setColor(color)
    }

    const ColorButton = () => {
        return (
            <div {...props} style={{ backgroundColor: color, ...props.style }} id='color_picker_button' onClick={() => { DisplayPopupAnimation(true) }}></div>
        )
    }

    const ColorPicker = () => {
        return (
            <div ref={colorPopupRef} id='popup_color' onClick={() => { DisplayPopupAnimation(false) }}>
                <div className='color_picker'>
                    {
                        colors.map((color, i1) => (
                            <div key={i1} onClick={() => { handleChooseColor(color) }} className='color_nuance' style={{ backgroundColor: color }}></div>
                        ))
                    }
                </div>
            </div>)
    }

    return (
        <>
            <ColorButton />
            {colorPopup &&
                <ColorPicker />}
        </>
    )
}


{/* 
  const [colorWorkSpace, setColorWorkSpace] = useState("");
  const [colorWorkSpacePopup, setColorWorkSpacePopup] = useState(false);
<ColorPickerPopup
            setColor={setColorWorkSpace}
            colorPopup={colorWorkSpacePopup}
            setColorPopup={setColorWorkSpacePopup}
            color={colorWorkSpace || "#4969fb"}
          /> */}