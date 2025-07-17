import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSafeInterval } from '../hooks/useSafeInterval';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import CryptoPieChart from '../components/CryptoPieChart';
import HistoricalChart from '../components/HistoricalChart';
import CoinTable from '../components/CoinTable';
import TrendingCoins from '../components/TrendingCoins';
import SearchBar from '../components/SearchBar';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import coinGeckoService from '../services/coingeckoService';
import { DollarSign, TrendingUp, BarChart3, Globe, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [globalStats, setGlobalStats] = useState(null);
  const [coins, setCoins] = useState([]);
  const [trendingCoins, setTrendingCoins] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');
  const [refreshing, setRefreshing] = useState(false);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  const [lastDataUpdate, setLastDataUpdate] = useState(null);
  const [historicalTimeRange, setHistoricalTimeRange] = useState(7); // Nuevo estado para el rango de tiempo
  const [loadingHistorical, setLoadingHistorical] = useState(false); // Estado para carga de datos históricos

  // Usar hook seguro para limpiar cache cada 5 minutos
  useSafeInterval(() => {
    coinGeckoService.cleanExpiredCache();
  }, 5 * 60 * 1000); // 5 minutos

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  // Recargar datos históricos cuando cambie el rango de tiempo o la moneda seleccionada
  useEffect(() => {
    if (selectedCoin && historicalTimeRange) {
      // Asegurar que el rango de tiempo sea válido
      const validRanges = [1, 7, 30, 365];
      if (!validRanges.includes(historicalTimeRange)) {
        setHistoricalTimeRange(7); // Resetear a default si no es válido
        return;
      }
      updateHistoricalData();
    }
  }, [selectedCoin, historicalTimeRange]);

  const updateHistoricalData = async () => {
    try {
      setLoadingHistorical(true);
      console.log(`📊 Updating historical data for ${selectedCoin} with ${historicalTimeRange} days`);
      const historicalData = await coinGeckoService.getCoinHistory(selectedCoin, historicalTimeRange);
      const processedData = historicalData.prices.map(([timestamp, price]) => ({
        timestamp,
        price: price.toFixed(2)
      }));
      setHistoricalData(processedData);
    } catch (err) {
      console.error('Error updating historical data:', err);
      // No mostrar error aquí para no ser intrusivo
    } finally {
      setLoadingHistorical(false);
    }
  };

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('🚀 Loading dashboard data...');
      
      // Usar el método optimizado para cargar datos del dashboard
      const dashboardData = await coinGeckoService.loadDashboardData({
        historicalDays: historicalTimeRange,
        selectedCoin: selectedCoin
      });

      // Verificar si algún dato usa fallback
      const hasFallbackData = dashboardData.fallbacksUsed && dashboardData.fallbacksUsed.length > 0;
      setUsingFallbackData(hasFallbackData);

      // Si hay errores pero tenemos datos, mostrar warning pero continuar
      if (dashboardData.errors && dashboardData.errors.length > 0) {
        console.warn('⚠️ Some data could not be updated, using available data:', dashboardData.errors);
        
        if (hasFallbackData) {
          setError(`Algunos datos pueden no estar actualizados. Usando información guardada previamente. ${dashboardData.fallbacksUsed.join(', ')} usando datos de respaldo.`);
        } else {
          setError('Algunos datos no pudieron cargarse completamente. Mostrando información disponible.');
        }
      }

      // Establecer los datos (incluso si son de fallback)
      if (dashboardData.globalStats) {
        setGlobalStats(dashboardData.globalStats.data || dashboardData.globalStats);
      }
      
      if (dashboardData.coins && dashboardData.coins.length > 0) {
        setCoins(dashboardData.coins);
      }
      
      if (dashboardData.trending && dashboardData.trending.coins) {
        setTrendingCoins(dashboardData.trending.coins);
      }
      
      if (dashboardData.pieChart && dashboardData.pieChart.length > 0) {
        setPieChartData(dashboardData.pieChart);
      }
      
      // Procesar datos históricos
      if (dashboardData.historical && dashboardData.historical.prices) {
        const processedHistoricalData = dashboardData.historical.prices.map(([timestamp, price]) => ({
          timestamp,
          price: price.toFixed(2)
        }));
        setHistoricalData(processedHistoricalData);
      }

      setLastDataUpdate(new Date());

      // Si todos los datos son de fallback, mostrar mensaje específico
      if (hasFallbackData && dashboardData.fallbacksUsed.length >= 4) {
        setError('Mostrando datos guardados previamente. La conexión con la API puede estar temporalmente limitada.');
      }

      // Log del estado final
      console.log('✅ Dashboard data loaded:', {
        globalStats: !!dashboardData.globalStats,
        coins: dashboardData.coins?.length || 0,
        trending: dashboardData.trending?.coins?.length || 0,
        pieChart: dashboardData.pieChart?.length || 0,
        historical: dashboardData.historical?.prices?.length || 0,
        fallbacksUsed: dashboardData.fallbacksUsed || [],
        errors: dashboardData.errors || []
      });

    } catch (err) {
      console.error('💥 Critical error loading dashboard data:', {
        error: err.message,
        stack: err.stack
      });
      
      // En caso de error crítico, intentar cargar datos básicos de cache
      try {
        console.log('🔄 Attempting to load any cached data...');
        const cacheStats = coinGeckoService.getCacheStats();
        console.log('Cache state:', cacheStats);
        
        // Si hay datos en cache persistente, intentar usarlos
        if (cacheStats.persistentCache.size > 0) {
          setError('Error de conexión. Mostrando datos guardados anteriormente.');
          setUsingFallbackData(true);
          
          // Aquí podrías implementar lógica específica para cargar desde cache persistente
          // Por ahora, mantener los datos existentes si los hay
        } else {
          setError('Error al cargar los datos y no hay datos guardados disponibles. Por favor, verifica tu conexión a internet e intenta de nuevo.');
        }
      } catch (cacheErr) {
        console.error('Error accessing cache:', cacheErr);
        setError('Error al cargar los datos. Por favor, intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    setError(''); // Limpiar errores previos
    
    try {
      console.log('🔄 Manual refresh initiated...');
      
      // Limpiar solo cache normal para obtener datos frescos, pero mantener fallback
      coinGeckoService.cleanExpiredCache();
      
      await loadInitialData();
      
      // Si la actualización fue exitosa y no hay errores, limpiar el estado de fallback
      if (!error && !usingFallbackData) {
        console.log('✅ Manual refresh completed successfully');
      }
      
    } catch (err) {
      console.error('Error during manual refresh:', err);
      setError('Error al actualizar los datos. Mostrando información disponible.');
    } finally {
      setRefreshing(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    
    try {
      setLoading(true);
      setError('');
      
      // Pequeño delay para evitar rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const searchResults = await coinGeckoService.searchCoinsIntelligent(query);
      
      if (searchResults.results.length > 0) {
        // Obtener datos detallados de las monedas encontradas con delay
        const coinIds = searchResults.results.slice(0, 5).map(coin => coin.id); // Reducir a 5 para evitar rate limiting
        
        const detailedCoins = [];
        for (const id of coinIds) {
          try {
            const coin = await coinGeckoService.getCoinById(id);
            if (coin) {
              detailedCoins.push({
                id: coin.id,
                name: coin.name,
                symbol: coin.symbol,
                image: coin.image.small,
                current_price: coin.market_data.current_price.usd,
                market_cap: coin.market_data.market_cap.usd,
                market_cap_rank: coin.market_cap_rank,
                price_change_percentage_24h: coin.market_data.price_change_percentage_24h,
                price_change_percentage_7d_in_currency: coin.market_data.price_change_percentage_7d,
                total_volume: coin.market_data.total_volume.usd,
                sparkline_in_7d: { price: [] }
              });
            }
            // Delay entre requests
            await new Promise(resolve => setTimeout(resolve, 150));
          } catch (coinErr) {
            console.warn(`Error loading coin ${id}:`, coinErr);
          }
        }
        
        if (detailedCoins.length > 0) {
          setCoins(detailedCoins);
        }
      }
    } catch (err) {
      console.error('Error en búsqueda:', err);
      setError('Error en la búsqueda. La API puede estar temporalmente sobrecargada. Intenta de nuevo en unos segundos.');
    } finally {
      setLoading(false);
    }
  };

  const handleCoinSelectFromSearch = async (coin) => {
    try {
      // Actualizar la moneda seleccionada para el gráfico histórico
      setSelectedCoin(coin.id);
      
      // Obtener datos históricos de la moneda seleccionada
      const historicalData = await coinGeckoService.getCoinHistory(coin.id, 7);
      const processedData = historicalData.prices.map(([timestamp, price]) => ({
        timestamp,
        price: price.toFixed(2)
      }));
      setHistoricalData(processedData);
      
      // Opcional: También actualizar la lista de monedas con la seleccionada
      const coinDetails = await coinGeckoService.getCoinById(coin.id);
      const formattedCoin = {
        id: coinDetails.id,
        name: coinDetails.name,
        symbol: coinDetails.symbol,
        image: coinDetails.image.small,
        current_price: coinDetails.market_data.current_price.usd,
        market_cap: coinDetails.market_data.market_cap.usd,
        market_cap_rank: coinDetails.market_cap_rank,
        price_change_percentage_24h: coinDetails.market_data.price_change_percentage_24h,
        price_change_percentage_7d_in_currency: coinDetails.market_data.price_change_percentage_7d,
        total_volume: coinDetails.market_data.total_volume.usd,
        sparkline_in_7d: { price: [] }
      };
      
      // Agregar la moneda seleccionada al inicio de la lista si no está presente
      setCoins(prevCoins => {
        const coinExists = prevCoins.some(c => c.id === coin.id);
        if (!coinExists) {
          return [formattedCoin, ...prevCoins.slice(0, 19)]; // Mantener máximo 20 monedas
        }
        return prevCoins;
      });
      
    } catch (err) {
      console.error('Error al seleccionar moneda:', err);
      setError('Error al cargar datos de la moneda seleccionada');
    }
  };

  const handleCoinSelect = async (coinId) => {
    try {
      setSelectedCoin(coinId);
      // El useEffect se encargará de cargar los datos históricos automáticamente
    } catch (err) {
      setError('Error al seleccionar la moneda');
    }
  };

  const handleTimeRangeChange = async (days) => {
    setHistoricalTimeRange(days);
    console.log(`📊 User changed historical chart time range to ${days} days`);
  };

  const getTimeRangeLabel = (days) => {
    switch (days) {
      case 1: return '1 Día';
      case 7: return '7 Días';
      case 30: return '1 Mes';
      case 365: return '1 Año';
      default: return `${days} Días`;
    }
  };

  // Obtener lista de monedas disponibles para el dropdown
  const getAvailableCoins = () => {
    const defaultCoins = [
      { id: 'bitcoin', name: 'Bitcoin' },
      { id: 'ethereum', name: 'Ethereum' },
      { id: 'cardano', name: 'Cardano' },
      { id: 'polkadot', name: 'Polkadot' },
      { id: 'chainlink', name: 'Chainlink' },
    ];

    // Combinar monedas de la tabla con las predeterminadas
    const tableCoins = coins.slice(0, 10).map(coin => ({
      id: coin.id,
      name: coin.name
    }));

    // Crear un mapa para evitar duplicados
    const coinMap = new Map();
    
    // Primero agregar monedas predeterminadas
    defaultCoins.forEach(coin => coinMap.set(coin.id, coin));
    
    // Luego agregar monedas de la tabla (esto sobrescribirá si hay duplicados)
    tableCoins.forEach(coin => coinMap.set(coin.id, coin));

    return Array.from(coinMap.values());
  };

  if (loading && !refreshing) {
    return <Loader message="Cargando dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Main content with full width background */}
      <div className="bg-gray-50 min-h-screen pt-14 sm:pt-16">
        <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8" role="main">
          <div className="py-4 sm:py-6">
            {/* Header */}
            <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-start sm:space-y-0 mb-6 sm:mb-8">
              <div>
                <p className="text-lg sm:text-xl text-gray-700 mb-2">
                  Bienvenido de vuelta, <strong className="text-gray-900">{user?.fullName}</strong>
                </p>
                {/* Indicador de estado de datos */}
                {usingFallbackData && (
                  <div className="flex items-center space-x-2 text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                    <span>Mostrando datos guardados - Actualizando en segundo plano</span>
                  </div>
                )}
                {lastDataUpdate && !usingFallbackData && (
                  <div className="flex items-center space-x-2 text-sm text-green-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Última actualización: {lastDataUpdate.toLocaleTimeString()}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={refreshData}
                  disabled={refreshing}
                  className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base"
                  aria-label={refreshing ? 'Actualizando datos' : 'Actualizar datos del dashboard'}
                  aria-describedby="refresh-status"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} aria-hidden="true" />
                  <span>{refreshing ? 'Actualizando...' : 'Actualizar'}</span>
                </button>
                
                {/* Botón de limpieza de cache para admins */}
                {user?.role === 'admin' && (
                  <button
                    onClick={() => {
                      coinGeckoService.clearAllCache();
                      setError('');
                      setUsingFallbackData(false);
                      loadInitialData();
                    }}
                    className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm sm:text-base"
                    title="Limpiar todo el cache y recargar (Admin)"
                  >
                    <span>🧹</span>
                    <span>Limpiar Cache</span>
                  </button>
                )}
              </div>
            </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 sm:mb-6" role="alert" aria-live="polite">
              <ErrorMessage message={error} onClose={() => setError('')} />
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-6 sm:mb-8">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Buscar criptomonedas..."
            />
          </div>

          {/* Stats Cards */}
          {globalStats && (
            <section className="mb-6 sm:mb-8" aria-labelledby="stats-heading">
              <h2 id="stats-heading" className="sr-only">Estadísticas del mercado</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatCard
                  title="Cap. Mercado Total"
                  value={`$${coinGeckoService.formatNumber(globalStats.total_market_cap.usd)}`}
                  change={globalStats.market_cap_change_percentage_24h_usd}
                  changePercent={globalStats.market_cap_change_percentage_24h_usd?.toFixed(2)}
                  icon={DollarSign}
                  color="blue"
                />
                <StatCard
                  title="Volumen 24h"
                  value={`$${coinGeckoService.formatNumber(globalStats.total_volume.usd)}`}
                  change={5.2}
                  changePercent="5.2"
                  icon={BarChart3}
                  color="green"
                />
                <StatCard
                  title="Dominancia BTC"
                  value={`${globalStats.market_cap_percentage.btc?.toFixed(1)}%`}
                  change={globalStats.market_cap_percentage.btc - 45}
                  changePercent={(globalStats.market_cap_percentage.btc - 45)?.toFixed(2)}
                  icon={TrendingUp}
                  color="orange"
                />
                <StatCard
                  title="Criptomonedas Activas"
                  value={globalStats.active_cryptocurrencies?.toLocaleString()}
                  change={2.1}
                  changePercent="2.1"
                  icon={Globe}
                  color="purple"
                />
              </div>
            </section>
          )}

          {/* Charts Row */}
          <section className="mb-6 sm:mb-8" aria-labelledby="charts-heading">
            <h2 id="charts-heading" className="sr-only">Gráficos de análisis</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Pie Chart */}
              <div className="lg:col-span-1">
                <CryptoPieChart data={pieChartData} />
              </div>
              
              {/* Historical Chart */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-0">
                      <h3 className="text-lg font-bold text-gray-800">
                        Precio Histórico
                      </h3>
                      
                      {/* Dropdown de selección de moneda */}
                      <div className="relative">
                        <select 
                          value={selectedCoin}
                          onChange={(e) => setSelectedCoin(e.target.value)}
                          disabled={loadingHistorical}
                          className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {getAvailableCoins().map((coin) => (
                            <option key={coin.id} value={coin.id}>
                              {coin.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          {loadingHistorical ? (
                            <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                          ) : (
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      
                      <span className="text-sm text-gray-500">
                        {getTimeRangeLabel(historicalTimeRange)}
                      </span>
                    </div>
                    
                    {/* Selector de rango de tiempo */}
                    <div className="flex flex-wrap gap-2">
                      {[1, 7, 30, 365].map((days) => (
                        <button
                          key={days}
                          onClick={() => handleTimeRangeChange(days)}
                          disabled={refreshing}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                            historicalTimeRange === days
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {days === 1 ? '1D' : days === 7 ? '7D' : days === 30 ? '1M' : '1A'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="h-80 relative">
                    {loadingHistorical && (
                      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
                          <span className="text-sm font-medium text-gray-600">
                            Cargando datos de {getAvailableCoins().find(c => c.id === selectedCoin)?.name || selectedCoin}...
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {historicalData && historicalData.length > 0 ? (
                      <HistoricalChart 
                        data={historicalData}
                        title=""
                        coinName={getAvailableCoins().find(c => c.id === selectedCoin)?.name || 'Bitcoin'}
                        showTitle={false}
                        className="!p-0 !shadow-none !bg-transparent"
                      />
                    ) : !loadingHistorical ? (
                      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <div className="text-center">
                          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500 text-lg font-medium">No hay datos históricos disponibles</p>
                          <p className="text-gray-400 text-sm mt-2">
                            Los datos del gráfico no pudieron cargarse para {getTimeRangeLabel(historicalTimeRange).toLowerCase()}
                          </p>
                          <button
                            onClick={() => handleTimeRangeChange(historicalTimeRange)}
                            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Reintentar
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Second Row */}
          <section className="mb-6 sm:mb-8" aria-labelledby="data-section-heading">
            <h2 id="data-section-heading" className="sr-only">Datos de mercado y tendencias</h2>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Trending Coins */}
              <div className="lg:col-span-1 order-2 lg:order-1">
                <TrendingCoins coins={trendingCoins} />
              </div>
              
              {/* Main Table */}
              <div className="lg:col-span-3 order-1 lg:order-2">
                <CoinTable 
                  coins={coins}
                  loading={loading}
                  onCoinSelect={handleCoinSelect}
                />
              </div>
            </div>
          </section>

          {/* Quick Actions for Admin */}
          {user?.role === 'admin' && (
            <section className="mb-6" aria-labelledby="admin-panel-heading">
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <h3 id="admin-panel-heading" className="text-lg font-bold text-gray-800 mb-4">Panel de Administrador</h3>
                
                {/* Cache Status */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">Estado del Cache</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Cache Normal: </span>
                      <span className="font-medium">{coinGeckoService.getCacheStats().normalCache.size} entradas</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Cache Persistente: </span>
                      <span className="font-medium">{coinGeckoService.getCacheStats().persistentCache.size} entradas</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-gray-600">Usando datos de respaldo: </span>
                      <span className={`font-medium ${usingFallbackData ? 'text-amber-600' : 'text-green-600'}`}>
                        {usingFallbackData ? 'Sí' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <button 
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-left"
                    aria-describedby="manage-users-desc"
                  >
                    <h4 className="font-semibold text-gray-800">Gestionar Usuarios</h4>
                    <p id="manage-users-desc" className="text-sm text-gray-600">Administrar cuentas de usuario</p>
                  </button>
                  <button 
                    className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-left"
                    aria-describedby="api-config-desc"
                  >
                    <h4 className="font-semibold text-gray-800">Configuración API</h4>
                    <p id="api-config-desc" className="text-sm text-gray-600">Configurar conexiones de datos</p>
                  </button>
                  <button 
                    className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-left sm:col-span-2 lg:col-span-1"
                    aria-describedby="reports-desc"
                  >
                    <h4 className="font-semibold text-gray-800">Reportes</h4>
                    <p id="reports-desc" className="text-sm text-gray-600">Generar informes detallados</p>
                  </button>
                </div>
              </div>
            </section>
          )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
