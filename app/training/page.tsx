"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TrainingFlow } from "@/components/calculator/training-flow";
import { ArrowLeft } from "lucide-react";
import "../catalyst-tool.css";

export const dynamic = "force-dynamic";

export default function TrainingPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [progressPercent, setProgressPercent] = useState(20);

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

  return (
    <div className="tool-overlay">
      <div className="tool-nav">
        <div className="tool-logo">
          Sew<span>Asset</span>™ Catalyst
        </div>
        <div className="tool-nav-right">
          <span className="tool-path-badge show-training">Capability Development</span>
          <Link href="/" className="close-tool">
            <ArrowLeft size={14} />
            <span>Close</span>
          </Link>
        </div>
      </div>
      <div className="tool-progress">
        <div className="tool-progress-fill" style={{ width: `${progressPercent}%` }} />
      </div>

      <TrainingFlow onProgressChange={setProgressPercent} />
    </div>
  );
}
