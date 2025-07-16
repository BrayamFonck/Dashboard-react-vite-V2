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
      const searchResults = await coinGeckoService.searchCoins(query);
      // Aquí podrías implementar la lógica de filtrado
      console.log('Search results:', searchResults);
    } catch (err) {
      setError('Error en la búsqueda');
    } finally {
      setLoading(false);
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
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Dashboard de Criptomonedas
              </h1>
              <p className="text-gray-600">
                Bienvenido de vuelta, <strong>{user?.fullName}</strong>
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <button
                onClick={refreshData}
                disabled={refreshing}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>{refreshing ? 'Actualizando...' : 'Actualizar'}</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6">
              <ErrorMessage message={error} onClose={() => setError('')} />
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Buscar criptomonedas..."
            />
          </div>

          {/* Stats Cards */}
          {globalStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          )}

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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

          {/* Second Row */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {/* Trending Coins */}
            <div className="lg:col-span-1">
              <TrendingCoins coins={trendingCoins} />
            </div>
            
            {/* Main Table */}
            <div className="lg:col-span-3">
              <CoinTable 
                coins={coins}
                loading={loading}
                onCoinSelect={handleCoinSelect}
              />
            </div>
          </div>

          {/* Quick Actions for Admin */}
          {user?.role === 'admin' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Panel de Administrador</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <h4 className="font-semibold text-gray-800">Gestionar Usuarios</h4>
                  <p className="text-sm text-gray-600">Administrar cuentas de usuario</p>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
                  <h4 className="font-semibold text-gray-800">Configuración API</h4>
                  <p className="text-sm text-gray-600">Configurar conexiones de datos</p>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors">
                  <h4 className="font-semibold text-gray-800">Reportes</h4>
                  <p className="text-sm text-gray-600">Generar informes detallados</p>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
