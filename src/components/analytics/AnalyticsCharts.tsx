import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { subDays, format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { AttendanceRecord } from '../../types/user';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AnalyticsChartsProps {
  attendance: AttendanceRecord[];
}

export function AnalyticsCharts({ attendance }: AnalyticsChartsProps) {
  // Get last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i))
    .reverse()
    .map(date => format(date, 'MMM dd'));

  // Get late returns per day
  const lateReturnsData = last7Days.map(day => {
    return attendance.filter(record => 
      record.isLate && 
      format(record.checkOut || new Date(), 'MMM dd') === day
    ).length;
  });

  // Calculate average duration by hour of day
  const thisWeekStart = startOfWeek(new Date());
  const thisWeekEnd = endOfWeek(new Date());
  const weekDays = eachDayOfInterval({ start: thisWeekStart, end: thisWeekEnd })
    .map(date => format(date, 'EEE'));

  const averageDurationByDay = weekDays.map(day => {
    const records = attendance.filter(record => 
      record.checkOut && 
      format(record.checkOut, 'EEE') === day
    );
    
    if (records.length === 0) return 0;
    
    const totalDuration = records.reduce((sum, record) => sum + (record.duration || 0), 0);
    return Math.round(totalDuration / records.length / (1000 * 60 * 60)); // Convert to hours
  });

  // Calculate status distribution
  const totalRecords = attendance.length;
  const lateRecords = attendance.filter(record => record.isLate).length;
  const onTimeRecords = totalRecords - lateRecords;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const lineChartData = {
    labels: last7Days,
    datasets: [
      {
        label: 'Late Returns',
        data: lateReturnsData,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const barChartData = {
    labels: weekDays,
    datasets: [
      {
        label: 'Average Duration (Hours)',
        data: averageDurationByDay,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  const doughnutChartData = {
    labels: ['On Time', 'Late'],
    datasets: [
      {
        data: [onTimeRecords, lateRecords],
        backgroundColor: [
          'rgba(34, 197, 94, 0.5)',
          'rgba(239, 68, 68, 0.5)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Late Returns Trend
        </h3>
        <Line options={chartOptions} data={lineChartData} />
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Average Duration by Day
        </h3>
        <Bar options={chartOptions} data={barChartData} />
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Return Status Distribution
        </h3>
        <div className="max-w-md mx-auto">
          <Doughnut data={doughnutChartData} />
        </div>
      </div>
    </div>
  );
}