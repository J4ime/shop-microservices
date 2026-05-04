import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authApi } from '../services/api';

interface User { id: string; email: string; firstName: string; lastName: string; role: string; }
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: object) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      const stored = localStorage.getItem('user');
      if (stored) setUser(JSON.parse(stored));
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const { data } = await authApi.login(email, password);
    localStorage.setItem('token', data.data.accessToken);
    setToken(data.data.accessToken);
    const parts = data.data.accessToken.split('.');
    if (parts[1]) {
      const payload = JSON.parse(atob(parts[1]));
      const u = { id: payload.sub, email: payload.email, firstName: payload.given_name || '', lastName: payload.family_name || '', role: payload.role };
      setUser(u);
      localStorage.setItem('user', JSON.stringify(u));
    }
  };

  const register = async (data: object) => {
    const res = await authApi.register(data);
    localStorage.setItem('token', res.data.data.accessToken);
    setToken(res.data.data.accessToken);
  };

  const logout = () => { localStorage.clear(); setToken(null); setUser(null); };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
