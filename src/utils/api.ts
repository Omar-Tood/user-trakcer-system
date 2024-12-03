import { User } from '../types/user';

export async function fetchRandomUsers(count: number): Promise<User[]> {
  try {
    const response = await fetch(`https://randomuser.me/api/?results=${count}`);
    const data = await response.json();
    
    return data.results.map((user: any) => ({
      id: user.login.uuid,
      name: `${user.name.first} ${user.name.last}`,
      email: user.email,
      avatar: user.picture.medium,
      status: 'in' as const,
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}