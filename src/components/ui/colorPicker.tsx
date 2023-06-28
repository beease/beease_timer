import { useRef } from 'react';
import {wait} from '../../utils/function'
import {colors} from '../../libs/colors'
interface Props {
    setColor: (color: string) => void;
    colorPopup: boolean;
    setColorPopup: (etat: boolean) => void;
    color: string;
}

export const ColorPickerPopup = ({
    setColor,
    colorPopup,
    setColorPopup,
    color
}: Props) => {
    const colorPopupRef = useRef<HTMLDivElement | null>(null);

    const handleColorWorkSpace = async (etat: boolean) => {
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
        await handleColorWorkSpace(false)
        setColor(color)
    }

    const ColorButton = () => {
        return (
            <button style={{ backgroundColor: color }} id='add_workspace_choose_color' onClick={() => { handleColorWorkSpace(true) }}></button>
        )
    }

    const ColorPicker = () => {
        return (
            <div ref={colorPopupRef} id='popup_color' onClick={() => { handleColorWorkSpace(false) }}>
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