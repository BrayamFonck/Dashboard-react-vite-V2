import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
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

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError('');

      // Cargar datos en paralelo
      const [globalData, coinsData, trendingData, pieData, historicalData] = await Promise.all([
        coinGeckoService.getGlobalStats(),
        coinGeckoService.getCoins(1, 20),
        coinGeckoService.getTrendingCoins(),
        coinGeckoService.getTopCoinsForPieChart(),
        coinGeckoService.getCoinHistory(selectedCoin, 7)
      ]);

      setGlobalStats(globalData.data);
      setCoins(coinsData);
      setTrendingCoins(trendingData.coins || []);
      setPieChartData(pieData);
      
      // Procesar datos históricos
      const processedHistoricalData = historicalData.prices.map(([timestamp, price]) => ({
        timestamp,
        price: price.toFixed(2)
      }));
      setHistoricalData(processedHistoricalData);

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Error al cargar los datos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    
    try {
      setLoading(true);
      setError('');
      const searchResults = await coinGeckoService.searchCoinsIntelligent(query);
      
      if (searchResults.results.length > 0) {
        // Obtener datos detallados de las monedas encontradas
        const coinIds = searchResults.results.slice(0, 10).map(coin => coin.id);
        const detailedCoins = await Promise.all(
          coinIds.map(id => coinGeckoService.getCoinById(id).catch(() => null))
        );
        
        // Filtrar resultados válidos y formatear para la tabla
        const validCoins = detailedCoins.filter(coin => coin !== null).map(coin => ({
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
          sparkline_in_7d: { price: [] } // Placeholder para sparkline
        }));
        
        setCoins(validCoins);
      }
    } catch (err) {
      console.error('Error en búsqueda:', err);
      setError('Error en la búsqueda. Por favor, intenta de nuevo.');
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
      const historicalData = await coinGeckoService.getCoinHistory(coinId, 7);
      const processedData = historicalData.prices.map(([timestamp, price]) => ({
        timestamp,
        price: price.toFixed(2)
      }));
      setHistoricalData(processedData);
    } catch (err) {
      setError('Error al cargar datos históricos');
    }
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
                <HistoricalChart 
                  data={historicalData}
                  title="Precio Histórico (7 días)"
                  coinName={coins.find(c => c.id === selectedCoin)?.name || 'Bitcoin'}
                />
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
