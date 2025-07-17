import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';
import Loader from '../components/Loader';

const Login = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'colaborador'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email y contraseña son requeridos');
      return false;
    }

    if (!isLogin) {
      if (!formData.fullName) {
        setError('El nombre completo es requerido');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden');
        return false;
      }
      if (formData.password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingresa un email válido');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password);
        if (!result.success) {
          setError(result.message);
        }
      } else {
        const result = await register({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });
        
        if (result.success) {
          setSuccess('Usuario registrado exitosamente. Ahora puedes iniciar sesión.');
          setIsLogin(true);
          setFormData({
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'colaborador'
          });
        } else {
          setError(result.message);
        }
      }
    } catch (err) {
      setError('Ha ocurrido un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'colaborador'
    });
  };

  if (loading) {
    return <Loader message={isLogin ? 'Iniciando sesión...' : 'Registrando usuario...'} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 flex items-center justify-center py-4 px-4 sm:py-8 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full" aria-hidden="true">
        <div className="absolute top-10 left-10 sm:top-20 sm:left-20 w-24 h-24 sm:w-32 sm:h-32 bg-white bg-opacity-10 rounded-full blur-xl"></div>
        <div className="absolute bottom-16 right-8 sm:bottom-32 sm:right-16 w-32 h-32 sm:w-48 sm:h-48 bg-white bg-opacity-10 rounded-full blur-xl"></div>
        {/* <div className="absolute top-1/2 left-1/4 w-16 h-16 sm:w-24 sm:h-24 bg-yellow-300 bg-opacity-20 rounded-full blur-lg"></div> */}
      </div>

      <div className="max-w-7xl w-full flex items-center justify-center relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-center w-full">
          {/* Left side - Information */}
          <div className="text-white space-y-4 sm:space-y-6 px-4 sm:px-8 order-2 lg:order-1 text-center lg:text-left">
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Dashboard de
                <span className="block text-yellow-300">Criptomonedas</span>
                <span className="block">en Tiempo Real</span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
                Monitorea, analiza y gestiona tus inversiones en criptomonedas con 
                datos actualizados en tiempo real. La plataforma más completa para 
                traders y entusiastas de las criptomonedas.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-2 sm:space-y-0 sm:space-x-4 text-orange-100">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm sm:text-base">Datos en tiempo real</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm sm:text-base">100% Seguro</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 max-w-md w-full mx-auto order-1 lg:order-2">
            <div className="text-center mb-6 sm:mb-8">
              <div className="mx-auto h-12 w-12 sm:h-16 sm:w-16 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <svg className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                {isLogin ? 'Bienvenido de vuelta' : 'Crear nueva cuenta'}
              </h2>
              <p className="text-gray-600 text-sm">
                {isLogin ? 'Ingresa tus credenciales para continuar' : 'Completa el formulario para registrarte'}
              </p>
            </div>

            <ErrorMessage message={error} onClose={() => setError('')} />
            
            {success && (
              <div 
                className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm"
                role="alert"
                aria-live="polite"
              >
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
              {!isLogin && (
                <div>
                  <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required={!isLogin}
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-sm sm:text-base"
                    placeholder="Ingresa tu nombre completo"
                    aria-describedby={!isLogin && !formData.fullName ? "fullName-error" : undefined}
                    aria-invalid={!isLogin && !formData.fullName && error ? "true" : "false"}
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Correo Electrónico *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-sm sm:text-base"
                  placeholder="ejemplo@correo.com"
                  aria-describedby={!formData.email ? "email-error" : undefined}
                  aria-invalid={!formData.email && error ? "true" : "false"}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Contraseña *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-sm sm:text-base"
                  placeholder="Ingresa tu contraseña"
                  aria-describedby={!formData.password ? "password-error" : undefined}
                  aria-invalid={!formData.password && error ? "true" : "false"}
                />
              </div>

              {!isLogin && (
                <>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirmar Contraseña *
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required={!isLogin}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-sm sm:text-base"
                      placeholder="Confirma tu contraseña"
                      aria-describedby="confirmPassword-help"
                    />
                    <p id="confirmPassword-help" className="text-xs text-gray-500 mt-1">
                      Debe coincidir con la contraseña anterior
                    </p>
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                      Tipo de Usuario
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-sm sm:text-base"
                      aria-describedby="role-help"
                    >
                      <option value="colaborador">Colaborador</option>
                      <option value="admin">Administrador</option>
                    </select>
                    <p id="role-help" className="text-xs text-gray-500 mt-1">
                      Los administradores tienen acceso completo al sistema
                    </p>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg hover:from-orange-500 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg text-sm sm:text-base lg:text-lg"
                aria-describedby="submit-status"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2 sm:mr-3" aria-hidden="true"></div>
                    <span className="text-white font-semibold">
                      {isLogin ? 'Iniciando sesión...' : 'Creando cuenta...'}
                    </span>
                  </div>
                ) : (
                  <span className="text-white font-semibold">
                    {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                  </span>
                )}
              </button>
            </form>

            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-gray-600 text-sm">
                {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="ml-2 font-semibold text-orange-700 hover:text-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 rounded transition-colors"
                  aria-describedby="toggle-help"
                >
                  {isLogin ? 'Regístrate es gratis' : 'Inicia sesión'}
                </button>
              </p>
            </div>

            {isLogin && (
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs font-medium mb-2 text-blue-800">
                  💡 Usuarios de demostración:
                </p>
                <div className="text-xs text-blue-700 space-y-1">
                  <div><strong>Admin:</strong> brayan@admin.com / admin123</div>
                  <div><strong>Colaborador:</strong> maria@colaborador.com / colaborador123</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
