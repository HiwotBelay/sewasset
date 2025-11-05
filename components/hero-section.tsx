"use client"

import Link from "next/link"
import { ArrowRight, TrendingUp, BarChart3 } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F8F9FA] to-white pt-20 pb-32">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FDC700]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#3B5998]/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 bg-[#FDC700]/10 text-[#2E4059] rounded-full text-sm font-semibold">
                ✨ Trusted by 500+ Companies
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-[#2E4059] leading-tight">
                Calculate Your <span className="bg-gradient-accent bg-clip-text text-transparent">Real ROI</span>
              </h1>
              <p className="text-xl text-[#6B7280] leading-relaxed">
                Stop guessing. Get detailed insights into your investment returns with AI-powered predictions and
                comprehensive analysis.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/calculator"
                className="px-8 py-4 bg-[#2E4059] text-white font-bold rounded-lg hover:bg-[#1A1F2E] transition-smooth flex items-center justify-center gap-2 group"
              >
                Start Free Analysis
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-smooth" />
              </Link>
              <button className="px-8 py-4 border-2 border-[#2E4059] text-[#2E4059] font-bold rounded-lg hover:bg-[#2E4059]/5 transition-smooth">
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-[#E5E7EB]">
              <div>
                <div className="text-3xl font-bold text-[#FDC700]">98%</div>
                <p className="text-sm text-[#6B7280]">Accuracy Rate</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#10B981]">2M+</div>
                <p className="text-sm text-[#6B7280]">Calculations</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#3B5998]">15min</div>
                <p className="text-sm text-[#6B7280]">Avg. Setup</p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative h-96 md:h-[500px]">
            <div className="absolute inset-0 bg-gradient-primary rounded-2xl opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#FDC700]/20 to-[#3B5998]/20 rounded-2xl backdrop-blur-xl border border-white/40 hover:shadow-2xl transition-smooth">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-6">
                  <div className="flex justify-center gap-4">
                    <div className="w-20 h-20 rounded-xl bg-[#FDC700] flex items-center justify-center text-2xl hover:scale-110 transition-smooth">
                      <BarChart3 className="text-[#2E4059]" size={40} />
                    </div>
                    <div className="w-20 h-20 rounded-xl bg-[#3B5998] flex items-center justify-center text-2xl hover:scale-110 transition-smooth">
                      <TrendingUp className="text-white" size={40} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[#6B7280] text-sm">Your ROI Awaits</p>
                    <p className="text-4xl font-bold text-[#2E4059]">+245%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
