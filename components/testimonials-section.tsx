"use client"

import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CFO at TechVentures",
      content:
        "SewAsset transformed how we track investment performance. The accuracy and insights are unmatched in the industry.",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Investment Manager",
      content:
        "The ROI calculator saved us countless hours in manual analysis. Now we make data-driven decisions with confidence.",
      rating: 5,
    },
    {
      name: "Emily Watson",
      role: "Founder at GrowthCo",
      content:
        "Professional reports we generate are impressive to share with stakeholders. Highly recommended for serious investors.",
      rating: 5,
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2E4059]">Trusted by Investment Professionals</h2>
          <p className="text-xl text-[#6B7280] max-w-2xl mx-auto">
            See what industry leaders say about SewAsset ROI Calculator
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <Card key={idx} className="p-8 bg-[#F8F9FA] border border-[#E5E7EB] hover:shadow-lg transition-smooth">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={18} className="fill-[#FDC700] text-[#FDC700]" />
                ))}
              </div>
              <p className="text-[#6B7280] leading-relaxed mb-6">"{testimonial.content}"</p>
              <div>
                <p className="font-bold text-[#2E4059]">{testimonial.name}</p>
                <p className="text-sm text-[#6B7280]">{testimonial.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
