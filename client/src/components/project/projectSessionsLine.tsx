import React from 'react'
import { DisplayUserPicture } from "../ui/displayUserPicture";
import { BasicButton } from "../ui/basicButton";
import bin from "../../assets/bin.svg";
import { formatTimestamp } from '../../utils/function';
import dayjs from 'dayjs';
import type { Session } from '../../libs/interfaces';

interface Props {
    session: Session;
}

const getTimestampWithTwoDates = (date1: string, date2: string) => {
    const day1 = dayjs(date1);
    const day2 = dayjs(date2);
    const diff = day2.diff(day1);
    return formatTimestamp(diff);
  }

const formatTwoDates = (date1: string, date2: string): string => {
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
            {session.memberWorkspace?.user && <DisplayUserPicture className="ProjectSessions_picture" user={session.memberWorkspace.user} />}
        <div className="ProjectSessions_time">
            {session.startedAt && session.endedAt && getTimestampWithTwoDates(session.startedAt, session.endedAt)}
        </div>
        <div className="ProjectSessions_date">
            {session.startedAt && session.endedAt && formatTwoDates(session.startedAt, session.endedAt)}
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
