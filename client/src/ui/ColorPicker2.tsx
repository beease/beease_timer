import { useRef } from 'react';
import {wait} from '../../../src/utils/function'
import {colors} from '../../../src/libs/colors'
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

    const Button = () => {
        return (
            <button style={{ backgroundColor: color }} id='add_workspace_choose_color' onClick={() => { setColorPopup(true) }}></button>
        )
    } 

    const ColorPickerPopup = () => {
        return (
            <div id='popup_color' onClick={() => { setColorPopup(false) }} style={{
                visibility: colorPopup ? 'visible' : 'hidden',
                opacity: colorPopup ? '1' : '0',
            }}>
                <div className='color_picker'>
                    {
                        colors.map((color, i1) => (
                            <div key={i1} onClick={() => { setColor(color) }} className='color_nuance' style={{ backgroundColor: color }}></div>
                        ))
                    }
                </div>
            </div>
        )
    }
    
    
    return (
    <>
       <Button />
       <ColorPickerPopup />
    </>
)
}
