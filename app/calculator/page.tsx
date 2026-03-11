"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalculatorLayout } from "@/components/calculator/calculator-layout";

export const dynamic = "force-dynamic";

export default function CalculatorPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  useEffect(() => {
    // Only run on client
    setIsClient(true);
    const accepted = sessionStorage.getItem("disclaimerAccepted");
    if (!accepted) {
      router.push("/disclaimer");
    } else {
      setDisclaimerAccepted(true);
    }
  }, [router]);

  // Show nothing until client-side check is complete
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E4059] mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!disclaimerAccepted) {
    return null; // Will redirect
  }

  return <CalculatorLayout />;
}
