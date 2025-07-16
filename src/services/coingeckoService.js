// Servicio para consumir la API de CoinGecko
class CoinGeckoService {
  constructor() {
    this.baseURL = 'https://api.coingecko.com/api/v3';
    this.cache = new Map();
    this.persistentCache = new Map(); // Cache para datos de respaldo
    this.cacheTimeout = 60000; // 1 minuto de cache normal
    this.fallbackCacheTimeout = 24 * 60 * 60 * 1000; // 24 horas para cache de respaldo
    this.requestQueue = [];
    this.isProcessingQueue = false;
    this.lastRequestTime = 0;
    this.minRequestInterval = 100; // 100ms entre requests
    this.maxRetries = 3; // Máximo número de reintentos
    this.retryDelay = 1000; // Delay inicial para reintentos (1 segundo)
  }

  // Método para agregar delay entre requests
  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Método para hacer requests con rate limiting y reintentos
  async makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ url, options, resolve, reject });
      this.processQueue();
    });
  }

  // Método para reintentos con backoff exponencial
  async makeRequestWithRetries(url, options = {}, retryCount = 0) {
    try {
      // Asegurar que haya al menos 100ms entre requests
      const timeSinceLastRequest = Date.now() - this.lastRequestTime;
      if (timeSinceLastRequest < this.minRequestInterval) {
        await this.delay(this.minRequestInterval - timeSinceLastRequest);
      }

      const response = await fetch(url, {
        ...options,
        headers: {
          'Accept': 'application/json',
          ...options.headers
        }
      });

      this.lastRequestTime = Date.now();

      if (!response.ok) {
        const errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        // Si es error 429 (rate limit) o 503 (service unavailable), reintentamos
        if ((response.status === 429 || response.status === 503) && retryCount < this.maxRetries) {
          const delay = this.retryDelay * Math.pow(2, retryCount); // Backoff exponencial
          console.warn(`API rate limit reached (${response.status}). Retrying in ${delay}ms... (attempt ${retryCount + 1}/${this.maxRetries})`);
          await this.delay(delay);
          return await this.makeRequestWithRetries(url, options, retryCount + 1);
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // Reintentar solo para errores de red, no para errores de parsing
      if (retryCount < this.maxRetries && (error.name === 'TypeError' || error.message.includes('fetch'))) {
        const delay = this.retryDelay * Math.pow(2, retryCount);
        console.warn(`Network error occurred. Retrying in ${delay}ms... (attempt ${retryCount + 1}/${this.maxRetries})`, error.message);
        await this.delay(delay);
        return await this.makeRequestWithRetries(url, options, retryCount + 1);
      }
      
      console.error('Request failed after all retries:', {
        url,
        error: error.message,
        retryCount,
        maxRetries: this.maxRetries
      });
      throw error;
    }
  }

  // Procesar cola de requests
  async processQueue() {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0) {
      const { url, options, resolve, reject } = this.requestQueue.shift();
      
      try {
        const data = await this.makeRequestWithRetries(url, options);
        resolve(data);
      } catch (error) {
        reject(error);
      }

      // Pequeño delay adicional para ser más conservadores
      await this.delay(50);
    }

    this.isProcessingQueue = false;
  }

  // Método para cache
  getCacheKey(endpoint, params = {}) {
    return `${endpoint}_${JSON.stringify(params)}`;
  }

  // Obtener datos del cache o hacer request con fallback
  async getCachedData(cacheKey, fetchFunction, enableFallback = true) {
    try {
      // Intentar obtener datos del cache normal primero
      const cached = this.cache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
        console.log(`✅ Cache hit for ${cacheKey}`);
        return cached.data;
      }

      console.log(`🔄 Fetching fresh data for ${cacheKey}`);
      
      // Intentar obtener datos frescos
      const data = await fetchFunction();
      
      // Guardar en ambos caches
      const timestamp = Date.now();
      this.cache.set(cacheKey, { data, timestamp });
      this.persistentCache.set(cacheKey, { data, timestamp });
      
      console.log(`✅ Fresh data fetched and cached for ${cacheKey}`);
      return data;
      
    } catch (error) {
      console.error(`❌ Error fetching fresh data for ${cacheKey}:`, {
        error: error.message,
        stack: error.stack,
        cacheKey,
        enableFallback
      });

      if (enableFallback) {
        // Intentar usar cache persistente como fallback
        const fallbackCached = this.persistentCache.get(cacheKey);
        if (fallbackCached && (Date.now() - fallbackCached.timestamp) < this.fallbackCacheTimeout) {
          console.warn(`🔄 Using fallback cache data for ${cacheKey} (age: ${Math.floor((Date.now() - fallbackCached.timestamp) / 1000)}s)`);
          
          // También guardar en cache normal para futuros requests inmediatos
          this.cache.set(cacheKey, {
            data: fallbackCached.data,
            timestamp: Date.now(),
            isFallback: true
          });
          
          return fallbackCached.data;
        }
      }
      
      // Si no hay cache de respaldo o está muy viejo, propagar el error
      console.error(`💥 No fallback data available for ${cacheKey}, propagating error`);
      throw error;
    }
  }

  // Verificar si los datos actuales son de fallback
  isFallbackData(cacheKey) {
    const cached = this.cache.get(cacheKey);
    return cached && cached.isFallback === true;
  }

  // Obtener la edad de los datos en cache
  getCacheAge(cacheKey) {
    const cached = this.cache.get(cacheKey) || this.persistentCache.get(cacheKey);
    if (!cached) return null;
    return Date.now() - cached.timestamp;
  }

  // Obtener lista de monedas con datos de mercado
  async getCoins(page = 1, perPage = 10) {
    const cacheKey = this.getCacheKey('coins', { page, perPage });
    
    return this.getCachedData(cacheKey, async () => {
      try {
        const url = `${this.baseURL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=1h,24h,7d`;
        return await this.makeRequest(url);
      } catch (error) {
        console.error('Error en getCoins:', error);
        throw error;
      }
    });
  }

  // Obtener estadísticas globales del mercado
  async getGlobalStats() {
    const cacheKey = this.getCacheKey('global');
    
    return this.getCachedData(cacheKey, async () => {
      try {
        const url = `${this.baseURL}/global`;
        return await this.makeRequest(url);
      } catch (error) {
        console.error('Error en getGlobalStats:', error);
        throw error;
      }
    });
  }

  // Obtener datos históricos de una moneda
  async getCoinHistory(coinId, days = 7) {
    const cacheKey = this.getCacheKey('history', { coinId, days });
    
    return this.getCachedData(cacheKey, async () => {
      try {
        const url = `${this.baseURL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`;
        return await this.makeRequest(url);
      } catch (error) {
        console.error('Error en getCoinHistory:', error);
        throw error;
      }
    });
  }

  // Obtener datos de una moneda específica
  async getCoinById(id) {
    const cacheKey = this.getCacheKey('coinById', { id });
    
    return this.getCachedData(cacheKey, async () => {
      try {
        const url = `${this.baseURL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`;
        return await this.makeRequest(url);
      } catch (error) {
        console.error('Error en getCoinById:', error);
        throw error;
      }
    });
  }

  // Obtener trending coins
  async getTrendingCoins() {
    const cacheKey = this.getCacheKey('trending');
    
    return this.getCachedData(cacheKey, async () => {
      try {
        const url = `${this.baseURL}/search/trending`;
        return await this.makeRequest(url);
      } catch (error) {
        console.error('Error en getTrendingCoins:', error);
        throw error;
      }
    });
  }

  // Buscar monedas con búsqueda inteligente
  async searchCoinsIntelligent(query) {
    try {
      if (!query || query.trim().length === 0) {
        return { results: [], suggestions: [] };
      }

      const searchTerm = query.trim().toLowerCase();
      const cacheKey = this.getCacheKey('search', { searchTerm });
      
      return this.getCachedData(cacheKey, async () => {
        const url = `${this.baseURL}/search?query=${searchTerm}`;
        const data = await this.makeRequest(url);
        
        // Filtrar y mejorar los resultados
        const filteredResults = data.coins?.filter(coin => {
          const name = coin.name.toLowerCase();
          const symbol = coin.symbol.toLowerCase();
          const id = coin.id.toLowerCase();
          
          return (
            name.includes(searchTerm) ||
            symbol.includes(searchTerm) ||
            id.includes(searchTerm) ||
            name.startsWith(searchTerm) ||
            symbol.startsWith(searchTerm)
          );
        }).slice(0, 10) || [];

        // Si no hay resultados, obtener sugerencias
        let suggestions = [];
        if (filteredResults.length === 0) {
          suggestions = await this.getTopCoinsSuggestions();
        }

        return {
          results: filteredResults,
          suggestions: suggestions,
          query: query
        };
      });
    } catch (error) {
      console.error('Error en searchCoinsIntelligent:', error);
      throw error;
    }
  }

  // Obtener las 10 monedas más famosas como sugerencias
  async getTopCoinsSuggestions() {
    try {
      const topCoins = await this.getCoins(1, 10);
      return topCoins.map(coin => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        thumb: coin.image,
        market_cap_rank: coin.market_cap_rank
      }));
    } catch (error) {
      console.error('Error en getTopCoinsSuggestions:', error);
      return [];
    }
  }

  // Buscar monedas
  async searchCoins(query) {
    try {
      const url = `${this.baseURL}/search?query=${query}`;
      return await this.makeRequest(url);
    } catch (error) {
      console.error('Error en searchCoins:', error);
      throw error;
    }
  }

  // Obtener lista de las top 10 monedas para el gráfico de pastel
  async getTopCoinsForPieChart() {
    const cacheKey = this.getCacheKey('topCoinsForPieChart');
    
    return this.getCachedData(cacheKey, async () => {
      try {
        const coins = await this.getCoins(1, 15); // Obtenemos más monedas para poder agrupar
        
        // Calcular el total del mercado para obtener porcentajes
        const totalMarketCap = coins.reduce((sum, coin) => sum + coin.market_cap, 0);
        
        // Separar monedas con >2% y <2%
        const majorCoins = [];
        const minorCoins = [];
        
        coins.forEach(coin => {
          const percentage = (coin.market_cap / totalMarketCap) * 100;
          const coinData = {
            name: coin.name,
            symbol: coin.symbol,
            value: coin.market_cap,
            price: coin.current_price,
            change: coin.price_change_percentage_24h,
            percentage: percentage,
            color: this.generateColor(coin.symbol)
          };
          
          if (percentage >= 2) {
            majorCoins.push(coinData);
          } else {
            minorCoins.push(coinData);
          }
        });
        
        // Si hay monedas menores, crear grupo "Otras"
        let result = majorCoins;
        if (minorCoins.length > 0) {
          const othersValue = minorCoins.reduce((sum, coin) => sum + coin.value, 0);
          const othersChange = minorCoins.reduce((sum, coin) => sum + coin.change, 0) / minorCoins.length;
          
          result.push({
            name: 'Otras',
            symbol: 'others',
            value: othersValue,
            price: 0,
            change: othersChange,
            percentage: (othersValue / totalMarketCap) * 100,
            color: '#6B7280', // Color gris más elegante para "Otras"
            isOthers: true,
            coinsIncluded: minorCoins.map(coin => coin.symbol.toUpperCase()).join(', ')
          });
        }
        
        return result;
      } catch (error) {
        console.error('Error en getTopCoinsForPieChart:', error);
        throw error;
      }
    });
  }

  // Generar color basado en el símbolo de la moneda
  generateColor(symbol) {
    // Paleta de colores mejorada con mejor contraste y armonía visual
    const colors = [
      '#F59E0B', // Amber 500 - Bitcoin style
      '#3B82F6', // Blue 500 - Ethereum style
      '#10B981', // Emerald 500 - Tether style
      '#8B5CF6', // Violet 500 - BNB style
      '#EF4444', // Red 500 - Cardano style
      '#06B6D4', // Cyan 500 - Solana style
      '#F97316', // Orange 500 - Polygon style
      '#84CC16', // Lime 500 - Avalanche style
      '#EC4899', // Pink 500 - Polkadot style
      '#6366F1', // Indigo 500 - Chainlink style
      '#14B8A6', // Teal 500 - Litecoin style
      '#A855F7', // Purple 500 - Cosmos style
      '#F59E0B', // Amber 500 (repeat for more coins)
      '#DC2626', // Red 600
      '#059669'  // Emerald 600
    ];
    const index = symbol.charCodeAt(0) % colors.length;
    return colors[index];
  }

  // Formatear números para mostrar
  formatNumber(num, decimals = 2) {
    if (num >= 1e12) {
      return (num / 1e12).toFixed(decimals) + 'T';
    } else if (num >= 1e9) {
      return (num / 1e9).toFixed(decimals) + 'B';
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(decimals) + 'M';
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(decimals) + 'K';
    }
    return num.toFixed(decimals);
  }

  // Limpiar cache manualmente
  clearCache() {
    this.cache.clear();
    console.log('🧹 Normal cache cleared');
  }

  // Limpiar todo el cache incluyendo el persistente
  clearAllCache() {
    this.cache.clear();
    this.persistentCache.clear();
    console.log('🧹 All cache (including persistent) cleared');
  }

  // Limpiar cache expirado
  cleanExpiredCache() {
    const now = Date.now();
    let normalCleaned = 0;
    let persistentCleaned = 0;
    
    // Limpiar cache normal
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.cacheTimeout) {
        this.cache.delete(key);
        normalCleaned++;
      }
    }
    
    // Limpiar cache persistente muy viejo (más de 24 horas)
    for (const [key, value] of this.persistentCache.entries()) {
      if (now - value.timestamp > this.fallbackCacheTimeout) {
        this.persistentCache.delete(key);
        persistentCleaned++;
      }
    }
    
    if (normalCleaned > 0 || persistentCleaned > 0) {
      console.log(`🧹 Cache cleanup: ${normalCleaned} normal entries, ${persistentCleaned} persistent entries removed`);
    }
  }

  // Obtener información del estado del cache
  getCacheStats() {
    return {
      normalCache: {
        size: this.cache.size,
        entries: Array.from(this.cache.keys())
      },
      persistentCache: {
        size: this.persistentCache.size,
        entries: Array.from(this.persistentCache.keys())
      },
      cacheTimeout: this.cacheTimeout,
      fallbackCacheTimeout: this.fallbackCacheTimeout
    };
  }

  // Método para cargar datos del dashboard de forma optimizada con fallbacks
  async loadDashboardData(options = {}) {
    const { historicalDays = 7, selectedCoin = 'bitcoin' } = options;
    
    const results = {
      globalStats: null,
      coins: [],
      trending: { coins: [] },
      pieChart: [],
      historical: { prices: [] },
      errors: [],
      fallbacksUsed: []
    };

    try {
      console.log('🚀 Starting dashboard data load...');
      
      // Cargar datos críticos primero (con mayor prioridad)
      try {
        console.log('📊 Loading global stats...');
        results.globalStats = await this.getGlobalStats();
        console.log('✅ Global stats loaded successfully');
      } catch (error) {
        console.error('❌ Error loading global stats:', error.message);
        results.errors.push({ type: 'globalStats', error: error.message });
        
        // Intentar obtener datos de fallback manualmente
        const fallbackKey = this.getCacheKey('global');
        const fallbackData = this.persistentCache.get(fallbackKey);
        if (fallbackData && (Date.now() - fallbackData.timestamp) < this.fallbackCacheTimeout) {
          results.globalStats = fallbackData.data;
          results.fallbacksUsed.push('globalStats');
          console.warn('🔄 Using fallback data for global stats');
        }
      }
      
      // Pequeño delay antes del siguiente batch
      await this.delay(50);
      
      // Cargar datos del pie chart y coins en paralelo pero de forma controlada
      const pieChartPromise = this.getTopCoinsForPieChart().catch(error => {
        console.error('❌ Error loading pie chart data:', error.message);
        results.errors.push({ type: 'pieChart', error: error.message });
        
        // Intentar fallback
        const fallbackKey = this.getCacheKey('topCoinsForPieChart');
        const fallbackData = this.persistentCache.get(fallbackKey);
        if (fallbackData && (Date.now() - fallbackData.timestamp) < this.fallbackCacheTimeout) {
          results.fallbacksUsed.push('pieChart');
          console.warn('🔄 Using fallback data for pie chart');
          return fallbackData.data;
        }
        return [];
      });

      const coinsPromise = this.getCoins(1, 20).catch(error => {
        console.error('❌ Error loading coins data:', error.message);
        results.errors.push({ type: 'coins', error: error.message });
        
        // Intentar fallback
        const fallbackKey = this.getCacheKey('coins', { page: 1, perPage: 20 });
        const fallbackData = this.persistentCache.get(fallbackKey);
        if (fallbackData && (Date.now() - fallbackData.timestamp) < this.fallbackCacheTimeout) {
          results.fallbacksUsed.push('coins');
          console.warn('🔄 Using fallback data for coins');
          return fallbackData.data;
        }
        return [];
      });

      const [pieData, coinsData] = await Promise.all([pieChartPromise, coinsPromise]);
      results.pieChart = pieData;
      results.coins = coinsData;
      
      // Delay antes del siguiente batch
      await this.delay(50);
      
      // Cargar trending y datos históricos
      const trendingPromise = this.getTrendingCoins().catch(error => {
        console.error('❌ Error loading trending data:', error.message);
        results.errors.push({ type: 'trending', error: error.message });
        
        // Intentar fallback
        const fallbackKey = this.getCacheKey('trending');
        const fallbackData = this.persistentCache.get(fallbackKey);
        if (fallbackData && (Date.now() - fallbackData.timestamp) < this.fallbackCacheTimeout) {
          results.fallbacksUsed.push('trending');
          console.warn('🔄 Using fallback data for trending');
          return fallbackData.data;
        }
        return { coins: [] };
      });

      const historicalPromise = this.getCoinHistory(selectedCoin, historicalDays).catch(error => {
        console.error('❌ Error loading historical data:', error.message);
        results.errors.push({ type: 'historical', error: error.message });
        
        // Intentar fallback
        const fallbackKey = this.getCacheKey('history', { coinId: selectedCoin, days: historicalDays });
        const fallbackData = this.persistentCache.get(fallbackKey);
        if (fallbackData && (Date.now() - fallbackData.timestamp) < this.fallbackCacheTimeout) {
          results.fallbacksUsed.push('historical');
          console.warn('🔄 Using fallback data for historical');
          return fallbackData.data;
        }
        return { prices: [] };
      });

      const [trendingData, historicalData] = await Promise.all([trendingPromise, historicalPromise]);
      results.trending = trendingData;
      results.historical = historicalData;

      // Log final del estado
      if (results.errors.length > 0) {
        console.warn('⚠️ Dashboard loaded with some errors:', {
          errors: results.errors,
          fallbacksUsed: results.fallbacksUsed,
          dataIntegrity: {
            globalStats: !!results.globalStats,
            coins: results.coins.length,
            trending: results.trending.coins?.length || 0,
            pieChart: results.pieChart.length,
            historical: results.historical.prices?.length || 0
          }
        });
      } else {
        console.log('✅ Dashboard data loaded successfully without errors');
      }

      return results;

    } catch (error) {
      console.error('💥 Critical error loading dashboard data:', {
        error: error.message,
        stack: error.stack,
        partialResults: {
          globalStats: !!results.globalStats,
          coins: results.coins.length,
          trending: results.trending.coins?.length || 0,
          pieChart: results.pieChart.length,
          historical: results.historical.prices?.length || 0
        }
      });
      
      // Aún en caso de error crítico, devolver los datos parciales obtenidos
      results.errors.push({ type: 'critical', error: error.message });
      return results;
    }
  }
}

const coinGeckoService = new CoinGeckoService();
export default coinGeckoService;
