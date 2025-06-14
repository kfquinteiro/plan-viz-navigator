// Correção conjunta dos arquivos KPICards, PerformanceAnalysis e InvestmentDistribution
// Itens ajustados:
// - Correção de parser para moeda
// - Uso consistente de parseCurrency
// - Conversão correta de tipos numéricos
// - Agrupamento para inserções conforme campanha + veículo + praça + meio
// - Evita leitura direta de campos numéricos sem fallback seguro

// Devido ao tamanho dos arquivos e múltiplas seções, o código completo com correções será iniciado agora neste canvas
// e as próximas etapas virão com os blocos de código inseridos progressivamente.

// A seguir, você pode colar os trechos ajustados um a um ou pedir "continue".

// Começando por KPICards.tsx...

"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MediaPlanData } from "@/pages/Index";
import {
  TrendingUp,
  Eye,
  MousePointer,
  DollarSign,
} from "lucide-react";

interface KPICardsProps {
  data: MediaPlanData[];
}

export const KPICards: React.FC<KPICardsProps> = ({ data }) => {
  const parseCurrency = (value: string): number => {
    if (!value || typeof value !== "string") return 0;
    const clean = value.replace(/\s/g, "").replace("R$", "");
    const number = parseFloat(clean.replace(/\./g, "").replace(",", "."));
    return isNaN(number) ? 0 : number;
  };

  const totalInvestment = data.reduce((sum, item) => {
    return sum + parseCurrency(item["R$ NEGOCIADO TOTAL \n(LÍQUIDO)"]);
  }, 0);

  const totalImpressions = data.reduce((sum, item) => {
    return sum + (Number(item["IMPACTOS                   ESTIMADOS"]) || 0);
  }, 0);

  const totalClicks = data.reduce((sum, item) => {
    return sum + (Number(item.CLIQUES) || 0);
  }, 0);

  const validCPMs = data
    .map((item) => parseCurrency(item.CPM))
    .filter((cpm) => cpm > 0);

  const averageCPM =
    validCPMs.length > 0
      ? validCPMs.reduce((sum, cpm) => sum + cpm, 0) / validCPMs.length
      : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("pt-BR").format(value);
  };

  const kpis = [
    {
      title: "Total Investment (Líquido)",
      value: formatCurrency(totalInvestment),
      icon: DollarSign,
      description: "Total net media investment",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Impressions",
      value: formatNumber(totalImpressions),
      icon: Eye,
      description: "Total estimated impacts",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Average CPM",
      value: formatCurrency(averageCPM),
      icon: TrendingUp,
      description: "Average cost per thousand impressions",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Total Clicks",
      value: formatNumber(totalClicks),
      icon: MousePointer,
      description: "Total estimated clicks",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <Card
          key={index}
          className="shadow-lg border-0 bg-white hover:shadow-xl transition-shadow duration-200"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                {kpi.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${kpi.bgColor}`}>
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {kpi.value}
            </div>
            <p className="text-xs text-gray-500">{kpi.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
