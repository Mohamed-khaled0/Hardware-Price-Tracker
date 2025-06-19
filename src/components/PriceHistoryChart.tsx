
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';

interface PriceHistoryData {
  date: string;
  price: number;
  source: string;
}

interface PriceHistoryChartProps {
  productId: number;
  currentPrice: number;
}

const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({ productId, currentPrice }) => {
  const [priceHistory, setPriceHistory] = useState<PriceHistoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPriceHistory();
  }, [productId]);

  const fetchPriceHistory = async () => {
    try {
      // First, add current price to history if not exists
      await supabase
        .from('price_history')
        .upsert([
          {
            product_id: productId,
            price: currentPrice,
            source: 'dummyjson'
          }
        ], {
          onConflict: 'product_id,recorded_at',
          ignoreDuplicates: true
        });

      // Fetch price history
      const { data, error } = await supabase
        .from('price_history')
        .select('*')
        .eq('product_id', productId)
        .order('recorded_at', { ascending: true });

      if (error) {
        console.error('Error fetching price history:', error);
        return;
      }

      const formattedData = data.map(item => ({
        date: new Date(item.recorded_at).toLocaleDateString(),
        price: parseFloat(item.price),
        source: item.source
      }));

      setPriceHistory(formattedData);
    } catch (error) {
      console.error('Error in fetchPriceHistory:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Price History</CardTitle>
          <CardDescription>Loading price tracking data...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (priceHistory.length === 0) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Price History</CardTitle>
          <CardDescription>No price history available yet</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Price History</CardTitle>
        <CardDescription>Track how the price has changed over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#39536f" 
                strokeWidth={2}
                dot={{ fill: '#39536f', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceHistoryChart;
