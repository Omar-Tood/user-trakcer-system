import { User } from '../types/user';

export function filterUsers(users: User[], searchTerm: string, filter: string): User[] {
  const normalizedSearch = searchTerm.toLowerCase().trim();
  
  return users
    .filter(user => {
      // Search by name or email
      const matchesSearch = !normalizedSearch || 
        user.name.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch);

      // Filter by status
      let matchesFilter = false;
      switch (filter) {
        case 'all':
          matchesFilter = true;
          break;
        case 'active':
          matchesFilter = user.status === 'in' && !user.suspended;
          break;
        case 'suspended':
          matchesFilter = !!user.suspended;
          break;
        case 'out':
          matchesFilter = user.status === 'out' && !user.suspended;
          break;
        default:
          matchesFilter = true;
      }

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      // Sort suspended users last
      if (a.suspended !== b.suspended) {
        return a.suspended ? 1 : -1;
      }
      // Then sort by name
      return a.name.localeCompare(b.name);
    });
}