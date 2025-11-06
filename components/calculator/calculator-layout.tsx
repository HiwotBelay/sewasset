"use client";

import { BusinessCaseForm } from "./business-case-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function CalculatorLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2E4059] to-[#3E587C] text-white py-4 sm:py-6 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-3 sm:px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/80 hover:text-white mb-2 sm:mb-3 transition-smooth text-sm sm:text-base"
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      <BusinessCaseForm />
    </div>
  );
}
