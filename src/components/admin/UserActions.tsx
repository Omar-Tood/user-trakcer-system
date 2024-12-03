import React from 'react';
import { Ban, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface UserActionsProps {
  userId: string;
  isActive: boolean;
  onToggleStatus: (userId: string) => void;
  onViewActivity: (userId: string) => void;
}

export function UserActions({ userId, isActive, onToggleStatus, onViewActivity }: UserActionsProps) {
  return (
    <div className="flex gap-2">
      <Button
        onClick={() => onToggleStatus(userId)}
        variant="outline"
        size="sm"
        className={isActive ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}
      >
        {isActive ? (
          <>
            <Ban className="w-4 h-4 mr-1" /> Suspend
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4 mr-1" /> Activate
          </>
        )}
      </Button>
      <Button
        onClick={() => onViewActivity(userId)}
        variant="outline"
        size="sm"
        className="dark:border-gray-600"
      >
        View Activity
      </Button>
    </div>
  );
}