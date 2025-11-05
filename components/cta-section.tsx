"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-premium text-white">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold leading-tight">Ready to Unlock Your Investment Potential?</h2>
        <p className="text-xl text-white/80">
          Join hundreds of companies making smarter investment decisions every day
        </p>
        <Link
          href="/calculator"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#FDC700] text-[#2E4059] font-bold rounded-lg hover:bg-white transition-smooth group"
        >
          Calculate Your ROI Now
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-smooth" />
        </Link>
      </div>
    </section>
  )
}
