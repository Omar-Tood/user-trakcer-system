import React, { useState, useEffect } from 'react';
import { DashboardStats } from '../components/DashboardStats';
import { UserTable } from '../components/UserTable';
import { CheckOutModal } from '../components/CheckOutModal';
import { AddUserModal } from '../components/AddUserModal';
import { LateManagementModal } from '../components/LateManagementModal';
import { ActivityModal } from '../components/admin/ActivityModal';
import { CurrentTime } from '../components/CurrentTime';
import { AdminPanel } from '../components/admin/AdminPanel';
import { LateReports } from '../components/reports/LateReports';
import { UserProfile } from '../components/profile/UserProfile';
import { AnalyticsCharts } from '../components/analytics/AnalyticsCharts';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { UserPlus, AlertTriangle, Settings, BarChart } from 'lucide-react';
import { filterUsers } from '../utils/userFilters';

export function Dashboard() {
  const { 
    users, 
    attendance, 
    activities,
    checkIn, 
    checkOut, 
    addUser, 
    notifyLateUser, 
    toggleUserStatus,
    getUserActivities,
    fetchUsers 
  } = useStore();
  
  // Modal states
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false);
  const [isLateManagementOpen, setIsLateManagementOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  
  // Admin panel and reports states
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  // User management states
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Initialize data when component mounts
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Get late users
  const lateUsers = users.filter(user => 
    user.status === 'out' && 
    user.expectedReturnTime && 
    new Date() > user.expectedReturnTime
  );

  // Filter users based on search and filter criteria
  const filteredUsers = filterUsers(users, searchTerm, activeFilter);

  const handleCheckOut = (userId: string) => {
    setSelectedUserId(userId);
    setIsCheckOutModalOpen(true);
  };

  const handleCheckIn = (userId: string) => {
    checkIn(userId);
  };

  const handleCheckOutConfirm = (expectedReturnTime: Date) => {
    if (selectedUserId) {
      checkOut(selectedUserId, expectedReturnTime);
      setIsCheckOutModalOpen(false);
      setSelectedUserId(null);
    }
  };

  const handleAddUser = (userData: { name: string; email: string }) => {
    addUser(userData);
    setIsAddUserModalOpen(false);
  };

  const handleViewActivity = (userId: string) => {
    setSelectedUserId(userId);
    setIsActivityModalOpen(true);
  };

  const handleToggleUserStatus = (userId: string) => {
    toggleUserStatus(userId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <UserProfile />
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          User Management Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <CurrentTime />
          <Button
            onClick={() => setShowAnalytics(!showAnalytics)}
            variant="outline"
            className={`dark:border-gray-600 ${showAnalytics ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
          >
            <BarChart className="w-5 h-5 mr-2" />
            Analytics
          </Button>
          <Button
            onClick={() => setShowReports(!showReports)}
            variant="outline"
            className={`dark:border-gray-600 ${showReports ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
          >
            <BarChart className="w-5 h-5 mr-2" />
            Reports
          </Button>
          <Button
            onClick={() => setShowAdminPanel(!showAdminPanel)}
            variant="outline"
            className={`dark:border-gray-600 ${showAdminPanel ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
          >
            <Settings className="w-5 h-5 mr-2" />
            Admin Panel
          </Button>
          {lateUsers.length > 0 && (
            <Button
              onClick={() => setIsLateManagementOpen(true)}
              className="flex items-center gap-2 bg-red-600 text-white hover:bg-red-700"
            >
              <AlertTriangle className="w-5 h-5" />
              Late Returns ({lateUsers.length})
            </Button>
          )}
          <Button
            onClick={() => setIsAddUserModalOpen(true)}
            className="flex items-center gap-2 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
          >
            <UserPlus className="w-5 h-5" />
            Add User
          </Button>
        </div>
      </div>

      <DashboardStats users={users} attendance={attendance} />

      {showAnalytics && (
        <div className="mt-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Analytics Overview
          </h2>
          <AnalyticsCharts attendance={attendance} />
        </div>
      )}

      {showReports && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Late Return Reports
          </h2>
          <LateReports />
        </div>
      )}

      {showAdminPanel && (
        <div className="mb-6">
          <AdminPanel
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>
      )}

      <UserTable
        users={filteredUsers}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
        onToggleStatus={handleToggleUserStatus}
        onViewActivity={handleViewActivity}
      />

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onAdd={handleAddUser}
      />

      <CheckOutModal
        isOpen={isCheckOutModalOpen}
        onClose={() => setIsCheckOutModalOpen(false)}
        onConfirm={handleCheckOutConfirm}
      />

      <LateManagementModal
        isOpen={isLateManagementOpen}
        onClose={() => setIsLateManagementOpen(false)}
        lateUsers={lateUsers}
        onNotifyUser={notifyLateUser}
      />

      {selectedUserId && (
        <ActivityModal
          isOpen={isActivityModalOpen}
          onClose={() => setIsActivityModalOpen(false)}
          userId={selectedUserId}
          userName={users.find(u => u.id === selectedUserId)?.name || ''}
          activities={getUserActivities(selectedUserId)}
        />
      )}
    </div>
  );
}