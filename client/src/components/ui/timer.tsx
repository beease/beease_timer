import React from 'react'
import { useTimer } from '../../utils/function'

interface Props {
    startedAt: string;
    add?: number;
    hoursByDay: number;
}

export const Timer = ({startedAt, add, hoursByDay}: Props) => {
  return (
    <>
    {
        useTimer(add || 0, hoursByDay, startedAt )
        }
    </>
  )
}
