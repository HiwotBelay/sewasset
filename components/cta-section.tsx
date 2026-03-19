"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative py-24 lg:py-32 bg-gradient-to-br from-[#2E4059] via-[#1A1F2E] to-[#3B5998] text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#FDC700]/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#3B5998]/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      {/* Pattern overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10 animate-fade-in-up">
        <div className="space-y-6">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-bold leading-tight text-white">
            Ready to Transform Competency Gaps into{" "}
            <span className="gradient-text bg-gradient-to-r from-[#FDC700] to-[#F5AF19] bg-clip-text text-transparent">
              Competitive Edge?
            </span>
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Join hundreds of companies making smarter investment decisions every
            day
          </p>
        </div>
        <Link
          href="/disclaimer"
          className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#FDC700] to-[#F5AF19] text-[#2E4059] font-bold rounded-xl hover:shadow-2xl hover:scale-110 transition-extra-smooth group text-lg relative overflow-hidden"
        >
          <span className="relative z-10">Calculate Your ROI Now</span>
          <ArrowRight
            size={22}
            className="group-hover:translate-x-2 transition-extra-smooth relative z-10"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5AF19] to-[#FDC700] opacity-0 group-hover:opacity-100 transition-extra-smooth"></div>
        </Link>
      </div>
    </section>
  );
}
