/** Map /route-selection stored values → Catalyst wizard field formats */

export function mapRouteAuthority(v: string): string {
  const m: Record<string, string> = {
    "decision-maker": "Decision Maker",
    influencer: "Influencer",
    "people-culture": "Influencer",
    "finance-procurement": "Influencer",
    "line-manager": "End User",
    other: "End User",
  };
  return m[v] ?? "Decision Maker";
}

export function mapRouteIndustrySlug(slug: string): string {
  const m: Record<string, string> = {
    manufacturing: "Manufacturing",
    "financial-services": "Financial Services",
    "telecom-tech": "Telecom & Tech",
    retail: "Retail",
    healthcare: "Healthcare",
    government: "Government",
    logistics: "Logistics",
    ngo: "NGO",
    other: "Other",
  };
  return m[slug] ?? "";
}

export function mapRouteCompanySize(s: string): string {
  const m: Record<string, string> = {
    "1-50": "1–50",
    "51-200": "51–200",
    "201-500": "201–500",
    "501-1000": "501–1000",
    "1000+": "1000+",
  };
  return m[s] ?? "";
}

export function mapRouteYears(s: string): string {
  const m: Record<string, string> = {
    "0-2": "0–2 years",
    "3-5": "3–5 years",
    "6-10": "6–10 years",
    "10+": "10+ years",
  };
  return m[s] ?? "";
}

export function mapRouteEducation(s: string): string {
  const m: Record<string, string> = {
    certificate: "Certification",
    diploma: "Other",
    degree: "Degree",
    masters: "Masters",
    phd: "Masters",
    other: "Other",
  };
  return m[s] ?? "Degree";
}

export function mapRouteLearningGoal(s: string): string {
  const m: Record<string, string> = {
    upskilling: "Upskilling",
    reskilling: "Career Pivot",
    certification: "Certification",
    leadership: "Upskilling",
    "career-shift": "Career Pivot",
  };
  return m[s] ?? "Upskilling";
}

export function mapRouteFunding(s: string): string {
  const m: Record<string, string> = {
    "self-funded": "Self-Funded",
    employer: "My Company is Paying",
    scholarship: "Self-Funded",
    other: "Self-Funded",
  };
  return m[s] ?? "Self-Funded";
}

export function mapRouteFormat(s: string): string {
  const m: Record<string, string> = {
    "virtual-live": "Virtual / Live",
    "in-person": "In-Person",
    "self-paced": "Self-paced (LMS)",
  };
  return m[s] ?? "Virtual / Live";
}

export function mapRouteConsultPurpose(s: string): string {
  const m: Record<string, string> = {
    "support-client": "Helping a client",
    "research-benchmarking": "Research & Benchmarking",
    "partnership-inquiry": "Exploring Partnership",
  };
  return m[s] ?? "";
}

/** Consulting wizard client industry options (subset) */
export function mapRouteClientIndustry(s: string): string {
  const m: Record<string, string> = {
    manufacturing: "Manufacturing",
    "financial-services": "Financial Services",
    "telecom-tech": "Telecom & Tech",
    retail: "Other / Multiple",
    healthcare: "Healthcare",
    government: "NGO / Government",
    logistics: "Other / Multiple",
    ngo: "NGO / Government",
    "professional-services": "Other / Multiple",
    other: "Other / Multiple",
  };
  return m[s] ?? "";
}

export function mapRouteClientCompanySize(s: string): string {
  if (s === "unknown") return "";
  return mapRouteCompanySize(s);
}
