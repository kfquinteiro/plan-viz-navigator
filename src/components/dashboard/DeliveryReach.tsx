
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MediaPlanData } from "@/pages/Index";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';

interface DeliveryReachProps {
  data: MediaPlanData[];
}

export const DeliveryReach: React.FC<DeliveryReachProps> = ({ data }) => {
  const parseCurrency = (value: string): number => {
    if (!value || value === "R$-") return 0;
    return parseFloat(value.replace(/[R$.,]/g, '').replace(',', '.')) || 0;
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  // Insertions by Channel
  const insertionsByChannel = data.reduce((acc, item) => {
    const channel = item.MEIO;
    const insertions = item.INS || 0;
    acc[channel] = (acc[channel] || 0) + insertions;
    return acc;
  }, {} as Record<string, number>);

  const channelInsertionsData = Object.entries(insertionsByChannel)
    .map(([channel, insertions]) => ({ channel, insertions }));

  // Insertions by Format
  const insertionsByFormat = data.reduce((acc, item) => {
    const format = item.FORMATO;
    const insertions = item.INS || 0;
    acc[format] = (acc[format] || 0) + insertions;
    return acc;
  }, {} as Record<string, number>);

  const formatInsertionsData = Object.entries(insertionsByFormat)
    .map(([format, insertions]) => ({ format, insertions }));

  // Impressions by Market
  const impressionsByMarket = data.reduce((acc, item) => {
    const market = item.PRAÇA;
    const impressions = item["IMPACTOS                   ESTIMADOS"] || 0;
    acc[market] = (acc[market] || 0) + impressions;
    return acc;
  }, {} as Record<string, number>);

  const marketImpressionsData = Object.entries(impressionsByMarket)
    .map(([market, impressions]) => ({ market, impressions }))
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 10);

  // Impressions by Channel
  const impressionsByChannel = data.reduce((acc, item) => {
    const channel = item.MEIO;
    const impressions = item["IMPACTOS                   ESTIMADOS"] || 0;
    acc[channel] = (acc[channel] || 0) + impressions;
    return acc;
  }, {} as Record<string, number>);

  const channelImpressionsData = Object.entries(impressionsByChannel)
    .map(([channel, impressions]) => ({ channel, impressions }));

  // Cities with Investment (for map visualization)
  const citiesData = data.reduce((acc, item) => {
    const city = item.PRAÇA;
    const investment = parseCurrency(item["R$ NEGOCIADO  TOTAL\n(BRUTO 20%)"]);
    const impressions = item["IMPACTOS                   ESTIMADOS"] || 0;
    
    if (!acc[city]) {
      acc[city] = { city, investment: 0, impressions: 0 };
    }
    acc[city].investment += investment;
    acc[city].impressions += impressions;
    return acc;
  }, {} as Record<string, any>);

  const citiesScatterData = Object.values(citiesData).map((city: any) => ({
    ...city,
    size: Math.max(city.investment / 1000, 10) // Scale for bubble size
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Delivery and Reach</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Insertions by Channel */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Insertions by Channel</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={channelInsertionsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="channel" />
                <YAxis />
                <Tooltip formatter={(value) => formatNumber(Number(value))} />
                <Bar dataKey="insertions" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Insertions by Format */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Insertions by Format</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={formatInsertionsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="format" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip formatter={(value) => formatNumber(Number(value))} />
                <Bar dataKey="insertions" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Impressions by Market */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Impressions by Market (Top 10)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={marketImpressionsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="market" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip formatter={(value) => formatNumber(Number(value))} />
                <Bar dataKey="impressions" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Impressions by Channel */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Impressions by Channel</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={channelImpressionsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="channel" />
                <YAxis />
                <Tooltip formatter={(value) => formatNumber(Number(value))} />
                <Bar dataKey="impressions" fill="#ff7300" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Cities Coverage Map (Bubble Chart) */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Cities Coverage (Investment vs Impressions)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={citiesScatterData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="investment" 
                name="Investment"
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <YAxis 
                dataKey="impressions" 
                name="Impressions"
                tickFormatter={(value) => formatNumber(Number(value))}
              />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'Investment' ? `R$ ${formatNumber(Number(value))}` : formatNumber(Number(value)),
                  name
                ]}
                labelFormatter={(label) => `City: ${label}`}
              />
              <Scatter 
                dataKey="size" 
                fill="#8884d8" 
                fillOpacity={0.6}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
