import React from 'react'
import { useTimer } from '../../utils/function'

interface Props {
    startedAt: string;
    add?: number;
}

export const Timer = ({startedAt, add}: Props) => {
  return (
    <>
    {
        useTimer(add || 0, startedAt)
        }
    </>
  )
}
