/**
 * Training module catalog and goal-fit scoring — ported from company HTML prototype logic.
 * Category names and goal strings must match wizard selections exactly.
 */

export type TrainingCatalogItem = {
  id: string;
  n: string;
  cat: string;
  h: number;
  difficulty: "Basic" | "Intermediate" | "Advanced";
  dept: string[];
  fit: string[];
};

export type ScoredModule = TrainingCatalogItem & {
  score: number;
  goalMatches: number;
  catScore: number;
  deptScore: number;
};

export const TRAINING_CAPABILITY_CATEGORIES = [
  "Soft Skills",
  "Leadership & Management",
  "Technical / Hard Skills",
  "Compliance & Mandatory",
  "Behavioral & Mindset",
  "Team & Culture Development",
  "Industry / Department Specific",
  "Motivation & Engagement",
] as const;

/** Goal tag labels — Step “outcomes”; strings must match CATALOG `fit` entries */
export const TRAINING_OUTCOME_GOALS: string[] = [
  "Improve team productivity",
  "Reduce errors",
  "Increase speed of work",
  "Improve problem-solving",
  "Improve communication",
  "Improve teamwork",
  "Improve customer service",
  "Strengthen emotional intelligence",
  "Improve engagement",
  "Reduce turnover",
  "Strengthen culture",
  "Improve leadership capability",
  "Strengthen coaching skills",
  "Improve conflict resolution",
  "Improve decision-making",
  "Improve sales performance",
  "Increase customer satisfaction",
  "Reduce complaints",
  "Improve technical skill proficiency",
  "Improve digital / software skill levels",
  "Ensure 100% compliance",
  "Reduce regulatory or process errors",
];

