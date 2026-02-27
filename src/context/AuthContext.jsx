import { createContext, useContext, useState } from 'react';
import { patient } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('ow-user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    // Mock auth — any credentials work
    await new Promise(r => setTimeout(r, 800)); // simulate network
    const mockUser = {
      id: 'user-001',
      email,
      role: 'patient',
      patient,
    };
    sessionStorage.setItem('ow-user', JSON.stringify(mockUser));
    setUser(mockUser);
    return { success: true };
  };

  const logout = () => {
    sessionStorage.removeItem('ow-user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
