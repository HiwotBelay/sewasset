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

// Competency Mapping: Training Goal → Core Competency → 7 Pillar
export interface CompetencyMapping {
  trainingGoal: string;
  coreCompetency: string;
  pillarId: string;
  pillarName: string;
}

export const competencyMapping: CompetencyMapping[] = [
  // Sales
  { trainingGoal: "Increase conversion rate from leads to closed deals", coreCompetency: "Advanced Negotiation & Closing", pillarId: "Pillar 2", pillarName: "Pillar 2: Sales & Business Development" },
  { trainingGoal: "Reduce sales cycle time through advanced negotiation skills", coreCompetency: "Advanced Negotiation & Closing", pillarId: "Pillar 2", pillarName: "Pillar 2: Sales & Business Development" },
  { trainingGoal: "Boost cross-selling/upselling with product knowledge training", coreCompetency: "Product Knowledge & Sales Strategy", pillarId: "Pillar 2", pillarName: "Pillar 2: Sales & Business Development" },
  { trainingGoal: "Improve active listening skills", coreCompetency: "Communication & Interpersonal Skills", pillarId: "Pillar 4", pillarName: "Pillar 4: Communication & Interpersonal Excellence" },
  { trainingGoal: "Enhance resilience and stress management", coreCompetency: "Resilience & Emotional Intelligence", pillarId: "Pillar 5", pillarName: "Pillar 5: Workplace Performance Suites" },
  
  // Customer Support/Service
  { trainingGoal: "Improve first-call resolution (FCR) rate", coreCompetency: "Customer Service Quality & Empathy", pillarId: "Pillar 3", pillarName: "Pillar 3: Customer Service Quality & Experience" },
  { trainingGoal: "Reduce average handle time (AHT) without sacrificing quality", coreCompetency: "Operational Efficiency & Process Adherence", pillarId: "Pillar 5", pillarName: "Pillar 5: Workplace Performance Suites" },
  { trainingGoal: "Increase CSAT scores through empathy training", coreCompetency: "Customer Service Quality & Empathy", pillarId: "Pillar 3", pillarName: "Pillar 3: Customer Service Quality & Experience" },
  { trainingGoal: "Strengthen conflict resolution skills", coreCompetency: "Conflict Management & Resolution", pillarId: "Pillar 4", pillarName: "Pillar 4: Communication & Interpersonal Excellence" },
  { trainingGoal: "Foster team collaboration", coreCompetency: "Teamwork & Collaboration", pillarId: "Pillar 5", pillarName: "Pillar 5: Workplace Performance Suites" },
  
  // Operations & Supply Chain
  { trainingGoal: "Reduce inventory waste via Lean methodologies", coreCompetency: "Operational Excellence & Lean Management", pillarId: "Pillar 5", pillarName: "Pillar 5: Workplace Performance Suites" },
  { trainingGoal: "Improve on-time delivery rates", coreCompetency: "Operational Efficiency & Process Adherence", pillarId: "Pillar 5", pillarName: "Pillar 5: Workplace Performance Suites" },
  { trainingGoal: "Cut supply chain costs through vendor negotiation training", coreCompetency: "Advanced Negotiation & Closing", pillarId: "Pillar 2", pillarName: "Pillar 2: Sales & Business Development" },
  { trainingGoal: "Enhance problem-solving agility", coreCompetency: "Critical Thinking & Problem Solving", pillarId: "Pillar 5", pillarName: "Pillar 5: Workplace Performance Suites" },
  { trainingGoal: "Build cross-functional communication", coreCompetency: "Communication & Interpersonal Skills", pillarId: "Pillar 4", pillarName: "Pillar 4: Communication & Interpersonal Excellence" },
  
  // Finance & Accounting
  { trainingGoal: "Speed up monthly close process", coreCompetency: "Operational Efficiency & Process Adherence", pillarId: "Pillar 5", pillarName: "Pillar 5: Workplace Performance Suites" },
  { trainingGoal: "Reduce errors in financial reports", coreCompetency: "Quality Assurance & Process Adherence", pillarId: "Pillar 5", pillarName: "Pillar 5: Workplace Performance Suites" },
  { trainingGoal: "Ensure 100% compliance with new tax laws", coreCompetency: "Compliance & Regulatory Knowledge", pillarId: "Pillar 6", pillarName: "Pillar 6: Compliance & Risk Management" },
  { trainingGoal: "Improve data storytelling for executive reports", coreCompetency: "Data Literacy & Business Communication", pillarId: "Pillar 1", pillarName: "Pillar 1: Strategic Leadership & Decision Making" },
  { trainingGoal: "Strengthen ethical decision-making", coreCompetency: "Ethical Leadership & Decision Making", pillarId: "Pillar 1", pillarName: "Pillar 1: Strategic Leadership & Decision Making" },
  
  // Human Resources (HR)
  { trainingGoal: "Increase employee retention through engagement strategies", coreCompetency: "Talent Management & Employee Engagement", pillarId: "Pillar 7", pillarName: "Pillar 7: Talent & Culture Transformation" },
  { trainingGoal: "Reduce time-to-hire with recruiter training", coreCompetency: "Talent Acquisition & Recruitment", pillarId: "Pillar 7", pillarName: "Pillar 7: Talent & Culture Transformation" },
  { trainingGoal: "Achieve 90%+ completion rate for mandatory DEI training", coreCompetency: "Diversity, Equity & Inclusion", pillarId: "Pillar 7", pillarName: "Pillar 7: Talent & Culture Transformation" },
  { trainingGoal: "Improve conflict mediation skills", coreCompetency: "Conflict Management & Resolution", pillarId: "Pillar 4", pillarName: "Pillar 4: Communication & Interpersonal Excellence" },
  { trainingGoal: "Boost employer branding", coreCompetency: "Talent Management & Employee Engagement", pillarId: "Pillar 7", pillarName: "Pillar 7: Talent & Culture Transformation" },
  
  // Information Technology (IT)
  { trainingGoal: "Reduce system downtime through proactive maintenance training", coreCompetency: "Technical Operations & System Management", pillarId: "Pillar 5", pillarName: "Pillar 5: Workplace Performance Suites" },
  { trainingGoal: "Increase cybersecurity compliance certifications", coreCompetency: "Compliance & Regulatory Knowledge", pillarId: "Pillar 6", pillarName: "Pillar 6: Compliance & Risk Management" },
  { trainingGoal: "Speed up ticket resolution time", coreCompetency: "Operational Efficiency & Process Adherence", pillarId: "Pillar 5", pillarName: "Pillar 5: Workplace Performance Suites" },
  { trainingGoal: "Improve user-centric communication", coreCompetency: "Communication & Interpersonal Skills", pillarId: "Pillar 4", pillarName: "Pillar 4: Communication & Interpersonal Excellence" },
  { trainingGoal: "Foster an innovation mindset", coreCompetency: "Innovation & Creative Problem Solving", pillarId: "Pillar 1", pillarName: "Pillar 1: Strategic Leadership & Decision Making" },
  
  // Leadership & Management
  { trainingGoal: "Increase employee engagement scores for their teams", coreCompetency: "Leadership & Team Management", pillarId: "Pillar 1", pillarName: "Pillar 1: Strategic Leadership & Decision Making" },
  { trainingGoal: "Improve decision-making speed with data literacy", coreCompetency: "Data Literacy & Business Communication", pillarId: "Pillar 1", pillarName: "Pillar 1: Strategic Leadership & Decision Making" },
  { trainingGoal: "Reduce turnover in their departments", coreCompetency: "Leadership & Team Management", pillarId: "Pillar 1", pillarName: "Pillar 1: Strategic Leadership & Decision Making" },
  { trainingGoal: "Strengthen coaching skills", coreCompetency: "Coaching & Mentoring", pillarId: "Pillar 1", pillarName: "Pillar 1: Strategic Leadership & Decision Making" },
  { trainingGoal: "Enhance change management capabilities", coreCompetency: "Change Management & Transformation", pillarId: "Pillar 7", pillarName: "Pillar 7: Talent & Culture Transformation" },
  
  // Compliance & Legal
  { trainingGoal: "Achieve 100% completion of mandatory compliance training", coreCompetency: "Compliance & Regulatory Knowledge", pillarId: "Pillar 6", pillarName: "Pillar 6: Compliance & Risk Management" },
  { trainingGoal: "Reduce regulatory fines", coreCompetency: "Compliance & Regulatory Knowledge", pillarId: "Pillar 6", pillarName: "Pillar 6: Compliance & Risk Management" },
  { trainingGoal: "Speed up contract review times", coreCompetency: "Operational Efficiency & Process Adherence", pillarId: "Pillar 5", pillarName: "Pillar 5: Workplace Performance Suites" },
  { trainingGoal: "Improve risk communication to non-legal teams", coreCompetency: "Communication & Interpersonal Skills", pillarId: "Pillar 4", pillarName: "Pillar 4: Communication & Interpersonal Excellence" },
  { trainingGoal: "Build an ethical culture", coreCompetency: "Ethical Leadership & Decision Making", pillarId: "Pillar 1", pillarName: "Pillar 1: Strategic Leadership & Decision Making" },
  
  // Marketing & Digital
  { trainingGoal: "Increase lead conversion rate", coreCompetency: "Digital Marketing & Lead Generation", pillarId: "Pillar 2", pillarName: "Pillar 2: Sales & Business Development" },
  { trainingGoal: "Improve ROI on ad spend", coreCompetency: "Data Literacy & Business Communication", pillarId: "Pillar 1", pillarName: "Pillar 1: Strategic Leadership & Decision Making" },
  { trainingGoal: "Boost organic traffic via SEO training", coreCompetency: "Digital Marketing & Lead Generation", pillarId: "Pillar 2", pillarName: "Pillar 2: Sales & Business Development" },
  { trainingGoal: "Enhance data-driven storytelling", coreCompetency: "Data Literacy & Business Communication", pillarId: "Pillar 1", pillarName: "Pillar 1: Strategic Leadership & Decision Making" },
  { trainingGoal: "Strengthen cross-team collaboration", coreCompetency: "Teamwork & Collaboration", pillarId: "Pillar 5", pillarName: "Pillar 5: Workplace Performance Suites" },
  
  // Generic Employee Development
  { trainingGoal: "Increase participation in L&D programs", coreCompetency: "Learning Agility & Development Mindset", pillarId: "Pillar 7", pillarName: "Pillar 7: Talent & Culture Transformation" },
  { trainingGoal: "Improve time management skills", coreCompetency: "Personal Productivity & Time Management", pillarId: "Pillar 5", pillarName: "Pillar 5: Workplace Performance Suites" },
  { trainingGoal: "Boost DEI awareness", coreCompetency: "Diversity, Equity & Inclusion", pillarId: "Pillar 7", pillarName: "Pillar 7: Talent & Culture Transformation" },
  { trainingGoal: "Enhance communication skills", coreCompetency: "Communication & Interpersonal Skills", pillarId: "Pillar 4", pillarName: "Pillar 4: Communication & Interpersonal Excellence" },
  { trainingGoal: "Foster a growth mindset", coreCompetency: "Learning Agility & Development Mindset", pillarId: "Pillar 7", pillarName: "Pillar 7: Talent & Culture Transformation" },
  
  // Engineering
  { trainingGoal: "Reduce code rework", coreCompetency: "Quality Assurance & Process Adherence", pillarId: "Pillar 5", pillarName: "Pillar 5: Workplace Performance Suites" },
  { trainingGoal: "Improve sprint completion rates", coreCompetency: "Operational Efficiency & Process Adherence", pillarId: "Pillar 5", pillarName: "Pillar 5: Workplace Performance Suites" },
  { trainingGoal: "Upskill in DevOps tools", coreCompetency: "Technical Operations & System Management", pillarId: "Pillar 5", pillarName: "Pillar 5: Workplace Performance Suites" },
  { trainingGoal: "Strengthen documentation practices", coreCompetency: "Quality Assurance & Process Adherence", pillarId: "Pillar 5", pillarName: "Pillar 5: Workplace Performance Suites" },
  { trainingGoal: "Boost collaboration with non-tech teams", coreCompetency: "Communication & Interpersonal Skills", pillarId: "Pillar 4", pillarName: "Pillar 4: Communication & Interpersonal Excellence" }
];