export const CATALOG: TrainingCatalogItem[] = [
  { id: "C01", n: "Accountability & Ownership", cat: "Behavioral & Mindset", h: 6, difficulty: "Basic", dept: ["Whole Organization", "Cross-functional"], fit: ["Improve team productivity", "Reduce errors", "Strengthen culture"] },
  { id: "C02", n: "Active Listening Mastery", cat: "Soft Skills", h: 4, difficulty: "Basic", dept: ["Whole Organization"], fit: ["Improve communication", "Improve teamwork", "Improve customer service"] },
  { id: "C03", n: "Advanced Excel Automation", cat: "Technical / Hard Skills", h: 12, difficulty: "Advanced", dept: ["Finance & Accounting", "Operations", "IT & Technology"], fit: ["Improve team productivity", "Reduce errors", "Improve technical skill proficiency", "Improve digital / software skill levels"] },
  { id: "C04", n: "Advanced Negotiation Strategies", cat: "Industry / Department Specific", h: 8, difficulty: "Advanced", dept: ["Sales", "Executive Leadership"], fit: ["Improve problem-solving", "Improve sales performance", "Improve communication"] },
  { id: "C05", n: "Budget Planning & Cost Control", cat: "Industry / Department Specific", h: 8, difficulty: "Intermediate", dept: ["Finance & Accounting", "Senior Management", "Line Management"], fit: ["Improve problem-solving", "Improve decision-making"] },
  { id: "C06", n: "Building High Performance Teams", cat: "Leadership & Management", h: 8, difficulty: "Intermediate", dept: ["Senior Management", "Line Management", "Supervisor"], fit: ["Improve team productivity", "Improve teamwork", "Improve leadership capability"] },
  { id: "C07", n: "Change Management Fundamentals", cat: "Leadership & Management", h: 8, difficulty: "Intermediate", dept: ["Senior Management", "Line Management", "HR"], fit: ["Strengthen culture", "Improve engagement", "Reduce turnover"] },
  { id: "C08", n: "Cloud Computing Fundamentals", cat: "Technical / Hard Skills", h: 8, difficulty: "Basic", dept: ["IT & Technology", "Operations"], fit: ["Improve technical skill proficiency", "Improve digital / software skill levels"] },
  { id: "C09", n: "Coaching for Performance", cat: "Leadership & Management", h: 8, difficulty: "Advanced", dept: ["Senior Management", "Line Management", "Supervisor"], fit: ["Strengthen coaching skills", "Improve team productivity", "Improve leadership capability"] },
  { id: "C10", n: "Conflict Resolution & Difficult Conversations", cat: "Soft Skills", h: 8, difficulty: "Intermediate", dept: ["Whole Organization", "HR"], fit: ["Improve conflict resolution", "Improve communication", "Strengthen emotional intelligence"] },
  { id: "C11", n: "Consultative Selling", cat: "Industry / Department Specific", h: 8, difficulty: "Intermediate", dept: ["Sales"], fit: ["Improve sales performance", "Increase customer satisfaction", "Improve communication"] },
  { id: "C12", n: "Customer Service Excellence", cat: "Industry / Department Specific", h: 8, difficulty: "Basic", dept: ["Customer Service"], fit: ["Improve customer service", "Increase customer satisfaction", "Reduce complaints"] },
  { id: "C13", n: "Cybersecurity Awareness", cat: "Compliance & Mandatory", h: 4, difficulty: "Basic", dept: ["Whole Organization"], fit: ["Ensure 100% compliance", "Reduce regulatory or process errors"] },
  { id: "C14", n: "Data Analytics for Decision Making", cat: "Technical / Hard Skills", h: 16, difficulty: "Intermediate", dept: ["Finance & Accounting", "Operations", "IT & Technology", "Senior Management"], fit: ["Improve decision-making", "Improve problem-solving", "Improve technical skill proficiency"] },
  { id: "C15", n: "Digital Transformation Basics", cat: "Technical / Hard Skills", h: 6, difficulty: "Basic", dept: ["Executive Leadership", "Senior Management"], fit: ["Improve technical skill proficiency", "Improve digital / software skill levels"] },
  { id: "C16", n: "Diversity & Inclusion at Work", cat: "Team & Culture Development", h: 6, difficulty: "Basic", dept: ["Whole Organization", "HR"], fit: ["Strengthen culture", "Improve engagement", "Improve teamwork"] },
  { id: "C17", n: "Emotional Intelligence at Work", cat: "Behavioral & Mindset", h: 8, difficulty: "Intermediate", dept: ["Whole Organization"], fit: ["Strengthen emotional intelligence", "Improve communication", "Improve conflict resolution"] },
  { id: "C18", n: "Employee Engagement Strategies", cat: "Team & Culture Development", h: 6, difficulty: "Intermediate", dept: ["HR", "Senior Management", "Line Management"], fit: ["Improve engagement", "Reduce turnover", "Strengthen culture"] },
  { id: "C19", n: "Ethics & Anti-Corruption", cat: "Compliance & Mandatory", h: 6, difficulty: "Basic", dept: ["Whole Organization"], fit: ["Ensure 100% compliance", "Reduce regulatory or process errors", "Strengthen culture"] },
  { id: "C20", n: "First-Time Manager Essentials", cat: "Leadership & Management", h: 12, difficulty: "Basic", dept: ["Supervisor", "Line Management"], fit: ["Improve leadership capability", "Strengthen coaching skills", "Improve decision-making"] },
  { id: "C21", n: "HR Fundamentals", cat: "Industry / Department Specific", h: 8, difficulty: "Basic", dept: ["HR", "Supervisor"], fit: ["Reduce turnover", "Ensure 100% compliance"] },
  { id: "C22", n: "Leading Organizational Change", cat: "Leadership & Management", h: 10, difficulty: "Advanced", dept: ["Executive Leadership", "Senior Management"], fit: ["Improve leadership capability", "Strengthen culture", "Improve decision-making"] },
  { id: "C23", n: "Lean Process Improvement", cat: "Industry / Department Specific", h: 12, difficulty: "Advanced", dept: ["Operations", "Supply Chain"], fit: ["Increase speed of work", "Reduce errors", "Improve process efficiency"] },
  { id: "C24", n: "Logistics & Distribution Optimization", cat: "Industry / Department Specific", h: 8, difficulty: "Advanced", dept: ["Supply Chain", "Operations"], fit: ["Increase speed of work", "Reduce errors", "Improve process efficiency"] },
  { id: "C25", n: "Microsoft 365 Productivity Suite", cat: "Technical / Hard Skills", h: 8, difficulty: "Basic", dept: ["Whole Organization"], fit: ["Improve digital / software skill levels", "Improve team productivity"] },
  { id: "C26", n: "Motivation & Mindset Activation", cat: "Motivation & Engagement", h: 4, difficulty: "Basic", dept: ["Whole Organization"], fit: ["Improve engagement", "Improve team productivity"] },
  { id: "C27", n: "Occupational Health & Safety Compliance", cat: "Compliance & Mandatory", h: 6, difficulty: "Intermediate", dept: ["Operations", "Supply Chain"], fit: ["Ensure 100% compliance", "Reduce regulatory or process errors"] },
  { id: "C28", n: "Performance Management Systems", cat: "Leadership & Management", h: 8, difficulty: "Intermediate", dept: ["HR", "Senior Management", "Line Management"], fit: ["Improve team productivity", "Improve leadership capability"] },
  { id: "C29", n: "Problem-Solving & Critical Thinking", cat: "Soft Skills", h: 8, difficulty: "Intermediate", dept: ["Whole Organization", "Cross-functional"], fit: ["Improve problem-solving", "Improve decision-making"] },
  { id: "C30", n: "Resilience & Stress Management", cat: "Behavioral & Mindset", h: 6, difficulty: "Intermediate", dept: ["Whole Organization"], fit: ["Reduce turnover", "Improve engagement", "Strengthen emotional intelligence"] },
  { id: "C31", n: "Strategic Planning Fundamentals", cat: "Leadership & Management", h: 10, difficulty: "Intermediate", dept: ["Executive Leadership", "Senior Management"], fit: ["Improve decision-making", "Improve leadership capability"] },
  { id: "C32", n: "Structured Problem Solving", cat: "Soft Skills", h: 8, difficulty: "Intermediate", dept: ["Operations", "Cross-functional"], fit: ["Improve problem-solving", "Reduce errors"] },
  { id: "C33", n: "Team Excellence", cat: "Team & Culture Development", h: 8, difficulty: "Basic", dept: ["Whole Organization", "Cross-functional"], fit: ["Improve teamwork", "Improve communication", "Strengthen culture"] },
  { id: "C34", n: "Team Inspiration Session", cat: "Motivation & Engagement", h: 4, difficulty: "Basic", dept: ["Whole Organization"], fit: ["Improve engagement", "Strengthen culture"] },
  { id: "C35", n: "Time Management & Productivity", cat: "Soft Skills", h: 8, difficulty: "Basic", dept: ["Whole Organization"], fit: ["Improve team productivity", "Increase speed of work"] },
  { id: "C36", n: "Warehouse Efficiency Optimization", cat: "Industry / Department Specific", h: 8, difficulty: "Advanced", dept: ["Supply Chain", "Operations"], fit: ["Increase speed of work", "Improve process efficiency", "Reduce errors"] },
  { id: "C37", n: "Workplace Discipline Procedures", cat: "Compliance & Mandatory", h: 4, difficulty: "Basic", dept: ["HR", "Supervisor", "Line Management"], fit: ["Ensure 100% compliance", "Reduce regulatory or process errors"] },
  { id: "C38", n: "Workplace Professionalism Standards", cat: "Behavioral & Mindset", h: 4, difficulty: "Basic", dept: ["Whole Organization"], fit: ["Improve communication", "Improve teamwork"] },
  { id: "C39", n: "Executive Communication Excellence", cat: "Soft Skills", h: 8, difficulty: "Advanced", dept: ["Executive Leadership", "Senior Management"], fit: ["Improve communication", "Improve leadership capability"] },
  { id: "C40", n: "Omnichannel Customer Support", cat: "Industry / Department Specific", h: 6, difficulty: "Intermediate", dept: ["Customer Service"], fit: ["Improve customer service", "Increase customer satisfaction", "Reduce complaints"] },
];

