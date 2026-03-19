"use client";

import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Alemayehu Bekele",
      role: "CFO at TechVentures Ethiopia",
      content:
        "Before SewAsset, training budgets were guesswork. Now, we treat L&D as a 6-month payback asset. The strategic narrative is invaluable for board reporting.",
      rating: 5,
    },
    {
      name: "Meron Tadesse",
      role: "Investment Manager",
      content:
        "We no longer debate the training goal. The 7-Pillar diagnostic forces alignment, guaranteeing every program targets a measurable, strategic priority.",
      rating: 5,
    },
    {
      name: "Yonas Gebremariam",
      role: "Head of HR/L&D",
      content:
        "The tool saved us 50+ hours of manual analysis. It shifts the conversation with the CFO from 'cost' to 'closing the competency gap'—we get approvals faster.",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#FDC700]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#3B5998]/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20 space-y-5 animate-fade-in-up">
          <div className="inline-block px-4 py-2 bg-[#FDC700]/10 text-[#2E4059] rounded-full text-sm font-semibold mb-2">
            Testimonials
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2E4059]">
            Trusted by Investment Professionals
          </h2>
          <p className="text-xl text-[#6B7280] max-w-2xl mx-auto">
            See what industry leaders say about SewAsset ROI Calculator
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
          {testimonials.map((testimonial, idx) => (
            <Card
              key={idx}
              className="group p-8 bg-white border border-slate-200 rounded-2xl hover:border-[#FDC700] hover:shadow-2xl transition-extra-smooth hover-lift relative overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FDC700]/0 to-[#3B5998]/0 group-hover:from-[#FDC700]/5 group-hover:to-[#3B5998]/5 transition-extra-smooth pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className="fill-[#FDC700] text-[#FDC700] group-hover:scale-110 transition-extra-smooth"
                      style={{ transitionDelay: `${i * 50}ms` }}
                    />
                  ))}
                </div>
                <p className="text-[#6B7280] leading-relaxed mb-8 text-base group-hover:text-[#2E4059] transition-extra-smooth">
                  "{testimonial.content}"
                </p>
                <div className="pt-6 border-t border-slate-100 group-hover:border-[#FDC700]/30 transition-extra-smooth">
                  <p className="font-bold text-[#2E4059] text-lg mb-1">{testimonial.name}</p>
                  <p className="text-sm text-[#6B7280]">{testimonial.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
