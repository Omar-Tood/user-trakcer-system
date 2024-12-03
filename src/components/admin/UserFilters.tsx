import React from 'react';
import { Button } from '../ui/Button';

interface UserFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function UserFilters({ activeFilter, onFilterChange }: UserFiltersProps) {
  const filters = [
    { label: 'All Users', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Out', value: 'out' },
    { label: 'Suspended', value: 'suspended' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          variant={activeFilter === filter.value ? 'primary' : 'outline'}
          size="sm"
          className={`
            ${activeFilter === filter.value 
              ? 'dark:bg-blue-600 dark:hover:bg-blue-700' 
              : 'dark:border-gray-600 dark:hover:bg-gray-700'
            }
            transition-colors duration-200
          `}
        >
          {filter.label}
          {activeFilter === filter.value && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-white/20 rounded-full">
              Active
            </span>
          )}
        </Button>
      ))}
    </div>
  );
}