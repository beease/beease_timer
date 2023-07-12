import React from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement>{
    width: number;
    height: number;
    options: [string, string]; 
    color: string;
    currentOption: boolean;
    setCurrentOption: (option: boolean) => void;
}

export const Switch = ({options, width, height, color, currentOption, setCurrentOption, ...props}: Props) => {
    const lineHeight = `${height - 16}px`;
    const buttonPosition = `${currentOption === true ?(width / 2) * 1 - 4 : 0}px`;

    return (
        <div {...props} className='ui_switch_cont' style={{width: `${width}px`, height: `${height}px`}}>
            <div className='ui_switch_text_cont'>
                <div
                    className={`ui_switch_text ${currentOption === false && 'selected'}`}
                    style={{lineHeight}}
                    onClick={() => setCurrentOption(false)}
                >
                    {options[0]}
                </div>
                <div
                    className={`ui_switch_text ${currentOption === true && 'selected'}`}
                    style={{lineHeight}}
                    onClick={() => setCurrentOption(true)}
                >
                    {options[1]}
                </div>
            </div>
            <div className='ui_switch_colored_button' style={{
                backgroundColor: color,
                bottom: `${height - 8}px`,
                left: buttonPosition,
            }} />
        </div>
    );
};

// const [currentOption, setCurrentOption] = useState<number>(0);
// <Switch
// width={200}
// height={48}
// options={["En cours", "Archives"]}
// color={"#4969fb"}
// currentOption={currentOption}
// setCurrentOption={setCurrentOption}
// />