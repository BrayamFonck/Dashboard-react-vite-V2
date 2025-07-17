import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import { useBfcacheOptimization } from './hooks/useBfcacheOptimization';
import './App.css';

// Importaciones dinámicas con React.lazy para code splitting
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CoinDetails = lazy(() => import('./pages/CoinDetails'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Componente de carga mejorado para mostrar mientras se descargan los componentes
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px',
    color: '#666',
    flexDirection: 'column'
  }}>
    <div className="loading-spinner"></div>
    Cargando...
  </div>
);

// Componente para redirigir usuarios autenticados
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

// Componente para manejar la ruta raíz
const RootRedirect = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Cargando...</div>;
  }
  
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
};

function App() {
  // Hook para optimizar el back/forward cache
  useBfcacheOptimization();
  
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {/* Suspense envuelve todas las rutas para habilitar code splitting */}
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Ruta raíz - redirige según el estado de autenticación */}
              <Route path="/" element={<RootRedirect />} />
              
              {/* Ruta de login - solo accesible si no está autenticado */}
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              
              {/* Rutas protegidas */}
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              
              {/* Ruta de detalles de moneda */}
              <Route 
                path="/coin/:coinId" 
                element={
                  <PrivateRoute>
                    <CoinDetails />
                  </PrivateRoute>
                } 
              />
              
              {/* Ruta 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
