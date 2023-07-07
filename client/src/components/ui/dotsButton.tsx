import React from 'react'
import dots from '../../assets/dots_w.svg'
import { useRef, useEffect } from 'react'

interface Props extends React.HTMLAttributes<HTMLButtonElement>{
    setIsDotsButtonActive: (status: boolean) => void;
    isDotsButtonActive: boolean;
}

export const DotsButton = ({isDotsButtonActive, setIsDotsButtonActive, ...props}: Props) => {
    const dotImages = useRef<HTMLImageElement>(null);
    useEffect(() => {
        if (dotImages.current) {
            dotImages.current.style.transform = `rotate(${isDotsButtonActive ? '90' : '0'}deg)`
        }
    }, [isDotsButtonActive]);

  return (
    <button {...props} className='ui_dots_button'
        onClick={() => {setIsDotsButtonActive(!isDotsButtonActive)}}
    >
        <img ref={dotImages} src={dots}/>
    </button>
  )
}
