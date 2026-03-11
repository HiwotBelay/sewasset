"use client";

import { forwardRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { TrendingUp, DollarSign, BarChart3 } from "lucide-react";

interface ResultsProps {
  results: {
    roi: string;
    gain: string;
    totalCost: string;
    currentValue: string;
    annualROI: string;
    projections: any[];
    timestamp: string;
  };
}

// Create a chart component that imports all recharts components
const ChartComponent = dynamic(
  () =>
    import("recharts").then((mod) => {
      const {
        ResponsiveContainer,
        AreaChart,
        Area,
        XAxis,
        YAxis,
        CartesianGrid,
        Tooltip,
      } = mod;

      const Chart = ({ data }: { data: any[] }) => {
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FDC700" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FDC700" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#F8F9FA",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#FDC700"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      };

      return Chart;
    }),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] flex items-center justify-center text-[#6B7280]">
        Loading chart...
      </div>
    ),
  }
);

export const ResultsDashboard = forwardRef<HTMLDivElement, ResultsProps>(
  ({ results }, ref) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
    }, []);

    const roiPercentage = Number.parseFloat(results.roi);
    const isPositive = roiPercentage >= 0;

    return (
      <div ref={ref} className="space-y-6">
        {/* Main ROI Card */}
        <Card className="p-8 bg-gradient-to-br from-[#2E4059] to-[#3B5998] text-white">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-white/80 text-sm mb-2">
                Your Return on Investment
              </p>
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-5xl font-bold ${
                    isPositive ? "text-[#FDC700]" : "text-red-400"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {results.roi}%
                </span>
                <span
                  className={`text-xl ${
                    isPositive ? "text-[#10B981]" : "text-red-400"
                  }`}
                >
                  {isPositive ? "📈" : "📉"}
                </span>
              </div>
            </div>
            <TrendingUp size={40} className="text-[#FDC700]" />
          </div>
        </Card>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-6 bg-white border border-[#E5E7EB]">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign size={20} className="text-[#FDC700]" />
              <p className="text-xs text-[#6B7280]">Total Gain</p>
            </div>
            <p className="text-2xl font-bold text-[#2E4059]">
              ${Number.parseFloat(results.gain).toLocaleString()}
            </p>
          </Card>
          <Card className="p-6 bg-white border border-[#E5E7EB]">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 size={20} className="text-[#3B5998]" />
              <p className="text-xs text-[#6B7280]">Total Cost</p>
            </div>
            <p className="text-2xl font-bold text-[#2E4059]">
              ${Number.parseFloat(results.totalCost).toLocaleString()}
            </p>
          </Card>
          <Card className="p-6 bg-white border border-[#E5E7EB]">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp size={20} className="text-[#10B981]" />
              <p className="text-xs text-[#6B7280]">Annual ROI</p>
            </div>
            <p className="text-2xl font-bold text-[#2E4059]">
              {results.annualROI}%
            </p>
          </Card>
        </div>

        {/* Chart */}
        <Card className="p-6 bg-white">
          <h3 className="font-bold text-[#2E4059] mb-6">12-Month Projection</h3>
          {isClient && <ChartComponent data={results.projections} />}
        </Card>
      </div>
    );
  }
);

ResultsDashboard.displayName = "ResultsDashboard";
