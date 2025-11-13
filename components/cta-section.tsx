"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-premium text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 sm:space-y-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight px-2">
          Ready to Transform Competency Gaps into Competitive Edge?
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-white/80 px-2">
          Join hundreds of companies making smarter investment decisions every
          day
        </p>
        <Link
          href="/disclaimer"
          className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-[#FDC700] text-[#2E4059] font-bold rounded-lg hover:bg-white transition-smooth group text-sm sm:text-base"
        >
          Calculate Your ROI Now
          <ArrowRight
            size={18}
            className="sm:w-5 sm:h-5 group-hover:translate-x-1 transition-smooth"
          />
        </Link>
      </div>
    </section>
  );
}
