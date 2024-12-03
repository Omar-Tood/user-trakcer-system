import { useState, useEffect } from 'react';
import { format, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { formatNaturalDuration } from '../utils/time';

export function useTime() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => format(date, 'HH:mm:ss');

  const getTimeAgo = (date: Date) => {
    const mins = differenceInMinutes(currentTime, date);
    if (mins === 0) {
      const secs = differenceInSeconds(currentTime, date);
      return `${secs}s ago`;
    }
    return formatNaturalDuration(mins);
  };

  const getTimeRemaining = (expectedReturn: Date) => {
    const mins = differenceInMinutes(expectedReturn, currentTime);
    if (mins < 0) {
      return 'Overdue';
    }
    return formatNaturalDuration(mins);
  };

  return {
    currentTime,
    formatTime,
    getTimeAgo,
    getTimeRemaining
  };
}