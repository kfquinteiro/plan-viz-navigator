
import React, { useCallback, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { MediaPlanData } from "@/pages/Index";
import * as XLSX from 'xlsx';

interface FileUploadProps {
  onDataUpload: (data: MediaPlanData[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      // Get the first sheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      if (jsonData.length === 0) {
        throw new Error("No data found in the Excel file.");
      }

      // Validate data structure
      const requiredFields = ["CAMPANHA", "PRAÇA", "MEIO", "VEÍCULO", "MÊS"];
      const firstRecord = jsonData[0] as any;
      const missingFields = requiredFields.filter(field => !(field in firstRecord));
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }

      onDataUpload(jsonData as MediaPlanData[]);
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error(error instanceof Error ? error.message : "Error processing file");
    } finally {
      setIsProcessing(false);
    }
  }, [onDataUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const excelFile = files.find(file => 
      file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
      file.type === "application/vnd.ms-excel" ||
      file.name.endsWith('.xlsx') || 
      file.name.endsWith('.xls')
    );
    
    if (!excelFile) {
      toast.error("Please upload an Excel file (.xlsx or .xls)");
      return;
    }
    
    processFile(excelFile);
  }, [processFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  return (
    <div className="space-y-4">
      <Card 
        className={`border-2 border-dashed transition-all duration-200 ${
          isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="p-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              {isProcessing ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              ) : (
                <Upload className="w-8 h-8 text-blue-600" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isProcessing ? 'Processing file...' : 'Drop your Excel file here'}
            </h3>
            <p className="text-gray-600 mb-4">
              {isProcessing ? 'Please wait while we process your data' : 'or click to browse and select a file'}
            </p>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
              disabled={isProcessing}
            />
            <Button 
              asChild 
              variant="outline" 
              disabled={isProcessing}
              className="cursor-pointer"
            >
              <label htmlFor="file-upload">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Browse Files
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-amber-800 mb-1">File Format Requirements</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Upload an Excel file (.xlsx or .xls extension)</li>
                <li>• Data should be in the first sheet of the workbook</li>
                <li>• Required columns: CAMPANHA, PRAÇA, MEIO, VEÍCULO, MÊS</li>
                <li>• Numeric fields should be properly formatted</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
