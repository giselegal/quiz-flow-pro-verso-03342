/**
 * UserDataContext Stub
 */
import React, { ReactNode, createContext, useContext } from 'react';

const UserDataContext = createContext<any>(null);

export function UserDataProvider({ children }: { children: ReactNode }) {
  return <UserDataContext.Provider value={{}}>{children}</UserDataContext.Provider>;
}

export function useUserData() {
  return useContext(UserDataContext) || {};
}
