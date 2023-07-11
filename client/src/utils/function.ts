import { colors } from "../libs/colors";

export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const colorByLetter = (letter: string) => {
    if (letter === undefined || letter.length < 1) {
      return colors[0]; 
    }
    const index = letter.toLowerCase().charCodeAt(0) % colors.length;
    return colors[index];
  }

export const formatTimestamp = (timestamp: number) => {
  const totalSeconds = Math.floor(timestamp / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  
  const seconds = totalSeconds % 60;
  const minutes = totalMinutes % 60;
  
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

export const randomValue = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}