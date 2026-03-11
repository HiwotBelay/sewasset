"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Shield, FileText, Lock, ArrowLeft, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function DisclaimerPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleAccept = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("disclaimerAccepted", "true");
      router.push("/route-selection");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FDC700]/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#3B5998]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#FDC700]/5 to-[#3B5998]/5 rounded-full blur-3xl"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {/* Back to Home Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#2E4059] font-semibold mb-6 transition-all duration-300 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          <span>Back to Home</span>
        </Link>

        <Card 
          ref={sectionRef}
          className={`p-6 sm:p-8 bg-white/95 backdrop-blur-xl shadow-2xl border-2 border-slate-200/50 rounded-2xl transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
          }`}
        >
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#FDC700] to-[#F5AF19] rounded-xl mb-4 shadow-lg transform transition-all duration-500 hover:scale-110 animate-scale-in">
              <Shield className="w-8 h-8 text-[#2E4059]" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#2E4059] mb-3 transform transition-all duration-700 delay-200">
              Privacy & Engagement Terms
            </h1>
            <p className="text-lg text-[#6B7280] max-w-xl mx-auto transform transition-all duration-700 delay-300">
              Please read and accept the following terms before proceeding
            </p>
          </div>

          <div className="space-y-6 mb-8">
            <section className={`group p-5 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 hover:border-[#FDC700] transition-all duration-300 hover:shadow-lg transform transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`} style={{ transitionDelay: '400ms' }}>
              <h2 className="text-2xl font-bold text-[#2E4059] mb-3 flex items-center gap-2 group-hover:text-[#1A1F2E] transition-colors duration-300">
                <FileText className="w-5 h-5 text-[#3B5998]" />
                Terms for Strategic Analysis
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                By using the Sew Asset Strategic Business Case Builder, you acknowledge and agree to the following terms and conditions.
              </p>
            </section>

            <section className={`group p-5 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 hover:border-[#FDC700] transition-all duration-300 hover:shadow-lg transform transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`} style={{ transitionDelay: '500ms' }}>
              <h2 className="text-2xl font-bold text-[#2E4059] mb-3 flex items-center gap-2 group-hover:text-[#1A1F2E] transition-colors duration-300">
                <Lock className="w-5 h-5 text-[#FDC700]" />
                Confidentiality & Data Protection
              </h2>
              <div className="space-y-2.5 text-sm text-slate-700 leading-relaxed">
                <p>
                  Your proprietary organizational data (salaries, turnover, goals) is <strong className="text-[#2E4059]">exclusively</strong> used to generate your <strong className="text-[#2E4059]">Executive-Ready Business Case and Strategic Proposal</strong>. Your detailed report, including the <strong className="text-[#2E4059]">Scenario ROI Forecast</strong>, will be <strong className="text-[#2E4059]">instantly emailed</strong> to the professional address provided.
                </p>
                <p>
                  <strong className="text-[#2E4059]">Guaranteed Follow-Up:</strong> A SewAsset Senior Consultant will contact you within <strong className="text-[#2E4059]">24 hours</strong> to walk through your detailed results and finalize your Strategic Proposal.
                </p>
                <p>
                  We adhere to strict data privacy protocols. Your information is <strong className="text-[#2E4059]">never</strong> shared, sold, or distributed to third parties.
                </p>
              </div>
            </section>

            <section className={`group p-5 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-300 hover:border-amber-400 transition-all duration-300 hover:shadow-lg transform transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`} style={{ transitionDelay: '600ms' }}>
              <h2 className="text-2xl font-bold text-[#2E4059] mb-3 flex items-center gap-2 group-hover:text-[#1A1F2E] transition-colors duration-300">
                <CheckCircle2 className="w-5 h-5 text-amber-600" />
                Data Integrity Notice
              </h2>
              <div className="bg-white/80 border-l-3 border-amber-500 p-4 rounded-r-lg">
                <p className="text-xs font-semibold text-amber-900 mb-2 flex items-center gap-2">
                  ⚠️ Important Warning
                </p>
                <p className="text-sm text-amber-800 leading-relaxed">
                  The predictive power of your <strong className="text-amber-900">ROI</strong> forecast and the accuracy of your <strong className="text-amber-900">7-Pillar Competency Map</strong> depends entirely on the integrity of the data you enter. Please ensure all financial and organizational inputs are verified. <strong className="text-amber-900">Inaccurate data will result in an inaccurate, non-actionable Strategic Proposal.</strong>
                </p>
              </div>
            </section>

            <section className={`group p-5 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 hover:border-[#FDC700] transition-all duration-300 hover:shadow-lg transform transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`} style={{ transitionDelay: '700ms' }}>
              <h2 className="text-2xl font-bold text-[#2E4059] mb-3 flex items-center gap-2 group-hover:text-[#1A1F2E] transition-colors duration-300">
                <FileText className="w-5 h-5 text-[#3B5998]" />
                Strategic Analysis Notice
              </h2>
              <div className="space-y-2.5 text-sm text-slate-700 leading-relaxed">
                <p>
                  The ROI projections, business case analysis, SPSC diagnostic, and Competency Mapping are strategic estimates derived from your input, compared against our 7-Pillar industry benchmarks.
                </p>
                <p>
                  Results constitute a strategic diagnostic proposal and should not be interpreted as certified financial, tax, or legal advice.
                </p>
                <p>
                  Sew Asset provides this tool to support your internal decision-making process. We are not liable for subsequent business decisions, outcomes, or variances from the projected ROI.
                </p>
              </div>
            </section>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6 border-t border-slate-200">
            <Button
              asChild
              className="px-6 py-2.5 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 relative overflow-hidden group"
            >
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                Back to Home
              </Link>
            </Button>
            <Button
              onClick={handleAccept}
              className="px-6 py-2.5 bg-gradient-to-r from-[#FDC700] via-[#F5AF19] to-[#FDC700] text-[#2E4059] font-bold rounded-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                I Accept - Build My Strategic Business Case
              </span>
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#F5AF19] via-[#FDC700] to-[#F5AF19] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