const diffOrder = { Basic: 1, Intermediate: 2, Advanced: 3 } as const;

export function recommendModules(
  categories: string[],
  goals: string[],
  targetDepartments: string[],
  audience: string | null
): ScoredModule[] {
  const selDepts = [...targetDepartments];
  if (audience === "org" || audience === "myself") {
    selDepts.push("Whole Organization");
  }

  const pool = CATALOG.map((t) => {
    const goalMatches = t.fit.filter((f) => goals.includes(f)).length;
    const goalScore = goalMatches * 2;
    const catScore = categories.includes(t.cat) ? 2 : 0;
    let deptScore = 0;
    if (t.dept.includes("Whole Organization") || t.dept.includes("Cross-functional")) {
      deptScore = 2;
    } else {
      const deptMatch = t.dept.some((d) => selDepts.includes(d));
      if (deptMatch) deptScore = 2;
    }
    const finalScore = goalScore + catScore + deptScore;
    return { ...t, score: finalScore, goalMatches, catScore, deptScore };
  })
    .filter((t) => t.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (diffOrder[a.difficulty] ?? 2) - (diffOrder[b.difficulty] ?? 2);
    })
    .slice(0, 8);

  return pool;
}

export function searchCatalog(query: string, limit = 8): TrainingCatalogItem[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  return CATALOG.filter(
    (t) => t.n.toLowerCase().includes(q) || t.cat.toLowerCase().includes(q)
  ).slice(0, limit);
}
