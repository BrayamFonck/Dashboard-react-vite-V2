import React from 'react';
import { TrendingUp, TrendingDown, Star, ExternalLink } from 'lucide-react';

const CoinTable = ({ coins = [], loading = false }) => {
  if (loading) {
    return (
      <div 
        className="bg-white rounded-xl shadow-lg p-4 sm:p-6"
        role="status"
        aria-label="Cargando datos de criptomonedas"
      >
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 mb-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/6"></div>
              </div>
              <div className="w-20 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!coins.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center">
        <p className="text-gray-500">No hay monedas para mostrar</p>
      </div>
    );
  }

  const formatNumber = (num) => {
    if (num >= 1e12) {
      return (num / 1e12).toFixed(2) + 'T';
    } else if (num >= 1e9) {
      return (num / 1e9).toFixed(2) + 'B';
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(2) + 'M';
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(2) + 'K';
    }
    return num?.toFixed(2) || '0';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
          Top Criptomonedas
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Ordenadas por capitalización de mercado
        </p>
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden">
        {coins.slice(0, 10).map((coin, index) => (
          <div
            key={coin.id}
            className="p-4 border-b border-gray-100 last:border-b-0"
            role="article"
            aria-labelledby={`coin-${coin.id}-name`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <span 
                  className="text-sm font-semibold text-gray-500 w-6 text-center flex-shrink-0"
                  aria-label={`Posición ${coin.market_cap_rank || index + 1}`}
                >
                  {coin.market_cap_rank || index + 1}
                </span>
                <img
                  src={coin.image}
                  alt={`Logo de ${coin.name}`}
                  className="w-8 h-8 rounded-full flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h3 
                    id={`coin-${coin.id}-name`}
                    className="font-semibold text-gray-900 truncate"
                  >
                    {coin.name}
                  </h3>
                  <p className="text-sm text-gray-500 uppercase truncate">
                    {coin.symbol}
                  </p>
                </div>
              </div>
              <button 
                className="p-1 text-gray-400 hover:text-yellow-500 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 rounded"
                aria-label={`Agregar ${coin.name} a favoritos`}
              >
                <Star className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Precio</p>
                <p className="font-semibold text-gray-900">
                  ${coin.current_price?.toLocaleString() || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">24h</p>
                <div className="flex items-center space-x-1">
                  {(coin.price_change_percentage_24h || 0) >= 0 ? (
                    <TrendingUp className="w-3 h-3 text-green-500" aria-hidden="true" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" aria-hidden="true" />
                  )}
                  <span 
                    className={`font-semibold ${
                      (coin.price_change_percentage_24h || 0) >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                    aria-label={`Cambio de precio de ${coin.price_change_percentage_24h?.toFixed(2) || 0}%`}
                  >
                    {(coin.price_change_percentage_24h || 0) >= 0 ? '+' : ''}
                    {coin.price_change_percentage_24h?.toFixed(2) || '0.00'}%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Cap. Mercado</p>
                <p className="font-semibold text-gray-900">
                  ${formatNumber(coin.market_cap)}
                </p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Volumen 24h</p>
                <p className="font-semibold text-gray-900">
                  ${formatNumber(coin.total_volume)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200" role="table">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                scope="col"
              >
                #
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                scope="col"
              >
                Moneda
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                scope="col"
              >
                Precio
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                scope="col"
              >
                1h
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                scope="col"
              >
                24h
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                scope="col"
              >
                7d
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                scope="col"
              >
                Cap. Mercado
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                scope="col"
              >
                Volumen 24h
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                scope="col"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {coins.map((coin, index) => (
              <tr 
                key={coin.id} 
                className="hover:bg-gray-50 transition-colors duration-150 focus-within:bg-gray-50"
                role="row"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {coin.market_cap_rank || index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img 
                      className="h-8 w-8 rounded-full" 
                      src={coin.image} 
                      alt={`Logo de ${coin.name}`} 
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{coin.name}</div>
                      <div className="text-sm text-gray-500">{coin.symbol?.toUpperCase()}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${coin.current_price?.toLocaleString() || '0'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className={`flex items-center ${
                    (coin.price_change_percentage_1h_in_currency || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {(coin.price_change_percentage_1h_in_currency || 0) >= 0 ? (
                      <TrendingUp className="w-3 h-3 mr-1" aria-hidden="true" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" aria-hidden="true" />
                    )}
                    <span 
                      aria-label={`Cambio de precio en 1 hora: ${coin.price_change_percentage_1h_in_currency?.toFixed(2) || 0}%`}
                    >
                      {(coin.price_change_percentage_1h_in_currency || 0) >= 0 ? '+' : ''}
                      {coin.price_change_percentage_1h_in_currency?.toFixed(2) || '0'}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className={`flex items-center ${
                    (coin.price_change_percentage_24h || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {(coin.price_change_percentage_24h || 0) >= 0 ? (
                      <TrendingUp className="w-3 h-3 mr-1" aria-hidden="true" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" aria-hidden="true" />
                    )}
                    <span 
                      aria-label={`Cambio de precio en 24 horas: ${coin.price_change_percentage_24h?.toFixed(2) || 0}%`}
                    >
                      {(coin.price_change_percentage_24h || 0) >= 0 ? '+' : ''}
                      {coin.price_change_percentage_24h?.toFixed(2) || '0'}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className={`flex items-center ${
                    (coin.price_change_percentage_7d_in_currency || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {(coin.price_change_percentage_7d_in_currency || 0) >= 0 ? (
                      <TrendingUp className="w-3 h-3 mr-1" aria-hidden="true" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" aria-hidden="true" />
                    )}
                    <span 
                      aria-label={`Cambio de precio en 7 días: ${coin.price_change_percentage_7d_in_currency?.toFixed(2) || 0}%`}
                    >
                      {(coin.price_change_percentage_7d_in_currency || 0) >= 0 ? '+' : ''}
                      {coin.price_change_percentage_7d_in_currency?.toFixed(2) || '0'}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${formatNumber(coin.market_cap)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${formatNumber(coin.total_volume)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <button 
                      className="p-1 text-gray-400 hover:text-yellow-500 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 rounded"
                      aria-label={`Agregar ${coin.name} a favoritos`}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-1 text-gray-400 hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                      aria-label={`Ver detalles de ${coin.name}`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 sm:px-6 bg-gray-50 border-t border-gray-200">
        <p className="text-xs sm:text-sm text-gray-500 text-center">
          Datos actualizados en tiempo real desde CoinGecko
        </p>
      </div>
    </div>
  );
};

export default CoinTable;
