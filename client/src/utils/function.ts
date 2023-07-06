import { colors } from "../libs/colors";

export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const colorByLetter = (letter: string) => {
    if (letter === undefined || letter.length < 1) {
      return colors[0]; 
    }
    const index = letter.toLowerCase().charCodeAt(0) % colors.length;
    return colors[index];
  }