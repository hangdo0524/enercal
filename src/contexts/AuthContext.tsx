import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  role: 'user' | 'admin';
  personId: string | null;
  familyId: string;
}

interface UserConfig {
  password: string;
  name: string;
  role: 'user' | 'admin';
  personId: string | null;
  familyId: string;
}

interface AuthContextType {
  user: User | null;
  login: (userId: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

// ========================================
// CẤU HÌNH GIA ĐÌNH VÀ USERS
// Khi thêm gia đình mới, thêm vào đây
// ========================================

const USERS_CONFIG: Record<string, UserConfig> = {
  // === Gia đình Lê Xuân Xuyến (family: lexuanxuyen) ===
  xuyenlx: { password: '1985', name: 'Bố Xuyến', role: 'user', personId: 'father', familyId: 'lexuanxuyen' },
  hangdt: { password: '260512', name: 'Mẹ Hằng', role: 'user', personId: 'mother', familyId: 'lexuanxuyen' },
  annale: { password: '260512', name: 'Phương Thảo', role: 'user', personId: 'daughter1', familyId: 'lexuanxuyen' },
  ivyle: { password: '260512', name: 'Thảo Vy', role: 'user', personId: 'daughter2', familyId: 'lexuanxuyen' },

  // === Admin (có thể xem tất cả) ===
  admin: { password: '260512', name: 'Admin', role: 'admin', personId: null, familyId: 'lexuanxuyen' },

  // === Thêm gia đình mới ở đây ===
  // Ví dụ:
  // nguyenvana: { password: '1234', name: 'Nguyễn Văn A', role: 'user', personId: 'father', familyId: 'nguyenvana' },
  // nguyenthib: { password: '1234', name: 'Nguyễn Thị B', role: 'user', personId: 'mother', familyId: 'nguyenvana' },
};

// Danh sách các gia đình và file data tương ứng
export const FAMILY_DATA_FILES: Record<string, string> = {
  'lexuanxuyen': 'numerology-analysis.json',
  // Thêm gia đình mới:
  // 'nguyenvana': 'numerology-nguyenvana.json',
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
        familyId: config.familyId,
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
        familyId: config.familyId,
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
      familyId: config.familyId,
    }));
}

// Lấy danh sách user theo gia đình
export function getUsersByFamily(familyId: string) {
  return Object.entries(USERS_CONFIG)
    .filter(([id, config]) => config.familyId === familyId && id !== 'admin')
    .map(([id, config]) => ({
      id,
      name: config.name,
      personId: config.personId,
    }));
}

// Lấy danh sách tất cả các gia đình
export function getFamiliesList() {
  const families = new Set<string>();
  Object.values(USERS_CONFIG).forEach(config => {
    if (config.role !== 'admin') {
      families.add(config.familyId);
    }
  });
  return Array.from(families);
}
