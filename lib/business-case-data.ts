// Department → Goals mapping
export const deptGoals: Record<string, string[]> = {
  "Sales": [
    "Increase conversion rate from leads to closed deals",
    "Reduce sales cycle time through advanced negotiation skills",
    "Boost cross-selling/upselling with product knowledge training",
    "Improve active listening skills",
    "Enhance resilience and stress management"
  ],
  "Customer Support/Service": [
    "Improve first-call resolution (FCR) rate",
    "Reduce average handle time (AHT) without sacrificing quality",
    "Increase CSAT scores through empathy training",
    "Strengthen conflict resolution skills",
    "Foster team collaboration"
  ],
  "Operations & Supply Chain": [
    "Reduce inventory waste via Lean methodologies",
    "Improve on-time delivery rates",
    "Cut supply chain costs through vendor negotiation training",
    "Enhance problem-solving agility",
    "Build cross-functional communication"
  ],
  "Finance & Accounting": [
    "Speed up monthly close process",
    "Reduce errors in financial reports",
    "Ensure 100% compliance with new tax laws",
    "Improve data storytelling for executive reports",
    "Strengthen ethical decision-making"
  ],
  "Human Resources (HR)": [
    "Increase employee retention through engagement strategies",
    "Reduce time-to-hire with recruiter training",
    "Achieve 90%+ completion rate for mandatory DEI training",
    "Improve conflict mediation skills",
    "Boost employer branding"
  ],
  "Information Technology (IT)": [
    "Reduce system downtime through proactive maintenance training",
    "Increase cybersecurity compliance certifications",
    "Speed up ticket resolution time",
    "Improve user-centric communication",
    "Foster an innovation mindset"
  ],
  "Leadership & Management": [
    "Increase employee engagement scores for their teams",
    "Improve decision-making speed with data literacy",
    "Reduce turnover in their departments",
    "Strengthen coaching skills",
    "Enhance change management capabilities"
  ],
  "Compliance & Legal": [
    "Achieve 100% completion of mandatory compliance training",
    "Reduce regulatory fines",
    "Speed up contract review times",
    "Improve risk communication to non-legal teams",
    "Build an ethical culture"
  ],
  "Marketing & Digital": [
    "Increase lead conversion rate",
    "Improve ROI on ad spend",
    "Boost organic traffic via SEO training",
    "Enhance data-driven storytelling",
    "Strengthen cross-team collaboration"
  ],
  "Generic Employee Development": [
    "Increase participation in L&D programs",
    "Improve time management skills",
    "Boost DEI awareness",
    "Enhance communication skills",
    "Foster a growth mindset"
  ],
  "Engineering": [
    "Reduce code rework",
    "Improve sprint completion rates",
    "Upskill in DevOps tools",
    "Strengthen documentation practices",
    "Boost collaboration with non-tech teams"
  ]
};

// Program catalog
export interface Program {
  group: string;
  name: string;
  durationHours: number;
  priceMode: "perParticipant" | "perDay";
  base: number;
}

