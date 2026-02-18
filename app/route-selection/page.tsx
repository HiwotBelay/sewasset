"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, GraduationCap, Briefcase, HelpCircle, Sparkles, ArrowRight } from "lucide-react";

export default function RouteSelectionPage() {
  const router = useRouter();
  const [selectedRoute, setSelectedRoute] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleRouteSelect = (route: string) => {
    // Toggle selection - if already selected, unselect it
    if (selectedRoute === route) {
      setSelectedRoute("");
    } else {
      setSelectedRoute(route);
    }
  };

  const handleRoleSelect = (role: string) => {
    // Toggle selection - if already selected, unselect it
    if (selectedRole === role) {
      setSelectedRole("");
    } else {
      setSelectedRole(role);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("selectedRole", role);
      }
    }
  };

  const handleContinue = () => {
    if (!selectedRoute) {
      alert("Please select what you need");
      return;
    }
    // Store selections and navigate
    if (typeof window !== "undefined") {
      sessionStorage.setItem("selectedRoute", selectedRoute);
      if (selectedRole) {
        sessionStorage.setItem("selectedRole", selectedRole);
      }
    }
    if (selectedRoute === "training") {
      router.push("/training");
    } else if (selectedRoute === "consulting") {
      alert("Consulting route coming soon!");
    } else if (selectedRoute === "not-sure") {
      alert("Decision helper coming soon!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-white relative overflow-hidden">
      {/* Creative animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FDC700]/10 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#3B5998]/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#FDC700]/5 via-[#3B5998]/5 to-[#FDC700]/5 rounded-full blur-[150px]"></div>
      </div>

      {/* Modern header */}
      <div className="relative z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/50 sticky top-0 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#2E4059] transition-all duration-300 group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-all duration-300">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
            </div>
            <span className="font-medium">Back To Home</span>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
        {/* Creative hero section */}
        <div className={`text-center mb-12 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FDC700]/10 backdrop-blur-md rounded-full border border-[#FDC700]/30 mb-6">
            <Sparkles className="w-4 h-4 text-[#FDC700]" />
            <span className="text-[#2E4059] text-sm font-semibold">Business Case Builder</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#2E4059] mb-4">
            SewAsset Catalyst™
          </h1>
          <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
            Choose your path to strategic success
          </p>
        </div>

        {/* Creative Step 1: What do you need */}
        <div 
          ref={sectionRef}
          className={`mb-8 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FDC700] to-[#F5AF19] flex items-center justify-center text-[#2E4059] font-bold shadow-lg">
              1
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#2E4059]">
              What do you need right now?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Training Route - Creative Card Design */}
            <button
              onClick={() => handleRouteSelect("training")}
              className={`group relative p-6 rounded-xl border-2 transition-all duration-300 overflow-hidden bg-white ${
                selectedRoute === "training"
                  ? "border-[#FDC700] bg-[#FDC700]/5 shadow-lg"
                  : "border-[#E5E7EB] hover:border-[#FDC700]/40 hover:bg-[#F8F9FA]"
              }`}
            >
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center transition-all duration-300 ${
                  selectedRoute === "training"
                    ? "bg-[#FDC700]"
                    : "bg-[#FDC700]/10 group-hover:bg-[#FDC700]/20"
                }`}>
                  <GraduationCap className={`w-6 h-6 transition-colors duration-300 ${
                    selectedRoute === "training" ? "text-white" : "text-[#FDC700]"
                  }`} />
                </div>
                
                <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                  selectedRoute === "training" ? "text-[#2E4059]" : "text-[#2E4059]"
                }`}>
                  Training & Development
                </h3>
                <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                  selectedRoute === "training" ? "text-[#2E4059]" : "text-[#6B7280]"
                }`}>
                  Training programs, courses, and ROI estimates
                </p>
              </div>
            </button>

            {/* Consulting Route */}
            <button
              onClick={() => handleRouteSelect("consulting")}
              className={`group relative p-6 rounded-xl border-2 transition-all duration-300 overflow-hidden bg-white ${
                selectedRoute === "consulting"
                  ? "border-[#3B5998] bg-[#3B5998]/5 shadow-lg"
                  : "border-[#E5E7EB] hover:border-[#3B5998]/40 hover:bg-[#F8F9FA]"
              }`}
            >
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center transition-all duration-300 ${
                  selectedRoute === "consulting"
                    ? "bg-[#3B5998]"
                    : "bg-[#3B5998]/10 group-hover:bg-[#3B5998]/20"
                }`}>
                  <Briefcase className={`w-6 h-6 transition-colors duration-300 ${
                    selectedRoute === "consulting" ? "text-white" : "text-[#3B5998]"
                  }`} />
                </div>
                
                <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                  selectedRoute === "consulting" ? "text-[#2E4059]" : "text-[#2E4059]"
                }`}>
                  Strategic Consulting
                </h3>
                <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                  selectedRoute === "consulting" ? "text-[#2E4059]" : "text-[#6B7280]"
                }`}>
                  Deep diagnostics and strategic business cases
                </p>
              </div>
            </button>

            {/* Not Sure Route */}
            <button
              onClick={() => handleRouteSelect("not-sure")}
              className={`group relative p-6 rounded-xl border-2 transition-all duration-300 overflow-hidden bg-white ${
                selectedRoute === "not-sure"
                  ? "border-[#6B7280] bg-[#6B7280]/5 shadow-lg"
                  : "border-[#E5E7EB] hover:border-[#6B7280]/40 hover:bg-[#F8F9FA]"
              }`}
            >
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center transition-all duration-300 ${
                  selectedRoute === "not-sure"
                    ? "bg-[#6B7280]"
                    : "bg-[#F8F9FA] group-hover:bg-[#E5E7EB]"
                }`}>
                  <HelpCircle className={`w-6 h-6 transition-colors duration-300 ${
                    selectedRoute === "not-sure" ? "text-white" : "text-[#6B7280]"
                  }`} />
                </div>
                
                <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                  selectedRoute === "not-sure" ? "text-[#2E4059]" : "text-[#2E4059]"
                }`}>
                  Need Help Deciding?
                </h3>
                <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                  selectedRoute === "not-sure" ? "text-[#2E4059]" : "text-[#6B7280]"
                }`}>
                  Quick assessment to find your best path
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Creative Step 2: Who are you */}
        <div className={`mb-8 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B5998] to-[#2E4059] flex items-center justify-center text-white font-bold shadow-lg">
              2
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#2E4059]">
              Who are you?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { value: "individual", label: "Individual", icon: "👤" },
              { value: "consultant", label: "Consultant", icon: "💼" },
              { value: "business", label: "Business", icon: "🏢" }
            ].map((role, idx) => (
              <button
                key={role.value}
                onClick={() => handleRoleSelect(role.value)}
                className={`group relative p-5 rounded-xl border-2 transition-all duration-300 overflow-hidden bg-white ${
                  selectedRole === role.value
                    ? "border-[#FDC700] bg-[#FDC700]/5 shadow-lg"
                    : "border-[#E5E7EB] hover:border-[#FDC700]/40 hover:bg-[#F8F9FA]"
                }`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className="text-center relative z-10">
                  <div className={`text-3xl mb-3 transition-transform duration-300 ${
                    selectedRole === role.value ? "scale-110" : "group-hover:scale-105"
                  }`}>
                    {role.icon}
                  </div>
                  <p className={`font-semibold text-sm transition-colors duration-300 ${
                    selectedRole === role.value ? "text-[#2E4059]" : "text-[#2E4059]"
                  }`}>
                    {role.label}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Creative Continue Button */}
        <div className="flex justify-end mt-10">
          <Button
            onClick={handleContinue}
            disabled={!selectedRoute}
            className="px-10 py-4 bg-gradient-to-r from-[#FDC700] via-[#F5AF19] to-[#FDC700] text-[#2E4059] font-bold rounded-xl hover:shadow-2xl hover:shadow-[#FDC700]/50 hover:scale-110 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 relative overflow-hidden group backdrop-blur-sm"
          >
            <span className="relative z-10 flex items-center gap-3">
              Continue
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </span>
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#F5AF19] via-[#FDC700] to-[#F5AF19] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Button>
        </div>
      </div>
    </div>
  );
}
