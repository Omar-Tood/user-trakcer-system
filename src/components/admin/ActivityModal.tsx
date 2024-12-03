import React from 'react';
import { X } from 'lucide-react';
import { ActivityLog } from './ActivityLog';
import { Button } from '../ui/Button';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  activities: any[];
}

export function ActivityModal({ isOpen, onClose, userId, userName, activities }: ActivityModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Activity Log - {userName}
          </h2>
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
            className="dark:border-gray-600"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <ActivityLog activities={activities} />
      </div>
    </div>
  );
}