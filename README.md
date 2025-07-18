# 🚀 CryptoDashboard v2.0 - React + Vite

Un dashboard completo y altamente optimizado para monitoreo de criptomonedas en tiempo real que combina análisis de mercado avanzado, visualización de datos inteligente, y un sistema robusto de gestión de datos. Desarrollado con React 19, Vite 7, implementando las mejores prácticas de performance, accesibilidad y SEO.

## 🔍 Descripción General

CryptoDashboard v2.0 es una aplicación web moderna que permite a los usuarios monitorear, analizar y explorar el mercado de criptomonedas en tiempo real. Incluye funcionalidades avanzadas como autenticación, búsqueda inteligente, gráficos interactivos, páginas detalladas de monedas, sistema de caché sofisticado con respaldo offline, **code splitting**, **optimizaciones de performance**, y **soporte completo para GitHub Pages**.

## ✨ Características Principales

### 🔐 **Sistema de Autenticación Avanzado**
- Login seguro con gestión de usuarios y roles
- Rutas protegidas con PrivateRoute component
- Contexto global de autenticación
- Usuarios de demostración incluidos

### 📊 **Dashboard Completo e Interactivo**
- Estadísticas globales del mercado en tiempo real
- Gráficos de pastel con distribución de capitalización
- Tablas dinámicas con top 20 criptomonedas
- Gráficos históricos con múltiples rangos de tiempo
- Datos de tendencias y análisis de mercado

### 🔍 **Búsqueda Inteligente con Debounce**
- Búsqueda en tiempo real con filtrado avanzado
- Debounce optimizado para reducir requests
- Sugerencias inteligentes y autocomplete
- Manejo de estados de carga y errores

### 📈 **Visualización de Datos Avanzada**
- Gráficos interactivos con Recharts
- Selección de rangos de tiempo personalizables
- Tooltips informativos y navegación intuitiva
- Responsive design para todos los dispositivos

### ⚡ **Optimizaciones de Performance**
- **Code Splitting** con React.lazy y Suspense
- **Back/Forward Cache (bfcache)** optimizado
- **Hooks personalizados** para gestión de memoria
- **Compresión Gzip/Brotli** habilitada
- **Minificación avanzada** con esbuild
- **Service Worker** para caché offline

### 🌐 **SEO y Accesibilidad**
- **robots.txt** válido para indexación
- **Meta tags** optimizadas para redes sociales
- **Contraste de colores** WCAG 2.1 AA compliant
- **ARIA labels** y navegación por teclado
- **Lighthouse Score** optimizado

### 🚀 **GitHub Pages Ready**
- **Configuración completa** para deployment
- **Soporte para React Router** en GitHub Pages
- **Archivo 404.html** para manejo de rutas
- **Scripts de redirección** transparentes

## 🛠 Arquitectura del Proyecto

```text
src/
├── components/         # Componentes reutilizables
│   ├── CoinTable.jsx          # Tabla principal de criptomonedas
│   ├── CryptoPieChart.jsx     # Gráfico de pastel con distribución
│   ├── HistoricalChart.jsx    # Gráfico histórico interactivo
│   ├── TrendingCoins.jsx      # Lista de monedas trending
│   ├── SearchBar.jsx          # Barra de búsqueda inteligente
│   ├── StatCard.jsx           # Tarjetas de estadísticas
│   ├── Navbar.jsx             # Navegación principal
│   ├── Loader.jsx             # Componente de carga
│   └── ErrorMessage.jsx       # Manejo de errores
├── pages/              # Páginas principales
│   ├── Dashboard.jsx          # Dashboard principal
│   ├── CoinDetails.jsx        # Página de detalles de moneda
│   ├── Login.jsx              # Página de autenticación
│   └── NotFound.jsx           # Página 404
├── context/            # Contextos de React
│   └── AuthContext.jsx        # Contexto de autenticación
├── hooks/              # Hooks personalizados (NUEVO)
│   ├── useBfcacheOptimization.js    # Optimización bfcache
│   ├── useSafeInterval.js           # Intervals seguros
│   ├── useSafeTimeout.js            # Timeouts seguros
│   └── useApiConnection.js          # Gestión de conexiones API
├── services/           # Servicios de API
│   ├── coingeckoService.js    # Servicio principal de CoinGecko
│   ├── authService.js         # Servicio de autenticación
│   ├── users.js               # Gestión de usuarios
│   └── users.db               # Base de datos local
├── routes/             # Rutas protegidas
│   └── PrivateRoute.jsx       # Componente de rutas privadas
├── styles/             # Estilos globales
│   └── App.module.css         # Estilos principales
├── App.jsx             # Componente principal con lazy loading
└── main.jsx            # Punto de entrada con Service Worker
```

