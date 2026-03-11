import { programs, softSkills, urgencyMap, addOns, benchmarkGains, replacementCostFactor } from "./business-case-data";
import type { BusinessCaseData } from "@/components/calculator/business-case-form";

export interface PricingAndROI {
  baseCost: number;
  consultingCost: number;
  addOnsTotal: number;
  totalInvestment: number;
  annualBenefit: {
    conservative: number;
    expected: number;
    optimistic: number;
  };
  roi: {
    conservative: number | null;
    expected: number | null;
    optimistic: number | null;
  };
  payback: {
    conservative: number | null;
    expected: number | null;
    optimistic: number | null;
  };
}

export function computePricingAndROI(data: BusinessCaseData): PricingAndROI {
  const participants = Math.max(0, parseFloat(String(data.participants || 0)));
  const urgencyMult = urgencyMap[data.urgency || "Standard (4+ weeks lead time)"] || 1;

  // Program base
  let baseCost = 0;

  // Main program (group+name) - handle both single string and array
  const programNames = Array.isArray(data.programName) ? data.programName : (data.programName ? [data.programName] : []);
  programNames.forEach(programName => {
    const prg = programs.find(p => p.name === programName);
    if (prg) {
      if (prg.priceMode === "perParticipant") {
        baseCost += prg.base * participants;
      } else if (prg.priceMode === "perDay") {
        // Assume 8 hours/day
        const durationHours = parseFloat(String(data.durationOverrideHours || prg.durationHours));
        const days = durationHours / 8;
        baseCost += prg.base * Math.max(1, Math.ceil(days));
      }
    }
  });

  // Additional soft skills (sum)
  if (Array.isArray(data.softSkillSelections)) {
    data.softSkillSelections.forEach(title => {
      const s = softSkills.find(x => x.title === title);
      if (!s) return;
      if (s.mode === "perParticipant") {
        baseCost += s.base * participants;
      }
    });
  }

  // Consulting add-on (simple day model)
  let consultingCost = 0;
  if (data.consultingAddOn && data.consultingType) {
    // 3 days default @ 90k/day
    consultingCost = 3 * 90000;
  }

  // Add-ons
  let addOnsTotal = 0;
  if (data.addPreAssess) addOnsTotal += addOns.preAssessmentPerPerson * participants;
  if (data.addCoaching) addOnsTotal += addOns.postProgramCoachingPerPerson * participants;
  if (data.addPrinted) addOnsTotal += addOns.printedMaterialsPerPerson * participants;
  if (data.addDigital) addOnsTotal += addOns.digitalFollowUpsPerPerson * participants;
  if (data.addVenue) addOnsTotal += addOns.venueFlat;

  // Total with urgency
  const subtotal = baseCost + consultingCost + addOnsTotal;
  const totalInvestment = Math.round(subtotal * urgencyMult);

  // Benefits
  const avgMonthly = parseFloat(String(data.avgMonthlySalary || 0));
  const avgAnnual = avgMonthly * 12;

  // Use entered gains if provided else benchmarks
  // Handle both single string and array for department
  const dept = Array.isArray(data.department) && data.department.length > 0 
    ? data.department[0] // Use first department for benchmark if multiple selected
    : (data.department || "Generic Employee Development");
  // Check if value is provided (not empty string), if so use it, otherwise use benchmark
  const prodGainValue = parseFloat(String(data.estProductivityGain || ""));
  const prodGainPct = !isNaN(prodGainValue) ? prodGainValue / 100 : benchmarkGains.productivity[dept];
  const retGainValue = parseFloat(String(data.estRetentionImprovement || ""));
  const retGainPct = !isNaN(retGainValue) ? retGainValue / 100 : benchmarkGains.retention[dept];
  const directSavePerPerson = parseFloat(String(data.directCostSavingPerPerson || 0));

  // Annual benefit components
  const benefitProductivity = participants * avgAnnual * prodGainPct;
  const benefitRetention = participants * avgAnnual * replacementCostFactor * retGainPct;
  const benefitDirect = participants * directSavePerPerson;

  // Scenario multipliers
  const scenarios = {
    conservative: 0.7,
    expected: 1.0,
    optimistic: 1.3
  };

  const annualBenefitRaw = {
    conservative: (benefitProductivity + benefitRetention + benefitDirect) * scenarios.conservative,
    expected: (benefitProductivity + benefitRetention + benefitDirect) * scenarios.expected,
    optimistic: (benefitProductivity + benefitRetention + benefitDirect) * scenarios.optimistic
  };

  const roi = {
    conservative: totalInvestment > 0 ? (annualBenefitRaw.conservative - totalInvestment) / totalInvestment : null,
    expected: totalInvestment > 0 ? (annualBenefitRaw.expected - totalInvestment) / totalInvestment : null,
    optimistic: totalInvestment > 0 ? (annualBenefitRaw.optimistic - totalInvestment) / totalInvestment : null
  };

  const payback = {
    conservative: annualBenefitRaw.conservative > 0 ? (totalInvestment / (annualBenefitRaw.conservative / 12)) : null,
    expected: annualBenefitRaw.expected > 0 ? (totalInvestment / (annualBenefitRaw.expected / 12)) : null,
    optimistic: annualBenefitRaw.optimistic > 0 ? (totalInvestment / (annualBenefitRaw.optimistic / 12)) : null
  };

  return {
    baseCost,
    consultingCost,
    addOnsTotal,
    totalInvestment,
    annualBenefit: annualBenefitRaw,
    roi,
    payback
  };
}

export function formatCurrency(v: number): string {
  if (isNaN(v)) return "—";
  return "ETB " + v.toLocaleString();
}

export function formatPercent(v: number | null): string {
  if (v === null || v === undefined || isNaN(v)) return "—";
  return (v * 100).toFixed(1) + "%";
}

