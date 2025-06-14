import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MediaPlanData } from "@/pages/Index";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

interface InvestmentDistributionProps {
  data: MediaPlanData[];
}

export const InvestmentDistribution: React.FC<InvestmentDistributionProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Nome da coluna de investimento (com quebra de linha real, exatamente como no Excel)
  const investimentoColuna = "R$ NEGOCIADO TOTAL \n(LÍQUIDO)";

  // Agrupamento por PRAÇA
  const investmentByMarket = data.reduce((acc, item) => {
    const market = item.PRAÇA;
    const investment = Number(item[investimentoColuna] || 0);
    acc[market] = (acc[market] || 0) + investment;
    return acc;
  }, {} as Record<string, number>);

  const marketData = Object.entries(investmentByMarket)
    .map(([market, investment]) => ({ market, investment }))
    .sort((a, b) => b.investment - a.investment)
    .slice(0, 10);

  // Agrupamento por MÊS
  const investmentByMonth = data.reduce((acc, item) => {
    const month = item.MÊS;
    const investment = Number(item[investimentoColuna] || 0);
    acc[month] = (acc[month] || 0) + investment;
    return acc;
  }, {} as Record<string, number>);

  const monthData = Object.entries(investmentByMonth)
    .map(([month, investment]) => ({ month, investment }));

  // Agrupamento por CAMPANHA
  const investmentByCampaign = data.reduce((acc, item) => {
    const campaign = item.CAMPANHA;
    const investment = Number(item[investimentoColuna] || 0);
    acc[campaign] = (acc[campaign] || 0) + investment;
    return acc;
  }, {} as Record<string, number>);

  const campaignData = Object.entries(investmentByCampaign)
    .map(([campaign, investment]) => ({ campaign, investment }))
    .sort((a, b) => b.investment - a.investment);

  // Agrupamento por MEIO
  const investmentByChannel = data.reduce((acc, item) => {
    const channel = item.MEIO;
    const investment = Number(item[investimentoColuna] || 0);
    acc[channel] = (acc[channel] || 0) + investment;
    return acc;
  }, {} as Record<string, number>);

  const channelData = Object.entries(investmentByChannel)
    .map(([channel, investment]) => ({ channel, investment }));

  // Agrupamento por MEIO + VEÍCULO
  const investmentByOutlet = data.reduce((acc, item) => {
    const outletKey = `${item.MEIO} - ${item.VEÍCULO}`;
    const investment = Number(item[investimentoColuna] || 0);
    acc[outletKey] = (acc[outletKey] || 0) + investment;
    return acc;
  }, {} as Record<string, number>);

  const outletData = Object.entries(investmentByOutlet)
    .map(([outlet, investment]) => ({ outlet, investment }))
    .sort((a, b) => b.investment - a.investment)
    .slice(0, 10);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Investment Distribution</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Por Praça */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Investment by Market (Praça)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={marketData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="market" angle={-45} textAnchor="end" height={100} fontSize={12} />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="investment" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Por Mês */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Investment by Month</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="investment" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Por Campanha */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Investment by Campaign</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={campaignData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ campaign, percent }) => `${campaign} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="investment"
                >
                  {campaignData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Por Meio */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Investment by Channel (Meio)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ channel, percent }) => `${channel} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="investment"
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Por Canal + Veículo */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Investment by Channel & Media Outlet (Top 10)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={outletData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="outlet" angle={-45} textAnchor="end" height={120} fontSize={11} />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="investment" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
