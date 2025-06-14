
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { FileUpload } from "@/components/FileUpload";
import { Dashboard } from "@/components/Dashboard";

export interface MediaPlanData {
  "STATUS MIDIA": string;
  "STATUS MATERIAL": string;
  "CHECKING": string;
  "CAMPANHA": string;
  "PRAÇA": string;
  "MEIO": string;
  "VEÍCULO": string;
  "APROVEITAMENTO / PROGRAMAÇÃO": string;
  "FORMATO": string;
  "MÊS": string;
  "INS": number;
  "R$ TABELA UNITÁRIO": string;
  "DESC.": string;
  "R$ NEGOCIADO UNITÁRIO": string;
  "R$ NEGOCIADO TOTAL \n(LÍQUIDO)": string;
  "R$ NEGOCIADO  TOTAL\n(BRUTO 20%)": string;
  "IA": string;
  "GRP": number;
  "IMPACTOS                   ESTIMADOS": number;
  "CPM": string;
  "UNIVERSO": string;
  "CLIQUES": number;
  "CTR": string;
  "CPC": string;
  "LEAD": string;
  "CPL": string;
  "CONVERSÃO": string;
  "CPA": string;
  "RECEITA (R$)": string;
}

const Index = () => {
  const [data, setData] = useState<MediaPlanData[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const handleDataUpload = (uploadedData: MediaPlanData[]) => {
    setData(uploadedData);
    setIsDataLoaded(true);
    toast.success(`Carregado com sucesso ${uploadedData.length} registros de planejamento de mídia!`);
  };

  const handleReset = () => {
    setData([]);
    setIsDataLoaded(false);
    toast.info("O dashboard resetou. Suba novos dados para continuar.");
  };

  if (!isDataLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Dashboard de Plano de Mídia
            </h1>
            <p className="text-xl text-gray-600">
              Suba seu plano de mídia aqui para gerar análises e insights da campanha
            </p>
          </div>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FileSpreadsheet className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Suba o arquivo do planejamento</CardTitle>
              <CardDescription className="text-lg">
                Vamos começar a análisar seu plano de mídia agora?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload onDataUpload={handleDataUpload} />
            </CardContent>
          </Card>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/60 backdrop-blur-sm border-0">
              <CardContent className="p-6 text-center">
                <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Análises poderosas</h3>
                <p className="text-gray-600 text-sm">Encontre insights sobre investimento, distribuição, métricas de performance, e entregue inteligência para o cliente.</p>
              </CardContent>
            </Card>
            <Card className="bg-white/60 backdrop-blur-sm border-0">
              <CardContent className="p-6 text-center">
                <Upload className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Fácil de importar</h3>
                <p className="text-gray-600 text-sm">Apenas arraste e solte seu arquivo de Excel ou clique para buscar no computador</p>
              </CardContent>
            </Card>
            <Card className="bg-white/60 backdrop-blur-sm border-0">
              <CardContent className="p-6 text-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold text-sm">KPI</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Indicadores de performance</h3>
                <p className="text-gray-600 text-sm">Monitore o total do investimento, impressões, CPM, cliques e outras métricas-chave</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard de Planejamento de Mídia</h1>
            <p className="text-gray-600">{data.length} registros carregados</p>
          </div>
          <Button onClick={handleReset} variant="outline">
            Carregue novos dados
          </Button>
        </div>
      </div>
      <Dashboard data={data} />
    </div>
  );
};

export default Index;
