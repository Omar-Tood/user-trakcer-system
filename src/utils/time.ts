import { formatDistanceStrict, differenceInHours, differenceInMinutes } from 'date-fns';

export function formatLateDuration(actualReturn: Date, expectedReturn: Date): string {
  return formatNaturalDuration(differenceInMinutes(actualReturn, expectedReturn));
}

export function formatNaturalDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours === 0) {
    return `${minutes} minutes`;
  }
  
  if (minutes === 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }
  
  return `${hours} ${hours === 1 ? 'hour' : 'hours'} and ${minutes} minutes`;
}