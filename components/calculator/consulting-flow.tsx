"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle,
  TrendingUp,
  Target,
  Users,
  Building,
  BarChart3,
  DollarSign,
  FileText,
  CheckCircle2
} from "lucide-react";

// Data Types
interface ConsultingData {
  // Stage 1: Discovery
  problem: string;
  problemLocation: string[];
  urgency: number;
  coiSignal: string;
  
  // Stage 2: Alignment
  whyNow: string;
  sponsor: string[];
  successDefinition: string;
  
  // Stage 3: Department & Goals
  affectedDepartments: string[];
  improvementGoals: string[];
  
  // Stage 4: Capability Gaps
  selectedPillars: string[];
  pillarRatings: Record<string, Record<string, number>>;
  priorityCompetencies: string[];
  
  // Stage 5: SPSC Root Cause
  spscScores: {
    strategy: number;
    people: number;
    systems: number;
    culture: number;
  };
  spscComments: {
    strategy: string;
    people: string;
    systems: string;
    culture: string;
  };
  
  // Stage 6: KPI Baseline
  hasKPIs: string;
  kpis: Array<{
    name: string;
    currentValue: string;
    targetValue: string;
    frequency: string;
    confidence: string;
  }>;
  
  // Stage 7: ROI & COI
  costOfInaction: {
    turnover: number;
    errors: number;
    time: number;
    revenue: number;
  };
  expectedImprovement: number;
  
  // Stage 8-10: Auto-generated
  recommendedPathway: string;
  complexityScore: number;
  priceBand: { min: number; max: number };
}

const initialData: ConsultingData = {
  problem: "",
  problemLocation: [],
  urgency: 3,
  coiSignal: "",
  whyNow: "",
  sponsor: [],
  successDefinition: "",
  affectedDepartments: [],
  improvementGoals: [],
  selectedPillars: [],
  pillarRatings: {},
  priorityCompetencies: [],
  spscScores: {
    strategy: 3,
    people: 3,
    systems: 3,
    culture: 3,
  },
  spscComments: {
    strategy: "",
    people: "",
    systems: "",
    culture: "",
  },
  hasKPIs: "",
  kpis: [],
  costOfInaction: {
    turnover: 0,
    errors: 0,
    time: 0,
    revenue: 0,
  },
  expectedImprovement: 0,
  recommendedPathway: "",
  complexityScore: 0,
  priceBand: { min: 0, max: 0 },
};

// Capability Pillars
const CAPABILITY_PILLARS = [
  { id: "strategy", label: "Strategy", tooltip: "Clarity of direction, priorities, goals." },
  { id: "people", label: "People", tooltip: "Talent, roles, performance, hiring." },
  { id: "skills", label: "Skills & Competence", tooltip: "Employee skills, proficiency, knowledge gaps." },
  { id: "systems", label: "Systems & Processes", tooltip: "Workflows, structure, operational efficiency." },
  { id: "tools", label: "Tools & Technology", tooltip: "Systems, software, digital enablement." },
  { id: "leadership", label: "Leadership & Culture", tooltip: "Mindsets, behaviors, alignment, accountability." },
  { id: "governance", label: "Governance/Measurement", tooltip: "KPIs, reporting, decision-making discipline." },
];

