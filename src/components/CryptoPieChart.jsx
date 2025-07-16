import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const CryptoPieChart = ({ data, title = "Distribución por Capitalización de Mercado" }) => {
  // Paleta de colores de respaldo mejorada que coincide con el servicio
  const COLORS = [
    '#F59E0B', '#3B82F6', '#10B981', '#8B5CF6', '#EF4444', 
    '#06B6D4', '#F97316', '#84CC16', '#EC4899', '#6366F1',
    '#14B8A6', '#A855F7', '#DC2626', '#059669', '#6B7280'
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <p className="font-semibold text-gray-800">{data.name}</p>
          {!data.isOthers ? (
            <>
              <p className="text-sm text-gray-600">Símbolo: {data.symbol.toUpperCase()}</p>
              <p className="text-sm text-blue-600">Cap. Mercado: ${(data.value / 1e9).toFixed(2)}B</p>
              <p className="text-sm text-green-600">Precio: ${data.price}</p>
              <p className={`text-sm ${data.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                Cambio 24h: {data.change >= 0 ? '+' : ''}{data.change?.toFixed(2)}%
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600">Incluye: {data.coinsIncluded}</p>
              <p className="text-sm text-blue-600">Cap. Mercado: ${(data.value / 1e9).toFixed(2)}B</p>
              <p className={`text-sm ${data.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                Cambio promedio 24h: {data.change >= 0 ? '+' : ''}{data.change?.toFixed(2)}%
              </p>
            </>
          )}
          <p className="text-sm text-purple-600 font-medium">
            Porcentaje: {data.percentage?.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = (props) => {
    const { payload } = props;
    return (
      <ul className="flex flex-wrap justify-center gap-2 mt-4">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center text-xs">
            <span 
              className="w-3 h-3 rounded-full mr-1" 
              style={{ backgroundColor: entry.color }}
            ></span>
            <span className="text-gray-700">
              {entry.payload.isOthers ? 'Otras' : entry.payload.symbol.toUpperCase()}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  // Función personalizada para renderizar etiquetas solo en porciones >2%
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, symbol, isOthers }) => {
    const percentage = percent * 100;
    
    // Solo mostrar etiqueta si el porcentaje es mayor al 2%
    if (percentage < 2) {
      return null;
    }

    const RADIAN = Math.PI / 180;
    // Ajustar la distancia de la etiqueta del centro
    const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Determinar la alineación del texto basada en la posición
    const textAnchor = x > cx ? 'start' : 'end';

    return (
      <text 
        x={x} 
        y={y} 
        fill="#374151" 
        textAnchor={textAnchor} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="500"
        className="pointer-events-none"
      >
        {isOthers ? 'Otras' : symbol.toUpperCase()} {percentage.toFixed(0)}%
      </text>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={renderCustomLabel}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CryptoPieChart;
