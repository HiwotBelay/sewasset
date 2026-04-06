"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CatalystConsultingWizard } from "@/components/calculator/catalyst-consulting-wizard";
import "../catalyst-tool.css";

export const dynamic = "force-dynamic";

export default function ConsultingPage() {
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
    return (
      <div className="min-h-screen bg-[#f7f3ec] flex items-center justify-center px-4">
        <p className="text-[#2E4059] text-sm font-medium">Redirecting to terms of use…</p>
      </div>
    );
  }

  return (
    <div className="tool-overlay">
      <div className="tool-nav">
        <div className="tool-logo">
          Sew<span>Asset</span>™ Catalyst
        </div>
        <div className="tool-nav-right">
          <span className="tool-path-badge show-consulting">Capability Transformation</span>
          <Link href="/" className="close-tool">
            <ArrowLeft size={14} />
            <span>Close</span>
          </Link>
        </div>
      </div>

      <CatalystConsultingWizard />
    </div>
  );
}
