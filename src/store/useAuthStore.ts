import { create } from 'zustand';
import { AuthUser, AuthState } from '../types/auth';
import { generateId } from '../utils/id';
import { toast } from 'sonner';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: { email: string; password: string; name: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: { name?: string; avatar?: string }) => Promise<void>;
}

const STORAGE_KEY = 'usertrack_auth';
const USERS_KEY = 'usertrack_users';

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: getStoredUser(),
  isAuthenticated: !!getStoredUser(),

  login: async (email: string, password: string) => {
    const users = getStoredUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      set({ user, isAuthenticated: true });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      toast.success('Successfully logged in');
      return true;
    }

    toast.error('Invalid email or password');
    return false;
  },

  register: async (userData) => {
    const users = getStoredUsers();
    
    if (users.some(u => u.email === userData.email)) {
      toast.error('Email already exists');
      return false;
    }

    const newUser: AuthUser = {
      id: generateId(),
      email: userData.email,
      password: userData.password,
      name: userData.name,
      role: users.length === 0 ? 'admin' : 'user',
      createdAt: new Date(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`,
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    set({ user: newUser, isAuthenticated: true });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    
    toast.success('Registration successful');
    return true;
  },

  updateProfile: async (data) => {
    const { user } = get();
    if (!user) throw new Error('No user logged in');

    const updatedUser = {
      ...user,
      ...data,
    };

    // Update user in local storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));

    // Update user in users list
    const users = getStoredUsers();
    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, ...data } : u
    );
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));

    set({ user: updatedUser });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem(STORAGE_KEY);
    toast.success('Successfully logged out');
  },
}));

function getStoredUser(): AuthUser | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const user = JSON.parse(stored);
    user.createdAt = new Date(user.createdAt);
    return user;
  } catch {
    return null;
  }
}

function getStoredUsers(): AuthUser[] {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    if (!stored) return [];
    
    const users = JSON.parse(stored);
    return users.map((user: AuthUser) => ({
      ...user,
      createdAt: new Date(user.createdAt),
    }));
  } catch {
    return [];
  }
}