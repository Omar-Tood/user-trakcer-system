import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { Button } from './ui/Button';
import { User } from '../types/user';
import { formatNaturalDuration } from '../utils/time';

interface LateManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  lateUsers: User[];
  onNotifyUser: (userId: string) => void;
}

export function LateManagementModal({ 
  isOpen, 
  onClose, 
  lateUsers,
  onNotifyUser 
}: LateManagementModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[32rem] max-h-[80vh] overflow-y-auto">
        <div className="flex items-center gap-2 text-red-600 mb-4">
          <AlertTriangle className="w-6 h-6" />
          <h2 className="text-xl font-semibold">Late Returns Management</h2>
        </div>

        {lateUsers.length === 0 ? (
          <p className="text-gray-600">No late returns at the moment.</p>
        ) : (
          <div className="space-y-4">
            {lateUsers.map(user => {
              const lateDuration = formatNaturalDuration(
                Math.floor(
                  (new Date().getTime() - (user.expectedReturnTime?.getTime() || 0)) / 1000 / 60
                )
              );

              return (
                <div 
                  key={user.id} 
                  className="bg-red-50 border border-red-100 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => onNotifyUser(user.id)}
                      size="sm"
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      Send Reminder
                    </Button>
                  </div>
                  
                  <div className="mt-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Expected: {user.expectedReturnTime?.toLocaleTimeString()}</span>
                    </div>
                    <p className="mt-1 text-red-600 font-medium">
                      Late by: {lateDuration}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}