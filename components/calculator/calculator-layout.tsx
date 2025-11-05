"use client"

import { useState, useRef } from "react"
import { Calculator } from "./calculator-form"
import { ResultsDashboard } from "./results-dashboard"
import { ReportGenerator } from "./report-generator"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface ROIData {
  initialInvestment: number
  currentValue: number
  investmentPeriod: number
  additionalCosts: number
  timeframe: "monthly" | "quarterly" | "yearly"
}

export function CalculatorLayout() {
  const [results, setResults] = useState<any>(null)
  const [formData, setFormData] = useState<ROIData | null>(null)
  const reportRef = useRef(null)

  const handleCalculate = (data: ROIData) => {
    setFormData(data)

    const totalCost = data.initialInvestment + data.additionalCosts
    const gain = data.currentValue - totalCost
    const roi = (gain / totalCost) * 100

    const projections = generateProjections(data)

    setResults({
      roi: roi.toFixed(2),
      gain: gain.toFixed(2),
      totalCost: totalCost.toFixed(2),
      currentValue: data.currentValue.toFixed(2),
      annualROI: (roi / (data.investmentPeriod || 1)).toFixed(2),
      projections,
      timestamp: new Date().toLocaleDateString(),
    })
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <div className="bg-gradient-premium text-white py-8 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-smooth">
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold">ROI Calculator</h1>
          <p className="text-white/80 mt-2">Calculate your return on investment with detailed insights</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <div>
            <Calculator onCalculate={handleCalculate} />
          </div>

          {/* Results */}
          <div className="space-y-6">
            {results ? (
              <>
                <ResultsDashboard results={results} ref={reportRef} />
                <ReportGenerator results={results} formData={formData} reportRef={reportRef} />
              </>
            ) : (
              <div className="h-96 bg-white rounded-xl border-2 border-dashed border-[#E5E7EB] flex items-center justify-center">
                <div className="text-center text-[#6B7280]">
                  <p className="text-lg font-semibold">Enter your investment details</p>
                  <p className="text-sm mt-2">Results will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function generateProjections(data: ROIData) {
  const projections = []
  const monthlyRate =
    ((data.currentValue / (data.initialInvestment + data.additionalCosts)) ** (1 / (data.investmentPeriod * 12)) - 1) *
    100

  for (let i = 1; i <= 12; i++) {
    const projectedValue = (data.initialInvestment + data.additionalCosts) * Math.pow(1 + monthlyRate / 100, i)
    projections.push({
      month: i,
      value: Math.round(projectedValue),
    })
  }
  return projections
}