// Competency mappings for each pillar
const PILLAR_COMPETENCIES: Record<string, Array<{ id: string; label: string }>> = {
  strategy: [
    { id: "clarity", label: "Clarity of strategy" },
    { id: "alignment", label: "Goal alignment" },
    { id: "prioritization", label: "Prioritization discipline" },
    { id: "communication", label: "Strategic communication" },
  ],
  people: [
    { id: "role_clarity", label: "Role clarity" },
    { id: "talent_fit", label: "Talent fit" },
    { id: "performance", label: "Performance management" },
    { id: "engagement", label: "Engagement level" },
    { id: "accountability", label: "Accountability culture" },
  ],
  skills: [
    { id: "technical", label: "Technical skill level" },
    { id: "soft", label: "Soft skill level" },
    { id: "knowledge", label: "Job knowledge" },
    { id: "cross_functional", label: "Cross-functional competence" },
    { id: "learning", label: "Learning readiness" },
  ],
  systems: [
    { id: "process_clarity", label: "Process clarity" },
    { id: "compliance", label: "Process compliance" },
    { id: "efficiency", label: "Efficiency" },
    { id: "error_rate", label: "Error rate" },
    { id: "bottlenecks", label: "Bottlenecks" },
    { id: "handover", label: "Handover quality" },
  ],
  tools: [
    { id: "usability", label: "Tool usability" },
    { id: "adoption", label: "Adoption" },
    { id: "integration", label: "Integration" },
    { id: "data_quality", label: "Data quality" },
    { id: "downtime", label: "System downtime" },
  ],
  leadership: [
    { id: "alignment", label: "Leadership alignment" },
    { id: "communication", label: "Communication" },
    { id: "safety", label: "Psychological safety" },
    { id: "maturity", label: "Team maturity" },
    { id: "ownership", label: "Ownership & accountability" },
  ],
  governance: [
    { id: "kpi_clarity", label: "KPI clarity" },
    { id: "kpi_alignment", label: "KPI alignment" },
    { id: "tracking", label: "Tracking/reporting discipline" },
    { id: "data_driven", label: "Data-driven decision-making" },
    { id: "meetings", label: "Meeting cadence quality" },
  ],
};

