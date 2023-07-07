import React from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement>{
    users: [];
} 

export const AddPeople = ({users, ...props}: Props) => {
   
    return (
        <div {...props} className='ui_add_people'>
            
        </div>
    );
};