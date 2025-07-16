import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import coinGeckoService from '../services/coingeckoService';

const SearchBar = ({ onSearch, onCoinSelect, placeholder = "Buscar criptomonedas..." }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);
  const searchRef = useRef(null);
  const timeoutRef = useRef(null);

  // Cerrar resultados cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
        setShowNoResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Búsqueda con debounce
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (searchTerm.trim().length > 0) {
      timeoutRef.current = setTimeout(() => {
        performSearch(searchTerm);
      }, 300);
    } else {
      setSearchResults([]);
      setSuggestions([]);
      setShowResults(false);
      setShowNoResults(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchTerm]);

  const performSearch = async (query) => {
    try {
      setIsSearching(true);
      const data = await coinGeckoService.searchCoinsIntelligent(query);
      
      setSearchResults(data.results || []);
      setSuggestions(data.suggestions || []);
      
      if (data.results.length === 0) {
        setShowNoResults(true);
        setShowResults(false);
      } else {
        setShowResults(true);
        setShowNoResults(false);
      }
    } catch (error) {
      console.error('Error en la búsqueda:', error);
      setSearchResults([]);
      setSuggestions([]);
      setShowResults(false);
      setShowNoResults(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() && onSearch) {
      onSearch(searchTerm.trim());
    }
  };

  const handleCoinClick = (coin) => {
    setSearchTerm('');
    setShowResults(false);
    setShowNoResults(false);
    
    // Navegar a la página de detalles de la moneda
    navigate(`/coin/${coin.id}`);
    
    // Callback opcional para compatibilidad
    if (onCoinSelect) {
      onCoinSelect(coin);
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInputFocus = () => {
    if (searchResults.length > 0) {
      setShowResults(true);
    } else if (searchTerm.trim().length > 0 && searchResults.length === 0) {
      setShowNoResults(true);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder={placeholder}
            className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 bg-white shadow-sm"
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {isSearching ? (
              <svg className="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
        </div>
      </form>

      {/* Resultados de búsqueda */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto">
          <div className="p-2">
            <p className="text-xs text-gray-500 mb-2 px-2">Resultados encontrados:</p>
            {searchResults.map((coin) => (
              <div
                key={coin.id}
                onClick={() => handleCoinClick(coin)}
                className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              >
                {coin.thumb && (
                  <img 
                    src={coin.thumb} 
                    alt={coin.name}
                    className="w-6 h-6 rounded-full mr-3"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{coin.name}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                      {coin.symbol.toUpperCase()}
                    </span>
                  </div>
                  {coin.market_cap_rank && (
                    <p className="text-xs text-gray-500">Ranking: #{coin.market_cap_rank}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sin resultados con sugerencias */}
      {showNoResults && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg">
          <div className="p-4">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12c0-4.418-3.582-8-8-8s-8 3.582-8 8c0 2.027.754 3.879 2 5.291" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">No se encontraron resultados</h3>
              <p className="text-xs text-gray-500 mb-4">
                No encontramos "<span className="font-medium">{searchTerm}</span>". 
                Verifica la ortografía o prueba con otro término.
              </p>
            </div>

            {suggestions.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-700 mb-3">Tal vez estás buscando:</p>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {suggestions.map((coin) => (
                    <div
                      key={coin.id}
                      onClick={() => handleCoinClick(coin)}
                      className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    >
                      {coin.thumb && (
                        <img 
                          src={coin.thumb} 
                          alt={coin.name}
                          className="w-5 h-5 rounded-full mr-2"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">{coin.name}</span>
                          <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-medium">
                            {coin.symbol}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
