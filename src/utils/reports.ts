import { AttendanceRecord } from '../types/user';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

interface LateReport {
  totalIncidents: number;
  averageDuration: string;
  details: {
    date: Date;
    duration: string;
  }[];
}

export function generateWeeklyLateReport(attendance: AttendanceRecord[]): LateReport {
  const now = new Date();
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);

  return generateReport(attendance, weekStart, weekEnd);
}

export function generateMonthlyLateReport(attendance: AttendanceRecord[]): LateReport {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  return generateReport(attendance, monthStart, monthEnd);
}

function generateReport(
  attendance: AttendanceRecord[],
  startDate: Date,
  endDate: Date
): LateReport {
  const lateRecords = attendance.filter(record => 
    record.isLate && 
    record.checkOut &&
    isWithinInterval(record.checkOut, { start: startDate, end: endDate })
  );

  const totalIncidents = lateRecords.length;
  
  const details = lateRecords.map(record => ({
    date: record.checkOut!,
    duration: record.lateDuration || '0 minutes'
  }));

  // Calculate average duration in minutes
  const totalMinutes = details.reduce((acc, curr) => {
    const duration = curr.duration.match(/\d+/);
    return acc + (duration ? parseInt(duration[0]) : 0);
  }, 0);

  const averageMinutes = totalIncidents > 0 ? Math.round(totalMinutes / totalIncidents) : 0;
  const averageDuration = `${averageMinutes} minutes`;

  return {
    totalIncidents,
    averageDuration,
    details
  };
}