import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { fetchApi, clearAuthToken, getAuthToken, setAuthToken } from '../lib/auth-api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  refreshUser: () => Promise<void>;
  logout: () => void;
  login: (token: string, userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      if (!getAuthToken()) {
        setUser(null);
        setLoading(false);
        return;
      }
      
      const res = await fetchApi('/api/auth/me');
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        clearAuthToken();
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = (token: string, userData: User) => {
    setAuthToken(token);
    setUser(userData);
  };

  const logout = () => {
    clearAuthToken();
    setUser(null);
  };

  const isAdmin = user?.email === import.meta.env.VITE_ADMIN_EMAIL || user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, refreshUser, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
