import { create } from 'zustand';
import { User, AttendanceRecord, Activity } from '../types/user';
import { fetchRandomUsers } from '../utils/api';
import { toast } from 'sonner';
import { formatLateDuration } from '../utils/time';
import { createElement } from 'react';
import { LateReturnToast } from '../components/LateReturnToast';
import { storage } from '../utils/storage';
import { generateId } from '../utils/id';
import { usePaymentStore } from './usePaymentStore';

interface Store {
  users: User[];
  attendance: AttendanceRecord[];
  activities: Activity[];
  isLoading: boolean;
  fetchUsers: () => Promise<void>;
  addUser: (userData: { name: string; email: string }) => void;
  checkOut: (userId: string, expectedReturnTime: Date) => void;
  checkIn: (userId: string) => void;
  clearData: () => void;
  getLateUsers: () => User[];
  notifyLateUser: (userId: string) => void;
  toggleUserStatus: (userId: string) => void;
  getUserActivities: (userId: string) => Activity[];
}

export const useStore = create<Store>((set, get) => ({
  users: storage.getUsers(),
  attendance: storage.getAttendance(),
  activities: storage.getActivities(),
  isLoading: false,

  fetchUsers: async () => {
    if (get().users.length === 0) {
      set({ isLoading: true });
      try {
        const users = await fetchRandomUsers(10);
        const newUsers = users.map(user => ({ ...user, status: 'in' as const }));
        set({ users: newUsers });
        storage.setUsers(newUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        set({ isLoading: false });
      }
    }
  },

  addUser: (userData) => {
    const newUser: User = {
      id: generateId(),
      name: userData.name,
      email: userData.email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`,
      status: 'in',
    };

    set(state => {
      const newUsers = [...state.users, newUser];
      storage.setUsers(newUsers);
      return { users: newUsers };
    });

    toast.success(`Added new user: ${userData.name}`);
  },

  checkOut: (userId: string, expectedReturnTime: Date) => {
    set(state => {
      const newUsers = state.users.map(user =>
        user.id === userId
          ? { ...user, status: 'out', outTime: new Date(), expectedReturnTime }
          : user
      );

      const newAttendance = [
        ...state.attendance,
        {
          userId,
          checkIn: new Date(),
        },
      ];

      storage.setUsers(newUsers);
      storage.setAttendance(newAttendance);

      return {
        users: newUsers,
        attendance: newAttendance,
      };
    });
  },

  checkIn: (userId: string) => {
    const currentTime = new Date();
    const user = get().users.find(u => u.id === userId);
    
    if (user?.expectedReturnTime && currentTime > user.expectedReturnTime) {
      const hours = Math.ceil((currentTime.getTime() - user.expectedReturnTime.getTime()) / (1000 * 60 * 60));
      const lateDuration = formatLateDuration(currentTime, user.expectedReturnTime);
      
      // Create payment for late return
      if (hours > 0) {
        usePaymentStore.getState().createPayment(userId, lateDuration, hours);
      }

      const attendance = get().attendance;
      const lastAttendance = attendance.find(
        record => record.userId === userId && !record.checkOut
      );

      if (lastAttendance) {
        lastAttendance.isLate = true;
        lastAttendance.lateDuration = lateDuration;
        storage.setAttendance(attendance);
      }

      toast.error(
        createElement(LateReturnToast, {
          userName: user.name,
          expectedTime: user.expectedReturnTime,
          actualTime: currentTime,
          lateDuration,
        })
      );
    }

    set(state => {
      const newUsers = state.users.map(user =>
        user.id === userId
          ? { ...user, status: 'in', outTime: undefined, expectedReturnTime: undefined }
          : user
      );

      const newAttendance = state.attendance.map(record =>
        record.userId === userId && !record.checkOut
          ? {
              ...record,
              checkOut: currentTime,
              duration: currentTime.getTime() - record.checkIn.getTime(),
            }
          : record
      );

      storage.setUsers(newUsers);
      storage.setAttendance(newAttendance);

      return {
        users: newUsers,
        attendance: newAttendance,
      };
    });
  },

  getLateUsers: () => {
    const currentTime = new Date();
    return get().users.filter(
      user => 
        user.status === 'out' && 
        user.expectedReturnTime && 
        currentTime > user.expectedReturnTime
    );
  },

  notifyLateUser: (userId: string) => {
    const user = get().users.find(u => u.id === userId);
    if (user) {
      toast.warning(
        `Reminder sent to ${user.name}`,
        {
          description: 'A notification has been sent to remind them about their late return.',
          duration: 3000,
        }
      );
    }
  },

  toggleUserStatus: (userId: string) => {
    set(state => {
      const newUsers = state.users.map(user =>
        user.id === userId
          ? { ...user, suspended: !user.suspended }
          : user
      );

      const user = newUsers.find(u => u.id === userId);
      const newActivity: Activity = {
        id: generateId(),
        userId,
        type: user?.suspended ? 'suspension' : 'activation',
        timestamp: new Date(),
        details: `User ${user?.suspended ? 'suspended' : 'activated'}: ${user?.name}`,
      };

      const newActivities = [...state.activities, newActivity];

      storage.setUsers(newUsers);
      storage.setActivities(newActivities);

      return {
        users: newUsers,
        activities: newActivities,
      };
    });
  },

  getUserActivities: (userId: string) => {
    return get().activities.filter(activity => activity.userId === userId);
  },

  clearData: () => {
    storage.clear();
    set({ users: [], attendance: [], activities: [] });
  },
}));