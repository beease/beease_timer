import { formatTimestamp } from '../../utils/function'

interface Props {
    title: string,
    timestamp: number,
}

export const TitleTimer = ({title, timestamp}: Props) => {
  const formatTime = formatTimestamp(timestamp)

  return (
    <div className='titleTimer'>
        <div className='titleTimer_title'>{title}</div>
        <div className='titleTimer_timer'>{formatTime}</div>
    </div>
  )
}
