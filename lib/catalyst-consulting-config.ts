/** Pillar competency lists — from company HTML prototype */
export const PILLAR_COMPS: Record<string, string[]> = {
  strategy: ["Clarity of strategy", "Goal alignment", "Prioritization discipline", "Strategic communication"],
  people: ["Role clarity", "Talent fit", "Performance management", "Engagement level", "Accountability culture"],
  skills: ["Technical skill level", "Soft skill level", "Job knowledge", "Cross-functional competence", "Learning readiness"],
  systems: ["Process clarity", "Process compliance", "Efficiency", "Error rate", "Bottlenecks"],
  tools: ["Tool usability", "Adoption rate", "System integration", "Data quality", "System downtime"],
  leadership: ["Leadership alignment", "Communication", "Psychological safety", "Team maturity", "Ownership & accountability"],
  governance: ["KPI clarity", "KPI alignment", "Tracking discipline", "Data-driven decisions", "Meeting quality"],
};

/** SPSC detail slider keys → group letter for averaging */
export const SPSC_KEYS: Record<"s" | "p" | "sy" | "c", string[]> = {
  s: ["s1", "s2", "s3", "s4"],
  p: ["p1", "p2", "p3", "p4", "p5"],
  sy: ["sy1", "sy2", "sy3", "sy4"],
  c: ["c1", "c2", "c3", "c4", "c5"],
};

export const SPSC_BLOCKS: {
  id: keyof typeof SPSC_KEYS;
  emoji: string;
  title: string;
  hint: string;
  rows: { key: string; label: string; desc?: string }[];
}[] = [
  {
    id: "s",
    emoji: "🧭",
    title: "Strategy",
    hint: "How strong is your strategy foundation around this issue?",
    rows: [
      { key: "s1", label: "Clarity of strategy", desc: "Strategy = clarity, focus, direction." },
      { key: "s2", label: "Goal alignment" },
      { key: "s3", label: "Prioritization discipline" },
      { key: "s4", label: "Communication of expectations" },
    ],
  },
  {
    id: "p",
    emoji: "👥",
    title: "People",
    hint: "How strong are the people-related enablers?",
    rows: [
      { key: "p1", label: "Role clarity", desc: "People = human enablers." },
      { key: "p2", label: "Capability / skill fit" },
      { key: "p3", label: "Performance accountability" },
      { key: "p4", label: "Engagement & motivation" },
      { key: "p5", label: "Leadership support" },
    ],
  },
  {
    id: "sy",
    emoji: "⚙️",
    title: "Systems",
    hint: "How strong are the systems and processes supporting this work?",
    rows: [
      { key: "sy1", label: "Process clarity", desc: "Systems = structure, workflow, tools." },
      { key: "sy2", label: "Process compliance" },
      { key: "sy3", label: "Workflow efficiency" },
      { key: "sy4", label: "Tool & technology support" },
    ],
  },
  {
    id: "c",
    emoji: "🎯",
    title: "Culture",
    hint: "How strong is the culture supporting this work?",
    rows: [
      { key: "c1", label: "Leadership role modeling", desc: "Culture = the behavioral environment." },
      { key: "c2", label: "Accountability mindset" },
      { key: "c3", label: "Psychological safety" },
      { key: "c4", label: "Trust & collaboration" },
      { key: "c5", label: "Openness to change" },
    ],
  },
];

export const CONSULTING_INTENTS = [
  { id: "biz", icon: "🔎", title: "Solve a Business Problem", desc: "Diagnose people, systems, culture, or leadership bottlenecks." },
  { id: "ld", icon: "📊", title: "Build an L&D Business Case", desc: "Justify training investment with ROI and cost-of-inaction evidence." },
  { id: "gaps", icon: "🗺️", title: "Diagnose Capability Gaps", desc: "Map skills and performance gaps across the 7-Pillar model." },
  { id: "transform", icon: "🚀", title: "Full Transformation Roadmap", desc: "End-to-end strategy, capability, systems, and culture design." },
] as const;

export const PILLAR_TILES = [
  { id: "strategy", icon: "🧭", name: "Strategy", tip: "Direction, goals, priorities" },
  { id: "people", icon: "👥", name: "People", tip: "Talent, roles, performance" },
  { id: "skills", icon: "📚", name: "Skills & Competence", tip: "Skills, knowledge gaps" },
  { id: "systems", icon: "⚙️", name: "Systems & Processes", tip: "Workflows, efficiency" },
  { id: "tools", icon: "🖥️", name: "Tools & Technology", tip: "Software, digital tools" },
  { id: "leadership", icon: "🎯", name: "Leadership & Culture", tip: "Mindsets, accountability" },
  { id: "governance", icon: "📊", name: "Governance & Measurement", tip: "KPIs, reporting, decisions" },
] as const;
