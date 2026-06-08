import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register'; 
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TechDashboard from './pages/TechDashboard'; // NOVO: Importando a tela do técnico

// O Segurança da Porta
const PrivateRoute = ({ children, roleRequired }) => {
  const { authenticated, loading, user } = useContext(AuthContext);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  
  if (!authenticated) return <Navigate to="/" />;
  
  // Se a rota exige um perfil específico e o usuário não bater, manda de volta
  if (roleRequired && user?.role !== roleRequired) return <Navigate to="/" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ROTAS PÚBLICAS */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} /> 
          
          {/* ROTAS PRIVADAS */}
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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;