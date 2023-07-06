import { useRef, useEffect, useState } from 'react'
import dots from '../assets/dots_w.svg'
import play from '../assets/play_w.svg'
import pause from '../assets/pause_w.svg'
import history from '../assets/history.svg'
import setting from '../assets/setting.svg'
import { wait } from '../utils/function';

interface Props {
    setProjectMoreInfos: (status: string | null) => void;
    projectMoreInfos: null | string;
    id: string;
}

interface ButtonProps {
    title: string;
    icon: string;
}

export const ProjectCard = ({projectMoreInfos, setProjectMoreInfos, id}: Props) => {
    const [selectedButton, setSelectedButton] = useState('history');

    const projectCard = useRef<HTMLDivElement>(null);
    const moreInfos = useRef<HTMLDivElement>(null);
    const dotImages = useRef<HTMLImageElement>(null);
    
    useEffect(() => {
        const transition = async () => {
            if(projectMoreInfos === id && moreInfos.current && projectCard.current && dotImages.current){
                projectCard.current.style.height = '210px'
                dotImages.current.style.transform = 'rotate(90deg)';
                await wait(100);
                moreInfos.current.style.opacity = '0';
                moreInfos.current.style.opacity = '1';
            } else if (projectCard.current && moreInfos.current && dotImages.current){
                moreInfos.current.style.opacity = '0';
                dotImages.current.style.transform = 'rotate(0deg)';
                await wait(100);
                projectCard.current.style.height = '64px'
            }
        }
        transition()
    }, [projectMoreInfos, id])

    const handleMoreInfos = async () => {
        if(projectMoreInfos === id){
            setProjectMoreInfos(null)
        } else {  
            setProjectMoreInfos(id)
        }
    }

    const Button = ({ title, icon }: ButtonProps) => {
        const isSelected = selectedButton === title;
        const handleClick = () => {
            if (!isSelected) setSelectedButton(title);
        };
        return (
            <button style={{backgroundColor: isSelected ? 'auto' : '#4969fb'}} onClick={handleClick} className={`more_infos_history_button ${isSelected && 'selected'}`}>
            <img className={`${!isSelected && 'white'}`} alt={title} src={icon} />
            </button>
        );
      };

    const History = () => {
        return (<div></div>)
    }

    return (
        <div ref={projectCard} className='ProjectCard'>
            <div className='ProjectCard_top'>
                <button className='ProjectCard_top_more_infos' style={{
                    backgroundColor: '#4969fb'
                }}
                onClick={() => {handleMoreInfos()}}
                >
                    <img ref={dotImages} src={dots}/>
                </button>
                <div className='ProjectCard_top_infos'>
                    <div className='ProjectCard_top_infos_title'>Titre du projet</div>
                    <div className='ProjectCard_top_infos_timer'>00:00:00</div>
                </div>
                <div>
                    <button className='ProjectCard_top_play' style={{
                        backgroundColor: '#4969fb'
                    }}>
                        <img src={play}/>
                    </button>
                </div>
            </div>
            <div ref={moreInfos} className='ProjectCard_moreInfos'>
                <div className='ProjectCard_moreInfos_menu'>
                    <Button title={'history'} icon={history} />
                    <Button title={'setting'} icon={setting} />
                </div>
                <div className='ProjectCard_moreInfos_content'>
                    {selectedButton === 'history' && <History />}
                </div>
            </div>
        </div>
    )
}
