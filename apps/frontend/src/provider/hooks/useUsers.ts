import { useCallback, useMemo } from 'react';
import type { User } from '../../types';

export interface UsersHook {
  getUsers: () => Promise<User[]>;
}

export const useUsers = (): UsersHook => {
  const getUsers = useCallback(async () => {
    const res = await fetch('/api/users');
    if (!res.ok) {
      return [];
    }

    const data = await res.json() as User[];
    data.sort((a, b) => a.displayName.localeCompare(b.displayName));
    return data;
  }, []);

  return useMemo(() => ({
    getUsers,
  }), [getUsers]);
};
