"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Shield, FileText, Lock } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Card className="p-6 sm:p-8 md:p-10 bg-white shadow-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FFC72F] rounded-full mb-4">
              <Shield className="w-8 h-8 text-[#2E4059]" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#2E4059] mb-4">
              Privacy & Engagement Terms
            </h1>
            <p className="text-slate-600 text-lg">
              Please read and accept the following terms before proceeding
            </p>
          </div>

          <div className="space-y-6 mb-8">
            <section>
              <h2 className="text-xl font-bold text-[#2E4059] mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                The SewAsset Value Exchange: Terms for Strategic Analysis
              </h2>
              <div className="space-y-3 text-slate-700">
                <p>
                  By using the Sew Asset Strategic Business Case Builder, you
                  acknowledge and agree to the following terms and conditions:
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#2E4059] mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Confidentiality & Data Protection
              </h2>
              <div className="space-y-3 text-slate-700">
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Your proprietary organizational data (salaries, turnover,
                    goals) is <strong>exclusively</strong> used to generate your{" "}
                    <strong>
                      Executive-Ready Business Case and Strategic Proposal.
                    </strong>
                  </li>
                  <li>
                    Your detailed report, including the{" "}
                    <strong>Scenario ROI Forecast</strong>, will be{" "}
                    <strong>instantly emailed</strong> to the professional
                    address provided.
                  </li>
                  <li>
                    <strong>Guaranteed Follow-Up:</strong> A SewAsset Senior
                    Consultant will contact you within <strong>24 hours</strong>{" "}
                    to walk through your detailed results and finalize your
                    Strategic Proposal.
                  </li>
                  <li>
                    We adhere to strict data privacy protocols. Your information
                    is <strong>never</strong> shared, sold, or distributed to
                    third parties.
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#2E4059] mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Data Integrity Notice
              </h2>
              <div className="space-y-3 text-slate-700">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <p className="text-sm font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                    ⚠️ Warning
                  </p>
                  <p className="text-sm text-yellow-700">
                    The predictive power of your <strong>ROI</strong> forecast
                    and the accuracy of your{" "}
                    <strong>7-Pillar Competency Map</strong> depends entirely on
                    the integrity of the data you enter. Please ensure all
                    financial and organizational inputs are verified.{" "}
                    <strong>
                      Inaccurate data will result in an inaccurate,
                      non-actionable Strategic Proposal.
                    </strong>
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#2E4059] mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Strategic Analysis Notice
              </h2>
              <div className="space-y-3 text-slate-700">
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    The ROI projections, business case analysis, SPSC
                    diagnostic, and Competency Mapping are strategic estimates
                    derived from your input, compared against our 7-Pillar
                    industry benchmarks.
                  </li>
                  <li>
                    Results constitute a strategic diagnostic proposal and
                    should not be interpreted as certified financial, tax, or
                    legal advice.
                  </li>
                  <li>
                    Sew Asset provides this tool to support your internal
                    decision-making process. We are not liable for subsequent
                    business decisions, outcomes, or variances from the
                    projected ROI.
                  </li>
                </ul>
              </div>
            </section>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 border-t">
            <Button
              asChild
              className="bg-[#2E4059] text-white hover:bg-[#1A1F2E]"
            >
              <Link href="/">Back to Home</Link>
            </Button>
            <Button
              onClick={() => {
                if (typeof window !== "undefined") {
                  sessionStorage.setItem("disclaimerAccepted", "true");
                  window.location.href = "/route-selection";
                }
              }}
              className="bg-[#FFC72F] text-[#2E4059] font-bold hover:bg-[#FFC72F]/90"
            >
              I Accept - Build My Strategic Business Case
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
