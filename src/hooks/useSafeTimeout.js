import { useEffect, useRef } from 'react';

/**
 * Hook para manejar timeouts de manera segura con bfcache
 * Automáticamente limpia timeouts cuando la página va al bfcache
 */
export const useSafeTimeout = () => {
  const timeoutsRef = useRef(new Set());

  useEffect(() => {
    // Limpiar todos los timeouts cuando la página va al bfcache
    const handlePageHide = () => {
      timeoutsRef.current.forEach(timeoutId => {
        clearTimeout(timeoutId);
      });
      timeoutsRef.current.clear();
    };

    window.addEventListener('pagehide', handlePageHide);

    return () => {
      // Limpiar todos los timeouts al desmontar
      timeoutsRef.current.forEach(timeoutId => {
        clearTimeout(timeoutId);
      });
      timeoutsRef.current.clear();
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, []);

  // Función para crear un timeout seguro
  const setSafeTimeout = (callback, delay) => {
    const timeoutId = setTimeout(() => {
      timeoutsRef.current.delete(timeoutId);
      callback();
    }, delay);
    
    timeoutsRef.current.add(timeoutId);
    return timeoutId;
  };

  // Función para limpiar un timeout específico
  const clearSafeTimeout = (timeoutId) => {
    clearTimeout(timeoutId);
    timeoutsRef.current.delete(timeoutId);
  };

  // Función para limpiar todos los timeouts
  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(timeoutId => {
      clearTimeout(timeoutId);
    });
    timeoutsRef.current.clear();
  };

  return { setSafeTimeout, clearSafeTimeout, clearAllTimeouts };
};
