"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, TrendingUp, BarChart3 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50 min-h-screen flex items-start pt-8 pb-16">
      {/* Animated decorative elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#FDC700]/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#3B5998]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-[#FDC700]/5 to-[#3B5998]/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full mt-4">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 animate-fade-in-up">
            <div className="space-y-5">
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-[#FDC700]/20 to-[#FDC700]/10 text-[#2E4059] rounded-full text-sm font-semibold border border-[#FDC700]/30 hover:scale-105 transition-extra-smooth cursor-default">
                ✨ Trusted by 500+ Companies
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-bold text-[#2E4059] leading-tight">
                Justify Your{" "}
                <span className="gradient-text">
                  L&D Investment.
                </span>{" "}
                Start with Strategy.
              </h1>
              <p className="text-lg sm:text-xl md:text-xl text-[#6B7280] leading-relaxed">
                Transform training conversations from 'cost' to 'investment.'
                Use our{" "}
                <span className="font-semibold text-[#2E4059] relative">
                  SPSC diagnostic
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-[#FDC700]/30 -z-10"></span>
                </span>{" "}
                and{" "}
                <span className="font-semibold text-[#2E4059] relative">
                  7-Pillar methodology
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-[#FDC700]/30 -z-10"></span>
                </span>{" "}
                to map competency gaps to quantifiable business impact.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/disclaimer"
                className="group px-8 py-3.5 bg-gradient-to-r from-[#2E4059] to-[#1A1F2E] text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-extra-smooth flex items-center justify-center gap-2 text-base relative overflow-hidden"
              >
                <span className="relative z-10">Build My Strategic Business Case</span>
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-2 transition-extra-smooth relative z-10"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1A1F2E] to-[#2E4059] opacity-0 group-hover:opacity-100 transition-extra-smooth"></div>
              </Link>
              <button className="px-8 py-3.5 border-2 border-[#2E4059] text-[#2E4059] font-bold rounded-xl hover:bg-[#2E4059] hover:text-white hover:shadow-xl hover:scale-105 transition-extra-smooth text-base">
                Watch Demo
              </button>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative h-[400px] sm:h-[450px] md:h-[500px] flex items-center justify-center mt-8 md:mt-0 animate-fade-in-up delay-300">
            {/* Subtle decorative circles */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#FFC72F]/15 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#2E4059]/10 rounded-full blur-2xl"></div>

            {/* Main image container - clean and professional */}
            <div className="relative w-full h-full max-w-md mx-auto group">
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFC72F]/20 via-[#2E4059]/15 to-[#3B5998]/20 rounded-2xl blur-xl transform scale-105"></div>

              {/* Image container - clean and professional */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl border-2 border-white/80 backdrop-blur-sm bg-white p-6 group-hover:shadow-2xl transition-extra-smooth">
                <Image
                  src="/sewasset.png"
                  alt="Sew Asset - Strategic Business Case Builder"
                  fill
                  className="object-contain rounded-xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
