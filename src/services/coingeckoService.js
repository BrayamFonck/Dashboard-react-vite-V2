// Servicio para consumir la API de CoinGecko
class CoinGeckoService {
  constructor() {
    this.baseURL = 'https://api.coingecko.com/api/v3';
  }

  // Obtener lista de monedas con datos de mercado
  async getCoins(page = 1, perPage = 10) {
    try {
      const response = await fetch(
        `${this.baseURL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=1h,24h,7d`
      );
      
      if (!response.ok) {
        throw new Error('Error al obtener las monedas');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getCoins:', error);
      throw error;
    }
  }

  // Obtener estadísticas globales del mercado
  async getGlobalStats() {
    try {
      const response = await fetch(`${this.baseURL}/global`);
      
      if (!response.ok) {
        throw new Error('Error al obtener estadísticas globales');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getGlobalStats:', error);
      throw error;
    }
  }

  // Obtener datos históricos de una moneda
  async getCoinHistory(coinId, days = 7) {
    try {
      const response = await fetch(
        `${this.baseURL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
      );
      
      if (!response.ok) {
        throw new Error('Error al obtener datos históricos');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getCoinHistory:', error);
      throw error;
    }
  }

  // Obtener datos de una moneda específica
  async getCoinById(id) {
    try {
      const response = await fetch(
        `${this.baseURL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`
      );
      
      if (!response.ok) {
        throw new Error('Error al obtener la moneda');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getCoinById:', error);
      throw error;
    }
  }

  // Obtener trending coins
  async getTrendingCoins() {
    try {
      const response = await fetch(`${this.baseURL}/search/trending`);
      
      if (!response.ok) {
        throw new Error('Error al obtener monedas trending');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getTrendingCoins:', error);
      throw error;
    }
  }

  // Buscar monedas con búsqueda inteligente
  async searchCoinsIntelligent(query) {
    try {
      if (!query || query.trim().length === 0) {
        return { results: [], suggestions: [] };
      }

      const searchTerm = query.trim().toLowerCase();
      const response = await fetch(`${this.baseURL}/search?query=${searchTerm}`);
      
      if (!response.ok) {
        throw new Error('Error en la búsqueda');
      }

      const data = await response.json();
      
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
      const response = await fetch(`${this.baseURL}/search?query=${query}`);
      
      if (!response.ok) {
        throw new Error('Error en la búsqueda');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en searchCoins:', error);
      throw error;
    }
  }

  // Obtener lista de las top 10 monedas para el gráfico de pastel
  async getTopCoinsForPieChart() {
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
}

const coinGeckoService = new CoinGeckoService();
export default coinGeckoService;
