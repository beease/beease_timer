import React from 'react'
import { useTimer } from '../../utils/function'

interface Props {
    startedAt: string;
}

export const Timer = ({startedAt}: Props) => {
  return (
    <>
    {
        useTimer(startedAt)
        }
    </>
  )
}
