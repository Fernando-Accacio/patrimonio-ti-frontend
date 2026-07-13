import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // A sessão é isolada por aba para permitir testar perfis diferentes ao mesmo tempo.
    const token = sessionStorage.getItem('@PatrimonioTI:token');
    const storedUser = sessionStorage.getItem('@PatrimonioTI:user');

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const loginContext = (token, userData) => {
    sessionStorage.setItem('@PatrimonioTI:token', token);
    sessionStorage.setItem('@PatrimonioTI:user', JSON.stringify(userData));
    setUser(userData);
  };

  const logoutContext = () => {
    sessionStorage.removeItem('@PatrimonioTI:token');
    sessionStorage.removeItem('@PatrimonioTI:user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ authenticated: !!user, user, loading, loginContext, logoutContext }}>
      {children}
    </AuthContext.Provider>
  );
}
