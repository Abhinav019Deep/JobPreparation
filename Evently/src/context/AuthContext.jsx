import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null);
  // JWT stored in memory only — never localStorage
  const [token, setToken] = useState(null);

  const login = (email, password) => {
    if (!email || !password) return { ok: false, error: 'Email and password required' };
    const mockUser  = { id: 1, name: email.split('@')[0], email };
    const mockToken = 'eyJhbGciOiJIUzI1NiJ9.mock.' + btoa(email + ':' + Date.now());
    setUser(mockUser);
    setToken(mockToken);
    return { ok: true };
  };

  const register = (name, email, password) => {
    if (!name || !email || !password) return { ok: false, error: 'All fields required' };
    const mockUser  = { id: Date.now(), name, email };
    const mockToken = 'eyJhbGciOiJIUzI1NiJ9.mock.' + btoa(email + ':' + Date.now());
    setUser(mockUser);
    setToken(mockToken);
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
