import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Bienvenido, <strong>{user?.fullName}</strong>
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                user?.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {user?.role}
              </span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                ¡Bienvenido al Dashboard!
              </h2>
              <p className="text-gray-600 mb-6">
                Has iniciado sesión exitosamente como <strong>{user?.role}</strong>
              </p>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Usuario</h3>
                <div className="space-y-2 text-left">
                  <p><strong>Nombre:</strong> {user?.fullName}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Rol:</strong> {user?.role}</p>
                  <p><strong>ID:</strong> {user?.id}</p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-gray-500">
                  Aquí se mostrará el contenido del dashboard según tu rol.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
