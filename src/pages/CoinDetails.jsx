import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HistoricalChart from '../components/HistoricalChart';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import coinGeckoService from '../services/coingeckoService';
import { ArrowLeft, TrendingUp, TrendingDown, Globe, Calendar, DollarSign, BarChart3 } from 'lucide-react';

const CoinDetails = () => {
  const { coinId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [coinData, setCoinData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [timeRange, setTimeRange] = useState(7);

  useEffect(() => {
    if (coinId) {
      loadCoinData();
    }
  }, [coinId, timeRange]);

  const loadCoinData = async () => {
    try {
      setLoading(true);
      setError('');

      // Cargar datos de la moneda y datos históricos en paralelo
      const [coinDetails, historical] = await Promise.all([
        coinGeckoService.getCoinById(coinId),
        coinGeckoService.getCoinHistory(coinId, timeRange)
      ]);

      setCoinData(coinDetails);
      
      // Procesar datos históricos
      const processedHistoricalData = historical.prices.map(([timestamp, price]) => ({
        timestamp,
        price: price.toFixed(2)
      }));
      setHistoricalData(processedHistoricalData);

    } catch (err) {
      console.error('Error loading coin data:', err);
      setError('Error al cargar los datos de la moneda. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeRangeChange = (days) => {
    setTimeRange(days);
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

  if (loading) {
    return <Loader message="Cargando detalles de la moneda..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 px-4">
          <ErrorMessage message={error} onClose={() => setError('')} />
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
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
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </button>
          </div>

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
              <HistoricalChart 
                data={historicalData}
                title=""
                coinName={coinData.name}
                showTitle={false}
              />
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
        </div>
      </div>
    </div>
  );
};

export default CoinDetails;
