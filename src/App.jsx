import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register'; 
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TechDashboard from './pages/TechDashboard';

// Segurança de Rota 🚨
const PrivateRoute = ({ children, roleRequired }) => {
  const { authenticated, loading, user } = useContext(AuthContext);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500">Carregando...</div>;
  
  if (!authenticated) return <Navigate to="/" replace />;

  const userRole = String(user?.role || '').trim().toUpperCase();
  const requiredRole = String(roleRequired || '').trim().toUpperCase();

  // Se o perfil do usuário não bater com o exigido pela rota, manda pro dashboard CORRETO dele
  if (roleRequired && userRole !== requiredRole) {
    if (userRole === 'ADMIN') return <Navigate to="/admin" replace />;
    if (['TECH', 'TI', 'TECNICO', 'SUPORTE'].includes(userRole)) return <Navigate to="/tech" replace />;
    return <Navigate to="/user" replace />;
  }

  return children;
};

// Evita ver tela de login se já estiver autenticado
const PublicRoute = ({ children }) => {
  const { authenticated, loading, user } = useContext(AuthContext);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500">Carregando...</div>;

  if (authenticated) {
    const userRole = String(user?.role || '').trim().toUpperCase();
    if (userRole === 'ADMIN') return <Navigate to="/admin" replace />;
    if (['TECH', 'TI', 'TECNICO', 'SUPORTE'].includes(userRole)) return <Navigate to="/tech" replace />;
    return <Navigate to="/user" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} /> 
          
          <Route 
            path="/admin" 
            element={
              <PrivateRoute roleRequired="ADMIN">
                <AdminDashboard />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/tech"
            element={
              <PrivateRoute roleRequired="TECH">
                <TechDashboard />
              </PrivateRoute>
            } 
          />

          <Route 
            path="/user" 
            element={
              <PrivateRoute roleRequired="USER">
                <UserDashboard />
              </PrivateRoute>
            } 
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;