export function ConsultingFlow() {
  const router = useRouter();
  const [consultingType, setConsultingType] = useState<string>("");
  const [showIdentityGate, setShowIdentityGate] = useState(false);
  const [userIdentity, setUserIdentity] = useState<string>("");
  const [currentStage, setCurrentStage] = useState(0); // 0 = type selection, -1 = identity gate, 1-10 = stages
  const [data, setData] = useState<ConsultingData>(initialData);
  const [errors, setErrors] = useState<Record<number, string[]>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Load saved data from sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("consultingData");
      if (saved) {
        try {
          setData(JSON.parse(saved));
        } catch (e) {
          console.error("Error loading saved data:", e);
        }
      }
    }
  }, []);

  // Save data to sessionStorage on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("consultingData", JSON.stringify(data));
    }
  }, [data]);

  const updateData = (field: keyof ConsultingData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
    // Clear errors for current stage
    if (errors[currentStage]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[currentStage];
        return newErrors;
      });
    }
  };

  const validateStage = (stage: number): boolean => {
    const newErrors: string[] = [];

    switch (stage) {
      case 1:
        if (!data.problem.trim()) newErrors.push("Please describe the business problem");
        if (data.problemLocation.length === 0) newErrors.push("Please select where the problem is showing up");
        if (!data.coiSignal) newErrors.push("Please select what happens if you do nothing");
        break;
      case 2:
        if (!data.whyNow.trim()) newErrors.push("Please explain why now is the right time");
        if (data.sponsor.length === 0) newErrors.push("Please select at least one stakeholder");
        if (!data.successDefinition.trim()) newErrors.push("Please define what success looks like");
        break;
      case 3:
        if (data.affectedDepartments.length === 0) newErrors.push("Please select at least one department");
        if (data.improvementGoals.length === 0) newErrors.push("Please select at least one improvement goal");
        break;
      case 4:
        if (data.selectedPillars.length === 0) newErrors.push("Please select at least one capability area");
        break;
      case 5:
        // SPSC validation - all sliders must be set
        break;
      case 6:
        if (!data.hasKPIs) newErrors.push("Please indicate if you have KPI data");
        break;
    }

    if (newErrors.length > 0) {
      setErrors((prev) => ({ ...prev, [stage]: newErrors }));
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStage(currentStage)) {
      // Calculate complexity and recommendations before final stage
      if (currentStage === 9) {
        calculateComplexityAndPricing();
      }
      setCurrentStage((prev) => Math.min(prev + 1, 10));
    }
  };

  const handleBack = () => {
    setCurrentStage((prev) => Math.max(prev - 1, 1));
  };

  const calculateComplexityAndPricing = () => {
    // Calculate complexity score
    const gapCount = data.selectedPillars.length;
    const spscSeverity = Math.min(...Object.values(data.spscScores));
    const teamSizeFactor = data.affectedDepartments.length > 3 ? 1.5 : 1;
    
    const complexityScore = Math.min(5, Math.max(1, 
      (gapCount * 0.2) + (spscSeverity * 0.3) + teamSizeFactor
    ));

    // Calculate price band based on complexity
    const priceBands: Record<number, { min: number; max: number }> = {
      1: { min: 25000, max: 60000 },
      2: { min: 60000, max: 120000 },
      3: { min: 120000, max: 220000 },
      4: { min: 220000, max: 400000 },
      5: { min: 400000, max: 850000 },
    };

    const priceBand = priceBands[Math.round(complexityScore)] || priceBands[3];

    // Determine recommended pathway
    const dominantRootCause = Object.entries(data.spscScores)
      .sort(([, a], [, b]) => a - b)[0][0];
    
    const pathwayMap: Record<string, string> = {
      strategy: "Strategic Alignment Pathway",
      people: "Talent & Performance Pathway",
      systems: "Process Optimization Pathway",
      culture: "Culture Activation Pathway",
    };

    updateData("complexityScore", complexityScore);
    updateData("priceBand", priceBand);
    updateData("recommendedPathway", pathwayMap[dominantRootCause] || "Comprehensive Transformation Pathway");
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    // Submit to API
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "consulting",
          data: data,
        }),
      });

      if (response.ok) {
        setTimeout(() => {
          router.push("/");
        }, 3000);
      }
    } catch (error) {
      console.error("Submission error:", error);
      // Still redirect after 3 seconds for testing
      setTimeout(() => {
        router.push("/");
      }, 3000);
    }
  };

  // Stage Components
  const renderStage1 = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#2E4059] mb-2">
          Stage 1: Discovery
        </h2>
        <p className="text-lg text-[#6B7280]">
          Let's understand your business challenge
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <div>
          <Label className="text-base font-semibold text-[#2E4059] mb-2 block">
            What business problem are you trying to solve? <span className="text-red-500">*</span>
          </Label>
          <Textarea
            value={data.problem}
            onChange={(e) => updateData("problem", e.target.value)}
            placeholder="Describe your perceived business issue..."
            className="min-h-[100px] border-2 border-slate-200 focus:border-[#FDC700] rounded-xl"
            maxLength={200}
          />
          <p className="text-xs text-[#6B7280] mt-1">{data.problem.length}/200</p>
        </div>

        <div>
          <Label className="text-base font-semibold text-[#2E4059] mb-3 block">
            Where is the problem showing up? <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {["Sales", "Customer Service", "Operations", "Finance", "HR", "Leadership", "Supply Chain", "Technology", "Cross-functional", "Whole organization"].map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => {
                  const current = data.problemLocation;
                  const updated = current.includes(dept)
                    ? current.filter(d => d !== dept)
                    : [...current, dept];
                  updateData("problemLocation", updated);
                }}
                className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                  data.problemLocation.includes(dept)
                    ? "border-[#FDC700] bg-[#FDC700]/10"
                    : "border-slate-200 hover:border-[#FDC700]/50"
                }`}
              >
                <span className="text-sm font-medium text-[#2E4059]">{dept}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-base font-semibold text-[#2E4059] mb-3 block">
            How serious is the issue? <span className="text-red-500">*</span>
          </Label>
          <div className="space-y-3">
            <Slider
              value={[data.urgency]}
              onValueChange={([value]) => updateData("urgency", value)}
              min={1}
              max={5}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-[#6B7280]">
              <span>1 = Mild frustration</span>
              <span>2 = Minor problem</span>
              <span>3 = Affecting performance</span>
              <span>4 = Major problem</span>
              <span>5 = Critical - urgent</span>
            </div>
            <div className="text-center mt-2">
              <span className="text-2xl font-bold text-[#FDC700]">{data.urgency}</span>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-base font-semibold text-[#2E4059] mb-3 block">
            What happens if you do nothing? <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={data.coiSignal}
            onValueChange={(value) => updateData("coiSignal", value)}
            className="space-y-2"
          >
            {[
              "Nothing big changes",
              "Problem will get worse",
              "We will lose money/people/time",
              "The business will suffer major consequences"
            ].map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option} className="cursor-pointer text-[#2E4059]">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </Card>
    </div>
  );

  const renderStage2 = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#2E4059] mb-2">
          Stage 2: Alignment
        </h2>
        <p className="text-lg text-[#6B7280]">
          Understanding context and stakeholders
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <div>
          <Label className="text-base font-semibold text-[#2E4059] mb-2 block">
            Why is now the right time to solve this? <span className="text-red-500">*</span>
          </Label>
          <Textarea
            value={data.whyNow}
            onChange={(e) => updateData("whyNow", e.target.value)}
            placeholder="Is there a trigger event or new priority?"
            className="min-h-[80px] border-2 border-slate-200 focus:border-[#FDC700] rounded-xl"
          />
        </div>

        <div>
          <Label className="text-base font-semibold text-[#2E4059] mb-3 block">
            Key Stakeholders / Responsible Party (select multiple) <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["CEO", "C-Suite Executive", "Department Heads", "Frontline Managers", "HR", "L&D Team", "Employees", "Clients/Customers"].map((stakeholder) => (
              <button
                key={stakeholder}
                type="button"
                onClick={() => {
                  const current = data.sponsor;
                  const updated = current.includes(stakeholder)
                    ? current.filter(s => s !== stakeholder)
                    : [...current, stakeholder];
                  updateData("sponsor", updated);
                }}
                className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                  data.sponsor.includes(stakeholder)
                    ? "border-[#FDC700] bg-[#FDC700]/10"
                    : "border-slate-200 hover:border-[#FDC700]/50"
                }`}
              >
                <span className="text-sm font-medium text-[#2E4059]">{stakeholder}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-base font-semibold text-[#2E4059] mb-2 block">
            What does success look like? <span className="text-red-500">*</span>
          </Label>
          <Textarea
            value={data.successDefinition}
            onChange={(e) => updateData("successDefinition", e.target.value)}
            placeholder="One sentence. What must improve?"
            className="min-h-[80px] border-2 border-slate-200 focus:border-[#FDC700] rounded-xl"
          />
        </div>
      </Card>
    </div>
  );

  const renderStage3 = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#2E4059] mb-2">
          Stage 3: Department & Goals
        </h2>
        <p className="text-lg text-[#6B7280]">
          Identify affected areas and improvement objectives
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <div>
          <Label className="text-base font-semibold text-[#2E4059] mb-3 block">
            Which department(s) does this affect? <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {["Sales", "Finance & Accounting", "Customer Service", "Operations", "Logistic & Supply", "HR", "Information Technology"].map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => {
                  const current = data.affectedDepartments;
                  const updated = current.includes(dept)
                    ? current.filter(d => d !== dept)
                    : [...current, dept];
                  updateData("affectedDepartments", updated);
                }}
                className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                  data.affectedDepartments.includes(dept)
                    ? "border-[#FDC700] bg-[#FDC700]/10"
                    : "border-slate-200 hover:border-[#FDC700]/50"
                }`}
              >
                <span className="text-sm font-medium text-[#2E4059]">{dept}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-base font-semibold text-[#2E4059] mb-3 block">
            What are your top improvement goals? <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              "Increase revenue",
              "Reduce cost",
              "Improve speed",
              "Improve customer satisfaction",
              "Improve quality",
              "Reduce errors",
              "Strengthen leadership",
              "Improve culture",
              "Reduce turnover",
              "Improve process efficiency",
              "Other"
            ].map((goal) => (
              <button
                key={goal}
                type="button"
                onClick={() => {
                  const current = data.improvementGoals;
                  const updated = current.includes(goal)
                    ? current.filter(g => g !== goal)
                    : [...current, goal];
                  updateData("improvementGoals", updated);
                }}
                className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                  data.improvementGoals.includes(goal)
                    ? "border-[#FDC700] bg-[#FDC700]/10"
                    : "border-slate-200 hover:border-[#FDC700]/50"
                }`}
              >
                <span className="text-sm font-medium text-[#2E4059]">{goal}</span>
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );

  const renderStage4 = () => {
    const handlePillarToggle = (pillarId: string) => {
      const current = data.selectedPillars;
      const updated = current.includes(pillarId)
        ? current.filter(p => p !== pillarId)
        : [...current, pillarId];
      updateData("selectedPillars", updated);
      
      // Initialize ratings for new pillar
      if (!current.includes(pillarId)) {
        const competencies = PILLAR_COMPETENCIES[pillarId] || [];
        const ratings: Record<string, number> = {};
        competencies.forEach(comp => {
          ratings[comp.id] = 3;
        });
        updateData("pillarRatings", {
          ...data.pillarRatings,
          [pillarId]: ratings,
        });
      }
    };

    const handleCompetencyRating = (pillarId: string, competencyId: string, value: number) => {
      updateData("pillarRatings", {
        ...data.pillarRatings,
        [pillarId]: {
          ...(data.pillarRatings[pillarId] || {}),
          [competencyId]: value,
        },
      });
    };

    return (
      <div className="space-y-6 animate-fade-in-up">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2E4059] mb-2">
            Stage 4: Capability Gaps
          </h2>
          <p className="text-lg text-[#6B7280]">
            Identify where capabilities are weak
          </p>
        </div>

        <Card className="p-6 space-y-6">
          <div>
            <Label className="text-base font-semibold text-[#2E4059] mb-3 block">
              Which capability areas are weak? <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-[#6B7280] mb-4">Choose all that apply.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {CAPABILITY_PILLARS.map((pillar) => (
                <button
                  key={pillar.id}
                  type="button"
                  onClick={() => handlePillarToggle(pillar.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    data.selectedPillars.includes(pillar.id)
                      ? "border-[#FDC700] bg-[#FDC700]/10"
                      : "border-slate-200 hover:border-[#FDC700]/50"
                  }`}
                >
                  <div className="font-semibold text-[#2E4059] mb-1">{pillar.label}</div>
                  <div className="text-xs text-[#6B7280]">{pillar.tooltip}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Show competency ratings for selected pillars */}
          {data.selectedPillars.map((pillarId) => {
            const pillar = CAPABILITY_PILLARS.find(p => p.id === pillarId);
            const competencies = PILLAR_COMPETENCIES[pillarId] || [];
            const ratings = data.pillarRatings[pillarId] || {};

            return (
              <div key={pillarId} className="border-t border-slate-200 pt-6 space-y-4">
                <h3 className="text-lg font-bold text-[#2E4059]">
                  You Selected "{pillar?.label.toUpperCase()}" as a Capability Area
                </h3>
                <div className="space-y-4">
                  {competencies.map((comp) => (
                    <div key={comp.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-[#2E4059]">
                          {comp.label}
                        </Label>
                        <span className="text-sm font-bold text-[#FDC700]">
                          {ratings[comp.id] || 3}
                        </span>
                      </div>
                      <Slider
                        value={[ratings[comp.id] || 3]}
                        onValueChange={([value]) => handleCompetencyRating(pillarId, comp.id, value)}
                        min={1}
                        max={5}
                        step={1}
                        className="w-full"
                      />
                      {ratings[comp.id] && ratings[comp.id] <= 2 && (
                        <Input
                          placeholder="Describe the issue briefly..."
                          className="mt-2 border-2 border-slate-200 focus:border-[#FDC700] rounded-xl"
                          onChange={(e) => {
                            // Store comments if needed
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    );
  };

  const renderStage5 = () => {
    const handleSPSCChange = (key: keyof typeof data.spscScores, value: number) => {
      updateData("spscScores", {
        ...data.spscScores,
        [key]: value,
      });
      
      // Show comment field if score < 3
      if (value < 3 && !data.spscComments[key]) {
        updateData("spscComments", {
          ...data.spscComments,
          [key]: "",
        });
      }
    };

    const spscSections = [
      { key: "strategy" as const, label: "Strategy Foundation", tooltip: "Strategy = clarity, focus, and direction. Weak strategy creates confusion even if people and processes are strong." },
      { key: "people" as const, label: "People-related Enablers", tooltip: "People = the human enablers. Weaknesses here often show up as mistakes, delays, resistance, or poor execution." },
      { key: "systems" as const, label: "Systems & Processes", tooltip: "Systems/process = structure, workflow, and technology. If these are weak, even skilled people underperform." },
      { key: "culture" as const, label: "Culture", tooltip: "Culture = the behavioral environment. It can block or enable all improvements." },
    ];

    return (
      <div className="space-y-6 animate-fade-in-up">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2E4059] mb-2">
            Stage 5: Root Cause (SPSC Model)
          </h2>
          <p className="text-lg text-[#6B7280]">
            Assess the root causes across Strategy, People, Systems, and Culture
          </p>
        </div>

        <div className="space-y-6">
          {spscSections.map((section) => (
            <Card key={section.key} className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-[#2E4059] mb-1">
                  How strong is your {section.label.toLowerCase()} around this issue?
                </h3>
                <p className="text-sm text-[#6B7280]">{section.tooltip}</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#2E4059]">
                      {section.label}
                    </span>
                    <span className="text-2xl font-bold text-[#FDC700]">
                      {data.spscScores[section.key]}
                    </span>
                  </div>
                  <Slider
                    value={[data.spscScores[section.key]]}
                    onValueChange={([value]) => handleSPSCChange(section.key, value)}
                    min={1}
                    max={5}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-[#6B7280]">
                    <span>1 = Weak</span>
                    <span>5 = Strong</span>
                  </div>
                </div>
                
                {data.spscScores[section.key] < 3 && (
                  <div className="mt-4">
                    <Textarea
                      value={data.spscComments[section.key] || ""}
                      onChange={(e) => updateData("spscComments", {
                        ...data.spscComments,
                        [section.key]: e.target.value,
                      })}
                      placeholder="Please describe the issue briefly..."
                      className="min-h-[80px] border-2 border-slate-200 focus:border-[#FDC700] rounded-xl"
                    />
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderStage6 = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#2E4059] mb-2">
          Stage 6: KPI Baseline
        </h2>
        <p className="text-lg text-[#6B7280]">
          Measure current performance
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <div>
          <Label className="text-base font-semibold text-[#2E4059] mb-3 block">
            Do you have measured KPI data for this problem? <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={data.hasKPIs}
            onValueChange={(value) => updateData("hasKPIs", value)}
            className="space-y-2"
          >
            {[
              { value: "yes", label: "Yes, we have KPIs" },
              { value: "no", label: "No, we don't measure it yet" },
              { value: "partial", label: "Sort of / partially" },
            ].map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="cursor-pointer text-[#2E4059]">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {data.hasKPIs === "yes" && (
          <div className="space-y-4 border-t border-slate-200 pt-6">
            <h3 className="font-semibold text-[#2E4059]">KPI Details</h3>
            {data.kpis.map((kpi, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl">
                <Input
                  placeholder="KPI Name"
                  value={kpi.name}
                  onChange={(e) => {
                    const updated = [...data.kpis];
                    updated[idx] = { ...updated[idx], name: e.target.value };
                    updateData("kpis", updated);
                  }}
                />
                <Input
                  placeholder="Current Value"
                  value={kpi.currentValue}
                  onChange={(e) => {
                    const updated = [...data.kpis];
                    updated[idx] = { ...updated[idx], currentValue: e.target.value };
                    updateData("kpis", updated);
                  }}
                />
                <Input
                  placeholder="Target Value"
                  value={kpi.targetValue}
                  onChange={(e) => {
                    const updated = [...data.kpis];
                    updated[idx] = { ...updated[idx], targetValue: e.target.value };
                    updateData("kpis", updated);
                  }}
                />
                <Input
                  placeholder="Frequency"
                  value={kpi.frequency}
                  onChange={(e) => {
                    const updated = [...data.kpis];
                    updated[idx] = { ...updated[idx], frequency: e.target.value };
                    updateData("kpis", updated);
                  }}
                />
              </div>
            ))}
            <Button
              type="button"
              onClick={() => updateData("kpis", [...data.kpis, { name: "", currentValue: "", targetValue: "", frequency: "", confidence: "" }])}
              className="bg-[#FDC700] text-[#2E4059] hover:bg-[#F5AF19]"
            >
              Add More KPI
            </Button>
          </div>
        )}
      </Card>
    </div>
  );

  const renderStage7 = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#2E4059] mb-2">
          Stage 7: ROI & Cost of Inaction
        </h2>
        <p className="text-lg text-[#6B7280]">
          Estimate the cost of doing nothing
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <div>
          <Label className="text-base font-semibold text-[#2E4059] mb-3 block">
            Expected Improvement Percentage
          </Label>
          <div className="space-y-3">
            <Slider
              value={[data.expectedImprovement]}
              onValueChange={([value]) => updateData("expectedImprovement", value)}
              min={0}
              max={50}
              step={5}
              className="w-full"
            />
            <div className="text-center">
              <span className="text-3xl font-bold text-[#FDC700]">{data.expectedImprovement}%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: "turnover", label: "Turnover Cost", placeholder: "People count × Salary × 1.5" },
            { key: "errors", label: "Error Cost", placeholder: "Frequency × Cost per error" },
            { key: "time", label: "Time Cost", placeholder: "Hours × Hourly Rate" },
            { key: "revenue", label: "Revenue Impact", placeholder: "Estimated loss" },
          ].map((item) => (
            <div key={item.key}>
              <Label className="text-sm font-semibold text-[#2E4059] mb-2 block">
                {item.label}
              </Label>
              <Input
                type="number"
                value={data.costOfInaction[item.key as keyof typeof data.costOfInaction] || ""}
                onChange={(e) => updateData("costOfInaction", {
                  ...data.costOfInaction,
                  [item.key]: parseFloat(e.target.value) || 0,
                })}
                placeholder={item.placeholder}
                className="border-2 border-slate-200 focus:border-[#FDC700] rounded-xl"
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderStage8 = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#2E4059] mb-2">
          Stage 8: Solution Pathways
        </h2>
        <p className="text-lg text-[#6B7280]">
          Recommended approach based on your diagnosis
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-[#FDC700]/10 to-[#F5AF19]/10 rounded-xl border-2 border-[#FDC700]/20">
            <h3 className="text-xl font-bold text-[#2E4059] mb-2">
              {data.recommendedPathway || "Comprehensive Transformation Pathway"}
            </h3>
            <p className="text-[#6B7280]">
              Based on your SPSC analysis, we recommend this pathway to address your root causes.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-[#2E4059]">Recommended Components:</h4>
            <ul className="list-disc list-inside space-y-1 text-[#6B7280]">
              <li>Diagnostic Assessment</li>
              <li>Strategic Workshops</li>
              <li>Coaching & Development</li>
              <li>Training Programs</li>
              <li>Implementation Support</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderStage9 = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#2E4059] mb-2">
          Stage 9: Pricing
        </h2>
        <p className="text-lg text-[#6B7280]">
          Investment range for your engagement
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="p-6 bg-gradient-to-r from-[#FDC700]/10 to-[#F5AF19]/10 rounded-xl border-2 border-[#FDC700]/20">
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-[#2E4059] mb-2">
                {data.priceBand.min.toLocaleString()} - {data.priceBand.max.toLocaleString()} ETB
              </div>
              <div className="text-sm text-[#6B7280]">
                Complexity Score: {data.complexityScore.toFixed(1)}/5.0
              </div>
            </div>
            
            <div className="space-y-2 mt-4">
              <h4 className="font-semibold text-[#2E4059]">What's Included:</h4>
              <ul className="list-disc list-inside space-y-1 text-[#6B7280]">
                <li>Full diagnostic assessment</li>
                <li>Strategic recommendations</li>
                <li>Implementation roadmap</li>
                <li>Progress tracking & reporting</li>
                <li>Ongoing support</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderStage10 = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#2E4059] mb-2">
          Stage 10: Summary & Next Steps
        </h2>
        <p className="text-lg text-[#6B7280]">
          Review your diagnostic results
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl">
            <h3 className="font-semibold text-[#2E4059] mb-2">Problem Summary</h3>
            <p className="text-[#6B7280]">{data.problem}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl">
            <h3 className="font-semibold text-[#2E4059] mb-2">Root Cause Analysis</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(data.spscScores).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className="text-2xl font-bold text-[#FDC700]">{value}</div>
                  <div className="text-xs text-[#6B7280] capitalize">{key}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl">
            <h3 className="font-semibold text-[#2E4059] mb-2">Recommended Pathway</h3>
            <p className="text-[#6B7280]">{data.recommendedPathway}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl">
            <h3 className="font-semibold text-[#2E4059] mb-2">Investment Range</h3>
            <p className="text-2xl font-bold text-[#2E4059]">
              {data.priceBand.min.toLocaleString()} - {data.priceBand.max.toLocaleString()} ETB
            </p>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitted}
          className="w-full bg-[#FDC700] text-[#2E4059] hover:bg-[#F5AF19] font-bold py-6 text-lg rounded-xl"
        >
          {isSubmitted ? "Submitting..." : "Book Diagnostic Call"}
        </Button>
      </Card>
    </div>
  );

  // Render Consulting Type Selection (C0)
  const renderConsultingTypeSelection = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#2E4059] mb-2">
          What kind of consulting support do you need?
        </h2>
        <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
          What strategic challenge do you want to diagnose today? We'll guide you through a structured discovery (SPSC) to map your real problem and build a business case.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            id: "problem",
            label: "Solve a business problem",
            tooltip: "Performance, quality, culture, sales, operations, service, leadership.",
          },
          {
            id: "diagnose",
            label: "Diagnose organization/team capability gaps",
            tooltip: "People, systems, culture, leadership, process bottlenecks.",
          },
          {
            id: "business-case",
            label: "Build an L&D investment business case",
            tooltip: "Show ROI, justify budget, measure impact.",
          },
          {
            id: "transformation",
            label: "Full transformation roadmap",
            tooltip: "End-to-end design of strategy, capability, system, culture.",
          },
        ].map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => {
              setConsultingType(option.id);
              setShowIdentityGate(true);
              setCurrentStage(-1);
            }}
            className={`p-6 rounded-xl border-2 transition-all duration-300 text-left group ${
              consultingType === option.id
                ? "border-[#FDC700] bg-[#FDC700]/10 shadow-lg"
                : "border-slate-200 hover:border-[#FDC700]/50 hover:shadow-md"
            }`}
          >
            <h3 className="font-semibold text-lg text-[#2E4059] mb-2">{option.label}</h3>
            <p className="text-sm text-[#6B7280]">{option.tooltip}</p>
          </button>
        ))}
      </div>
    </div>
  );

  // Render Identity Gate (C1)
  const renderIdentityGate = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#2E4059] mb-2">
          Tell us who you are
        </h2>
        <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
          Who are you completing this diagnosis for?<br />
          We will customize questions based on your role and authority.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { id: "individual", label: "Individual", icon: "👤" },
          { id: "consultant", label: "Consultant", icon: "💼" },
          { id: "business", label: "Business", icon: "🏢" },
        ].map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => {
              setUserIdentity(option.id);
              if (typeof window !== "undefined") {
                sessionStorage.setItem("selectedRole", option.id);
              }
              setCurrentStage(1);
            }}
            className={`p-8 rounded-xl border-2 transition-all duration-300 text-center group ${
              userIdentity === option.id
                ? "border-[#FDC700] bg-[#FDC700]/10 shadow-lg"
                : "border-slate-200 hover:border-[#FDC700]/50 hover:shadow-md"
            }`}
          >
            <div className="text-5xl mb-4">{option.icon}</div>
            <h3 className="font-semibold text-lg text-[#2E4059]">{option.label}</h3>
          </button>
        ))}
      </div>
    </div>
  );

  // Main render
  const renderCurrentStage = () => {
    if (currentStage === 0) return renderConsultingTypeSelection();
    if (currentStage === -1) return renderIdentityGate();
    
    switch (currentStage) {
      case 1: return renderStage1();
      case 2: return renderStage2();
      case 3: return renderStage3();
      case 4: return renderStage4();
      case 5: return renderStage5();
      case 6: return renderStage6();
      case 7: return renderStage7();
      case 8: return renderStage8();
      case 9: return renderStage9();
      case 10: return renderStage10();
      default: return renderConsultingTypeSelection();
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card className="p-12 text-center animate-fade-in-up">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-[#2E4059] mb-2">Thank You!</h2>
          <p className="text-lg text-[#6B7280] mb-6">
            We've received your diagnostic request. Our team will contact you soon to schedule your diagnostic call.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Progress Indicator - Only show for stages 1-10 */}
      {currentStage > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#6B7280]">
              Stage {currentStage} of 10
            </span>
            <span className="text-sm font-medium text-[#6B7280]">
              {Math.round((currentStage / 10) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-[#FDC700] to-[#F5AF19] h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStage / 10) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Stage Content */}
      {renderCurrentStage()}

      {/* Navigation */}
      {currentStage > 0 && currentStage < 10 && (
        <div className="flex justify-between mt-8">
          <Button
            onClick={handleBack}
            disabled={currentStage === 1}
            variant="outline"
            className="px-6 py-3 rounded-xl border-2 border-slate-200 hover:border-[#FDC700] disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            className="px-8 py-3 bg-[#FDC700] text-[#2E4059] hover:bg-[#F5AF19] font-bold rounded-xl"
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
      
      {/* Continue button for identity gate */}
      {currentStage === -1 && userIdentity && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={() => setCurrentStage(1)}
            className="px-8 py-3 bg-[#FDC700] text-[#2E4059] hover:bg-[#F5AF19] font-bold rounded-xl"
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
