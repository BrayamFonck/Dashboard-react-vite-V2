import { useEffect } from 'react';

/**
 * Hook personalizado para manejar el back/forward cache (bfcache)
 * Limpia automáticamente conexiones y event listeners cuando la página
 * se va al bfcache para permitir su restauración
 */
export const useBfcacheOptimization = () => {
  useEffect(() => {
    let beforeUnloadListener = null;
    let hasUnsavedChanges = false;

    // Función para limpiar conexiones y timers
    const cleanupConnections = () => {
      // Limpiar todos los timeouts activos
      const highestTimeoutId = setTimeout(() => {}, 0);
      for (let i = 0; i < highestTimeoutId; i++) {
        clearTimeout(i);
      }

      // Limpiar todos los intervals activos
      const highestIntervalId = setInterval(() => {}, 0);
      for (let i = 0; i < highestIntervalId; i++) {
        clearInterval(i);
      }
    };

    // Usar pagehide en lugar de unload para bfcache
    const handlePageHide = (event) => {
      if (event.persisted) {
        // La página está siendo guardada en bfcache
        console.log('Página guardada en bfcache');
      } else {
        // La página está siendo descargada completamente
        console.log('Página descargada');
      }
      
      // Limpiar conexiones en ambos casos
      cleanupConnections();
    };

    // Función para agregar beforeunload solo cuando sea necesario
    const addBeforeUnloadListener = () => {
      if (!beforeUnloadListener && hasUnsavedChanges) {
        beforeUnloadListener = (event) => {
          event.preventDefault();
          event.returnValue = ''; // Para navegadores modernos
          return ''; // Para navegadores antiguos
        };
        window.addEventListener('beforeunload', beforeUnloadListener);
      }
    };

    // Función para remover beforeunload cuando ya no sea necesario
    const removeBeforeUnloadListener = () => {
      if (beforeUnloadListener) {
        window.removeEventListener('beforeunload', beforeUnloadListener);
        beforeUnloadListener = null;
      }
    };

    // Función para marcar que hay cambios sin guardar
    const setUnsavedChanges = (hasChanges) => {
      hasUnsavedChanges = hasChanges;
      if (hasChanges) {
        addBeforeUnloadListener();
      } else {
        removeBeforeUnloadListener();
      }
    };

    // Función para manejar la restauración desde bfcache
    const handlePageShow = (event) => {
      if (event.persisted) {
        console.log('Página restaurada desde bfcache');
        // Reactivar funcionalidades si es necesario
        // Por ejemplo, reconectar WebSockets si los había
      }
    };

    // Agregar listeners para bfcache
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('pageshow', handlePageShow);

    // Cleanup al desmontar el componente
    return () => {
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('pageshow', handlePageShow);
      removeBeforeUnloadListener();
    };
  }, []);

  // Función para que otros componentes puedan marcar cambios sin guardar
  const setUnsavedChanges = (hasChanges) => {
    // Esta función se puede exponer si se necesita desde otros componentes
    console.log(`Cambios sin guardar: ${hasChanges}`);
  };

  return { setUnsavedChanges };
};
