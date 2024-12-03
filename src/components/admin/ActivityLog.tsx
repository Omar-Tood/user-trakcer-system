import React from 'react';
import { Clock, LogIn, LogOut, AlertTriangle, Ban, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Activity } from '../../types/user';

interface ActivityLogProps {
  activities: Activity[];
}

export function ActivityLog({ activities }: ActivityLogProps) {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'check-in':
        return <LogIn className="w-5 h-5 text-green-500" />;
      case 'check-out':
        return <LogOut className="w-5 h-5 text-blue-500" />;
      case 'late-return':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'suspension':
        return <Ban className="w-5 h-5 text-red-500" />;
      case 'activation':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return null;
    }
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No activity records found
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.map((activity, index) => (
          <li key={activity.id}>
            <div className="relative pb-8">
              {index !== activities.length - 1 && (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {activity.details}
                    </p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}