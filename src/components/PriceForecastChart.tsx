import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface PriceData {
  month: string;
  historicalPrice: number;
  forecastPrice: number;
}

interface PriceForecastChartProps {
  currentPrice: number;
  productName: string;
}

const PriceForecastChart: React.FC<PriceForecastChartProps> = ({ currentPrice, productName }) => {
  // Generate historical data for the last 12 months
  const generateHistoricalData = (): PriceData[] => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const currentDate = new Date();
    const data: PriceData[] = [];
    
    // Generate random historical prices with some variation
    for (let i = 11; i >= 0; i--) {
      const monthIndex = (currentDate.getMonth() - i + 12) % 12;
      const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
      const historicalPrice = currentPrice * (1 + variation);
      
      data.push({
        month: months[monthIndex],
        historicalPrice: Number(historicalPrice.toFixed(2)),
        forecastPrice: null
      });
    }
    
    // Add forecast for next month (10-15% lower)
    const forecastReduction = 0.1 + Math.random() * 0.05; // 10-15% reduction
    const forecastPrice = currentPrice * (1 - forecastReduction);
    
    data.push({
      month: 'Next',
      historicalPrice: null,
      forecastPrice: Number(forecastPrice.toFixed(2))
    });
    
    return data;
  };

  const data = generateHistoricalData();

  return (
    <div className="w-full h-[300px] sm:h-[400px] mt-8 p-4 bg-white rounded-xl border border-gray-200">
      <h3 className="text-lg sm:text-xl font-semibold text-[#39536f] mb-4">
        Price History & Forecast
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="month" 
            stroke="#6f7d95"
            tick={{ fill: '#6f7d95' }}
          />
          <YAxis 
            stroke="#6f7d95"
            tick={{ fill: '#6f7d95' }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
            formatter={(value: number) => [`$${value}`, '']}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="historicalPrice"
            stroke="#39536f"
            strokeWidth={2}
            dot={{ fill: '#39536f', strokeWidth: 2 }}
            activeDot={{ r: 6 }}
            name="Historical Price"
          />
          <Line
            type="monotone"
            dataKey="forecastPrice"
            stroke="#39536f"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#39536f', strokeWidth: 2 }}
            activeDot={{ r: 6 }}
            name="Price Forecast"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceForecastChart; 