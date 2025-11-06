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
              Terms & Conditions
            </h1>
            <p className="text-slate-600 text-lg">
              Please read and accept the following terms before proceeding
            </p>
          </div>

          <div className="space-y-6 mb-8">
            <section>
              <h2 className="text-xl font-bold text-[#2E4059] mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Notice & Terms of Use
              </h2>
              <div className="space-y-3 text-slate-700">
                <p>
                  By using the Sew Asset Strategic Business Case Builder, you
                  acknowledge and agree to the following terms and conditions:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    The ROI calculations and business case analysis provided are
                    estimates based on the information you provide.
                  </li>
                  <li>
                    Results are for informational purposes and should not be
                    considered as financial or legal advice.
                  </li>
                  <li>
                    Sew Asset is not responsible for decisions made based on the
                    calculator results.
                  </li>
                  <li>
                    All calculations are based on industry benchmarks and
                    assumptions that may vary in practice.
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#2E4059] mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Confidentiality & Data Protection
              </h2>
              <div className="space-y-3 text-slate-700">
                <p>We take your privacy and data security seriously:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    All information you provide is treated with strict
                    confidentiality.
                  </li>
                  <li>
                    Your business data will only be used to generate your
                    personalized ROI analysis.
                  </li>
                  <li>
                    Reports will be sent directly to the email address you
                    provide.
                  </li>
                  <li>
                    Our team will contact you using the information provided to
                    discuss your business case.
                  </li>
                  <li>
                    We do not share your information with third parties without
                    your explicit consent.
                  </li>
                  <li>
                    Data is stored securely and in compliance with data
                    protection regulations.
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#2E4059] mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Data Accuracy
              </h2>
              <div className="space-y-3 text-slate-700">
                <p>
                  <strong>Important:</strong> The accuracy of your ROI
                  calculation depends on the accuracy of the information you
                  provide.
                </p>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <p className="text-sm font-semibold text-yellow-800 mb-2">
                    ⚠️ Please ensure all data is correct
                  </p>
                  <p className="text-sm text-yellow-700">
                    Your report will be sent personally to your office, and our
                    team will be in contact with you. Providing accurate
                    information ensures you receive accurate results.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#2E4059] mb-3">
                Contact & Support
              </h2>
              <div className="space-y-2 text-slate-700">
                <p>
                  If you have any questions about these terms or need
                  assistance, please contact our support team before proceeding.
                </p>
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
                }
                window.location.href = "/calculator";
              }}
              className="bg-[#FFC72F] text-[#2E4059] font-bold hover:bg-[#FFC72F]/90"
            >
              I Accept - Proceed to Calculator
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
