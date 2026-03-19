"use client";

import { CheckCircle2, AlertCircle, Lightbulb } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function WhySection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const reasons = [
    {
      icon: AlertCircle,
      title: "Map Competency Gaps to ROI",
      description:
        "Pinpoint the exact competency shortfall (e.g., Delegation, Process Adherence) causing your business pain, then quantify the financial return of fixing it.",
    },
    {
      icon: Lightbulb,
      title: "Strategic Alignment Framework",
      description:
        "Ensure every learning hour supports your top priority (Growth, Operational Excellence, Talent Retention) using our proprietary 7-Pillar methodology.",
    },
    {
      icon: CheckCircle2,
      title: "Executive-Ready Proposal",
      description:
        "Generate a clear, story-driven business case that contextualizes investment cost against risk and the Cost of Inaction for your CFO and board.",
    },
  ];

  return (
    <section id="why" ref={sectionRef} className="py-24 bg-gradient-to-b from-white via-slate-50/50 to-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#3B5998]/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FDC700]/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-20 space-y-5 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-block px-4 py-2 bg-[#3B5998]/10 text-[#2E4059] rounded-full text-sm font-semibold mb-2 transform transition-all duration-700 delay-200">
            Why Choose Us
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2E4059] transform transition-all duration-700 delay-300">
            The SewAsset Diagnostic Advantage
          </h2>
          <p className="text-xl text-[#6B7280] max-w-2xl mx-auto transform transition-all duration-700 delay-500">
            Every business needs clarity on their strategic training needs. We
            provide the intelligence and insights you need to make confident
            decisions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
          {reasons.map((reason, idx) => {
            const Icon = reason.icon;
            return (
              <div
                key={idx}
                className={`group p-8 lg:p-10 rounded-2xl bg-white border-2 border-slate-200 hover:border-[#FDC700] hover:shadow-2xl transition-all duration-500 hover-lift relative overflow-hidden transform ${
                  isVisible 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-20 scale-95'
                }`}
                style={{ 
                  transitionDelay: `${idx * 200 + 600}ms`,
                  transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {/* Animated gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FDC700]/0 via-[#3B5998]/0 to-[#FDC700]/0 group-hover:from-[#FDC700]/10 group-hover:via-[#3B5998]/5 group-hover:to-[#FDC700]/10 transition-all duration-500 pointer-events-none"></div>
                
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FDC700] to-[#F5AF19] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-xl transition-all duration-500 shadow-lg transform">
                    <Icon className="text-[#2E4059] group-hover:scale-110 transition-transform duration-500" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#2E4059] mb-4 group-hover:text-[#1A1F2E] group-hover:translate-x-1 transition-all duration-500">
                    {reason.title}
                  </h3>
                  <p className="text-[#6B7280] leading-relaxed text-base group-hover:text-[#2E4059] transition-all duration-500">
                    {reason.description}
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
