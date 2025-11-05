"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface ROIData {
  initialInvestment: number
  currentValue: number
  investmentPeriod: number
  additionalCosts: number
  timeframe: "monthly" | "quarterly" | "yearly"
}

interface CalculatorProps {
  onCalculate: (data: ROIData) => void
}

export function Calculator({ onCalculate }: CalculatorProps) {
  const [formData, setFormData] = useState<ROIData>({
    initialInvestment: 10000,
    currentValue: 15000,
    investmentPeriod: 1,
    additionalCosts: 500,
    timeframe: "yearly",
  })

  const handleInputChange = (field: keyof ROIData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCalculate(formData)
  }

  return (
    <Card className="p-8 bg-white sticky top-32 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#2E4059] mb-2">Investment Details</h2>
        <p className="text-[#6B7280]">Enter your investment information below</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Initial Investment */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#2E4059]">Initial Investment ($)</label>
          <Input
            type="number"
            value={formData.initialInvestment}
            onChange={(e) => handleInputChange("initialInvestment", Number(e.target.value))}
            className="border border-[#E5E7EB]"
            placeholder="Enter amount"
          />
          <p className="text-xs text-[#6B7280]">Total amount invested initially</p>
        </div>

        {/* Current Value */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#2E4059]">Current Value ($)</label>
          <Input
            type="number"
            value={formData.currentValue}
            onChange={(e) => handleInputChange("currentValue", Number(e.target.value))}
            className="border border-[#E5E7EB]"
            placeholder="Enter amount"
          />
          <p className="text-xs text-[#6B7280]">What is your investment worth today?</p>
        </div>

        {/* Investment Period */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#2E4059]">Investment Period (Years)</label>
          <Input
            type="number"
            value={formData.investmentPeriod}
            onChange={(e) => handleInputChange("investmentPeriod", Number(e.target.value))}
            className="border border-[#E5E7EB]"
            placeholder="Enter years"
          />
          <p className="text-xs text-[#6B7280]">How long have you held this investment?</p>
        </div>

        {/* Additional Costs */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#2E4059]">Additional Costs ($)</label>
          <Input
            type="number"
            value={formData.additionalCosts}
            onChange={(e) => handleInputChange("additionalCosts", Number(e.target.value))}
            className="border border-[#E5E7EB]"
            placeholder="Fees, maintenance, etc."
          />
          <p className="text-xs text-[#6B7280]">Fees, maintenance, or other costs</p>
        </div>

        {/* Timeframe */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#2E4059]">Reporting Period</label>
          <select
            value={formData.timeframe}
            onChange={(e) => handleInputChange("timeframe", e.target.value as any)}
            className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg text-[#2E4059] bg-white hover:border-[#FDC700] transition-smooth focus:outline-none focus:ring-2 focus:ring-[#FDC700]/50"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#FDC700] text-[#2E4059] font-bold py-3 rounded-lg hover:bg-[#F5AF19] transition-smooth text-base"
        >
          Calculate ROI
        </Button>
      </form>
    </Card>
  )
}
