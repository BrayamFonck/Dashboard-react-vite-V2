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
      const coins = await this.getCoins(1, 10);
      return coins.map(coin => ({
        name: coin.name,
        symbol: coin.symbol,
        value: coin.market_cap,
        price: coin.current_price,
        change: coin.price_change_percentage_24h,
        color: this.generateColor(coin.symbol)
      }));
    } catch (error) {
      console.error('Error en getTopCoinsForPieChart:', error);
      throw error;
    }
  }

  // Generar color basado en el símbolo de la moneda
  generateColor(symbol) {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
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
