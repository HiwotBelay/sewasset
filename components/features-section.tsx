"use client";

import { Zap, LineChart, FileText, Shield } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: "Dynamic Solution Mapping",
      description:
        "Automatically filter and match your required competency to the ideal SewAsset program or consulting service.",
    },
    {
      icon: LineChart,
      title: "Scenario Forecasting",
      description:
        "Evaluate ROI across Conservative, Expected, and Optimistic scenarios to manage risk and set realistic expectations.",
    },
    {
      icon: FileText,
      title: "Cost of Inaction Quantification",
      description:
        "Instantly calculate and present the annual financial damage of not solving the problem, reframing your investment as a preventative measure.",
    },
    {
      icon: Shield,
      title: "Customization & Urgency",
      description:
        "Factor in logistics, participant number, and delivery urgency (Priority/Rush) to get a comprehensive, final-cost proposal.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2E4059]">
            Features That Drive Business Outcomes
          </h2>
          <p className="text-xl text-[#6B7280]">
            Strategic tool functionality that transforms competency gaps into
            competitive edge
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="p-6 bg-white rounded-xl border border-[#E5E7EB] hover:shadow-lg transition-smooth"
              >
                <div className="w-12 h-12 rounded-lg bg-[#3B5998]/10 flex items-center justify-center mb-4">
                  <Icon className="text-[#3B5998]" size={24} />
                </div>
                <h3 className="font-bold text-[#2E4059] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#6B7280]">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
