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
    <section id="features" className="py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#FDC700]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#3B5998]/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20 space-y-5 animate-fade-in-up">
          <div className="inline-block px-4 py-2 bg-[#3B5998]/10 text-[#2E4059] rounded-full text-sm font-semibold mb-2">
            Powerful Features
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2E4059]">
            Features That Drive Business Outcomes
          </h2>
          <p className="text-xl text-[#6B7280] max-w-2xl mx-auto">
            Strategic tool functionality that transforms competency gaps into
            competitive edge
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group p-8 bg-white rounded-2xl border-2 border-slate-200 hover:border-[#3B5998] hover:shadow-2xl transition-extra-smooth hover-lift relative overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#3B5998]/0 to-[#FDC700]/0 group-hover:from-[#3B5998]/5 group-hover:to-[#FDC700]/5 transition-extra-smooth pointer-events-none"></div>
                
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#3B5998]/10 to-[#3B5998]/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-extra-smooth">
                    <Icon className="text-[#3B5998] group-hover:text-[#2E4059] transition-extra-smooth" size={28} />
                  </div>
                  <h3 className="font-bold text-[#2E4059] mb-3 text-lg group-hover:text-[#1A1F2E] transition-extra-smooth">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed group-hover:text-[#2E4059] transition-extra-smooth">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
