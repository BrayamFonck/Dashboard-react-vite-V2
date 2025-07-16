# 🚀 CryptoDashboard - React + Vite

Un dashboard completo y en tiempo real para monitoreo de criptomonedas que combina análisis de mercado avanzado, visualización de datos inteligente y un sistema robusto de gestión de datos. Desarrollado con React 19, Vite 7, y tecnologías modernas como Recharts y Tailwind CSS.

## 🔍 Descripción General

CryptoDashboard es una aplicación web moderna que permite a los usuarios monitorear, analizar y explorar el mercado de criptomonedas en tiempo real. Incluye funcionalidades avanzadas como autenticación, búsqueda inteligente, gráficos interactivos, páginas detalladas de monedas, y un sistema de caché sofisticado con respaldo offline.

## ✨ Características Principales

- **� Sistema de Autenticación**: Login seguro con gestión de usuarios y roles
- **📊 Dashboard Completo**: Estadísticas globales, gráficos de pastel, tablas dinámicas y tendencias
- **� Búsqueda Inteligente**: Búsqueda en tiempo real con debounce y filtrado avanzado
- **📈 Gráficos Interactivos**: Gráficos históricos con selección de rangos de tiempo y monedas
- **📱 Diseño Responsive**: Mobile-first design optimizado para cualquier dispositivo
- **⚡ Sistema de Cache Inteligente**: Cache dual con respaldo persistente y manejo de errores
- **🔄 Datos en Tiempo Real**: Integración completa con CoinGecko API y rate limiting
- **♿ Accesibilidad Completa**: ARIA labels, navegación por teclado y soporte para lectores de pantalla

## 🛠 Estructura del Proyecto

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
├── services/           # Servicios de API
│   ├── coingeckoService.js    # Servicio principal de CoinGecko
│   ├── authService.js         # Servicio de autenticación
│   └── users.js               # Gestión de usuarios
├── routes/             # Rutas protegidas
│   └── PrivateRoute.jsx       # Componente de rutas privadas
├── styles/             # Estilos globales
│   └── App.module.css         # Estilos principales
├── App.jsx
└── main.jsx
```

---

## 📋 Tabla de Contenidos
- [Demostración del Dashboard](#-demostración-del-dashboard)
- [Requisitos del Sistema](#-requisitos-del-sistema)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Características Técnicas](#-características-técnicas)
- [API Utilizada](#-api-utilizada)
- [Sistema de Cache](#-sistema-de-cache)
- [Accesibilidad](#-accesibilidad)
- [Casos de Uso](#-casos-de-uso)
- [Contribuir](#-contribuir)
- [Contacto](#-contacto)

## 🎯 Demostración del Dashboard

### Funcionalidades Principales

#### 🔐 **Sistema de Autenticación**
- **Login Seguro**: Sistema de autenticación con validación
- **Gestión de Usuarios**: Soporte para diferentes roles (admin/usuario)
- **Rutas Protegidas**: Acceso controlado a funcionalidades del dashboard

#### 📊 **Dashboard Principal**
- **Estadísticas Globales**: Capitalización total, volumen 24h, dominancia BTC
- **Gráfico de Pastel**: Distribución visual de capitalización de mercado
- **Gráfico Histórico**: Análisis temporal con múltiples rangos de tiempo
- **Tabla de Criptomonedas**: Top monedas con datos en tiempo real
- **Monedas Trending**: Lista actualizada de criptomonedas populares

#### 🔍 **Búsqueda Inteligente**
- **Búsqueda en Tiempo Real**: Resultados instantáneos con debounce
- **Filtrado Avanzado**: Por nombre, símbolo y características
- **Navegación Directa**: Acceso rápido a páginas de detalles

#### 📈 **Análisis Avanzado**
- **Páginas de Detalles**: Información completa de cada criptomoneda
- **Gráficos Históricos**: Rangos de 1D, 7D, 1M, 1A con selector de monedas
- **Métricas Detalladas**: Precios, volumen, capitalización, cambios porcentuales
- **Enlaces Útiles**: Sitios web oficiales y exploradores blockchain

### Características de las Interfaces

#### 📱 **Diseño Responsive**
- **Mobile-First**: Optimizado para dispositivos móviles
- **Navegación Adaptiva**: Menú colapsible en pantallas pequeñas
- **Layout Flexible**: Grid system que se adapta a cualquier tamaño

#### 🎨 **Interfaz de Usuario**
- **Diseño Moderno**: Gradientes, sombras y animaciones suaves
- **Paleta Consistente**: Colores coherentes y profesionales
- **Feedback Visual**: Estados de carga, errores y confirmaciones
- **Iconografía**: Lucide React icons para mejor experiencia visual

## 💻 Requisitos del Sistema

- **Node.js 18+** (recomendado 20+ LTS)
- **npm 9+** o **pnpm 8+**
- Navegador moderno con soporte para:
  - ES2022+ features
  - CSS Grid y Flexbox
  - Fetch API
  - Local Storage API
  - Modern JavaScript (async/await, modules)

### Dependencias Principales
- **React 19.1.0**: Biblioteca principal de UI con las últimas características
- **Vite 7.0.4**: Build tool ultrarrápido con HMR optimizado
- **React Router DOM 7.6.3**: Enrutamiento del lado del cliente
- **Recharts 3.1.0**: Biblioteca de gráficos para visualización de datos
- **Tailwind CSS 4.1.11**: Framework CSS utilitario moderno
- **Lucide React 0.525.0**: Iconos SVG ligeros y modernos

## 🚀 Instalación

### 📥 Clonar el Repositorio
```bash
git clone https://github.com/BrayamFonck/Dashboard-react-vite-V2.git
cd Dashboard-react-vite-V2
```

### 📦 Instalar Dependencias
```bash
# Con npm
npm install

