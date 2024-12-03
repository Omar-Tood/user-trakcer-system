import { User, AttendanceRecord, Activity } from '../types/user';

const STORAGE_KEYS = {
  USERS: 'usertrack_users',
  ATTENDANCE: 'usertrack_attendance',
  ACTIVITIES: 'usertrack_activities',
} as const;

export const storage = {
  getUsers: (): User[] => {
    try {
      const users = localStorage.getItem(STORAGE_KEYS.USERS);
      if (!users) return [];
      return JSON.parse(users, (key, value) => {
        if (key === 'outTime' || key === 'expectedReturnTime') {
          return value ? new Date(value) : undefined;
        }
        return value;
      });
    } catch (error) {
      console.error('Error loading users from storage:', error);
      return [];
    }
  },

  setUsers: (users: User[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users to storage:', error);
    }
  },

  getAttendance: (): AttendanceRecord[] => {
    try {
      const attendance = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
      if (!attendance) return [];
      return JSON.parse(attendance, (key, value) => {
        if (key === 'checkIn' || key === 'checkOut') {
          return value ? new Date(value) : undefined;
        }
        return value;
      });
    } catch (error) {
      console.error('Error loading attendance from storage:', error);
      return [];
    }
  },

  setAttendance: (attendance: AttendanceRecord[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
    } catch (error) {
      console.error('Error saving attendance to storage:', error);
    }
  },

  getActivities: (): Activity[] => {
    try {
      const activities = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      if (!activities) return [];
      return JSON.parse(activities, (key, value) => {
        if (key === 'timestamp') {
          return new Date(value);
        }
        return value;
      });
    } catch (error) {
      console.error('Error loading activities from storage:', error);
      return [];
    }
  },

  setActivities: (activities: Activity[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    } catch (error) {
      console.error('Error saving activities to storage:', error);
    }
  },

  clear: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.USERS);
      localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
      localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};