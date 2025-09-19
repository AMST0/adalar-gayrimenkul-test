import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminUser } from '../types';
import { getStorageItem, setStorageItem, removeStorageItem, STORAGE_KEYS } from '../utils/storage';
import { mockAdminUser } from '../data/mockData';

interface AdminContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Initialize admin user if not exists
    const adminUser = getStorageItem(STORAGE_KEYS.ADMIN_USER, mockAdminUser);
    setStorageItem(STORAGE_KEYS.ADMIN_USER, adminUser);

    // Check for existing session
    const session = getStorageItem(STORAGE_KEYS.ADMIN_SESSION, null);
    if (session && new Date().getTime() < session.expires) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const adminUser = getStorageItem(STORAGE_KEYS.ADMIN_USER, mockAdminUser);
    
    if (username === adminUser.username && password === adminUser.password) {
      const session = {
        username,
        expires: new Date().getTime() + (24 * 60 * 60 * 1000), // 24 hours
      };
      setStorageItem(STORAGE_KEYS.ADMIN_SESSION, session);
      setIsAuthenticated(true);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    removeStorageItem(STORAGE_KEYS.ADMIN_SESSION);
    setIsAuthenticated(false);
  };

  return (
    <AdminContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};