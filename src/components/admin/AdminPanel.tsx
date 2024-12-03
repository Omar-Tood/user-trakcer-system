import React from 'react';
import { UserSearch } from './UserSearch';
import { UserFilters } from './UserFilters';

interface AdminPanelProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function AdminPanel({
  searchTerm,
  onSearchChange,
  activeFilter,
  onFilterChange,
}: AdminPanelProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6 transition-colors duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <UserSearch
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
        />
        <UserFilters
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
        />
      </div>
    </div>
  );
}