import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { formatNaturalDuration } from '../utils/time';
import { differenceInMinutes } from 'date-fns';

interface LateReturnToastProps {
  userName: string;
  expectedTime: Date;
  actualTime: Date;
  lateDuration: string;
}

export function LateReturnToast({ userName, expectedTime, actualTime, lateDuration }: LateReturnToastProps) {
  const minutes = differenceInMinutes(actualTime, expectedTime);
  const formattedDuration = formatNaturalDuration(minutes);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 font-semibold">
        <AlertTriangle className="w-5 h-5 text-red-500" />
        Late Return: {userName}
      </div>
      <div className="text-sm text-gray-600">
        Expected: {expectedTime.toLocaleTimeString()}
      </div>
      <div className="text-sm text-gray-600">
        Actual: {actualTime.toLocaleTimeString()}
      </div>
      <div className="text-sm font-medium text-red-600">
        Late by: {formattedDuration}
      </div>
    </div>
  );
}