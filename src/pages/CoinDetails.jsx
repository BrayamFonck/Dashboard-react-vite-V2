import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HistoricalChart from '../components/HistoricalChart';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import coinGeckoService from '../services/coingeckoService';
import { ArrowLeft, TrendingUp, TrendingDown, Globe, Calendar, DollarSign, BarChart3, RefreshCw } from 'lucide-react';

const CoinDetails = () => {
  const { coinId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [coinData, setCoinData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [timeRange, setTimeRange] = useState(7);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  const [lastDataUpdate, setLastDataUpdate] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (coinId) {
      loadCoinData();
    }
  }, [coinId, timeRange]);

  const loadCoinData = async () => {
    try {
      setLoading(true);
      setError('');
      setUsingFallbackData(false);

      console.log(`🚀 Loading data for coin: ${coinId}`);

      // Intentar cargar datos frescos
      const [coinDetails, historical] = await Promise.all([
        coinGeckoService.getCoinById(coinId).catch(async (error) => {
          console.error(`❌ Error loading coin details for ${coinId}:`, error.message);
          
          // Intentar obtener datos de cache persistente
          const fallbackKey = coinGeckoService.getCacheKey('coinById', { id: coinId });
          const fallbackCached = coinGeckoService.persistentCache.get(fallbackKey);
          
          if (fallbackCached && (Date.now() - fallbackCached.timestamp) < coinGeckoService.fallbackCacheTimeout) {
            console.warn(`🔄 Using fallback cache data for coin ${coinId} (age: ${Math.floor((Date.now() - fallbackCached.timestamp) / 1000)}s)`);
            setUsingFallbackData(true);
            return fallbackCached.data;
          }
          
          throw error;
        }),
        coinGeckoService.getCoinHistory(coinId, timeRange).catch(async (error) => {
          console.error(`❌ Error loading historical data for ${coinId}:`, error.message);
          
          // Intentar obtener datos históricos de cache persistente
          const fallbackKey = coinGeckoService.getCacheKey('history', { coinId, days: timeRange });
          const fallbackCached = coinGeckoService.persistentCache.get(fallbackKey);
          
          if (fallbackCached && (Date.now() - fallbackCached.timestamp) < coinGeckoService.fallbackCacheTimeout) {
            console.warn(`🔄 Using fallback cache data for historical ${coinId} (age: ${Math.floor((Date.now() - fallbackCached.timestamp) / 1000)}s)`);
            if (!usingFallbackData) setUsingFallbackData(true);
            return fallbackCached.data;
          }
          
          // Si no hay datos históricos, devolver estructura vacía para no romper la interfaz
          return { prices: [] };
        })
      ]);

      setCoinData(coinDetails);
      
      // Procesar datos históricos
      if (historical && historical.prices && historical.prices.length > 0) {
        const processedHistoricalData = historical.prices.map(([timestamp, price]) => ({
          timestamp,
          price: price.toFixed(2)
        }));
        setHistoricalData(processedHistoricalData);
      } else {
        setHistoricalData([]);
      }

      setLastDataUpdate(new Date());

      // Limpiar errores si la carga fue exitosa
      if (!usingFallbackData) {
        console.log(`✅ Fresh data loaded successfully for ${coinId}`);
      } else {
        setError(`Mostrando datos guardados para ${coinDetails.name}. La información puede no estar actualizada.`);
        console.warn(`⚠️ Loaded ${coinId} with fallback data`);
      }

    } catch (err) {
      console.error(`💥 Critical error loading coin data for ${coinId}:`, {
        error: err.message,
        stack: err.stack,
        coinId,
        timeRange
      });

      // Solo mostrar error si no tenemos datos previos
      if (!coinData) {
        setError('Error al cargar los datos de la moneda. Por favor, intenta de nuevo.');
      } else {
        // Si ya tenemos datos, solo mostrar warning
        setError('No se pudieron actualizar los datos. Mostrando información anterior.');
        console.warn(`⚠️ Keeping previous data for ${coinId} due to error`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTimeRangeChange = (days) => {
    setTimeRange(days);
  };

  const refreshData = async () => {
    setRefreshing(true);
    setError(''); // Limpiar errores previos
    
    try {
      console.log(`🔄 Manual refresh initiated for ${coinId}`);
      
      // Limpiar solo cache normal para obtener datos frescos, pero mantener fallback
      coinGeckoService.cleanExpiredCache();
      
      await loadCoinData();
      
      if (!error && !usingFallbackData) {
        console.log(`✅ Manual refresh completed successfully for ${coinId}`);
      }
      
    } catch (err) {
      console.error(`Error during manual refresh for ${coinId}:`, err);
      setError('Error al actualizar los datos. Mostrando información disponible.');
    } finally {
      setRefreshing(false);
    }
  };

  const formatPrice = (price) => {
    if (price >= 1) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  const formatPercentage = (percentage) => {
    if (!percentage) return 'N/A';
    const isPositive = percentage >= 0;
    return (
      <span className={`inline-flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
        {isPositive ? '+' : ''}{percentage.toFixed(2)}%
      </span>
    );
  };

  if (loading && !coinData) {
    return <Loader message="Cargando detalles de la moneda..." />;
  }

  if (error && !coinData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 px-4">
          <ErrorMessage message={error} onClose={() => setError('')} />
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </button>
            <button
              onClick={loadCoinData}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!coinData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 px-4 text-center">
          <p className="text-gray-600">No se encontraron datos para esta moneda.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  const marketData = coinData.market_data;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header con botón de regreso */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Dashboard
              </button>

              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                {/* Indicador de estado de datos */}
                {usingFallbackData && (
                  <div className="flex items-center space-x-2 text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                    <span>Datos guardados - Puede no estar actualizado</span>
                  </div>
                )}
                {lastDataUpdate && !usingFallbackData && (
                  <div className="flex items-center space-x-2 text-sm text-green-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Actualizado: {lastDataUpdate.toLocaleTimeString()}</span>
                  </div>
                )}

                {/* Botón de actualizar */}
                <button
                  onClick={refreshData}
                  disabled={refreshing}
                  className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
                  aria-label={refreshing ? 'Actualizando datos' : 'Actualizar datos de la moneda'}
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} aria-hidden="true" />
                  <span>{refreshing ? 'Actualizando...' : 'Actualizar'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mensaje de error no crítico */}
          {error && coinData && (
            <div className="mb-6" role="alert" aria-live="polite">
              <ErrorMessage message={error} onClose={() => setError('')} />
            </div>
          )}

          {/* Información principal de la moneda */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
              <div className="flex items-center mb-4 sm:mb-0">
                <img 
                  src={coinData.image.large} 
                  alt={coinData.name}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{coinData.name}</h1>
                  <p className="text-lg text-gray-600 uppercase">{coinData.symbol}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      Ranking #{coinData.market_cap_rank || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  {formatPrice(marketData.current_price.usd)}
                </div>
                <div className="text-lg">
                  {formatPercentage(marketData.price_change_percentage_24h)}
                </div>
              </div>
            </div>

            {/* Estadísticas clave */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Cap. de Mercado</span>
                </div>
                <p className="text-lg font-semibold text-gray-800">
                  ${coinGeckoService.formatNumber(marketData.market_cap.usd)}
                </p>
                <p className="text-sm text-gray-500">
                  {formatPercentage(marketData.market_cap_change_percentage_24h)}
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <BarChart3 className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Volumen 24h</span>
                </div>
                <p className="text-lg font-semibold text-gray-800">
                  ${coinGeckoService.formatNumber(marketData.total_volume.usd)}
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Máximo 24h</span>
                </div>
                <p className="text-lg font-semibold text-gray-800">
                  {formatPrice(marketData.high_24h.usd)}
                </p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <TrendingDown className="w-5 h-5 text-orange-600 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Mínimo 24h</span>
                </div>
                <p className="text-lg font-semibold text-gray-800">
                  {formatPrice(marketData.low_24h.usd)}
                </p>
              </div>
            </div>

            {/* Información adicional */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">Información del Mercado</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Suministro Circulante:</span>
                    <span className="font-medium">
                      {marketData.circulating_supply ? 
                        coinGeckoService.formatNumber(marketData.circulating_supply) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Suministro Total:</span>
                    <span className="font-medium">
                      {marketData.total_supply ? 
                        coinGeckoService.formatNumber(marketData.total_supply) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ATH:</span>
                    <span className="font-medium text-green-600">
                      {formatPrice(marketData.ath.usd)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">Cambios de Precio</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">1 hora:</span>
                    {formatPercentage(marketData.price_change_percentage_1h_in_currency?.usd)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">7 días:</span>
                    {formatPercentage(marketData.price_change_percentage_7d)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">30 días:</span>
                    {formatPercentage(marketData.price_change_percentage_30d)}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">Enlaces</h3>
                <div className="space-y-2">
                  {coinData.links.homepage[0] && (
                    <a 
                      href={coinData.links.homepage[0]} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Sitio Web Oficial
                    </a>
                  )}
                  {coinData.links.blockchain_site[0] && (
                    <a 
                      href={coinData.links.blockchain_site[0]} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Explorador Blockchain
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico Histórico */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 sm:mb-0">
                Precio Histórico de {coinData.name}
              </h2>
              
              {/* Selector de rango de tiempo */}
              <div className="flex space-x-2">
                {[1, 7, 30, 90, 365].map((days) => (
                  <button
                    key={days}
                    onClick={() => handleTimeRangeChange(days)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      timeRange === days
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {days === 1 ? '1D' : days === 7 ? '7D' : days === 30 ? '1M' : days === 90 ? '3M' : '1Y'}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-96">
              {historicalData && historicalData.length > 0 ? (
                <HistoricalChart 
                  data={historicalData}
                  title=""
                  coinName={coinData.name}
                  showTitle={false}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium">No hay datos históricos disponibles</p>
                    <p className="text-gray-400 text-sm mt-2">
                      Los datos del gráfico no pudieron cargarse para el período seleccionado
                    </p>
                    <button
                      onClick={refreshData}
                      className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reintentar carga de gráfico
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Descripción */}
          {coinData.description.en && (
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Acerca de {coinData.name}</h2>
              <div 
                className="text-gray-700 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: coinData.description.en.split('.')[0] + '.' 
                }}
              />
            </div>
          )}

          {/* Información sobre datos de fallback */}
          {usingFallbackData && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <span className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                  </span>
                </div>
                <div>
                  <h3 className="text-amber-800 font-medium">Información sobre los datos mostrados</h3>
                  <p className="text-amber-700 text-sm mt-1">
                    Los datos mostrados fueron obtenidos de cache local debido a limitaciones temporales de la API. 
                    La información puede no reflejar los valores más recientes del mercado. 
                    Intenta actualizar en unos minutos para obtener datos frescos.
                  </p>
                  <button
                    onClick={refreshData}
                    disabled={refreshing}
                    className="mt-3 inline-flex items-center px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
                    {refreshing ? 'Actualizando...' : 'Intentar actualizar ahora'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoinDetails;
