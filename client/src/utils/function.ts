import { colors } from "../libs/colors";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const colorByLetter = (letter: string) => {
  if (letter === undefined || letter.length < 1) {
    return colors[0];
  }
  const index = letter.toLowerCase().charCodeAt(0) % colors.length;
  return colors[index];
};

export const formatTimestamp = (timestamp: number, hoursByDay: number) => {
  const totalSeconds = Math.floor(timestamp / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);

  const days = Math.floor(totalHours / hoursByDay);

  const hours = totalHours % hoursByDay;
  const minutes = totalMinutes % 60;
  const seconds = totalSeconds % 60;

  const formattedDays = days.toString();
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  return `${
    +formattedDays > 0 ? formattedDays + "d " : ""
  }${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

export const randomValue = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const timer = (startDate: string, add: number, hoursByDay: number) => {
  const now = dayjs();
  const start = dayjs(startDate);
  const elapsedMilliseconds = now.diff(start);

  return formatTimestamp(elapsedMilliseconds + add, hoursByDay);
};

export const getTimestampWithTwoDates = (date1: string, date2?: string) => {
  const day1 = dayjs(date1);
  const day2 = dayjs(date2);
  const diff = day2.diff(day1);
  return formatTimestamp(diff, 24);
};

export const formatTwoDates = (date1: string, date2: string): string => {
  const formattedDate1 = dayjs(date1);
  const formattedDate2 = dayjs(date2);

  const dateString = formattedDate1.format("YYYY-MM-DD");
  const time1 = formattedDate1.format("HH:mm");
  const time2 = formattedDate2.format("HH:mm");

  return `${dateString}   ${time1} - ${time2}`;
};

export const formatDate = (date: string): string => {
  const formattedDate = dayjs(date);

  const dateString = formattedDate.format("YYYY-MM-DD");
  const time1 = formattedDate.format("HH:mm");

  return `${dateString} ${time1}`;
};

export const useTimer = (
  add: number,
  hoursByDay: number,
  startedAt?: string | null,
  endedAt?: string | null
) => {
  const [time, setTime] = useState("");

  useEffect(() => {
    if (startedAt && !endedAt) {
      setTime(timer(startedAt, add, hoursByDay));

      const intervalId = setInterval(() => {
        setTime(timer(startedAt, add, hoursByDay));
      }, 1000);

      return () => clearInterval(intervalId);
    } else if (startedAt && endedAt) {
      setTime(getTimestampWithTwoDates(startedAt, endedAt));
    } else if (!startedAt) {
      setTime("00:00:00");
    }
  }, [startedAt, endedAt]);

  return time;
};
