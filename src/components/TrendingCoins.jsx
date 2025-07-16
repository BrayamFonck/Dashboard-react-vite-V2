import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Star, ExternalLink } from 'lucide-react';

const TrendingCoins = ({ coins = [] }) => {
  const navigate = useNavigate();

  const handleCoinClick = (coinId) => {
    navigate(`/coin/${coinId}`);
  };
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUp className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-bold text-gray-800">Monedas Trending</h3>
        <Star className="w-4 h-4 text-yellow-500 fill-current" />
      </div>
      
      <p className="text-sm text-gray-500 mb-4">Haz clic en cualquier moneda para ver sus detalles</p>
      
      <div className="space-y-4">
        {coins.map((coin, index) => (
          <div 
            key={coin.item.id} 
            onClick={() => handleCoinClick(coin.item.id)}
            className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-orange-200 hover:bg-orange-50 hover:shadow-md transition-all duration-200 cursor-pointer group transform hover:scale-[1.02]"
            role="button"
            tabIndex={0}
            aria-label={`Ver detalles de ${coin.item.name}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCoinClick(coin.item.id);
              }
            }}
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-full text-xs font-bold group-hover:from-orange-500 group-hover:to-pink-600 transition-all">
                {index + 1}
              </div>
              <img 
                src={coin.item.small} 
                alt={`Logo de ${coin.item.name}`}
                className="w-8 h-8 rounded-full group-hover:scale-110 transition-transform"
              />
              <div>
                <p className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                  {coin.item.name}
                </p>
                <p className="text-sm text-gray-500 uppercase group-hover:text-gray-600 transition-colors">
                  {coin.item.symbol}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">Ranking</p>
                <p className="font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                  #{coin.item.market_cap_rank || 'N/A'}
                </p>
              </div>
              <ExternalLink 
                className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-all transform group-hover:scale-110" 
                title={`Ver detalles de ${coin.item.name}`}
                aria-hidden="true"
              />
            </div>
          </div>
        ))}
      </div>
      
      {coins.length === 0 && (
        <div className="text-center py-8">
          <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">No hay datos trending disponibles</p>
        </div>
      )}
    </div>
  );
};

export default TrendingCoins;
