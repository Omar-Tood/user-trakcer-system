import React from 'react';
import { User, AttendanceRecord } from '../types/user';
import { Users, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface DashboardStatsProps {
  users: User[];
  attendance: AttendanceRecord[];
}

export function DashboardStats({ users, attendance }: DashboardStatsProps) {
  const totalUsers = users.length;
  const usersOut = users.filter(user => user.status === 'out').length;
  const usersIn = totalUsers - usersOut;
  const lateUsers = users.filter(user => 
    user.status === 'out' && 
    user.expectedReturnTime && 
    new Date() > user.expectedReturnTime
  ).length;

  const stats = [
    {
      icon: Users,
      title: 'Total Users',
      value: totalUsers,
      color: 'bg-blue-500 dark:bg-blue-600',
    },
    {
      icon: Clock,
      title: 'Currently Out',
      value: usersOut,
      color: 'bg-yellow-500 dark:bg-yellow-600',
    },
    {
      icon: CheckCircle,
      title: 'Currently In',
      value: usersIn,
      color: 'bg-green-500 dark:bg-green-600',
    },
    {
      icon: AlertTriangle,
      title: 'Late Returns',
      value: lateUsers,
      color: 'bg-red-500 dark:bg-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div key={stat.title} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
            <div className={`${stat.color} p-3 rounded-full`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}