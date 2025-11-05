"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Download, Loader2 } from "lucide-react";

interface ReportGeneratorProps {
  results: any;
  formData: any;
  reportRef: React.RefObject<HTMLDivElement>;
}

export function ReportGenerator({
  results,
  formData,
  reportRef,
}: ReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);

    try {
      // Dynamically import html2pdf only on client side
      const html2pdf = (await import("html2pdf.js")).default;

      const element = document.createElement("div");
      element.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 40px; background: white;">
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #FDC700; padding-bottom: 20px;">
          <h1 style="color: #2E4059; margin: 0; font-size: 32px;">ROI Analysis Report</h1>
          <p style="color: #6B7280; margin: 10px 0 0 0;">SewAsset - Investment Intelligence</p>
        </div>

        <div style="margin-bottom: 40px;">
          <h2 style="color: #2E4059; font-size: 24px; border-left: 4px solid #FDC700; padding-left: 15px; margin: 0 0 20px 0;">Executive Summary</h2>
          <p style="color: #6B7280; line-height: 1.6;">
            This comprehensive ROI analysis provides detailed insights into your investment performance. 
            The following report details your current returns, projections, and recommendations.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px;">
          <div style="background: #F8F9FA; padding: 20px; border-radius: 8px; border-left: 4px solid #FDC700;">
            <p style="color: #6B7280; font-size: 12px; margin: 0 0 10px 0; text-transform: uppercase;">Return on Investment</p>
            <p style="color: #2E4059; font-size: 28px; font-weight: bold; margin: 0;">${
              results.roi
            }%</p>
          </div>
          <div style="background: #F8F9FA; padding: 20px; border-radius: 8px; border-left: 4px solid #3B5998;">
            <p style="color: #6B7280; font-size: 12px; margin: 0 0 10px 0; text-transform: uppercase;">Total Gain</p>
            <p style="color: #2E4059; font-size: 28px; font-weight: bold; margin: 0;">$${Number.parseFloat(
              results.gain
            ).toLocaleString()}</p>
          </div>
          <div style="background: #F8F9FA; padding: 20px; border-radius: 8px; border-left: 4px solid #10B981;">
            <p style="color: #6B7280; font-size: 12px; margin: 0 0 10px 0; text-transform: uppercase;">Annual ROI</p>
            <p style="color: #2E4059; font-size: 28px; font-weight: bold; margin: 0;">${
              results.annualROI
            }%</p>
          </div>
          <div style="background: #F8F9FA; padding: 20px; border-radius: 8px; border-left: 4px solid #06B6D4;">
            <p style="color: #6B7280; font-size: 12px; margin: 0 0 10px 0; text-transform: uppercase;">Current Value</p>
            <p style="color: #2E4059; font-size: 28px; font-weight: bold; margin: 0;">$${Number.parseFloat(
              results.currentValue
            ).toLocaleString()}</p>
          </div>
        </div>

        <div style="margin-bottom: 40px;">
          <h2 style="color: #2E4059; font-size: 24px; border-left: 4px solid #FDC700; padding-left: 15px; margin: 0 0 20px 0;">Investment Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background: #F8F9FA;">
              <td style="padding: 12px; border: 1px solid #E5E7EB; color: #6B7280; font-weight: bold;">Initial Investment</td>
              <td style="padding: 12px; border: 1px solid #E5E7EB; color: #2E4059; font-weight: bold;">$${Number.parseFloat(
                formData?.initialInvestment || 0
              ).toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #E5E7EB; color: #6B7280; font-weight: bold;">Additional Costs</td>
              <td style="padding: 12px; border: 1px solid #E5E7EB; color: #2E4059; font-weight: bold;">$${Number.parseFloat(
                formData?.additionalCosts || 0
              ).toLocaleString()}</td>
            </tr>
            <tr style="background: #F8F9FA;">
              <td style="padding: 12px; border: 1px solid #E5E7EB; color: #6B7280; font-weight: bold;">Investment Period</td>
              <td style="padding: 12px; border: 1px solid #E5E7EB; color: #2E4059; font-weight: bold;">${
                formData?.investmentPeriod || 0
              } Year(s)</td>
            </tr>
          </table>
        </div>

        <div style="margin-bottom: 40px;">
          <h2 style="color: #2E4059; font-size: 24px; border-left: 4px solid #FDC700; padding-left: 15px; margin: 0 0 20px 0;">Key Insights & Recommendations</h2>
          <ul style="color: #6B7280; line-height: 1.8;">
            <li>✓ Your investment has delivered a strong return, indicating solid financial performance.</li>
            <li>✓ Consider diversifying your portfolio to manage risk and maximize returns.</li>
            <li>✓ Monitor market conditions quarterly to ensure your investment aligns with your goals.</li>
            <li>✓ Reinvesting gains can compound your returns significantly over time.</li>
          </ul>
        </div>

        <div style="background: #F8F9FA; padding: 20px; border-radius: 8px; text-align: center; color: #6B7280; font-size: 12px;">
          <p style="margin: 0;">Report Generated: ${results.timestamp}</p>
          <p style="margin: 5px 0 0 0;">SewAsset ROI Calculator - Trusted by 500+ Companies</p>
        </div>
      </div>
    `;

      const options = {
        margin: 10,
        filename: `SewAsset-ROI-Report-${
          new Date().toISOString().split("T")[0]
        }.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
      };

      html2pdf().set(options).from(element).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-8 bg-white border-2 border-[#FDC700]/30">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-lg bg-[#FDC700]/10 flex items-center justify-center">
          <FileText className="text-[#FDC700]" size={28} />
        </div>
        <div>
          <h3 className="font-bold text-[#2E4059]">Generate Report</h3>
          <p className="text-sm text-[#6B7280]">
            Download detailed PDF with all insights
          </p>
        </div>
      </div>

      <Button
        onClick={generatePDF}
        disabled={isGenerating}
        className="w-full bg-[#2E4059] text-white font-bold py-3 rounded-lg hover:bg-[#1A1F2E] transition-smooth flex items-center justify-center gap-2"
      >
        {isGenerating ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Download size={20} />
            Download PDF Report
          </>
        )}
      </Button>

      <p className="text-xs text-[#6B7280] mt-4 text-center">
        Your report includes detailed analysis, projections, and actionable
        recommendations
      </p>
    </Card>
  );
}
