"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, GraduationCap, Briefcase, HelpCircle } from "lucide-react";

export default function RouteSelectionPage() {
  const router = useRouter();
  const [selectedRoute, setSelectedRoute] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");

  const handleRouteSelect = (route: string) => {
    setSelectedRoute(route);
    if (route === "training") {
      // Store selections and navigate to training flow
      if (typeof window !== "undefined") {
        sessionStorage.setItem("selectedRoute", route);
        if (selectedRole) {
          sessionStorage.setItem("selectedRole", selectedRole);
        }
      }
      router.push("/training");
    } else if (route === "consulting") {
      // TODO: Implement consulting route later
      alert("Consulting route coming soon!");
    } else if (route === "not-sure") {
      // TODO: Implement decision helper later
      alert("Decision helper coming soon!");
    }
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("selectedRole", role);
    }
  };

  const handleContinue = () => {
    if (!selectedRoute) {
      alert("Please select what you need");
      return;
    }
    handleRouteSelect(selectedRoute);
  };

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
            <span>Back To Home</span>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#2E4059] mb-4">
            SewAsset Catalyst™ - Business Case Builder
          </h1>
        </div>

        <Card className="p-6 sm:p-8 bg-white shadow-lg mb-6">
          <h2 className="text-2xl font-bold text-[#2E4059] mb-6">
            What do you need right now?
          </h2>

          <div className="space-y-4 mb-8">
            {/* Training Route */}
            <button
              onClick={() => setSelectedRoute("training")}
              className={`w-full text-left p-6 rounded-lg border-2 transition-all ${
                selectedRoute === "training"
                  ? "border-[#FFC72F] bg-[#FFC72F]/10"
                  : "border-slate-200 hover:border-[#FFC72F]/50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedRoute === "training"
                      ? "border-[#FFC72F] bg-[#FFC72F]"
                      : "border-slate-300"
                  }`}
                >
                  {selectedRoute === "training" && (
                    <div className="w-3 h-3 rounded-full bg-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <GraduationCap className="w-6 h-6 text-[#2E4059]" />
                    <h3 className="text-xl font-semibold text-[#2E4059]">
                      Training & Development Only
                    </h3>
                  </div>
                  <p className="text-slate-600">
                    I want a training program or 1-2 day session. Show me
                    courses, prices and a simple ROI estimate.
                  </p>
                </div>
              </div>
            </button>

            {/* Consulting Route */}
            <button
              onClick={() => setSelectedRoute("consulting")}
              className={`w-full text-left p-6 rounded-lg border-2 transition-all ${
                selectedRoute === "consulting"
                  ? "border-[#FFC72F] bg-[#FFC72F]/10"
                  : "border-slate-200 hover:border-[#FFC72F]/50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedRoute === "consulting"
                      ? "border-[#FFC72F] bg-[#FFC72F]"
                      : "border-slate-300"
                  }`}
                >
                  {selectedRoute === "consulting" && (
                    <div className="w-3 h-3 rounded-full bg-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Briefcase className="w-6 h-6 text-[#2E4059]" />
                    <h3 className="text-xl font-semibold text-[#2E4059]">
                      Strategic Consulting & ROI
                    </h3>
                  </div>
                  <p className="text-slate-600">
                    (fix deeper problems) I need a diagnostic and a strategic
                    business case (systems, culture or policy issues).
                  </p>
                </div>
              </div>
            </button>

            {/* Not Sure Route */}
            <button
              onClick={() => setSelectedRoute("not-sure")}
              className={`w-full text-left p-6 rounded-lg border-2 transition-all ${
                selectedRoute === "not-sure"
                  ? "border-[#FFC72F] bg-[#FFC72F]/10"
                  : "border-slate-200 hover:border-[#FFC72F]/50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedRoute === "not-sure"
                      ? "border-[#FFC72F] bg-[#FFC72F]"
                      : "border-slate-300"
                  }`}
                >
                  {selectedRoute === "not-sure" && (
                    <div className="w-3 h-3 rounded-full bg-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <HelpCircle className="w-6 h-6 text-[#2E4059]" />
                    <h3 className="text-xl font-semibold text-[#2E4059]">
                      Not sure - help me decide
                    </h3>
                  </div>
                  <p className="text-slate-600">
                    Quick check to see if training or consulting fits your
                    needs.
                  </p>
                </div>
              </div>
            </button>
          </div>
        </Card>

        <Card className="p-6 sm:p-8 bg-white shadow-lg mb-6">
          <h2 className="text-2xl font-bold text-[#2E4059] mb-6">
            Who are you?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleRoleSelect("individual")}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedRole === "individual"
                  ? "border-[#FFC72F] bg-[#FFC72F]/10"
                  : "border-slate-200 hover:border-[#FFC72F]/50"
              }`}
            >
              <div className="text-center">
                <div
                  className={`w-5 h-5 rounded-full border-2 mx-auto mb-2 flex items-center justify-center ${
                    selectedRole === "individual"
                      ? "border-[#FFC72F] bg-[#FFC72F]"
                      : "border-slate-300"
                  }`}
                >
                  {selectedRole === "individual" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  )}
                </div>
                <p className="font-semibold text-[#2E4059]">
                  I'm an INDIVIDUAL
                </p>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect("consultant")}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedRole === "consultant"
                  ? "border-[#FFC72F] bg-[#FFC72F]/10"
                  : "border-slate-200 hover:border-[#FFC72F]/50"
              }`}
            >
              <div className="text-center">
                <div
                  className={`w-5 h-5 rounded-full border-2 mx-auto mb-2 flex items-center justify-center ${
                    selectedRole === "consultant"
                      ? "border-[#FFC72F] bg-[#FFC72F]"
                      : "border-slate-300"
                  }`}
                >
                  {selectedRole === "consultant" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  )}
                </div>
                <p className="font-semibold text-[#2E4059]">
                  I'm a CONSULTANT helping a client
                </p>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect("business")}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedRole === "business"
                  ? "border-[#FFC72F] bg-[#FFC72F]/10"
                  : "border-slate-200 hover:border-[#FFC72F]/50"
              }`}
            >
              <div className="text-center">
                <div
                  className={`w-5 h-5 rounded-full border-2 mx-auto mb-2 flex items-center justify-center ${
                    selectedRole === "business"
                      ? "border-[#FFC72F] bg-[#FFC72F]"
                      : "border-slate-300"
                  }`}
                >
                  {selectedRole === "business" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  )}
                </div>
                <p className="font-semibold text-[#2E4059]">
                  I represent a BUSINESS/ORGANIZATION
                </p>
              </div>
            </button>
          </div>
        </Card>

        <div className="flex justify-end mt-6">
          <Button
            onClick={handleContinue}
            disabled={!selectedRoute}
            className="bg-[#FFC72F] text-[#2E4059] font-bold hover:bg-[#FFC72F]/90 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-6 text-lg"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
