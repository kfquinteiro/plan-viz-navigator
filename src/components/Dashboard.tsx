
import React from 'react';
import { MediaPlanData } from "@/pages/Index";
import { KPICards } from "@/components/dashboard/KPICards";
import { InvestmentDistribution } from "@/components/dashboard/InvestmentDistribution";
import { DeliveryReach } from "@/components/dashboard/DeliveryReach";
import { PerformanceAnalysis } from "@/components/dashboard/PerformanceAnalysis";

interface DashboardProps {
  data: MediaPlanData[];
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <KPICards data={data} />
      <InvestmentDistribution data={data} />
      <DeliveryReach data={data} />
      <PerformanceAnalysis data={data} />
    </div>
  );
};
