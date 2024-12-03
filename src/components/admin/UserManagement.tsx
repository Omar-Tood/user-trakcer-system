import React from 'react';
import { User } from '../../types/user';
import { Button } from '../ui/Button';
import { Ban, CheckCircle, History } from 'lucide-react';

interface UserManagementProps {
  user: User;
  onToggleStatus: (userId: string) => void;
  onViewActivity: (userId: string) => void;
}

export function UserManagement({ user, onToggleStatus, onViewActivity }: UserManagementProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => onToggleStatus(user.id)}
        variant="outline"
        size="sm"
        className={`
          ${user.suspended
            ? 'text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300'
            : 'text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'}
        `}
      >
        {user.suspended ? (
          <>
            <CheckCircle className="w-4 h-4 mr-1" />
            Activate
          </>
        ) : (
          <>
            <Ban className="w-4 h-4 mr-1" />
            Suspend
          </>
        )}
      </Button>
      
      <Button
        onClick={() => onViewActivity(user.id)}
        variant="outline"
        size="sm"
        className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      >
        <History className="w-4 h-4 mr-1" />
        Activity Log
      </Button>
    </div>
  );
}