### 📁 **Archivos de Configuración**
```text
public/
├── 404.html            # Manejo de rutas para GitHub Pages
├── robots.txt          # SEO y crawling
└── vite.svg           # Favicon
```

## 🎯 Páginas del Proyecto

### 🔐 **Login (`/login`)**
**Propósito**: Página de autenticación del sistema
- Formulario de login/registro con validación
- Diseño responsive con gradientes modernos
- Información promocional del dashboard
- **Contraste optimizado** para accesibilidad
- **Usuarios de prueba**:
  - Admin: `brayan@admin.com` / `admin123`
  - Colaborador: `maria@colaborador.com` / `colaborador123`

### 📊 **Dashboard (`/dashboard`)**
**Propósito**: Página principal del dashboard de criptomonedas
- Vista general completa del mercado crypto
- Estadísticas globales en tiempo real
- Tabla de las top 20 criptomonedas
- Gráfico de pastel con distribución de capitalización
- Gráfico histórico interactivo con rangos de tiempo
- Búsqueda inteligente de criptomonedas
- Sistema de cache avanzado con datos de respaldo

### 🪙 **CoinDetails (`/coin/:coinId`)**
**Propósito**: Página de detalles específicos de cada criptomoneda
- Información detallada de una criptomoneda individual
- Precio actual y métricas de mercado
- Gráfico histórico con múltiples rangos (1D, 7D, 30D, 90D, 1A)
- Enlaces oficiales y exploradores blockchain
- Descripción detallada de la criptomoneda
- Botón de actualización de datos

### ❌ **NotFound (`/404`)**
**Propósito**: Página de error 404
- Maneja rutas no encontradas
- Diseño limpio con botón de regreso al inicio
- **Lazy loading** implementado

## 🔧 Tecnologías y Dependencias

### **Frontend Core**
- **React** `19.1.0` - Biblioteca de interfaz de usuario
- **React Router DOM** `7.6.3` - Enrutamiento de la aplicación
- **Vite** `7.0.4` - Bundler y servidor de desarrollo

### **Styling & UI**
- **Tailwind CSS** `4.1.11` - Framework de utilidades CSS
- **Lucide React** `0.525.0` - Iconos modernos
- **Recharts** `3.1.0` - Gráficos y visualización de datos

### **Performance & Optimization**
- **@vitejs/plugin-react-swc** `3.10.2` - Compilación rápida
- **vite-plugin-compression** `0.5.1` - Compresión Gzip/Brotli
- **ESBuild** - Minificación avanzada

### **Development & Quality**
- **ESLint** `9.30.1` - Linting de código
- **PostCSS** `8.5.6` - Procesamiento de CSS
- **Autoprefixer** `10.4.21` - Prefijos CSS automáticos

### **Deployment**
- **gh-pages** `6.3.0` - Deployment a GitHub Pages

## 🚀 Instalación y Configuración

### **Prerrequisitos**
- Node.js `18+`
- npm `8+` o yarn `1.22+`

### **Instalación**
```bash
# Clonar el repositorio
git clone https://github.com/BrayamFonck/Dashboard-react-vite-V2.git

# Navegar al directorio
cd Dashboard-react-vite-V2

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### **Scripts Disponibles**
```bash
# Desarrollo
npm run dev          # Servidor de desarrollo en http://localhost:5173

# Producción
npm run build        # Build optimizado para producción
npm run preview      # Preview del build de producción

# Quality Assurance
npm run lint         # Ejecutar ESLint

