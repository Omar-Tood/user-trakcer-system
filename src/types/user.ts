export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'in' | 'out';
  suspended?: boolean;
  outTime?: Date;
  expectedReturnTime?: Date;
}

export interface AttendanceRecord {
  userId: string;
  checkIn: Date;
  checkOut?: Date;
  duration?: number;
  isLate?: boolean;
  lateDuration?: string;
}

export interface Activity {
  id: string;
  userId: string;
  type: 'check-in' | 'check-out' | 'late-return' | 'suspension' | 'activation';
  timestamp: Date;
  details: string;
}