import React from 'react'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    icon?: string;
    variant?: 'confirm' | 'cancel' | 'grey' | 'clear' | 'darkGrey' | 'alert' | 'disable';
    size?: 'small' | 'medium' | 'large';
}

const sizes = {
    small: {
        height: '16px',
        width: '16px',
    },
    medium: {
        height: '20px',
        width: '20px',
    },
    large: {
        height: '28px',
        width: '28px',  
    }
}

export const BasicButton = ({icon, variant, children, ...props}: Props) => {
  return (
    <button
        className={`ui_basicButton ${variant}`}
        {...props}
      >
        {children 
        ? children 
        : <img 
          src={icon} 
          style={{
            width: sizes[props.size || 'medium'].height,
            height: sizes[props.size || 'medium'].width,
          }}
        />}
        {}
    </button>
  )
}
