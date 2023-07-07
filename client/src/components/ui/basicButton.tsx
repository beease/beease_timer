import React from 'react'

interface Props extends React.HTMLAttributes<HTMLButtonElement>{
    icon: string;
    variant?: 'confirm' | 'cancel' | 'grey' | 'clear' 
}

export const BasicButton = ({icon, variant, ...props}: Props) => {
  return (
    <button
        className={`ui_basicButton ${variant}`}
        style={{
            ...props.style,
        }}
        {...props}
      >
        <img src={icon} />
    </button>
  )
}