# O con pnpm (recomendado para mejor rendimiento)
pnpm install
```

### 🔧 Configuración del Entorno
No se requiere configuración adicional de variables de entorno. El proyecto utiliza la API pública gratuita de CoinGecko.

**Usuarios de Prueba:**
- **Usuario**: maria@colaborador.com | **Contraseña**: colaborador123
- **Admin**: admin@admin.com | **Contraseña**: admin123

## 🎮 Uso

### 🔄 Servidor de Desarrollo
```bash
# Iniciar servidor de desarrollo con Hot Module Replacement
npm run dev
# o
pnpm dev

# El dashboard estará disponible en http://localhost:5173
```

### 🏗️ Build para Producción
```bash
# Crear build optimizado
npm run build
# o
pnpm build

# Previsualizar build localmente
npm run preview
# o
pnpm preview
```

### 🧹 Linting y Calidad de Código
```bash
# Ejecutar ESLint para verificar código
npm run lint
# o
pnpm lint
```

## 🏗️ Arquitectura del Proyecto

### 🧩 Componentes Principales

#### `Dashboard.jsx`
- **Página principal** del dashboard con gestión completa de estado
- **Integración de APIs** con sistema de cache inteligente
- **Gestión de errores** con fallbacks y datos de respaldo
- **Estados de carga** con feedback visual apropiado
- **Filtros de tiempo** para gráficos históricos (1D, 7D, 1M, 1A)

#### `CoinDetails.jsx`
- **Páginas detalladas** de criptomonedas individuales
- **Gráficos históricos** con múltiples rangos de tiempo
- **Información completa**: precios, volúmenes, enlaces oficiales
- **Sistema de fallback** para datos offline
- **Navegación fluida** de regreso al dashboard

#### `CoinTable.jsx`
- **Tabla responsive** con datos en tiempo real
- **Ordenamiento inteligente** y navegación por teclado
- **Acciones rápidas**: favoritos y navegación a detalles
- **Indicadores visuales** de cambios de precio con colores
- **Accesibilidad completa** con ARIA labels

#### `CryptoPieChart.jsx`
- **Visualización de datos** con gráfico de pastel interactivo
- **Etiquetas inteligentes** que evitan superposición
- **Tooltip informativo** con datos detallados de cada segmento
- **Agrupación automática** de monedas menores en categoría "Otras"
- **Paleta de colores** consistente y accesible

#### `HistoricalChart.jsx`
- **Gráficos de línea** interactivos con Recharts
- **Tooltip personalizado** con información contextual
- **Formateo inteligente** de ejes X e Y
- **Responsive design** que se adapta a cualquier pantalla
- **Datos históricos** procesados para mejor rendimiento

#### `SearchBar.jsx`
- **Búsqueda en tiempo real** con debounce para optimización
- **Resultados instantáneos** con navegación por teclado
- **Filtrado inteligente** por nombre y símbolo
- **Rate limiting** integrado para evitar sobrecarga de API

#### `TrendingCoins.jsx`
- **Lista de monedas trending** con navegación directa
- **Indicadores visuales** de ranking y tendencias
- **Interacción mejorada** con hover effects y animaciones
- **Accesibilidad completa** con soporte para lectores de pantalla

### 🔧 Servicios Principales

#### `coingeckoService.js`
```javascript
class CoinGeckoService {
  // Funcionalidades principales:
  
