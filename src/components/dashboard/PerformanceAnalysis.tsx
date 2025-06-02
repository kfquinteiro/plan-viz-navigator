
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MediaPlanData } from "@/pages/Index";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ComposedChart, Line, LineChart } from 'recharts';

interface PerformanceAnalysisProps {
  data: MediaPlanData[];
}

export const PerformanceAnalysis: React.FC<PerformanceAnalysisProps> = ({ data }) => {
  const parseCurrency = (value: string): number => {
    if (!value || value === "R$-") return 0;
    return parseFloat(value.replace(/[R$.,]/g, '').replace(',', '.')) || 0;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  // CPM by Channel
  const cpmByChannel = data.reduce((acc, item) => {
    const channel = item.MEIO;
    const investment = parseCurrency(item["R$ NEGOCIADO  TOTAL\n(BRUTO 20%)"]);
    const impressions = item["IMPACTOS                   ESTIMADOS"] || 0;
    
    if (!acc[channel]) {
      acc[channel] = { investment: 0, impressions: 0 };
    }
    acc[channel].investment += investment;
    acc[channel].impressions += impressions;
    return acc;
  }, {} as Record<string, any>);

  const channelCPMData = Object.entries(cpmByChannel).map(([channel, data]: [string, any]) => ({
    channel,
    cpm: data.impressions > 0 ? (data.investment / data.impressions) * 1000 : 0
  }));

  // CPM by Media Outlet
  const cpmByOutlet = data.reduce((acc, item) => {
    const outlet = item.VEÍCULO;
    const investment = parseCurrency(item["R$ NEGOCIADO  TOTAL\n(BRUTO 20%)"]);
    const impressions = item["IMPACTOS                   ESTIMADOS"] || 0;
    
    if (!acc[outlet]) {
      acc[outlet] = { investment: 0, impressions: 0 };
    }
    acc[outlet].investment += investment;
    acc[outlet].impressions += impressions;
    return acc;
  }, {} as Record<string, any>);

  const outletCPMData = Object.entries(cpmByOutlet)
    .map(([outlet, data]: [string, any]) => ({
      outlet,
      cpm: data.impressions > 0 ? (data.investment / data.impressions) * 1000 : 0
    }))
    .sort((a, b) => b.cpm - a.cpm)
    .slice(0, 10);

  // Estimated CPC by Channel
  const cpcByChannel = data.reduce((acc, item) => {
    const channel = item.MEIO;
    const investment = parseCurrency(item["R$ NEGOCIADO  TOTAL\n(BRUTO 20%)"]);
    const clicks = item.CLIQUES || 0;
    
    if (!acc[channel]) {
      acc[channel] = { investment: 0, clicks: 0 };
    }
    acc[channel].investment += investment;
    acc[channel].clicks += clicks;
    return acc;
  }, {} as Record<string, any>);

  const channelCPCData = Object.entries(cpcByChannel).map(([channel, data]: [string, any]) => ({
    channel,
    cpc: data.clicks > 0 ? data.investment / data.clicks : 0
  }));

  // Cost vs Impressions Matrix
  const costImpressionsMatrix = data.map(item => ({
    campaign: item.CAMPANHA,
    market: item.PRAÇA,
    investment: parseCurrency(item["R$ NEGOCIADO  TOTAL\n(BRUTO 20%)"]),
    impressions: item["IMPACTOS                   ESTIMADOS"] || 0,
    efficiency: (item["IMPACTOS                   ESTIMADOS"] || 0) > 0 ? 
      parseCurrency(item["R$ NEGOCIADO  TOTAL\n(BRUTO 20%)"]) / (item["IMPACTOS                   ESTIMADOS"] || 1) * 1000 : 0
  })).filter(item => item.investment > 0 && item.impressions > 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Performance Analysis</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPM by Channel */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>CPM by Channel</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={channelCPMData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="channel" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="cpm" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* CPM by Media Outlet */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>CPM by Media Outlet (Top 10)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={outletCPMData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="outlet" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  fontSize={11}
                />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="cpm" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Estimated CPC by Channel */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Estimated CPC by Channel</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={channelCPCData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="channel" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="cpc" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Efficiency */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Campaign Performance Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={costImpressionsMatrix.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="campaign" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  fontSize={11}
                />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip 
                  formatter={(value) => formatCurrency(Number(value))}
                  labelFormatter={(label) => `Campaign: ${label}`}
                />
                <Bar dataKey="efficiency" fill="#ff7300" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Cost vs Impressions Matrix */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Investment vs Impressions Performance Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={costImpressionsMatrix}>
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
                  name === 'investment' ? formatCurrency(Number(value)) : formatNumber(Number(value)),
                  name === 'investment' ? 'Investment' : 'Impressions'
                ]}
                labelFormatter={(value, payload) => {
                  const data = payload?.[0]?.payload;
                  return data ? `${data.campaign} - ${data.market}` : '';
                }}
              />
              <Scatter 
                dataKey="impressions" 
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
