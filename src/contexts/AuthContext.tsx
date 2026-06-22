import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  role: 'user' | 'admin';
  personId: string | null;
}

interface AuthContextType {
  user: User | null;
  login: (userId: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const USERS_CONFIG: Record<string, { password: string; name: string; role: 'user' | 'admin'; personId: string | null }> = {
  xuyenlx: { password: '1985', name: 'Bố', role: 'user', personId: 'father' },
  hangdt: { password: '260512', name: 'Mẹ', role: 'user', personId: 'mother' },
  annale: { password: '260512', name: 'Con 1', role: 'user', personId: 'daughter1' },
  ivyle: { password: '260512', name: 'Con 2', role: 'user', personId: 'daughter2' },
  admin: { password: '260512', name: 'Admin', role: 'admin', personId: null },
};

const AUTH_STORAGE_KEY = 'enercal_auth_user';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUserId = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedUserId && USERS_CONFIG[savedUserId]) {
      const config = USERS_CONFIG[savedUserId];
      setUser({
        id: savedUserId,
        name: config.name,
        role: config.role,
        personId: config.personId,
      });
    }
  }, []);

  const login = (userId: string, password: string): boolean => {
    const config = USERS_CONFIG[userId];
    if (config && config.password === password) {
      const newUser: User = {
        id: userId,
        name: config.name,
        role: config.role,
        personId: config.personId,
      };
      setUser(newUser);
      localStorage.setItem(AUTH_STORAGE_KEY, userId);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function getUsersList() {
  return Object.entries(USERS_CONFIG)
    .filter(([id]) => id !== 'admin')
    .map(([id, config]) => ({
      id,
      name: config.name,
      personId: config.personId,
    }));
}
