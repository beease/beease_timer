interface Props {
    width: number;
    height: number;
    options: [string, string]; 
    color: string;
    currentOption: number;
    setCurrentOption: (option: number) => void;
}

export const Switch = ({options, width, height, color, currentOption, setCurrentOption}: Props) => {
    const lineHeight = `${height - 16}px`;
    const buttonPosition = `${currentOption === 1 ?(width / 2) * currentOption - 8 : 0}px`;

    return (
        <div className='ui_switch_cont' style={{width: `${width}px`, height: `${height}px`}}>
            <div className='ui_switch_text_cont'>
                <div
                    className={`ui_switch_text ${currentOption === 0 && 'selected'}`}
                    style={{lineHeight}}
                    onClick={() => setCurrentOption(0)}
                >
                    {options[0]}
                </div>
                <div
                    className={`ui_switch_text ${currentOption === 1 && 'selected'}`}
                    style={{lineHeight}}
                    onClick={() => setCurrentOption(1)}
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