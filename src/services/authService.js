import usersData from './users.js';

class AuthService {
  constructor() {
    this.users = [...usersData];
    this.currentUser = null;
  }

  // Método para iniciar sesión
  async login(email, password) {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      this.currentUser = { ...user };
      delete this.currentUser.password; // No guardamos la contraseña en el estado
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      return { success: true, user: this.currentUser };
    }
    return { success: false, message: 'Credenciales incorrectas' };
  }

  // Método para registrar un nuevo usuario
  async register(userData) {
    const { fullName, email, password, role = 'colaborador' } = userData;
    
    // Verificar si el email ya existe
    const existingUser = this.users.find(u => u.email === email);
    if (existingUser) {
      return { success: false, message: 'El email ya está registrado' };
    }

    // Crear nuevo usuario
    const newUser = {
      id: this.users.length + 1,
      fullName,
      email,
      password,
      role
    };

    this.users.push(newUser);
    
    // Simular guardado en la "base de datos" (en una app real sería una llamada a la API)
    this.updateUsersDB();

    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;

    return { success: true, user: userWithoutPassword };
  }

  // Método para cerrar sesión
  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  // Método para obtener el usuario actual
  getCurrentUser() {
    if (this.currentUser) {
      return this.currentUser;
    }
    
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      this.currentUser = JSON.parse(stored);
      return this.currentUser;
    }
    
    return null;
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  }

  // Método para actualizar la "base de datos" (simulación)
  updateUsersDB() {
    // En una aplicación real, esto sería una llamada a la API
    console.log('Base de datos actualizada:', this.users);
  }

  // Método para obtener todos los usuarios (solo para admin)
  getAllUsers() {
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.role === 'admin') {
      return this.users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
    }
    return [];
  }
}

// Exportar una instancia única del servicio
const authService = new AuthService();
export default authService;
