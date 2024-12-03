import React from 'react';
import { LogIn, LogOut, History, Ban, CheckCircle } from 'lucide-react';
import { User } from '../types/user';
import { useTime } from '../hooks/useTime';
import { Button } from './ui/Button';

interface UserTableProps {
  users: User[];
  onCheckIn: (userId: string) => void;
  onCheckOut: (userId: string) => void;
  onToggleStatus: (userId: string) => void;
  onViewActivity: (userId: string) => void;
}

export function UserTable({ 
  users, 
  onCheckIn, 
  onCheckOut,
  onToggleStatus,
  onViewActivity 
}: UserTableProps) {
  const { formatTime, getTimeAgo, getTimeRemaining } = useTime();

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Out Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Duration</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Expected Return</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {users.map((user) => (
            <tr 
              key={user.id} 
              className={`
                hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors
                ${user.suspended ? 'bg-gray-50 dark:bg-gray-800/50' : ''}
              `}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      {user.name}
                      {user.suspended && (
                        <span className="px-2 py-0.5 text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full">
                          Suspended
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  user.status === 'in' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {user.status === 'in' ? 'IN' : 'OUT'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {user.outTime ? formatTime(user.outTime) : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {user.outTime ? getTimeAgo(user.outTime) : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {user.expectedReturnTime ? (
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500 dark:text-gray-400">
                      {formatTime(user.expectedReturnTime)}
                    </span>
                    <span className={`text-xs ${
                      getTimeRemaining(user.expectedReturnTime) === 'Overdue' 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      ({getTimeRemaining(user.expectedReturnTime)})
                    </span>
                  </div>
                ) : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center gap-2">
                  {!user.suspended && (
                    user.status === 'in' ? (
                      <Button
                        onClick={() => onCheckOut(user.id)}
                        variant="outline"
                        size="sm"
                        className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                      >
                        <LogOut className="w-4 h-4 mr-1" /> Check Out
                      </Button>
                    ) : (
                      <Button
                        onClick={() => onCheckIn(user.id)}
                        variant="outline"
                        size="sm"
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      >
                        <LogIn className="w-4 h-4 mr-1" /> Check In
                      </Button>
                    )
                  )}
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
                    Activity
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}