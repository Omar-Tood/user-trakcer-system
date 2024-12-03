import React from 'react';
import { User, AttendanceRecord } from '../types/user';
import { Users, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useTime } from '../hooks/useTime';

interface DashboardProps {
  users: User[];
  attendance: AttendanceRecord[];
}

export function Dashboard({ users, attendance }: DashboardProps) {
  const { formatTime } = useTime();
  
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
      label: 'Total Users',
      value: totalUsers,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      label: 'Currently Out',
      value: usersOut,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      label: 'Currently In',
      value: usersIn,
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      label: 'Late Returns',
      value: lateUsers,
      icon: AlertTriangle,
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{stat.value}</p>
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