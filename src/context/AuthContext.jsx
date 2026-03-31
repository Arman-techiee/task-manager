import { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'taskflow-user';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const rawUser = localStorage.getItem(STORAGE_KEY);
      if (rawUser) {
        setUser(JSON.parse(rawUser));
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveUser = profile => {
    const nextUser = {
      id: profile.id || crypto.randomUUID(),
      name: profile.name.trim(),
      email: profile.email.trim(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login: saveUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