# Deployment
npm run deploy       # Deploy a GitHub Pages
```

## 🔧 Optimizaciones Implementadas

### ⚡ **Performance Optimizations**

#### **Code Splitting**
- **React.lazy** para carga perezosa de componentes
- **Suspense** con loading spinners elegantes
- **Chunks manuales** para bibliotecas específicas
- **Reducción de JavaScript no utilizado**

#### **Back/Forward Cache (bfcache)**
- **Hooks personalizados** para gestión de memoria
- **Event listeners optimizados** (pagehide vs unload)
- **Limpieza automática** de intervals y timeouts
- **Restauración inteligente** del estado

#### **Build Optimization**
- **Compresión Gzip/Brotli** automática
- **Minificación avanzada** con esbuild
- **Tree shaking** para reducir bundle size
- **Service Worker** para caché offline

### 🌐 **SEO & Accessibility**

#### **SEO Enhancements**
- **robots.txt** válido para crawlers
- **Meta descriptions** optimizadas
- **Open Graph** tags para redes sociales
- **Lighthouse Score** mejorado

#### **Accessibility (WCAG 2.1 AA)**
- **Contraste de colores** optimizado (6.2:1 ratio)
- **ARIA labels** en componentes interactivos
- **Navegación por teclado** completa
- **Focus management** mejorado

### 🚀 **GitHub Pages Integration**

#### **React Router Support**
- **404.html** personalizado para manejo de rutas
- **Scripts de redirección** transparentes
- **Configuración automática** de base path
- **URLs compartibles** para todas las rutas

## 🎨 Hooks Personalizados

### **useBfcacheOptimization**
```javascript
// Optimiza el back/forward cache del navegador
useBfcacheOptimization();
```

### **useSafeInterval**
```javascript
// Intervals que se limpian automáticamente en pagehide
useSafeInterval(() => {
  // Lógica del interval
}, 5000);
```

### **useSafeTimeout**
```javascript
// Timeouts con gestión automática de memoria
const { setSafeTimeout, clearSafeTimeout } = useSafeTimeout();
```

## 📱 Responsive Design

- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: sm, md, lg, xl, 2xl
- **Touch Friendly**: Elementos táctiles optimizados
- **Performance**: Lazy loading de imágenes

## 🔐 Sistema de Autenticación

### **Usuarios de Demostración**
| Rol | Email | Contraseña | Permisos |
|-----|-------|------------|----------|
| **Admin** | `brayan@admin.com` | `admin123` | Acceso completo |
| **Colaborador** | `maria@colaborador.com` | `colaborador123` | Acceso estándar |

### **Funcionalidades**
- **Context API** para estado global
- **Rutas protegidas** con PrivateRoute
- **Persistencia** en localStorage
- **Validación** de formularios

## 📊 Funcionalidades del Dashboard

### **Estadísticas Globales**
- Capitalización total del mercado
- Volumen de trading 24h
- Dominancia de Bitcoin
- Número total de criptomonedas

### **Gráficos Interactivos**
- **Pie Chart**: Distribución de capitalización de mercado
- **Line Chart**: Datos históricos con rangos personalizables
- **Bar Chart**: Volúmenes de trading
- **Responsive**: Adaptables a cualquier tamaño de pantalla

### **Tabla de Criptomonedas**
- **Top 20** criptomonedas por capitalización
- **Paginación** y ordenamiento
- **Búsqueda en tiempo real**
- **Enlaces** a páginas de detalles

## 🔄 Sistema de Cache Inteligente

### **Cache Dual**
- **Cache primario**: Datos en tiempo real (60 segundos)
- **Cache de respaldo**: Datos persistentes (24 horas)
- **Fallback automático**: En caso de errores de red

### **Rate Limiting**
- **100ms** entre requests
- **Cola de peticiones** con procesamiento secuencial
- **Reintentos automáticos** con backoff exponencial

## 🌍 Deployment en GitHub Pages

### **URL de Producción**
🔗 **[https://BrayamFonck.github.io/Dashboard-react-vite-V2/](https://BrayamFonck.github.io/Dashboard-react-vite-V2/)**

### **Configuración Automática**
```json
{
  "homepage": "https://BrayamFonck.github.io/Dashboard-react-vite-V2/",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### **Soporte para React Router**
- **404.html**: Maneja rutas no encontradas
- **Redirección transparente**: URLs amigables
- **Estado preservado**: Navegación fluida

## 📈 Métricas de Performance

### **Lighthouse Scores**
- **Performance**: 95+ 🟢
- **Accessibility**: 100 🟢
- **Best Practices**: 100 🟢
- **SEO**: 100 🟢

### **Bundle Size**
- **Initial Bundle**: ~228KB (gzipped: ~73KB)
- **Code Splitting**: Chunks separados por página
- **Compression**: Gzip + Brotli habilitado

## 🧪 Testing

### **Testing Manual**
- **Navegación**: Todas las rutas funcionando
- **Responsive**: Probado en múltiples dispositivos
- **Performance**: Lighthouse audits regulares
- **Accessibility**: Pruebas con lectores de pantalla

### **Funcionalidades Probadas**
- ✅ Autenticación y autorización
- ✅ Búsqueda en tiempo real
- ✅ Gráficos interactivos
- ✅ Cache y fallbacks
- ✅ Navegación entre páginas
- ✅ Recarga de página en cualquier ruta

## 🔮 Próximas Mejoras

### **Funcionalidades Pendientes**
- [ ] **Portfolio Personal**: Gestión de carteras
- [ ] **Alertas de Precio**: Notificaciones personalizadas
- [ ] **Análisis Técnico**: Indicadores avanzados
- [ ] **Trading Simulado**: Paper trading
- [ ] **PWA**: Progressive Web App
- [ ] **Dark Mode**: Tema oscuro

### **Optimizaciones Técnicas**
- [ ] **React 19 Features**: Concurrent features
- [ ] **Testing Suite**: Jest + React Testing Library
- [ ] **E2E Testing**: Playwright o Cypress
- [ ] **Analytics**: Google Analytics 4
- [ ] **Error Tracking**: Sentry integration

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Por favor:

1. **Fork** el proyecto
2. **Crea** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre** un Pull Request

### **Estándares de Código**
- **ESLint**: Seguir las reglas configuradas
- **Prettier**: Formateo automático
- **Commits**: Conventional Commits
- **Documentación**: Actualizar README si es necesario

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Contacto

¿Tienes preguntas, sugerencias o quieres colaborar? ¡Me encantaría saber de ti!

**Brayan Steven Fonseca González**
- 🐙 **GitHub**: [@BrayamFonck](https://github.com/BrayamFonck)
- 💼 **LinkedIn**: [Brayan Steven Fonseca González](https://www.linkedin.com/in/brayan-steven-fonseca-gonzalez/)
- 📧 **Email**: [brayamfonck@gmail.com](mailto:brayamfonck@gmail.com)

### 💬 Formas de Contacto
- **🐛 Issues Técnicos**: [GitHub Issues](https://github.com/BrayamFonck/Dashboard-react-vite-V2/issues)
- **🤝 Colaboraciones**: Mensaje directo en LinkedIn
- **📧 Consultas Generales**: Email directo
- **🌐 Networking**: LinkedIn para oportunidades profesionales

---

¡Gracias por visitar CryptoDashboard v2.0! 🚀  
Si este proyecto te resulta útil, no olvides darle una ⭐ en GitHub.  
¡Tu apoyo me motiva a seguir desarrollando herramientas útiles para la comunidad! 😊

## 🌟 ¡Hecho con ❤️ y React desde Colombia para el mundo! 🇨🇴

---

<div align="center">
  <strong>CryptoDashboard v2.0</strong> - Monitoreo profesional de criptomonedas
  <br>
  <em>Desarrollado con React 19 + Vite 7 + Tailwind CSS + Performance Optimizations</em>
  <br><br>
  <img src="https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-7.0.4-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.1.11-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Performance-Optimized-00D9FF?style=for-the-badge&logo=lighthouse&logoColor=white" alt="Performance" />
  <img src="https://img.shields.io/badge/Accessibility-WCAG_2.1_AA-008000?style=for-the-badge&logo=accessibility&logoColor=white" alt="Accessibility" />
</div>
