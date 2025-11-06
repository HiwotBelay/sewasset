"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, TrendingUp, BarChart3 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F8F9FA] to-white pt-20 pb-32">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FDC700]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#3B5998]/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8">
            <div className="space-y-3 md:space-y-4">
              <div className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-[#FDC700]/10 text-[#2E4059] rounded-full text-xs md:text-sm font-semibold">
                ✨ Trusted by 500+ Companies
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#2E4059] leading-tight">
                Calculate Your{" "}
                <span className="bg-gradient-accent bg-clip-text text-transparent">
                  Real ROI
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-[#6B7280] leading-relaxed">
                Stop guessing. Get detailed insights into your business needs
                with AI-powered predictions and comprehensive analysis.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href="/disclaimer"
                className="px-6 py-3 md:px-8 md:py-4 bg-[#2E4059] text-white font-bold rounded-lg hover:bg-[#1A1F2E] transition-smooth flex items-center justify-center gap-2 group text-sm md:text-base"
              >
                Start Free Analysis
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-smooth"
                />
              </Link>
              <button className="px-6 py-3 md:px-8 md:py-4 border-2 border-[#2E4059] text-[#2E4059] font-bold rounded-lg hover:bg-[#2E4059]/5 transition-smooth text-sm md:text-base">
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 md:pt-8 border-t border-[#E5E7EB]">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-[#FDC700]">
                  98%
                </div>
                <p className="text-xs sm:text-sm text-[#6B7280]">
                  Accuracy Rate
                </p>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-[#10B981]">
                  2M+
                </div>
                <p className="text-xs sm:text-sm text-[#6B7280]">
                  Calculations
                </p>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-[#3B5998]">
                  15min
                </div>
                <p className="text-xs sm:text-sm text-[#6B7280]">Avg. Setup</p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] flex items-center justify-center mt-8 md:mt-0">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-[#FFC72F]/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-[#2E4059]/10 rounded-full blur-2xl animate-pulse delay-300"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-[#FFC72F]/15 rounded-full blur-xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[72px] sm:w-20 md:w-28 h-[72px] sm:h-20 md:h-28 bg-[#3B5998]/15 rounded-full blur-xl"></div>

            {/* Main image container with glow effect */}
            <div className="relative w-full h-full max-w-lg mx-auto">
              {/* Glow effect behind image */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFC72F]/30 via-[#2E4059]/20 to-[#3B5998]/30 rounded-2xl md:rounded-3xl blur-xl md:blur-2xl transform scale-110"></div>

              {/* Image with rounded corners and shadow */}
              <div className="relative w-full h-full rounded-2xl md:rounded-3xl overflow-hidden shadow-xl md:shadow-2xl border-2 md:border-4 border-white/50 backdrop-blur-sm bg-gradient-to-br from-white/80 to-slate-50/80 p-2 sm:p-3 md:p-4">
                <Image
                  src="/sewasset.png"
                  alt="Sew Asset - Strategic Business Case Builder"
                  fill
                  className="object-contain rounded-xl md:rounded-2xl"
                  priority
                />
              </div>

              {/* Floating decorative elements */}
              <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-[#FFC72F] rounded-full opacity-20 blur-sm animate-bounce"></div>
              <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#2E4059] rounded-full opacity-20 blur-sm animate-bounce delay-200"></div>
              <div className="absolute top-1/2 -right-4 sm:-right-6 md:-right-8 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-[#3B5998] rounded-full opacity-30 blur-sm"></div>
              <div className="absolute bottom-1/3 -left-4 sm:-left-6 md:-left-8 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-[#FFC72F] rounded-full opacity-25 blur-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
