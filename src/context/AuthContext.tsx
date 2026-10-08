import React, { createContext, useContext, useState, useEffect } from 'react';
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
  switchDemoUser: (userId: string) => void;
  updateWorkerAvailability: (status: AvailabilityStatus) => Promise<void>;
  updateUserProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('nera_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [currentWorker, setCurrentWorker] = useState<Worker | null>(null);

  // Load active business or worker profile when currentUser changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('nera_current_user', JSON.stringify(currentUser));
      if (currentUser.role === 'business') {
        api.getBusinesses().then((res) => {
          const found = res.businesses.find((b) => b.userId === currentUser.id);
          if (found) {
            setCurrentBusiness(found);
          } else {
            // Auto create business profile if missing
            api.createBusiness({
              userId: currentUser.id,
              companyName: currentUser.name || 'Business Venue',
              contactPerson: currentUser.name,
            }).then((bRes) => setCurrentBusiness(bRes.business)).catch(console.warn);
          }
          setCurrentWorker(null);
        }).catch(console.warn);
      } else if (currentUser.role === 'worker') {
        api.getWorkers().then((res) => {
          const found = res.workers.find((w) => w.userId === currentUser.id);
          if (found) {
            setCurrentWorker(found);
          } else {
            // Auto create worker profile if missing
            api.createWorker({
              userId: currentUser.id,
              name: currentUser.name,
              phone: currentUser.phone,
              hourlyRate: 250,
            }).then((wRes) => setCurrentWorker(wRes.worker)).catch(console.warn);
          }
          setCurrentBusiness(null);
        }).catch(console.warn);
      } else {
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
    try {
      const res = await api.login(email, role);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        return true;
      }
      return false;
    } catch {
      // Offline fallback
      const user: User = {
        id: `user-${Date.now()}`,
        name: email ? email.split('@')[0] : 'User',
        email: email || 'user@nera.in',
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
        } else if (user.role === 'worker') {
          const wrkRes = await api.createWorker({
            userId: user.id,
            name: user.name,
            role: (specificData as Partial<Worker>)?.role || 'Staff',
            skills: (specificData as Partial<Worker>)?.skills || ['Customer Service'],
            hourlyRate: (specificData as Partial<Worker>)?.hourlyRate || 250,
          });
          setCurrentWorker(wrkRes.worker);
        }
        return true;
      }
      return false;
    } catch {
      const user: User = {
        id: `user-${Date.now()}`,
        name: userData.name || 'New User',
        email: userData.email || 'user@nera.in',
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
    localStorage.removeItem('nera_current_user');
  };

  const switchRole = (role: UserRole) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, role });
    } else {
      login(`demo.${role}@nera.in`, role);
    }
  };

  const switchDemoUser = (userId: string) => {
    let role: UserRole = 'business';
    let name = 'Alex (Urban Brew Café)';
    let email = 'alex@urbanbrew.in';
    if (userId.includes('w1') || userId.includes('jordan')) {
      role = 'worker';
      name = 'Jordan Rivera';
      email = 'jordan.rivera@nera.in';
    } else if (userId.includes('w2') || userId.includes('maya')) {
      role = 'worker';
      name = 'Maya Chen';
      email = 'maya.chen@nera.in';
    } else if (userId.includes('admin')) {
      role = 'admin';
      name = 'NERA Master Admin';
      email = 'admin@nera.in';
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
        console.warn('Could not sync availability to MongoDB:', err);
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
