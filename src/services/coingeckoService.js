// Servicio para consumir la API de CoinGecko
class CoinGeckoService {
  constructor() {
    this.baseURL = 'https://api.coingecko.com/api/v3';
  }

  // Obtener lista de monedas
  async getCoins(page = 1, perPage = 10) {
    try {
      const response = await fetch(
        `${this.baseURL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false`
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

  // Obtener datos de una moneda específica
  async getCoinById(id) {
    try {
      const response = await fetch(`${this.baseURL}/coins/${id}`);
      
      if (!response.ok) {
        throw new Error('Error al obtener la moneda');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getCoinById:', error);
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
}

const coinGeckoService = new CoinGeckoService();
export default coinGeckoService;
