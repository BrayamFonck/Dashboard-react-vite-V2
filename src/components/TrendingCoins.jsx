import React from 'react';
import { TrendingUp, Star, ExternalLink } from 'lucide-react';

const TrendingCoins = ({ coins = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUp className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-bold text-gray-800">Monedas Trending</h3>
        <Star className="w-4 h-4 text-yellow-500 fill-current" />
      </div>
      
      <div className="space-y-4">
        {coins.map((coin, index) => (
          <div key={coin.item.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all duration-200">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-full text-xs font-bold">
                {index + 1}
              </div>
              <img 
                src={coin.item.small} 
                alt={coin.item.name}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="font-semibold text-gray-800">{coin.item.name}</p>
                <p className="text-sm text-gray-500">{coin.item.symbol}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm text-gray-600">Ranking</p>
                <p className="font-bold text-gray-800">#{coin.item.market_cap_rank || 'N/A'}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 cursor-pointer hover:text-orange-500" />
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