export const programs: Program[] = [
  {group:"Capacity Development Packages", name:"Onboarding 101", durationHours:8, priceMode:"perParticipant", base:2500},
  {group:"Capacity Development Packages", name:"Workplace Performance 1.0", durationHours:8, priceMode:"perParticipant", base:2800},
  {group:"Capacity Development Packages", name:"Workplace Performance 2.0", durationHours:16, priceMode:"perParticipant", base:5200},
  {group:"Capacity Development Packages", name:"Sales Effectiveness V1.0", durationHours:16, priceMode:"perParticipant", base:6000},
  {group:"Capacity Development Packages", name:"Teams Bonding 101", durationHours:8, priceMode:"perDay", base:100000},

  {group:"Leadership", name:"Leadership V1.0", durationHours:16, priceMode:"perParticipant", base:7000},
  {group:"Leadership", name:"Leadership V2.0", durationHours:24, priceMode:"perParticipant", base:9500},
  {group:"Leadership", name:"Women in Leadership V1.0", durationHours:16, priceMode:"perParticipant", base:9000},
  {group:"Leadership", name:"Reframing Strategy V2.0", durationHours:16, priceMode:"perDay", base:120000},

  {group:"Functional Excellence", name:"Communications 101", durationHours:8, priceMode:"perParticipant", base:3000},
  {group:"Functional Excellence", name:"Operational Excellence V1.0", durationHours:16, priceMode:"perParticipant", base:6500},
  {group:"Functional Excellence", name:"Digital Literacy V1.0", durationHours:8, priceMode:"perParticipant", base:3200},
  {group:"Functional Excellence", name:"Finance Acumen V1.0", durationHours:8, priceMode:"perParticipant", base:4500},
  {group:"Functional Excellence", name:"Management 101", durationHours:16, priceMode:"perParticipant", base:7000},
  {group:"Functional Excellence", name:"Strategy V1.0", durationHours:16, priceMode:"perDay", base:110000},
  {group:"Functional Excellence", name:"Service Excellence V1.0", durationHours:8, priceMode:"perParticipant", base:4800},
  {group:"Functional Excellence", name:"Beyond Service V2.0", durationHours:16, priceMode:"perParticipant", base:7800},

  {group:"Talent & Culture", name:"Competency & Skills Analysis", durationHours:40, priceMode:"perDay", base:90000},
  {group:"Talent & Culture", name:"Workplace Culture Transformation", durationHours:24, priceMode:"perDay", base:130000},

  {group:"Leadership Development Program", name:"Future Leadership Program (FLP)", durationHours:32, priceMode:"perParticipant", base:12000},
  {group:"Leadership Development Program", name:"Management Development Program (MDP)", durationHours:32, priceMode:"perParticipant", base:11500},
  {group:"Leadership Development Program", name:"Leadership Development Program (LDP)", durationHours:40, priceMode:"perParticipant", base:14000}
];

// Soft skills
export interface SoftSkill {
  title: string;
  hours: number;
  mode: "perParticipant" | "perDay";
  base: number;
}

export const softSkills: SoftSkill[] = [
  {title:"Professionalism", hours:4, mode:"perParticipant", base:1800},
  {title:"Personal Branding", hours:8, mode:"perParticipant", base:3500},
  {title:"Personal Development", hours:4, mode:"perParticipant", base:1800},
  {title:"Growth Mindset", hours:8, mode:"perParticipant", base:3200},
  {title:"Emotional Intelligence", hours:4, mode:"perParticipant", base:2400},
  {title:"Resilience at Work", hours:4, mode:"perParticipant", base:2200},
  {title:"Teamwork & Collaboration", hours:8, mode:"perParticipant", base:3500},
  {title:"Building High Performing Teams", hours:16, mode:"perParticipant", base:7400},
  {title:"Conflict Management", hours:8, mode:"perParticipant", base:3500},
  {title:"Leadership Fundamentals", hours:8, mode:"perParticipant", base:4200},
  {title:"Strategic Thinking", hours:8, mode:"perParticipant", base:5200},
  {title:"Project Management Skills", hours:16, mode:"perParticipant", base:8000}
];

// Urgency multipliers
export const urgencyMap: Record<string, number> = {
  "Standard (4+ weeks lead time)": 1.00,
  "Priority (2-3 weeks) (+15%)": 1.15,
  "Rush (<2 weeks) (+25%)": 1.25
};

// Add-on pricing (ETB)
export const addOns = {
  preAssessmentPerPerson: 5000,
  postProgramCoachingPerPerson: 15000,
  printedMaterialsPerPerson: 2500,
  digitalFollowUpsPerPerson: 8000,
  venueFlat: 25000
};

// Benchmark default gains by department (percentages as decimals)
export const benchmarkGains = {
  productivity: {
    "Sales": 0.06, "Customer Support/Service": 0.05, "Operations & Supply Chain": 0.05, "Finance & Accounting": 0.04,
    "Human Resources (HR)": 0.04, "Information Technology (IT)": 0.05, "Leadership & Management": 0.05,
    "Compliance & Legal": 0.03, "Marketing & Digital": 0.05, "Generic Employee Development": 0.03, "Engineering": 0.05
  },
  retention: {
    "Sales": 0.03, "Customer Support/Service": 0.03, "Operations & Supply Chain": 0.025, "Finance & Accounting": 0.02,
    "Human Resources (HR)": 0.03, "Information Technology (IT)": 0.025, "Leadership & Management": 0.03,
    "Compliance & Legal": 0.015, "Marketing & Digital": 0.025, "Generic Employee Development": 0.015, "Engineering": 0.025
  }
};

// Default replacement cost as a multiple of annual salary
export const replacementCostFactor = 0.5;

