import React from 'react';
import { format } from 'date-fns';
import { AlertTriangle, Clock } from 'lucide-react';

interface LateReportCardProps {
  title: string;
  totalIncidents: number;
  averageDuration: string;
  details: {
    date: Date;
    duration: string;
  }[];
}

export function LateReportCard({ title, totalIncidents, averageDuration, details }: LateReportCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          {title}
        </h3>
        <span className="text-2xl font-bold text-red-600 dark:text-red-400">
          {totalIncidents}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <Clock className="w-4 h-4" />
          <span>Average Late Duration: {averageDuration}</span>
        </div>
      </div>

      {details.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recent Incidents</h4>
          <div className="space-y-2">
            {details.slice(0, 3).map((detail, index) => (
              <div 
                key={index}
                className="flex justify-between text-sm text-gray-600 dark:text-gray-400"
              >
                <span>{format(detail.date, 'MMM d, yyyy HH:mm')}</span>
                <span>{detail.duration}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}