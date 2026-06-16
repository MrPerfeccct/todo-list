import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  const login = ({ email, token }) => {
    setEmail(email);
    setToken(token);
  };

  const logout = () => {
    setEmail('');
    setToken('');
  };

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider
      value={{ email, token, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}