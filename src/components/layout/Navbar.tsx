import React from 'react';
import { Link } from 'react-router-dom';
import { Users, RefreshCcw, Moon, Sun } from 'lucide-react';
import { Button } from '../ui/Button';
import { useStore } from '../../store/useStore';
import { useTheme } from '../../contexts/ThemeContext';

export function Navbar() {
  const { clearData, fetchUsers } = useStore();
  const { theme, toggleTheme } = useTheme();

  const handleReset = () => {
    clearData();
    fetchUsers();
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="font-bold text-xl text-gray-900 dark:text-white">UserTrack</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={toggleTheme}
              variant="outline"
              size="sm"
              className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button 
              onClick={handleReset}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <RefreshCcw className="w-4 h-4" />
              Reset Data
            </Button>
            <Link to="/dashboard">
              <Button 
                variant="secondary"
                className="dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}