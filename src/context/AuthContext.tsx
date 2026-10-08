import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, Business, Worker, UserRole, AvailabilityStatus } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  currentUser: User | null;
  currentBusiness: Business | null;
  currentWorker: Worker | null;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  signup: (userData: Partial<User>, specificData?: Partial<Business | Worker>) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  switchDemoUser: (userId: string) => Promise<void>;
  updateWorkerAvailability: (status: AvailabilityStatus) => Promise<void>;
  updateUserProfile: (data: Partial<User>) => void;
  refreshProfiles: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('jeera_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(() => {
    const saved = localStorage.getItem('jeera_current_business');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentWorker, setCurrentWorker] = useState<Worker | null>(() => {
    const saved = localStorage.getItem('jeera_current_worker');
    return saved ? JSON.parse(saved) : null;
  });

  const refreshProfiles = useCallback(async () => {
    if (!currentUser) {
      setCurrentBusiness(null);
      setCurrentWorker(null);
      localStorage.removeItem('jeera_current_business');
      localStorage.removeItem('jeera_current_worker');
      return;
    }

    try {
      if (currentUser.role === 'business') {
        const res = await api.getBusinesses();
        let found = res.businesses.find((b) => b.userId === currentUser.id || b.id === currentUser.id);
        if (!found) {
          // Auto provision if not found
          const bRes = await api.createBusiness({
            userId: currentUser.id,
            companyName: currentUser.name ? `${currentUser.name}'s Venue` : 'Urban Brew Café',
            contactPerson: currentUser.name,
          });
          found = bRes.business;
        }
        setCurrentBusiness(found);
        setCurrentWorker(null);
        localStorage.setItem('jeera_current_business', JSON.stringify(found));
        localStorage.removeItem('jeera_current_worker');
      } else if (currentUser.role === 'worker') {
        const res = await api.getWorkers();
        let found = res.workers.find((w) => w.userId === currentUser.id || w.id === currentUser.id || w.name.toLowerCase() === currentUser.name.toLowerCase());
        if (!found) {
          // Auto provision if not found
          const wRes = await api.createWorker({
            userId: currentUser.id,
            name: currentUser.name,
            phone: currentUser.phone || '+91 98765 43210',
            hourlyRate: 250,
            availabilityStatus: 'Available Now',
          });
          found = wRes.worker;
        }
        setCurrentWorker(found);
        setCurrentBusiness(null);
        localStorage.setItem('jeera_current_worker', JSON.stringify(found));
        localStorage.removeItem('jeera_current_business');
      } else {
        setCurrentBusiness(null);
        setCurrentWorker(null);
      }
    } catch (err) {
      console.warn('Could not sync auth profile with database:', err);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('jeera_current_user', JSON.stringify(currentUser));
      refreshProfiles();
    } else {
      localStorage.removeItem('jeera_current_user');
      localStorage.removeItem('jeera_current_business');
      localStorage.removeItem('jeera_current_worker');
      setCurrentBusiness(null);
      setCurrentWorker(null);
    }
  }, [currentUser, refreshProfiles]);

  const login = async (email: string, role?: UserRole): Promise<boolean> => {
    try {
      const res = await api.login(email, role);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        return true;
      }
      return false;
    } catch {
      // Fallback
      const user: User = {
        id: `user-${Date.now()}`,
        name: email ? email.split('@')[0] : 'User',
        email: email || 'user@jeera.in',
        role: role || 'business',
        phone: '+91 98765 43210',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(user);
      return true;
    }
  };

  const signup = async (
    userData: Partial<User>,
    specificData?: Partial<Business | Worker>
  ): Promise<boolean> => {
    try {
      const res = await api.register(userData);
      if (res.success && res.user) {
        const user = res.user;
        setCurrentUser(user);

        if (user.role === 'business') {
          const bizRes = await api.createBusiness({
            userId: user.id,
            companyName: (specificData as Partial<Business>)?.companyName || user.name,
            category: (specificData as Partial<Business>)?.category || 'café',
            address: (specificData as Partial<Business>)?.address || '',
          });
          setCurrentBusiness(bizRes.business);
          localStorage.setItem('jeera_current_business', JSON.stringify(bizRes.business));
        } else if (user.role === 'worker') {
          const wrkRes = await api.createWorker({
            userId: user.id,
            name: user.name,
            role: (specificData as Partial<Worker>)?.role || 'Senior Barista',
            skills: (specificData as Partial<Worker>)?.skills && (specificData as Partial<Worker>)!.skills!.length > 0
              ? (specificData as Partial<Worker>)?.skills
              : ['Barista', 'POS Operations'],
            hourlyRate: (specificData as Partial<Worker>)?.hourlyRate || 350,
            availabilityStatus: 'Available Now',
            experienceYears: 3,
            reliabilityScore: 98,
          });
          setCurrentWorker(wrkRes.worker);
          localStorage.setItem('jeera_current_worker', JSON.stringify(wrkRes.worker));
        }
        return true;
      }
      return false;
    } catch {
      const user: User = {
        id: `user-${Date.now()}`,
        name: userData.name || 'New User',
        email: userData.email || 'user@jeera.in',
        role: userData.role || 'business',
        phone: userData.phone || '+91 98765 43210',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(user);
      return true;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentBusiness(null);
    setCurrentWorker(null);
    localStorage.removeItem('jeera_current_user');
    localStorage.removeItem('jeera_current_business');
    localStorage.removeItem('jeera_current_worker');
  };

  const switchRole = (role: UserRole) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, role });
    } else {
      login(`demo.${role}@jeera.in`, role);
    }
  };

  const switchDemoUser = async (userId: string) => {
    let role: UserRole = 'business';
    let name = 'Alex (Urban Brew Café)';
    let email = 'alex@urbanbrew.in';

    if (userId.includes('w1') || userId.includes('jordan')) {
      role = 'worker';
      name = 'Jordan Rivera';
      email = 'jordan.rivera@jeera.in';
    } else if (userId.includes('w2') || userId.includes('maya')) {
      role = 'worker';
      name = 'Maya Chen';
      email = 'maya.chen@jeera.in';
    } else if (userId.includes('admin')) {
      role = 'admin';
      name = 'JEERA Master Admin';
      email = 'admin@jeera.in';
    }

    const user: User = {
      id: userId,
      name,
      email,
      role,
      phone: '+91 98765 43210',
      avatar: role === 'business'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(user);
  };

  const updateWorkerAvailability = async (status: AvailabilityStatus) => {
    if (currentWorker) {
      const updated: Worker = {
        ...currentWorker,
        availabilityStatus: status,
        isAvailable: status === 'Available Now',
      };
      setCurrentWorker(updated);
      try {
        await api.updateWorker(currentWorker.id, {
          availabilityStatus: status,
          isAvailable: status === 'Available Now',
        });
      } catch (err) {
        console.warn('Could not sync availability to database:', err);
      }
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
        switchRole,
        switchDemoUser,
        updateWorkerAvailability,
        updateUserProfile,
        refreshProfiles,
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
