
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

  // Total INS by Channel and Media Outlet (MEIO + VEÍCULO)
  const insertionsByOutlet = data.reduce((acc, item) => {
    const outletKey = `${item.MEIO} - ${item.VEÍCULO}`;
    const insertions = Number(item["INS"] ?? 0);
    acc[outletKey] = (acc[outletKey] || 0) + insertions;
    return acc;
  }, {} as Record<string, number>);

  const outletInsertionsData = Object.entries(insertionsByOutlet)
    .map(([outlet, insertions]) => ({ outlet, insertions }))
    .sort((a, b) => b.insertions - a.insertions)
    .slice(0, 10);

  // Total INS by Format (FORMATO)
  const insertionsByFormat = data.reduce((acc, item) => {
    const format = item.FORMATO;
    const insertions = Number(item["INS"] ?? 0);
    acc[format] = (acc[format] || 0) + insertions;
    return acc;
  }, {} as Record<string, number>);

  const formatInsertionsData = Object.entries(insertionsByFormat)
    .map(([format, insertions]) => ({ format, insertions }));

  // Total INS by Market (PRAÇA)
  const insertionsByMarket = data.reduce((acc, item) => {
    const market = item.PRAÇA;
    const insertions = Number(item["INS"] ?? 0);
    acc[market] = (acc[market] || 0) + insertions;
    return acc;
  }, {} as Record<string, number>);

  const marketInsertionsData = Object.entries(insertionsByMarket)
    .map(([market, insertions]) => ({ market, insertions }))
    .sort((a, b) => b.insertions - a.insertions)
    .slice(0, 10);

  // Total INS by Channel (MEIO)
  const insertionsByChannel = data.reduce((acc, item) => {
    const channel = item.MEIO;
    const insertions = Number(item["INS"] ?? 0);
    acc[channel] = (acc[channel] || 0) + insertions;
    return acc;
  }, {} as Record<string, number>);

  const channelInsertionsData = Object.entries(insertionsByChannel)
    .map(([channel, insertions]) => ({ channel, insertions }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Delivery and Reach</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Insertions by Channel & Media Outlet */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Insertions by Channel & Media Outlet (Top 10)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={outletInsertionsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="outlet" 
                  angle={-45}
                  textAnchor="end"
                  height={120}
                  fontSize={11}
                />
                <YAxis />
                <Tooltip formatter={(value) => formatNumber(Number(value))} />
                <Bar dataKey="insertions" fill="red" />
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
                <Bar dataKey="insertions" fill="red" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Insertions by Market */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Insertions by Market (Top 10)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={marketInsertionsData}>
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
                <Bar dataKey="insertions" fill="red" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

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
                <Bar dataKey="insertions" fill="red" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
