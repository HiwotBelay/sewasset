"use client"

import { CheckCircle2, AlertCircle, Lightbulb } from "lucide-react"

export function WhySection() {
  const reasons = [
    {
      icon: AlertCircle,
      title: "Stop Guessing on Returns",
      description:
        "No more uncertainty. Get precise, data-driven ROI calculations backed by AI analysis and predictive models.",
    },
    {
      icon: Lightbulb,
      title: "Data-Driven Decisions",
      description:
        "Make confident business decisions with comprehensive insights that reveal hidden opportunities and risks.",
    },
    {
      icon: CheckCircle2,
      title: "Detailed Reports",
      description:
        "Export professional PDF reports with visual charts, forecasts, and actionable recommendations for stakeholders.",
    },
  ]

  return (
    <section id="why" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2E4059]">Why Choose SewAsset ROI?</h2>
          <p className="text-xl text-[#6B7280] max-w-2xl mx-auto">
            Every business needs clarity on investment performance. We provide the intelligence you need.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reasons.map((reason, idx) => {
            const Icon = reason.icon
            return (
              <div
                key={idx}
                className="p-8 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] hover:border-[#FDC700] hover:shadow-lg transition-smooth group"
              >
                <div className="w-14 h-14 rounded-lg bg-[#FDC700] flex items-center justify-center mb-6 group-hover:scale-110 transition-smooth">
                  <Icon className="text-[#2E4059]" size={28} />
                </div>
                <h3 className="text-xl font-bold text-[#2E4059] mb-3">{reason.title}</h3>
                <p className="text-[#6B7280] leading-relaxed">{reason.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
