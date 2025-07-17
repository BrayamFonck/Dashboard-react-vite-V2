import { useEffect, useRef } from 'react';

/**
 * Hook para manejar intervals de manera segura con bfcache
 * Automáticamente limpia intervals cuando la página va al bfcache
 */
export const useSafeInterval = (callback, delay) => {
  const intervalRef = useRef(null);
  const callbackRef = useRef(callback);

  // Mantener la referencia del callback actualizada
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => callbackRef.current();

    if (delay !== null) {
      intervalRef.current = setInterval(tick, delay);
    }

    // Limpiar interval cuando la página va al bfcache
    const handlePageHide = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    // Restaurar interval cuando la página vuelve del bfcache
    const handlePageShow = (event) => {
      if (event.persisted && delay !== null && !intervalRef.current) {
        intervalRef.current = setInterval(tick, delay);
      }
    };

    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [delay]);

  // Función para limpiar manualmente el interval
  const clearSafeInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return clearSafeInterval;
};
