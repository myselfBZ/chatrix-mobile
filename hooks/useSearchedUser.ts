import { SearchUserResult } from '@/services/api';
import { useEffect, useState } from 'react';

let searchedUser: SearchUserResult | null = null;
const listeners = new Set<(user: SearchUserResult | null) => void>();

export const useSearchedUser = () => {
  const [user, setUser] = useState<SearchUserResult | null>(searchedUser);

  const setSearchedUser = (newUser: SearchUserResult | null) => {
    searchedUser = newUser;
    listeners.forEach(listener => listener(newUser));
  };

  const getSearchedUser = () => {
    return searchedUser;
  };

  const clearSearchedUser = () => {
    setSearchedUser(null);
  };

  // Subscribe to changes
  useEffect(() => {
    listeners.add(setUser);
    return () => {
      listeners.delete(setUser);
    };
  }, []);

  return {
    searchedUser: user,
    setSearchedUser,
    getSearchedUser,
    clearSearchedUser,
  };
};