import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MediaPlanData } from "@/pages/Index";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';

interface PerformanceAnalysisProps {
  data: MediaPlanData[];
}

export const PerformanceAnalysis: React.FC<PerformanceAnalysisProps> = ({ data }) => {
  const parseCurrency = (value: any): number => {
    if (!value || typeof value !== 'string') return 0;
    const numeric = value.replace(/[R$\s]/g, '').replace('.', '').replace(',', '.');
    return parseFloat(numeric) || 0;
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

  const aggregateMetric = (field: string, key: string) => {
    return data.reduce((acc, item) => {
      const groupKey = item[key];
      const value = parseCurrency(item[field]);
      if (!acc[groupKey]) acc[groupKey] = { total: 0, count: 0 };
      if (value > 0) {
        acc[groupKey].total += value;
        acc[groupKey].count += 1;
      }
      return acc;
    }, {} as Record<string, { total: number; count: number }>);
  };

  const buildAvgArray = (
    agg: Record<string, { total: number; count: number }>,
    label: string,
    metric: string
  ): Record<string, any>[] => {
    return Object.entries(agg)
      .map(([key, obj]) => {
        const result: Record<string, any> = {};
        result[label] = key;
        result[metric] = obj.count > 0 ? obj.total / obj.count : 0;
        return result;
      })
      .filter(entry => entry[metric] > 0);
  
  };

  const outletCPMData = buildAvgArray(aggregateMetric("CPM", "VEÍCULO"), "outlet", "avgCPM")
    .sort((a, b) => b.avgCPM - a.avgCPM)
    .slice(0, 10);

  const channelCPMData = buildAvgArray(aggregateMetric("CPM", "MEIO"), "channel", "avgCPM");

  const outletCPCData = buildAvgArray(aggregateMetric("CPC", "VEÍCULO"), "outlet", "avgCPC")
    .sort((a, b) => b.avgCPC - a.avgCPC)
    .slice(0, 10);

  const performanceMatrix = data.reduce((acc, item) => {
    const outlet = item.VEÍCULO;
    const investment = parseCurrency(item["R$ NEGOCIADO TOTAL (LÍQUIDO)"]);
    const impressions = Number(item["IMPACTOS ESTIMADOS"] || 0);
    if (!acc[outlet]) acc[outlet] = { investment: 0, impressions: 0 };
    acc[outlet].investment += investment;
    acc[outlet].impressions += impressions;
    return acc;
  }, {} as Record<string, { investment: number; impressions: number }>);

  const matrixData = Object.entries(performanceMatrix)
    .map(([outlet, metrics]) => ({ outlet, ...metrics }))
    .filter(item => item.investment > 0 && item.impressions > 0)
    .slice(0, 15);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Performance Analysis</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Average CPM by Media Outlet (Top 10)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={outletCPMData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="outlet" angle={-45} textAnchor="end" height={120} fontSize={11} />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="avgCPM" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Average CPM by Channel</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={channelCPMData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="channel" />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="avgCPM" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Average CPC by Media Outlet (Top 10)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={outletCPCData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="outlet" angle={-45} textAnchor="end" height={120} fontSize={11} />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="avgCPC" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Investment vs Impressions by Media Outlet</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="investment" name="Investment" tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
              <YAxis dataKey="impressions" name="Impressions" tickFormatter={formatNumber} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'investment' ? formatCurrency(Number(value)) : formatNumber(Number(value)),
                  name === 'investment' ? 'Investment' : 'Impressions'
                ]}
                labelFormatter={(_, payload) => {
                  const data = payload?.[0]?.payload;
                  return data ? `Media Outlet: ${data.outlet}` : '';
                }}
              />
              <Scatter data={matrixData} fill="#8884d8" fillOpacity={0.6} />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};