// Helper function to get competencies and pillars from selected training goals
export function getCompetenciesFromGoals(selectedGoals: string[]): { competencies: string[], pillars: string[] } {
  const competencySet = new Set<string>();
  const pillarSet = new Set<string>();
  
  selectedGoals.forEach(goal => {
    const mapping = competencyMapping.find(m => m.trainingGoal === goal);
    if (mapping) {
      competencySet.add(mapping.coreCompetency);
      pillarSet.add(mapping.pillarName);
    }
  });
  
  return {
    competencies: Array.from(competencySet),
    pillars: Array.from(pillarSet)
  };
}

// Soft Skills to Pillar mapping (for filtering)
export const softSkillsToPillar: Record<string, string[]> = {
  "Professionalism": ["Pillar 4", "Pillar 5"],
  "Personal Branding": ["Pillar 4", "Pillar 5"],
  "Personal Development": ["Pillar 5", "Pillar 7"],
  "Growth Mindset": ["Pillar 7"],
  "Emotional Intelligence": ["Pillar 4", "Pillar 5"],
  "Resilience at Work": ["Pillar 5"],
  "Teamwork & Collaboration": ["Pillar 4", "Pillar 5"],
  "Building High Performing Teams": ["Pillar 1", "Pillar 5"],
  "Conflict Management": ["Pillar 4"],
  "Leadership Fundamentals": ["Pillar 1"],
  "Strategic Thinking": ["Pillar 1"],
  "Project Management Skills": ["Pillar 5"]
};

// Helper function to filter soft skills by pillar
export function getSoftSkillsByPillar(pillarNames: string[]): string[] {
  const pillarIds = pillarNames.map(p => {
    // Extract pillar number from pillar name (e.g., "Pillar 3: Customer Service..." -> "Pillar 3")
    const match = p.match(/Pillar (\d+)/);
    return match ? `Pillar ${match[1]}` : "";
  }).filter(Boolean);
  
  return softSkills
    .filter(skill => {
      const skillPillars = softSkillsToPillar[skill.title] || [];
      return pillarIds.some(pillarId => skillPillars.includes(pillarId));
    })
    .map(skill => skill.title);
}

