
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MediaPlanData } from "@/pages/Index";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';

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

  // Average CPM by Media Outlet (VEÍCULO)
  const cpmByOutlet = data.reduce((acc, item) => {
    const outlet = item.VEÍCULO;
    const cpm = parseCurrency(item.CPM);
    
    if (!acc[outlet]) {
      acc[outlet] = { totalCPM: 0, count: 0 };
    }
    if (cpm > 0) {
      acc[outlet].totalCPM += cpm;
      acc[outlet].count += 1;
    }
    return acc;
  }, {} as Record<string, any>);

  const outletCPMData = Object.entries(cpmByOutlet)
    .map(([outlet, data]: [string, any]) => ({
      outlet,
      avgCPM: data.count > 0 ? data.totalCPM / data.count : 0
    }))
    .filter(item => item.avgCPM > 0)
    .sort((a, b) => b.avgCPM - a.avgCPM)
    .slice(0, 10);

  // Average CPM by Channel (MEIO)
  const cpmByChannel = data.reduce((acc, item) => {
    const channel = item.MEIO;
    const cpm = parseCurrency(item.CPM);
    
    if (!acc[channel]) {
      acc[channel] = { totalCPM: 0, count: 0 };
    }
    if (cpm > 0) {
      acc[channel].totalCPM += cpm;
      acc[channel].count += 1;
    }
    return acc;
  }, {} as Record<string, any>);

  const channelCPMData = Object.entries(cpmByChannel)
    .map(([channel, data]: [string, any]) => ({
      channel,
      avgCPM: data.count > 0 ? data.totalCPM / data.count : 0
    }))
    .filter(item => item.avgCPM > 0);

  // Average CPC by Media Outlet (VEÍCULO)
  const cpcByOutlet = data.reduce((acc, item) => {
    const outlet = item.VEÍCULO;
    const cpc = parseCurrency(item.CPC);
    
    if (!acc[outlet]) {
      acc[outlet] = { totalCPC: 0, count: 0 };
    }
    if (cpc > 0) {
      acc[outlet].totalCPC += cpc;
      acc[outlet].count += 1;
    }
    return acc;
  }, {} as Record<string, any>);

  const outletCPCData = Object.entries(cpcByOutlet)
    .map(([outlet, data]: [string, any]) => ({
      outlet,
      avgCPC: data.count > 0 ? data.totalCPC / data.count : 0
    }))
    .filter(item => item.avgCPC > 0)
    .sort((a, b) => b.avgCPC - a.avgCPC)
    .slice(0, 10);

  // Investment vs Impressions by Media Outlet (VEÍCULO)
  const performanceMatrix = data.reduce((acc, item) => {
    const outlet = item.VEÍCULO;
    const investment = parseCurrency(item["R$ NEGOCIADO TOTAL \n(LÍQUIDO)"]);
    const impressions = item["IMPACTOS                   ESTIMADOS"] || 0;
    
    if (!acc[outlet]) {
      acc[outlet] = { investment: 0, impressions: 0 };
    }
    acc[outlet].investment += investment;
    acc[outlet].impressions += impressions;
    return acc;
  }, {} as Record<string, any>);

  const matrixData = Object.entries(performanceMatrix)
    .map(([outlet, data]: [string, any]) => ({
      outlet,
      investment: data.investment,
      impressions: data.impressions
    }))
    .filter(item => item.investment > 0 && item.impressions > 0)
    .slice(0, 15);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Performance Analysis</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Average CPM by Media Outlet */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Average CPM by Media Outlet (Top 10)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={outletCPMData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="outlet" 
                  angle={-45}
                  textAnchor="end"
                  height={120}
                  fontSize={11}
                />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="avgCPM" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Average CPM by Channel */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Average CPM by Channel</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={channelCPMData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="channel" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="avgCPM" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Average CPC by Media Outlet */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Average CPC by Media Outlet (Top 10)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={outletCPCData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="outlet" 
                  angle={-45}
                  textAnchor="end"
                  height={120}
                  fontSize={11}
                />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="avgCPC" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Investment vs Impressions Matrix by Media Outlet */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Investment vs Impressions by Media Outlet</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={matrixData}>
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
                  return data ? `Media Outlet: ${data.outlet}` : '';
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
