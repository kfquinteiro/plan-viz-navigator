
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
    toast.success(`Successfully loaded ${uploadedData.length} media plan records!`);
  };

  const handleReset = () => {
    setData([]);
    setIsDataLoaded(false);
    toast.info("Dashboard reset. Upload new data to continue.");
  };

  if (!isDataLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Media Plan Dashboard
            </h1>
            <p className="text-xl text-gray-600">
              Upload your media plan data to generate comprehensive analytics and insights
            </p>
          </div>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FileSpreadsheet className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Upload Media Plan Data</CardTitle>
              <CardDescription className="text-lg">
                Upload your JSON file containing media plan records to start analyzing
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
                <h3 className="font-semibold text-gray-900 mb-2">Comprehensive Analytics</h3>
                <p className="text-gray-600 text-sm">Get insights into investment distribution, performance metrics, and delivery analysis</p>
              </CardContent>
            </Card>
            <Card className="bg-white/60 backdrop-blur-sm border-0">
              <CardContent className="p-6 text-center">
                <Upload className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Easy Data Import</h3>
                <p className="text-gray-600 text-sm">Simply drag and drop your JSON file or click to browse and upload</p>
              </CardContent>
            </Card>
            <Card className="bg-white/60 backdrop-blur-sm border-0">
              <CardContent className="p-6 text-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold text-sm">KPI</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Key Performance Indicators</h3>
                <p className="text-gray-600 text-sm">Monitor total investment, impressions, CPM, clicks and other critical metrics</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Media Plan Dashboard</h1>
            <p className="text-gray-600">{data.length} records loaded</p>
          </div>
          <Button onClick={handleReset} variant="outline">
            Upload New Data
          </Button>
        </div>
      </div>
      <Dashboard data={data} />
    </div>
  );
};

export default Index;
