import React from 'react'
import { DisplayUserPicture } from "../ui/displayUserPicture";
import { BasicButton } from "../ui/basicButton";
import bin from "../../assets/bin.svg";
import { formatTimestamp } from '../../utils/function';
import dayjs from 'dayjs';
interface Props {
    session: any;
}

const getTimestampWithTwoDates = (date1: Date, date2: Date) => {
    const day1 = dayjs(date1);
    const day2 = dayjs(date2);
    const diff = day2.diff(day1);
    return formatTimestamp(diff);
  }

const formatTwoDates = (date1: Date, date2: Date): string => {
    const formattedDate1 = dayjs(date1);
    const formattedDate2 = dayjs(date2);

    const dateString = formattedDate1.format('YYYY-MM-DD');
    const time1 = formattedDate1.format('HH:mm');
    const time2 = formattedDate2.format('HH:mm');

    return `${dateString}   ${time1} - ${time2}`;
};

export const ProjectSessionsLine = ({session}: Props) => {    
    return(
        <div className="ProjectSessions_line">
            <DisplayUserPicture className="ProjectSessions_picture" user={session.member} />
        <div className="ProjectSessions_time">
            {getTimestampWithTwoDates(session.startedAt, session.endedAt)}
        </div>
        <div className="ProjectSessions_date">
            {formatTwoDates(session.startedAt, session.endedAt)}
        </div>
            <BasicButton
                icon={bin}
                variant="grey"
                size='small'
                style={{
                    height: "36px",
                    width: "36px",
                }}
            />
        </div>
    )
}
