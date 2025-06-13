import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MediaPlanData } from "@/pages/Index";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DeliveryReachProps {
  data: MediaPlanData[];
}

export const DeliveryReach: React.FC<DeliveryReachProps> = ({ data }) => {
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  // Agrupar registros por CAMPANHA, VEÍCULO, PRAÇA, MEIO
  const groupedInsertions = new Map<string, number>();

  data.forEach((item) => {
    const key = `${item.CAMPANHA}||${item.VEÍCULO}||${item.PRAÇA}||${item.MEIO}`;
    groupedInsertions.set(key, (groupedInsertions.get(key) || 0) + 1);
  });

  // Gerar um array com dados agregados e INS calculado
  const aggregatedData = Array.from(groupedInsertions.entries()).map(([key, INS]) => {
    const [CAMPANHA, VEÍCULO, PRAÇA, MEIO] = key.split('||');
    return { CAMPANHA, VEÍCULO, PRAÇA, MEIO, INS };
  });

  // Total INS por MEIO + VEÍCULO
  const insertionsByOutlet = aggregatedData.reduce((acc, item) => {
    const outletKey = `${item.MEIO} - ${item.VEÍCULO}`;
    acc[outletKey] = (acc[outletKey] || 0) + item.INS;
    return acc;
  }, {} as Record<string, number>);

  const outletInsertionsData = Object.entries(insertionsByOutlet)
    .map(([outlet, insertions]) => ({ outlet, insertions }))
    .sort((a, b) => b.insertions - a.insertions)
    .slice(0, 10);

  // Total INS por FORMATO (se quiser usar no futuro)
  // const insertionsByFormat = ...

  // Total INS por PRAÇA
  const insertionsByMarket = aggregatedData.reduce((acc, item) => {
    acc[item.PRAÇA] = (acc[item.PRAÇA] || 0) + item.INS;
    return acc;
  }, {} as Record<string, number>);

  const marketInsertionsData = Object.entries(insertionsByMarket)
    .map(([market, insertions]) => ({ market, insertions }))
    .sort((a, b) => b.insertions - a.insertions)
    .slice(0, 10);

  // Total INS por MEIO
  const insertionsByChannel = aggregatedData.reduce((acc, item) => {
    acc[item.MEIO] = (acc[item.MEIO] || 0) + item.INS;
    return acc;
  }, {} as Record<string, number>);

  const channelInsertionsData = Object.entries(insertionsByChannel)
    .map(([channel, insertions]) => ({ channel, insertions }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Delivery and Reach</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Por Canal + Veículo */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Insertions by Channel & Media Outlet (Top 10)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={outletInsertionsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="outlet" angle={-45} textAnchor="end" height={120} fontSize={11} />
                <YAxis />
                <Tooltip formatter={(value) => formatNumber(Number(value))} />
                <Bar dataKey="insertions" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Por Praça */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Insertions by Market (Top 10)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={marketInsertionsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="market" angle={-45} textAnchor="end" height={100} fontSize={12} />
                <YAxis />
                <Tooltip formatter={(value) => formatNumber(Number(value))} />
                <Bar dataKey="insertions" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Por Canal */}
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
                <Bar dataKey="insertions" fill="#ff7300" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
