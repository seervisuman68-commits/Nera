import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Business, Worker, UserRole, AvailabilityStatus } from '../types';
import { mockUsers, mockBusinesses, mockWorkers } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  currentBusiness: Business | null;
  currentWorker: Worker | null;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  signup: (userData: Partial<User>, specificData?: Partial<Business | Worker>) => Promise<boolean>;
  logout: () => void;
  switchDemoUser: (userId: string) => void;
  updateWorkerAvailability: (status: AvailabilityStatus) => void;
  updateUserProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with Business Owner (Alex Johnson) by default for immediate demo flow
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('nera_current_user');
    return saved ? JSON.parse(saved) : mockUsers[0];
  });

  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(() => {
    return mockBusinesses[0];
  });

  const [currentWorker, setCurrentWorker] = useState<Worker | null>(() => {
    return mockWorkers[0];
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('nera_current_user', JSON.stringify(currentUser));
      if (currentUser.role === 'business') {
        const b = mockBusinesses.find((biz) => biz.userId === currentUser.id) || mockBusinesses[0];
        setCurrentBusiness(b);
        setCurrentWorker(null);
      } else if (currentUser.role === 'worker') {
        const w = mockWorkers.find((wrk) => wrk.userId === currentUser.id) || mockWorkers[0];
        setCurrentWorker(w);
        setCurrentBusiness(null);
      } else {
        // Admin
        setCurrentBusiness(null);
        setCurrentWorker(null);
      }
    } else {
      localStorage.removeItem('nera_current_user');
      setCurrentBusiness(null);
      setCurrentWorker(null);
    }
  }, [currentUser]);

  const login = async (email: string, role?: UserRole): Promise<boolean> => {
    const foundUser = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      setCurrentUser(foundUser);
      return true;
    }

    // Dynamic login fallback
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: role || 'business',
      phone: '+1 (555) 000-0000',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(newUser);
    return true;
  };

  const signup = async (
    userData: Partial<User>,
    _specificData?: Partial<Business | Worker>
  ): Promise<boolean> => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name || 'New User',
      email: userData.email || 'user@example.com',
      role: userData.role || 'business',
      phone: userData.phone || '+1 (555) 123-4567',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentBusiness(null);
    setCurrentWorker(null);
  };

  const switchDemoUser = (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const updateWorkerAvailability = (status: AvailabilityStatus) => {
    if (currentWorker) {
      const updated: Worker = {
        ...currentWorker,
        availabilityStatus: status,
        isAvailable: status === 'Available Now',
      };
      setCurrentWorker(updated);
    }
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...data });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentBusiness,
        currentWorker,
        isAuthenticated: !!currentUser,
        login,
        signup,
        logout,
        switchDemoUser,
        updateWorkerAvailability,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