  // Sistema de cache dual
  loadDashboardData()      // Carga optimizada del dashboard completo
  getCoinById(id)          // Obtener datos detallados de una moneda
  getCoinHistory(id, days) // Datos históricos con rango personalizable
  searchCoinsIntelligent() // Búsqueda avanzada con filtrado
  
  // Cache y optimización
  getCachedData()          // Gestión de cache con fallbacks
  cleanExpiredCache()      // Limpieza automática de cache expirado
  makeRequestWithRetries() // Reintentos con backoff exponencial
  
  // Utilidades
  formatNumber()           // Formateo de números grandes
  generateColor()          // Generación de colores para gráficos
}
```

#### `authService.js`
```javascript
// Gestión de autenticación
const authService = {
  login(email, password)    // Autenticación de usuarios
  logout()                  // Cierre de sesión
  getCurrentUser()          // Usuario actual
  validateSession()         // Validación de sesión
}
```

### � Context API

#### `AuthContext.jsx`
```javascript
const AuthContext = {
  user,                     // Usuario autenticado
  login,                    // Función de login
  logout,                   // Función de logout
  loading                   // Estado de carga de auth
}
```

### 🚦 Sistema de Rutas

#### `PrivateRoute.jsx`
- **Protección de rutas** con redirección automática
- **Validación de sesión** en tiempo real
- **Manejo de estados** de carga durante validación

## ⚡ Características Técnicas

### 🎨 **Diseño y UX**
- **Mobile-First Design**: Prioriza la experiencia móvil
- **CSS Grid & Flexbox**: Layout moderno y flexible
- **Tailwind CSS**: Sistema de diseño utilitario con configuración personalizada
- **Animaciones Suaves**: Transiciones CSS optimizadas con `transition-all`
- **Estados Visuales**: Loading spinners, skeleton screens, y feedback inmediato
- **Gradientes Dinámicos**: Uso de gradientes para elementos destacados

### 🚀 **Rendimiento y Optimización**
- **Debounce en Búsqueda**: 300ms de debounce para optimizar API calls
- **Sistema de Cache Dual**: 
  - Cache normal (1 minuto) para datos frescos
  - Cache persistente (24 horas) para respaldo offline
- **Rate Limiting**: Control de velocidad de requests con cola de procesamiento
- **Lazy Loading**: Carga diferida de componentes pesados
- **Memoización**: `useCallback` y `useMemo` para optimizar re-renders
- **Bundle Optimization**: Vite optimiza automáticamente el bundle final

### 🔄 **Gestión de Estado y Datos**
- **React Hooks**: Estado local con `useState`, `useEffect`, `useContext`
- **Estado Centralizado**: Context API para autenticación global
- **Cache Inteligente**: Reutilización de datos con vencimiento automático
- **Error Boundaries**: Manejo robusto de errores en toda la aplicación
- **Fallback System**: Datos de respaldo para funcionamiento offline

### 🛡️ **Seguridad y Confiabilidad**
- **Validación de Inputs**: Sanitización de entradas de usuario
- **Autenticación Segura**: Gestión de sesiones con validación
- **Rate Limiting**: Protección contra abuso de API
- **Error Handling**: Manejo graceful de errores de red y API
- **Retry Logic**: Reintentos automáticos con backoff exponencial

## 🌐 API Utilizada

### CoinGecko API v3
- **Endpoint Base**: `https://api.coingecko.com/api/v3/`
- **Documentación**: [CoinGecko API Docs](https://www.coingecko.com/en/api/documentation)
- **Límites**: API gratuita con rate limiting natural
- **Datos en Tiempo Real**: Precios, volúmenes, capitalización de mercado

### Endpoints Implementados
```javascript
// Dashboard principal
GET /global                               // Estadísticas globales del mercado
GET /coins/markets?vs_currency=usd       // Top criptomonedas con datos de mercado
GET /search/trending                     // Monedas trending del momento

// Datos detallados
GET /coins/{id}                          // Información completa de una moneda
GET /coins/{id}/market_chart             // Datos históricos personalizables
GET /search?query={term}                 // Búsqueda de criptomonedas

// Campos utilizados
fields=id,symbol,name,image,current_price,market_cap,market_cap_rank,
price_change_percentage_24h,total_volume,sparkline_in_7d
```

## 🗄️ Sistema de Cache

### Arquitectura de Cache Dual

#### **Cache Normal (60 segundos)**
```javascript
// Para datos que necesitan actualizarse frecuentemente
{
  key: 'coins-market-data',
  data: {...},
  timestamp: 1703425200000,
  expiresIn: 60000
}
```

#### **Cache Persistente (24 horas)**
```javascript
// Para respaldo cuando la API no está disponible
{
  key: 'coins-market-data-fallback',
  data: {...},
  timestamp: 1703425200000,
  expiresIn: 86400000,
  isFallback: true
}
```

### Estrategias de Cache

1. **Cache-First**: Verificar cache antes de hacer request
2. **Stale-While-Revalidate**: Usar datos del cache mientras se actualiza
3. **Fallback Strategy**: Usar datos persistentes cuando falla la API
4. **Automatic Cleanup**: Limpieza automática de cache expirado

### Manejo de Errores
- **Graceful Degradation**: Funcionalidad reducida pero operativa
- **Visual Indicators**: Indicadores cuando se usan datos de respaldo
- **Retry Logic**: Reintentos automáticos con delays progresivos
- **User Feedback**: Mensajes claros sobre el estado de los datos

## ♿ Accesibilidad

### Cumplimiento WCAG 2.1 AA
- **🎯 Estándares Web**: Cumple con pautas de accesibilidad internacional
- **⌨️ Navegación por Teclado**: Todos los elementos interactivos son navegables con Tab
- **🔊 Lectores de Pantalla**: Etiquetas semánticas HTML5 y atributos ARIA apropiados
- **🎨 Contraste de Color**: Ratios de contraste que superan los estándares WCAG
- **📱 Zoom Responsive**: Soporte hasta 200% de zoom sin pérdida de funcionalidad

### Características Específicas de Accesibilidad
- **ARIA Labels**: `aria-label`, `aria-describedby`, `aria-labelledby` en componentes
- **Roles Semánticos**: `role="button"`, `role="navigation"`, `role="main"`
- **Estados Dinámicos**: `aria-live` para anuncios de cambios en tiempo real
- **Focus Management**: Indicadores visuales claros para navegación por teclado
- **Reduced Motion**: Respeta `prefers-reduced-motion` para animaciones
- **Screen Reader Support**: Textos alternativos y descripciones contextuales

### Ejemplos de Implementación
```jsx
// Tabla de criptomonedas con accesibilidad completa
<table role="table" aria-label="Tabla de criptomonedas">
  <thead>
    <tr role="row">
      <th scope="col" aria-sort="none">Ranking</th>
      <th scope="col">Nombre</th>
    </tr>
  </thead>
  <tbody>
    <tr role="row" tabIndex={0} 
        aria-label={`${coin.name}, precio actual ${coin.current_price}`}>
      // Contenido accesible
    </tr>
  </tbody>
</table>

// Botones con descripciones contextuales
<button 
  aria-label={`Ver detalles de ${coin.name}`}
  className="focus:ring-2 focus:ring-blue-500"
>
  <ExternalLink aria-hidden="true" />
</button>
```

## 📊 Casos de Uso

### 🎓 **Educativo y Académico**
- **Análisis de Mercado**: Estudiantes de finanzas y economía
- **Visualización de Datos**: Ejemplos prácticos de charts y dashboards
- **Tecnología Blockchain**: Comprensión del ecosistema cripto
- **Desarrollo Web**: Referencia para proyectos con React y APIs

### 💼 **Profesional y Empresarial**
- **Monitoreo de Inversiones**: Seguimiento de portafolios de criptomonedas
- **Análisis Técnico**: Herramientas para traders e inversores
- **Desarrollo de Software**: Base para aplicaciones fintech
- **Presentaciones Corporativas**: Datos actualizados para informes

### 🔍 **Investigación y Análisis**
- **Tendencias de Mercado**: Identificación de patrones y movimientos
- **Comparación de Activos**: Análisis comparativo entre criptomonedas
- **Datos Históricos**: Investigación de comportamiento del mercado
- **APIs de Terceros**: Integración con servicios externos

### 🌐 **Personal y Entretenimiento**
- **Curiosidad Tecnológica**: Exploración del mundo cripto
- **Seguimiento Personal**: Monitoreo de inversiones propias
- **Aprendizaje Autodidacta**: Comprensión de conceptos financieros
- **Proyectos Hobby**: Base para aplicaciones personales

## 🤝 Contribuir

### 🔧 Configuración para Desarrollo

1. **Fork del Repositorio**
```bash
# Crear fork en GitHub y clonar
git clone https://github.com/tu-usuario/Dashboard-react-vite-V2.git
cd Dashboard-react-vite-V2
```

2. **Configuración del Entorno**
```bash
# Instalar dependencias
pnpm install

# Crear rama para feature
git checkout -b feature/nueva-funcionalidad

# Iniciar servidor de desarrollo
pnpm dev
```

3. **Flujo de Contribución**
```bash
# Hacer cambios y commits
git add .
git commit -m "feat: agregar nueva funcionalidad de análisis"

# Push y crear Pull Request
git push origin feature/nueva-funcionalidad
```

### 💡 Ideas para Contribuir

#### **🚀 Nuevas Funcionalidades**
- **🗺️ Mapas de Calor**: Visualización geográfica de adopción cripto
- **📈 Indicadores Técnicos**: RSI, MACD, Bollinger Bands
- **🔔 Sistema de Alertas**: Notificaciones de precios y cambios
- **💼 Gestión de Portfolio**: Tracker de inversiones personales
- **🔄 Comparador de Monedas**: Análisis side-by-side
- **� Análisis Avanzado**: Correlaciones y métricas financieras

#### **🎨 Mejoras de UI/UX**
- **🌙 Modo Oscuro**: Toggle entre temas claro y oscuro
- **🎨 Temas Personalizables**: Múltiples esquemas de colores
- **📱 PWA Support**: Funcionalidad de aplicación web progresiva
- **🔧 Personalización**: Dashboard configurable por usuario
- **📊 Widgets Personalizados**: Componentes arrastrables

#### **⚡ Optimizaciones Técnicas**
- **🗄️ Estado Global**: Implementación con Zustand o Redux Toolkit
- **🔄 React Query**: Cache y sincronización de datos mejorada
- **🧪 Testing**: Tests unitarios y de integración
- **📊 Analytics**: Tracking de uso y métricas
- **🔒 Seguridad**: Mejoras en autenticación y validación

### 🐛 Reportar Issues

Utiliza el [sistema de Issues de GitHub](https://github.com/BrayamFonck/Dashboard-react-vite-V2/issues) para:

- **🐛 Reportar Bugs**: Descripción detallada y pasos para reproducir
- **💡 Sugerir Features**: Ideas y casos de uso específicos
- **📚 Mejoras de Documentación**: Clarificaciones y ejemplos
- **🔧 Issues Técnicos**: Problemas de rendimiento o compatibilidad

### 📋 Template para Issues
```markdown
## Tipo de Issue
- [ ] Bug Report
- [ ] Feature Request
- [ ] Documentation
- [ ] Question

## Descripción
Descripción clara y concisa del issue.

## Pasos para Reproducir (si es bug)
1. Ir a '...'
2. Hacer click en '...'
3. Ver error

## Comportamiento Esperado
Lo que debería suceder.

## Screenshots
Si aplica, agregar screenshots para explicar el problema.

## Entorno
- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 120]
- Version: [e.g. 1.0.0]
```

## 🙏 Agradecimientos

### Tecnologías y Herramientas
- **[CoinGecko API](https://www.coingecko.com/en/api)**: Datos confiables y actualizados de criptomonedas
- **[React Team](https://react.dev)**: Por la increíble biblioteca y ecosistema
- **[Vite Team](https://vitejs.dev)**: Por la herramienta de desarrollo más rápida
- **[Tailwind CSS](https://tailwindcss.com)**: Framework CSS que acelera el desarrollo
- **[Recharts](https://recharts.org)**: Biblioteca de gráficos elegante y funcional
- **[Lucide](https://lucide.dev)**: Iconos SVG hermosos y ligeros

### Comunidad y Recursos
- **Open Source Community**: Por las innumerables contribuciones y bibliotecas
- **Stack Overflow**: Por resolver dudas técnicas complejas
- **MDN Web Docs**: Documentación web de referencia
- **GitHub**: Por la plataforma de desarrollo colaborativo
- **Crypto Community**: Por la inspiración y casos de uso reales

### Reconocimientos Especiales
- **Desarrolladores Frontend**: Por compartir mejores prácticas y patrones
- **Comunidad React**: Por el apoyo continuo y recursos educativos
- **Testers Beta**: Por el feedback valioso durante el desarrollo
- **Usuarios Finales**: Por las sugerencias y reportes de bugs

## 🔗 Enlaces Útiles

### Documentación Técnica
- **📖 CoinGecko API**: [https://www.coingecko.com/en/api/documentation](https://www.coingecko.com/en/api/documentation)
- **⚛️ React 19**: [https://react.dev](https://react.dev)
- **⚡ Vite**: [https://vitejs.dev](https://vitejs.dev)
- **🎨 Tailwind CSS**: [https://tailwindcss.com](https://tailwindcss.com)
- **📊 Recharts**: [https://recharts.org](https://recharts.org)

### Recursos de Desarrollo
- **🧪 Testing Library**: [https://testing-library.com](https://testing-library.com)
- **♿ WCAG Guidelines**: [https://www.w3.org/WAI/WCAG21/quickref/](https://www.w3.org/WAI/WCAG21/quickref/)
- **🔧 ESLint Rules**: [https://eslint.org/docs/rules/](https://eslint.org/docs/rules/)
- **📱 PWA Guide**: [https://web.dev/progressive-web-apps/](https://web.dev/progressive-web-apps/)

### Herramientas de Productividad
- **🎯 VS Code Extensions**: React snippets, ES7+, Tailwind IntelliSense
- **� React DevTools**: [Chrome Extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- **🎨 Design Inspiration**: [Dribbble](https://dribbble.com), [Behance](https://behance.net)

---

## 📧 Contacto

¿Tienes preguntas, sugerencias o quieres colaborar? ¡Me encantaría saber de ti!

**Brayan Steven Fonseca González**
- 🐙 **GitHub**: [@BrayamFonck](https://github.com/BrayamFonck)
- 💼 **LinkedIn**: [Brayan Steven Fonseca González](https://www.linkedin.com/in/brayan-steven-fonseca-gonzalez/)
- 📧 **Email**: [brayamfonck@gmail.com](mailto:brayamfonck@gmail.com)

### 💬 Formas de Contacto
- **🐛 Issues Técnicos**: [GitHub Issues](https://github.com/BrayamFonck/Dashboard-react-vite-V2/issues)
- **� Colaboraciones**: Mensaje directo en LinkedIn
- **📧 Consultas Generales**: Email directo
- **🤝 Networking**: LinkedIn para oportunidades profesionales

---

¡Gracias por visitar CryptoDashboard! 🚀  
Si este proyecto te resulta útil, no olvides darle una ⭐ en GitHub.  
¡Tu apoyo me motiva a seguir desarrollando herramientas útiles para la comunidad! 😊

## 🌟 ¡Hecho con ❤️ y React desde Colombia para el mundo! 🇨🇴

---

<div align="center">
  <strong>CryptoDashboard</strong> - Monitoreo profesional de criptomonedas
  <br>
  <em>Desarrollado con React 19 + Vite 7 + Tailwind CSS</em>
  <br><br>
  <img src="https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-7.0.4-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.1.11-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
</div>

