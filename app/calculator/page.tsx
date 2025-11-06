"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CalculatorLayout } from "@/components/calculator/calculator-layout";

export const dynamic = "force-dynamic";

export default function CalculatorPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user has accepted disclaimer
    const disclaimerAccepted = sessionStorage.getItem("disclaimerAccepted");
    if (!disclaimerAccepted) {
      router.push("/disclaimer");
    }
  }, [router]);

  const disclaimerAccepted =
    typeof window !== "undefined"
      ? sessionStorage.getItem("disclaimerAccepted")
      : null;

  if (!disclaimerAccepted) {
    return null; // Will redirect
  }

  return <CalculatorLayout />;
}
