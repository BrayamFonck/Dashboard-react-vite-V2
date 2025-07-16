import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, change, changePercent, icon: Icon, color = 'blue' }) => {
  const isPositive = change >= 0;
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600'
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-lg p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
      role="article"
      aria-labelledby={`stat-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p 
            id={`stat-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
            className="text-xs sm:text-sm font-medium text-gray-600 mb-1 truncate"
          >
            {title}
          </p>
          <p className="text-lg sm:text-2xl font-bold text-gray-900 mb-2 break-words">
            {value}
          </p>
          <div className="flex items-center space-x-1">
            {isPositive ? (
              <TrendingUp 
                className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" 
                aria-hidden="true"
              />
            ) : (
              <TrendingDown 
                className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 flex-shrink-0" 
                aria-hidden="true"
              />
            )}
            <span 
              className={`text-xs sm:text-sm font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}
              aria-label={`Cambio de ${isPositive ? 'aumento' : 'disminución'} del ${Math.abs(changePercent)}%`}
            >
              {isPositive ? '+' : ''}{changePercent}%
            </span>
            <span className="text-xs text-gray-500 hidden sm:inline">vs ayer</span>
            <span className="text-xs text-gray-500 sm:hidden">24h</span>
          </div>
        </div>
        <div className={`p-2 sm:p-3 rounded-lg bg-gradient-to-r ${colorClasses[color]} flex-shrink-0 ml-2 sm:ml-4`}>
          <Icon 
            className="w-4 h-4 sm:w-6 sm:h-6 text-white" 
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
