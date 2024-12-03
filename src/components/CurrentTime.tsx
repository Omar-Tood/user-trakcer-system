import React from 'react';
import { Clock } from 'lucide-react';
import { useTime } from '../hooks/useTime';

export function CurrentTime() {
  const { currentTime, formatTime } = useTime();

  return (
    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
      <Clock className="w-5 h-5" />
      <span className="font-medium">{formatTime(currentTime)}</span>
    </div>
  );
}