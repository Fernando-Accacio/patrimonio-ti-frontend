import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Quando o app abrir, ele procura o token e os dados do usuário no cofre
    const token = localStorage.getItem('@PatrimonioTI:token');
    const storedUser = localStorage.getItem('@PatrimonioTI:user');

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const loginContext = (token, userData) => {
    localStorage.setItem('@PatrimonioTI:token', token);
    localStorage.setItem('@PatrimonioTI:user', JSON.stringify(userData));
    setUser(userData);
  };

  const logoutContext = () => {
    localStorage.removeItem('@PatrimonioTI:token');
    localStorage.removeItem('@PatrimonioTI:user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ authenticated: !!user, user, loading, loginContext, logoutContext }}>
      {children}
    </AuthContext.Provider>
  );
}