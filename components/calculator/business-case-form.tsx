"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  deptGoals,
  programs,
  softSkills,
  urgencyMap,
  getCompetenciesFromGoals,
  getSoftSkillsByPillar,
} from "@/lib/business-case-data";
import {
  computePricingAndROI,
  formatCurrency,
  formatPercent,
} from "@/lib/business-case-calculations";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

export interface BusinessCaseData {
  // Step 0 - Discovery
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  clientType: string; // Private Company, NGO, Government/Public Sector, International IGO, Foreign Branch
  isRegisteredBusiness: string; // "Yes" | "No"
  tinNumber: string;
  physicalAddress: string;
  officeNumber: string;
  subcity: string;
  placeName: string;
  region: string;
  userType: string; // Business, Individual, Consultant
  industry: string; // Moved from Step 5 to Step 0
  primarySPSCFocus: string[]; // Multi-select: Strategy, People, System/Process, Culture
  consentAgreed: boolean;
  optInNewsletter: boolean;
  biggestChallenge: string;
  kpiPain: string[]; // Changed to array for multi-select
  persistenceDuration: string; // How long has this persisted?
  rootCausePeople: string; // SPSC Root Cause 1: People / Competency
  rootCauseSystem: string; // SPSC Root Cause 2: System / Process
  rootCauseStrategy: string; // SPSC Root Cause 3: Strategy / Clarity
  rootCauseCulture: string; // SPSC Root Cause 4: Culture / Environment
  enableIfSolved: string;
  currentImpact: string[]; // Changed to array for multi-select
  urgency: string;

  // Step 1 - Strategic Alignment & SPSC Validation
  hasStrategicAlignment: string; // "Yes" | "No"
  costOfInaction: number; // Moved up - first financial question
  strategicPriority: string;
  stakeholders: string[];
  csuiteDetails: string;
  departmentHeadsDetails: string;
  frontlineManagersDetails: string;
  employeesDetails: string;
  strategyTimeline: string;
  alignmentNarrative: string;
  // People Alignment
  behavioralChangeSupported: string; // Yes/No/Unsure
  competencyGap: string; // Minor, Moderate, Critical
  // System/Process Alignment
  systemProcessBottleneck: string; // Yes/No
  systemProcessRemediation: string; // Text area if Yes
  // Culture Alignment
  cultureResistant: string; // Yes/No/Unsure
  failureLearningAttitude: string; // Punitive, Tolerant, Growth-Oriented
  // Solution Risk Assessment
  greatestInternalHurdle: string;
  conflictingProject: string; // Yes/No/Unsure
  conflictingProjectDetails: string; // Text if Yes

  // Step 2 - Dept & Goals (Competency Mapping & Solution Blueprint)
  department: string[]; // Changed to array for multi-select
  trainingGoal: string[]; // Changed to array for multi-select
  contextualNotes: string; // Renamed from customGoal
  behaviorGoal: string;
  competencyRequired: string; // Auto-populated from training goals (read-only)
  alignedPillar: string; // Auto-populated from competencies (read-only)
  knowledgeSkills: string;
  // Implementation Scope and Audience Detail (Step 4 enhancements)
  participants: number; // Moved from Step 6 - Total Number of Participants
  targetJobLevel: string[]; // Select Multiple: Frontline, Specialist, Supervisor, Manager, Executive
  deploymentStart: string; // Required Deployment Start (Within 3 months, 3-6 months, etc.)
  baselineMeasurement: string; // Yes/No/Unsure
  baselineMeasurementDetails: string; // Text if Yes

  // Step 3 - Program Selection (Solution Mapping & Investment Recommendation)
  programGroup: string; // Read-only, displays Pillar(s) from Step 4
  programName: string[]; // Filtered by Pillar/Competency
  additionalTrainingTitle: string;
  requiresSoftSkills: string; // Yes/No toggle
  softSkillSelections: string[]; // Filtered by Pillar if Yes
  durationOverrideHours: string;
  expectedStartDate: string; // Date Picker
  // Training Customization
  customizationDepth: string; // Use Standard, Minor Branding, Full Custom
  deliveryFormat: string[]; // Select Multiple: In-Person, VILT, Blended, Self-Paced eLearning
  // SPSC Consulting Validation
  policySystemGaps: string; // Conditional: Only if System/Process Bottleneck = Yes
  changeManagementReadiness: string; // Conditional: Only if Culture Resistant = Yes/Unsure
  designatedChampion: string; // Always Visible: Name & Title
  consultingAddOn: boolean; // Include Consulting?
  consultingType: string; // Type of consulting selected

  // Step 6 - ROI Quantification & SPSC Impact Validation
  metricDataReadiness: string; // Validated Data / Only Estimates / Needs Benchmark
  metricName: string; // Read-only, auto-populated from training goal
  currentMetric: string;
  targetMetric: string;
  targetBehaviorAdoptionRate: string; // L3 - Target Behavior Adoption Rate (%)
  estProductivityGain: string;
  estRetentionImprovement: string;
  directCostSavingPerPerson: string;
  executiveImpactSummary: string; // Combined Success Looks Like + Observable Changes
  // SPSC Validation Metrics (conditional)
  systemProcessSuccessIndicator: string; // Conditional: if System consulting added
  cultureEnvironmentSuccessIndicator: string; // Conditional: if Culture consulting added
  // Financial drivers moved from Step 7
  avgMonthlySalary: number; // Moved from Step 7
  totalEmployees: string; // Moved from Step 7 (for context)

  // Step 7 - L&D Capacity & Budget Context
  annualBudget: number;
  budgetKnowledgeGate: string; // "I know the budget" / "The budget is TBD"
  consultingBudgetSeparate: string; // Yes/No/Unsure
  costContingencyPercent: number; // Optional
  lndStaff: number; // Total L&D staff (Trainers/Designers/Facilitators)
  trainerHourlyRate: number;
  initiativesPerYear: number; // # of distinct training initiatives planned annually
  annualHoursPerEmployee: number;
  devHoursPerTrainingHour: number;
  deliveryFrequency: string; // Required Follow-Up/Delivery Frequency

  // Step 5 - Training Add-ons (refined)
  addPreAssess: boolean; // Include Pre-assessment?
  addCoaching: boolean; // Include Post-program Coaching?
  addDigital: boolean; // Digital Learning Follow-ups?
  // Logistics Handling Fee - calculated field (based on Delivery Format and Region)
}

const initialData: BusinessCaseData = {
  companyName: "",
  contactName: "",
  phone: "",
  email: "",
  clientType: "",
  isRegisteredBusiness: "",
  tinNumber: "",
  physicalAddress: "",
  officeNumber: "",
  subcity: "",
  placeName: "",
  region: "",
  userType: "",
  industry: "",
  totalEmployees: "",
  primarySPSCFocus: [],
  consentAgreed: false,
  optInNewsletter: false,
  biggestChallenge: "",
  kpiPain: [],
  persistenceDuration: "",
  rootCausePeople: "",
  rootCauseSystem: "",
  rootCauseStrategy: "",
  rootCauseCulture: "",
  enableIfSolved: "",
  currentImpact: [],
  urgency: "Standard (4+ weeks lead time)",
  hasStrategicAlignment: "",
  costOfInaction: 0,
  strategicPriority: "",
  stakeholders: [],
  csuiteDetails: "",
  departmentHeadsDetails: "",
  frontlineManagersDetails: "",
  employeesDetails: "",
  strategyTimeline: "",
  alignmentNarrative: "",
  behavioralChangeSupported: "",
  competencyGap: "",
  systemProcessBottleneck: "",
  systemProcessRemediation: "",
  cultureResistant: "",
  failureLearningAttitude: "",
  greatestInternalHurdle: "",
  conflictingProject: "",
  conflictingProjectDetails: "",
  department: [],
  trainingGoal: [],
  contextualNotes: "",
  behaviorGoal: "",
  competencyRequired: "",
  alignedPillar: "",
  knowledgeSkills: "",
  participants: 0,
  targetJobLevel: [],
  deploymentStart: "",
  baselineMeasurement: "",
  baselineMeasurementDetails: "",
  programGroup: "",
  programName: [],
  additionalTrainingTitle: "",
  requiresSoftSkills: "",
  softSkillSelections: [],
  durationOverrideHours: "",
  expectedStartDate: "",
  customizationDepth: "",
  deliveryFormat: [],
  policySystemGaps: "",
  changeManagementReadiness: "",
  designatedChampion: "",
  consultingAddOn: false,
  consultingType: "",
  metricDataReadiness: "",
  metricName: "",
  currentMetric: "",
  targetMetric: "",
  targetBehaviorAdoptionRate: "",
  estProductivityGain: "",
  estRetentionImprovement: "",
  directCostSavingPerPerson: "",
  executiveImpactSummary: "",
  systemProcessSuccessIndicator: "",
  cultureEnvironmentSuccessIndicator: "",
  avgMonthlySalary: 0,
  annualBudget: 0,
  budgetKnowledgeGate: "",
  consultingBudgetSeparate: "",
  costContingencyPercent: 0,
  lndStaff: 0,
  trainerHourlyRate: 0,
  initiativesPerYear: 0,
  annualHoursPerEmployee: 0,
  devHoursPerTrainingHour: 0,
  deliveryFrequency: "",
  addPreAssess: false,
  addCoaching: false,
  addDigital: false,
};

const stepDefs = [
  { key: "companyInfo", title: "Company Information", number: 1 },
  {
    key: "problemContext",
    title: "Business Pain & SPSC Root Cause Diagnostic",
    number: 2,
  },
  { key: "align", title: "Strategic Alignment & SPSC Validation", number: 3 },
  {
    key: "deptGoals",
    title: "Competency Mapping & Solution Blueprint",
    number: 4,
  },
  {
    key: "program",
    title: "Solution Mapping & Investment Recommendation",
    number: 5,
  },
  {
    key: "metrics",
    title: "ROI Quantification & SPSC Impact Validation",
    number: 6,
  },
  { key: "org", title: "L&D Capacity & Budget Context", number: 7 },
  { key: "pricing", title: "Pricing & Strategic ROI Proposal", number: 8 },
];

/* ============================================
   COMMENTED OUT - PRESERVED FOR LATER USE
   This form code is commented out as we're implementing
   the new Training/Consulting route system.
   ============================================ */

export function BusinessCaseForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<BusinessCaseData>(initialData);
  const [errors, setErrors] = useState<Record<number, string[]>>({});
  const [showThankYou, setShowThankYou] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-redirect after showing thank you message
  useEffect(() => {
    if (showThankYou) {
      const timer = setTimeout(() => {
        setShowThankYou(false);
        router.push("/");
      }, 5000); // 5 seconds delay

      return () => clearTimeout(timer);
    }
  }, [showThankYou, router]);

  const updateData = (field: keyof BusinessCaseData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
    // Clear errors for this step when user starts typing
    if (errors[currentStep]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[currentStep];
        return newErrors;
      });
    }
  };

  // Validation functions for each step
  const validateStep = (step: number): string[] => {
    const stepErrors: string[] = [];

    switch (step) {
      case 0: // Company Information
        if (!data.companyName.trim())
          stepErrors.push("Company Name is required");
        if (!data.contactName.trim()) stepErrors.push("Your Name is required");
        if (!data.phone.trim()) stepErrors.push("Phone Number is required");
        if (!data.email.trim()) stepErrors.push("Company Email is required");
        if (!data.clientType) stepErrors.push("Client Type is required");
        if (!data.isRegisteredBusiness)
          stepErrors.push("Business registration status is required");
        if (data.isRegisteredBusiness === "Yes") {
          if (!data.tinNumber.trim())
            stepErrors.push("TIN Number is required for registered businesses");
          if (data.tinNumber.trim() && !/^\d{10}$/.test(data.tinNumber.trim()))
            stepErrors.push("TIN Number must be exactly 10 digits");
        }
        if (!data.region) stepErrors.push("Region is required");
        if (!data.industry) stepErrors.push("Industry is required");
        if (!data.totalEmployees)
          stepErrors.push("Total Employees is required");
        if (!data.consentAgreed)
          stepErrors.push("You must agree to the data use consent");
        break;

      case 1: // Business Pain & SPSC Root Cause Diagnostic
        if (!data.biggestChallenge.trim())
          stepErrors.push("Biggest Challenge is required");
        if (!data.kpiPain || data.kpiPain.length === 0)
          stepErrors.push("At least one KPI Pain is required");
        if (!data.persistenceDuration)
          stepErrors.push("Persistence Duration is required");
        if (!data.rootCausePeople.trim())
          stepErrors.push("Root Cause 1: People / Competency is required");
        if (!data.rootCauseSystem.trim())
          stepErrors.push("Root Cause 2: System / Process is required");
        if (!data.rootCauseStrategy.trim())
          stepErrors.push("Root Cause 3: Strategy / Clarity is required");
        if (!data.rootCauseCulture.trim())
          stepErrors.push("Root Cause 4: Culture / Environment is required");
        if (!data.enableIfSolved.trim())
          stepErrors.push("Strategic Enabler is required");
        if (!data.currentImpact || data.currentImpact.length === 0)
          stepErrors.push("At least one Current Impact is required");
        break;

      case 2: // Strategic Alignment & SPSC Validation
        if (!data.hasStrategicAlignment) {
          stepErrors.push(
            "Please select Yes or No for Strategic Goal Alignment"
          );
        } else if (data.hasStrategicAlignment === "Yes") {
          if (!data.costOfInaction || data.costOfInaction <= 0)
            stepErrors.push("Cost of Inaction must be greater than 0");
          if (!data.strategicPriority)
            stepErrors.push("Strategic Priority is required");
          if (!data.strategyTimeline)
            stepErrors.push("Strategic Timeline is required");
          if (!data.behavioralChangeSupported)
            stepErrors.push("Behavioral Change Support is required");
          if (!data.competencyGap)
            stepErrors.push("Competency Gap assessment is required");
          if (!data.systemProcessBottleneck)
            stepErrors.push("System/Process Bottleneck check is required");
          if (
            data.systemProcessBottleneck === "Yes" &&
            !data.systemProcessRemediation.trim()
          )
            stepErrors.push(
              "System/Process Remediation details are required when bottleneck is Yes"
            );
          if (!data.cultureResistant)
            stepErrors.push("Culture Resistance assessment is required");
          if (!data.failureLearningAttitude)
            stepErrors.push("Failure/Learning Attitude is required");
          if (!data.greatestInternalHurdle)
            stepErrors.push("Greatest Internal Hurdle is required");
          if (!data.conflictingProject)
            stepErrors.push("Conflicting Project check is required");
          if (
            data.conflictingProject === "Yes" &&
            !data.conflictingProjectDetails.trim()
          )
            stepErrors.push(
              "Conflicting Project details are required when Yes is selected"
            );
          if (
            data.stakeholders?.includes("C-suite") &&
            !data.csuiteDetails.trim()
          )
            stepErrors.push(
              "Please specify which C-suite executive(s) are involved"
            );
          if (
            data.stakeholders?.includes("Department Heads") &&
            !data.departmentHeadsDetails.trim()
          )
            stepErrors.push(
              "Please specify which Department Head(s) are responsible"
            );
          if (
            data.stakeholders?.includes("Frontline Managers") &&
            !data.frontlineManagersDetails.trim()
          )
            stepErrors.push(
              "Please specify which Frontline Manager(s) are involved"
            );
          if (
            data.stakeholders?.includes("Employees") &&
            !data.employeesDetails.trim()
          )
            stepErrors.push(
              "Please specify which Employee group(s) are involved"
            );
        }
        break;

      case 3: // Competency Mapping & Solution Blueprint
        if (!data.department || data.department.length === 0)
          stepErrors.push("At least one Department is required");
        if (!data.trainingGoal || data.trainingGoal.length === 0)
          stepErrors.push("At least one Training Goal is required");
        if (!data.competencyRequired)
          stepErrors.push("Competency Required must be confirmed");
        if (!data.alignedPillar)
          stepErrors.push("Aligned Development Pillar is required");
        if (!data.behaviorGoal.trim())
          stepErrors.push("Behavior Goal is required");
        if (!data.participants || data.participants <= 0)
          stepErrors.push(
            "Total Number of Participants is required and must be greater than 0"
          );
        if (!data.targetJobLevel || data.targetJobLevel.length === 0)
          stepErrors.push("At least one Target Job Level is required");
        if (!data.deploymentStart)
          stepErrors.push("Required Deployment Start is required");
        if (!data.baselineMeasurement)
          stepErrors.push("Baseline Measurement question is required");
        if (
          data.baselineMeasurement === "Yes" &&
          !data.baselineMeasurementDetails.trim()
        )
          stepErrors.push(
            "Baseline Measurement details are required when Yes is selected"
          );
        break;

      case 4: // Solution Mapping & Investment Recommendation
        if (
          (!data.programName || data.programName.length === 0) &&
          !data.additionalTrainingTitle.trim() &&
          (data.requiresSoftSkills !== "Yes" ||
            !data.softSkillSelections ||
            data.softSkillSelections.length === 0)
        ) {
          stepErrors.push(
            "Please select a Program, enter Additional Training Title, or select Soft Skills"
          );
        }
        if (!data.customizationDepth)
          stepErrors.push("Required Customization Depth is required");
        if (!data.deliveryFormat || data.deliveryFormat.length === 0)
          stepErrors.push("At least one Preferred Delivery Format is required");
        if (!data.designatedChampion.trim())
          stepErrors.push("Designated Internal Champion is required");
        if (
          data.systemProcessBottleneck === "Yes" &&
          !data.policySystemGaps.trim()
        )
          stepErrors.push(
            "Policy/System Gaps to Address is required when System/Process is a bottleneck"
          );
        if (
          (data.cultureResistant === "Yes" ||
            data.cultureResistant === "Unsure") &&
          !data.changeManagementReadiness
        )
          stepErrors.push(
            "Internal Change Management Readiness is required when culture resistance is Yes/Unsure"
          );
        break;

      case 5: // ROI Quantification & SPSC Impact Validation
        const hasSystemConsulting =
          data.systemProcessBottleneck === "Yes" && data.policySystemGaps;
        const hasCultureConsulting =
          (data.cultureResistant === "Yes" ||
            data.cultureResistant === "Unsure") &&
          data.changeManagementReadiness;

        if (!data.metricDataReadiness)
          stepErrors.push("Metric Data Readiness is required");
        if (!data.metricName.trim())
          stepErrors.push("Primary Metric Name is required");
        if (!data.currentMetric || parseFloat(data.currentMetric) <= 0)
          stepErrors.push(
            "Current Metric is required and must be greater than 0"
          );
        if (!data.targetMetric || parseFloat(data.targetMetric) <= 0)
          stepErrors.push(
            "Target Metric is required and must be greater than 0"
          );
        if (!data.targetBehaviorAdoptionRate)
          stepErrors.push("Target Behavior Adoption Rate (L3) is required");
        if (!data.estProductivityGain)
          stepErrors.push("Estimated Productivity Gain is required");
        if (!data.estRetentionImprovement)
          stepErrors.push("Employee Retention Improvement is required");
        if (!data.avgMonthlySalary || data.avgMonthlySalary <= 0)
          stepErrors.push(
            "Average Monthly Salary per Participant is required and must be greater than 0"
          );
        if (!data.executiveImpactSummary.trim())
          stepErrors.push("Executive Impact Summary is required");
        if (hasSystemConsulting && !data.systemProcessSuccessIndicator.trim())
          stepErrors.push(
            "System/Process Success Indicator is required when System consulting is added"
          );
        if (
          hasCultureConsulting &&
          !data.cultureEnvironmentSuccessIndicator.trim()
        )
          stepErrors.push(
            "Culture/Environment Success Indicator is required when Culture consulting is added"
          );
        break;

      case 6: // L&D Capacity & Budget Context
        if (!data.budgetKnowledgeGate)
          stepErrors.push("Budget Knowledge Gate is required");
        if (
          data.budgetKnowledgeGate === "I know the budget" &&
          (!data.annualBudget || data.annualBudget <= 0)
        )
          stepErrors.push(
            "Annual Training Budget is required when budget is known"
          );
        if (!data.consultingBudgetSeparate)
          stepErrors.push("Consulting budget separation question is required");
        break;

      case 7: // Pricing & Strategic ROI Proposal - no validation needed (read-only)
        break;
    }

    return stepErrors;
  };

  const handleNext = () => {
    const stepErrors = validateStep(currentStep);

    if (stepErrors.length > 0) {
      setErrors((prev) => ({ ...prev, [currentStep]: stepErrors }));
      return;
    }

    // Clear errors for current step
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[currentStep];
      return newErrors;
    });

    if (currentStep < stepDefs.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Calculate pricing and ROI
      const pricing = computePricingAndROI(data);

      // Prepare submission data
      const submissionData = {
        ...data,
        pricing: pricing,
        submittedAt: new Date().toISOString(),
      };

      // Submit to API
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (!response.ok) {
        // Show the actual error message from the API
        const errorMessage =
          result.error ||
          result.details ||
          "Failed to submit. Please try again.";
        alert(
          `Error: ${errorMessage}\n\nCheck the terminal/console for more details.`
        );
        console.error("API Error:", result);
        return;
      }

      setShowThankYou(true);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      const errorMessage =
        error.message || "Failed to submit. Please try again.";
      alert(
        `Error: ${errorMessage}\n\nCheck the terminal/console for more details.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <CompanyInfoStep data={data} updateData={updateData} />;
      case 1:
        return <ProblemContextStep data={data} updateData={updateData} />;
      case 2:
        return <AlignmentStep data={data} updateData={updateData} />;
      case 3:
        return <DeptGoalsStep data={data} updateData={updateData} />;
      case 4:
        return <ProgramStep data={data} updateData={updateData} />;
      case 5:
        return <MetricsStep data={data} updateData={updateData} />;
      case 6:
        return <OrgStep data={data} updateData={updateData} />;
      case 7:
        return <PricingStep data={data} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        // Header
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#2E4059] mb-2">
            Sew Asset — Strategic Business Case Builder
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            A story-driven, problem-first Pricing & ROI calculator that turns
            cost discussions into strategic investments.
          </p>
        </div>
        // Step Pills
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 -mx-3 sm:-mx-4 md:mx-0 px-3 sm:px-4 md:px-0">
          {stepDefs.map((step, idx) => (
            <div
              key={step.key}
              className={`px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                idx === currentStep
                  ? "bg-[#FFC72F] text-[#2E4059] font-bold shadow-md"
                  : "bg-white border border-slate-300 text-slate-600"
              }`}
            >
              {step.number}. {step.title}
            </div>
          ))}
        </div>
        // Form Content
        <Card className="p-4 sm:p-6 md:p-8 bg-white shadow-lg mb-4 sm:mb-6">
          {errors[currentStep] && errors[currentStep].length > 0 && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-sm sm:text-base text-red-800 font-semibold mb-2">
                Please fix the following errors:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-red-700">
                {errors[currentStep].map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
              {currentStep === 0 && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
                  <p className="text-xs sm:text-sm text-yellow-800 font-semibold">
                    ⚠️ Please make sure to fill all the required fields before
                    proceeding.
                  </p>
                </div>
              )}
            </div>
          )}
          {renderStep()}
        </Card>
        // Navigation Bar
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 p-2 sm:p-3 md:p-4 rounded-t-lg shadow-lg -mx-3 sm:-mx-4 md:mx-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-4 max-w-6xl mx-auto">
            <div className="flex gap-2 justify-center sm:justify-end">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="border-[#2E4059] text-[#2E4059] hover:bg-[#2E4059]/10 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 flex-1 sm:flex-initial"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Back
              </Button>
              {currentStep < stepDefs.length - 1 ? (
                <Button
                  onClick={handleNext}
                  className="bg-[#FFC72F] text-[#2E4059] font-bold hover:bg-[#FFC72F]/90 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 flex-1 sm:flex-initial"
                >
                  Next
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-[#FFC72F] text-[#2E4059] font-bold hover:bg-[#FFC72F]/90 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 flex-1 sm:flex-initial"
                >
                  {isSubmitting ? "Submitting..." : "Finish"}
                  <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      // Thank You Dialog
      <Dialog open={showThankYou} onOpenChange={setShowThankYou}>
        <DialogContent
          className="w-[90vw] sm:max-w-md mx-4"
          showCloseButton={false}
        >
          <DialogHeader className="text-center">
            <div className="mx-auto mb-3 sm:mb-4 w-12 h-12 sm:w-16 sm:h-16 bg-[#FFC72F] rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 sm:w-10 sm:h-10 text-[#2E4059]" />
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-[#2E4059]">
              Thank You!
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base text-slate-600 pt-2 px-2">
              Your business case has been successfully submitted. We will
              contact you at{" "}
              <span className="font-semibold text-[#2E4059] break-all">
                {data.email || "your email"}
              </span>{" "}
              within 24 hours to discuss your ROI analysis and next steps.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 sm:mt-6">
            <Button
              onClick={() => {
                setShowThankYou(false);
                router.push("/");
              }}
              className="w-full bg-[#FFC72F] text-[#2E4059] font-bold hover:bg-[#FFC72F]/90 text-sm sm:text-base py-2 sm:py-2.5"
            >
              Return to Home
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Step Components (commented out - preserved for later use)
// @ts-nocheck
/*
function CompanyInfoStep({
  data,
  updateData,
}: {
  data: BusinessCaseData;
  updateData: (field: keyof BusinessCaseData, value: any) => void;
}) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-[#2E4059] mb-3 sm:mb-4">
        Your Company Information
      </h2>
      // Data Accuracy Warning
      <Card className="p-4 bg-yellow-50 border-yellow-200 border-2 mb-4 sm:mb-6">
        <div className="flex items-start gap-3">
          <div className="text-yellow-600 font-bold text-lg">⚠️</div>
          <div className="flex-1">
            <p className="text-sm sm:text-base font-semibold text-yellow-800 mb-1">
              Important Notice
            </p>
            <p className="text-xs sm:text-sm text-yellow-700">
              Notice: Your final <strong>3-Scenario ROI Proposal</strong> will
              be sent to the email provided, and a SewAsset Consultant will
              contact the Strategic Contact Person within{" "}
              <strong>24 hours</strong> to finalize the Business Case.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <Label className="text-sm sm:text-base text-[#2E4059] font-semibold">
            Company Name <span className="text-red-500">*</span>
          </Label>
          <Input
            value={data.companyName}
            onChange={(e) => updateData("companyName", e.target.value)}
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label className="text-[#2E4059] font-semibold">
            Your Name <span className="text-red-500">*</span>
          </Label>
          <Input
            value={data.contactName}
            onChange={(e) => updateData("contactName", e.target.value)}
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label className="text-[#2E4059] font-semibold">
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <Input
            type="tel"
            value={data.phone}
            onChange={(e) => updateData("phone", e.target.value)}
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label className="text-[#2E4059] font-semibold">
            Company Email <span className="text-red-500">*</span>
          </Label>
          <Input
            type="email"
            value={data.email}
            onChange={(e) => updateData("email", e.target.value)}
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label className="text-[#2E4059] font-semibold">
            Client Type <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.clientType}
            onValueChange={(v) => updateData("clientType", v)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select client type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Private Company">Private Company</SelectItem>
              <SelectItem value="NGO">NGO</SelectItem>
              <SelectItem value="Government/Public Sector">
                Government/Public Sector
              </SelectItem>
              <SelectItem value="International IGO">
                International IGO
              </SelectItem>
              <SelectItem value="Foreign Branch">Foreign Branch</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-[#2E4059] font-semibold">
            Are you legally registered in Ethiopia?{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.isRegisteredBusiness}
            onValueChange={(v) => {
              updateData("isRegisteredBusiness", v);
              if (v === "No") updateData("tinNumber", "");
            }}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {data.isRegisteredBusiness === "Yes" && (
          <div>
            <Label className="text-[#2E4059] font-semibold">
              TIN (Taxpayer Identification Number){" "}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              value={data.tinNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ""); // Only digits
                if (value.length <= 10) {
                  updateData("tinNumber", value);
                }
              }}
              className="mt-1"
              placeholder="Enter 10-digit TIN Number"
              maxLength={10}
            />
            <p className="text-xs text-slate-500 mt-1">
              Ethiopian Taxpayer ID for verification (10 digits)
            </p>
          </div>
        )}
        <div>
          <Label className="text-[#2E4059] font-semibold">
            Physical Address / Street Name
          </Label>
          <Input
            value={data.physicalAddress}
            onChange={(e) => updateData("physicalAddress", e.target.value)}
            className="mt-1"
            placeholder="Enter physical address or street name"
          />
        </div>
        <div>
          <Label className="text-[#2E4059] font-semibold">Office Number</Label>
          <Input
            value={data.officeNumber}
            onChange={(e) => updateData("officeNumber", e.target.value)}
            className="mt-1"
            placeholder="Enter office number"
          />
        </div>
        <div>
          <Label className="text-[#2E4059] font-semibold">
            Region <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.region}
            onValueChange={(v) => updateData("region", v)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Addis Ababa">Addis Ababa</SelectItem>
              <SelectItem value="Oromia">Oromia</SelectItem>
              <SelectItem value="Amhara">Amhara</SelectItem>
              <SelectItem value="SNNPR">SNNPR</SelectItem>
              <SelectItem value="Tigray">Tigray</SelectItem>
              <SelectItem value="Somali">Somali</SelectItem>
              <SelectItem value="Afar">Afar</SelectItem>
              <SelectItem value="Dire Dawa">Dire Dawa</SelectItem>
              <SelectItem value="Harari">Harari</SelectItem>
              <SelectItem value="Gambela">Gambela</SelectItem>
              <SelectItem value="Benishangul-Gumuz">
                Benishangul-Gumuz
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-[#2E4059] font-semibold">City/Sub-City</Label>
          <Input
            value={data.subcity}
            onChange={(e) => updateData("subcity", e.target.value)}
            className="mt-1"
            placeholder="e.g., Bole, Kirkos, Arada"
          />
        </div>
        <div>
          <Label className="text-[#2E4059] font-semibold">
            Specific Place Name / Landmark (Optional)
          </Label>
          <Input
            value={data.placeName}
            onChange={(e) => updateData("placeName", e.target.value)}
            className="mt-1"
            placeholder="Enter landmark or specific place name"
          />
        </div>
        <div>
          <Label className="text-[#2E4059] font-semibold">User Type</Label>
          <Select
            value={data.userType}
            onValueChange={(v) => updateData("userType", v)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select user type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Business">Business</SelectItem>
              <SelectItem value="Individual">Individual</SelectItem>
              <SelectItem value="Consultant">Consultant</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-[#2E4059] font-semibold">
            Industry <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.industry}
            onValueChange={(v) => updateData("industry", v)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tech">Tech</SelectItem>
              <SelectItem value="Healthcare">Healthcare</SelectItem>
              <SelectItem value="Retail">Retail</SelectItem>
              <SelectItem value="Manufacturing">Manufacturing</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Hospitality">Hospitality</SelectItem>
              <SelectItem value="Construction">Construction</SelectItem>
              <SelectItem value="Government/Public Sector">
                Government/Public Sector
              </SelectItem>
              <SelectItem value="Pharmaceuticals">Pharmaceuticals</SelectItem>
              <SelectItem value="Telecommunications">
                Telecommunications
              </SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-[#2E4059] font-semibold">
            Total Employees <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.totalEmployees}
            onValueChange={(v) => updateData("totalEmployees", v)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-50">1-50</SelectItem>
              <SelectItem value="51-200">51-200</SelectItem>
              <SelectItem value="201-500">201-500</SelectItem>
              <SelectItem value="501-1000">501-1000</SelectItem>
              <SelectItem value="1001-5000">1001-5000</SelectItem>
              <SelectItem value="5000+">5000+</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-500 mt-1">
            Tip: Manufacturing typically ranges 100-500 employees
          </p>
        </div>
        <div className="md:col-span-2">
          <Label className="text-[#2E4059] font-semibold">
            Primary SPSC Focus (Select multiple)
          </Label>
          <div className="flex flex-wrap gap-3 mt-2 p-3 border border-slate-200 rounded-lg bg-slate-50">
            {["Strategy", "People", "System/Process", "Culture"].map(
              (focus) => (
                <div key={focus} className="flex items-center space-x-2">
                  <Checkbox
                    id={`spsc-${focus}`}
                    checked={data.primarySPSCFocus?.includes(focus) || false}
                    onCheckedChange={(checked) => {
                      const current = data.primarySPSCFocus || [];
                      const updated = checked
                        ? [...current, focus]
                        : current.filter((f) => f !== focus);
                      updateData("primarySPSCFocus", updated);
                    }}
                  />
                  <Label
                    htmlFor={`spsc-${focus}`}
                    className="font-normal cursor-pointer text-sm"
                  >
                    {focus}
                  </Label>
                </div>
              )
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            This guides later alignments
          </p>
        </div>
      </div>
      <div className="mt-6 sm:mt-8 space-y-4">
        <div>
          <Label className="text-[#2E4059] font-semibold">Urgency Level</Label>
          <Select
            value={data.urgency}
            onValueChange={(v) => updateData("urgency", v)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(urgencyMap).map((key) => (
                <SelectItem key={key} value={key}>
                  {key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="consentAgreed"
              checked={data.consentAgreed}
              onCheckedChange={(checked) =>
                updateData("consentAgreed", checked)
              }
              className="mt-1"
            />
            <Label
              htmlFor="consentAgreed"
              className="font-normal cursor-pointer text-sm leading-relaxed"
            >
              I agree to data use for report/follow-up{" "}
              <span className="text-red-500">*</span>{" "}
              <a
                href="/disclaimer"
                target="_blank"
                className="text-[#2E4059] underline hover:text-[#FFC72F]"
              >
                (Privacy Policy)
              </a>
            </Label>
          </div>
          <div className="flex items-start space-x-2">
            <Checkbox
              id="optInNewsletter"
              checked={data.optInNewsletter}
              onCheckedChange={(checked) =>
                updateData("optInNewsletter", checked)
              }
              className="mt-1"
            />
            <Label
              htmlFor="optInNewsletter"
              className="font-normal cursor-pointer text-sm"
            >
              Subscribe to SewAsset L&D Insights? (Ethiopian workforce tips)
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProblemContextStep({
  data,
  updateData,
}: {
  data: BusinessCaseData;
  updateData: (field: keyof BusinessCaseData, value: any) => void;
}) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#2E4059] mb-2">
          Step 2: Business Pain & SPSC Root Cause Diagnostic
        </h2>
        <p className="text-sm sm:text-base text-slate-600 italic">
          Instruction: Think beyond just <em>training</em>. Use the SPSC lens
          below to diagnose where the primary friction point truly lies. Your
          diagnosis informs our final consulting recommendation.
        </p>
      </div>
      <div className="space-y-4 sm:space-y-6">
        <div>
          <Label className="text-[#2E4059] font-semibold">
            What is the single biggest challenge your team/organization is
            facing right now? <span className="text-red-500">*</span>
          </Label>
          <Textarea
            value={data.biggestChallenge}
            onChange={(e) => updateData("biggestChallenge", e.target.value)}
            className="mt-1 min-h-[100px]"
            required
          />
        </div>
        <div>
          <Label className="text-[#2E4059] font-semibold">
            Which KPI(s) is/are most underperforming? (Select multiple){" "}
            <span className="text-red-500">*</span>
          </Label>
          <div className="flex flex-wrap gap-3 mt-2 p-3 border border-slate-200 rounded-lg bg-slate-50">
            {[
              "Sales",
              "Productivity",
              "Retention",
              "Customer Experience",
              "Compliance",
              "Innovation",
              "Cost",
              "Quality",
              "Other",
            ].map((kpi) => (
              <div key={kpi} className="flex items-center space-x-2">
                <Checkbox
                  id={`kpi-${kpi}`}
                  checked={data.kpiPain?.includes(kpi) || false}
                  onCheckedChange={(checked) => {
                    const current = data.kpiPain || [];
                    const updated = checked
                      ? [...current, kpi]
                      : current.filter((k) => k !== kpi);
                    updateData("kpiPain", updated);
                  }}
                />
                <Label
                  htmlFor={`kpi-${kpi}`}
                  className="font-normal cursor-pointer text-sm"
                >
                  {kpi}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Label className="text-[#2E4059] font-semibold">
            How long has this persisted? <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.persistenceDuration}
            onValueChange={(v) => updateData("persistenceDuration", v)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="<3 months">&lt;3 months</SelectItem>
              <SelectItem value="3-6 months">3-6 months</SelectItem>
              <SelectItem value="6-9 months">6-9 months</SelectItem>
              <SelectItem value="9 months-1 year">9 months-1 year</SelectItem>
              <SelectItem value=">1 year">&gt;1 year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        // SPSC Root Cause Diagnostic
        <div className="mt-6 pt-6 border-t-2 border-[#2E4059]">
          <h3 className="text-lg sm:text-xl font-bold text-[#2E4059] mb-4">
            SPSC Root Cause Diagnostic
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            Use the SPSC framework to diagnose the root causes across all four
            dimensions. All fields are required.
          </p>

          <div className="space-y-4 sm:space-y-6">
            <div>
              <Label className="text-[#2E4059] font-semibold">
                Root Cause 1: People / Competency{" "}
                <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-slate-500 mb-1">
                Focus on skills, capability, and motivation
              </p>
              <Textarea
                value={data.rootCausePeople}
                onChange={(e) => updateData("rootCausePeople", e.target.value)}
                className="mt-1 min-h-[100px]"
                placeholder="Describe people/competency-related root causes..."
                required
              />
            </div>

            <div>
              <Label className="text-[#2E4059] font-semibold">
                Root Cause 2: System / Process{" "}
                <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-slate-500 mb-1">
                Focus on technology, workflow, tools, and operational capability
              </p>
              <Textarea
                value={data.rootCauseSystem}
                onChange={(e) => updateData("rootCauseSystem", e.target.value)}
                className="mt-1 min-h-[100px]"
                placeholder="Describe system/process-related root causes..."
                required
              />
            </div>

            <div>
              <Label className="text-[#2E4059] font-semibold">
                Root Cause 3: Strategy / Clarity{" "}
                <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-slate-500 mb-1">
                Focus on direction, prioritization, and misalignment
              </p>
              <Textarea
                value={data.rootCauseStrategy}
                onChange={(e) =>
                  updateData("rootCauseStrategy", e.target.value)
                }
                className="mt-1 min-h-[100px]"
                placeholder="Describe strategy/clarity-related root causes..."
                required
              />
            </div>

            <div>
              <Label className="text-[#2E4059] font-semibold">
                Root Cause 4: Culture / Environment{" "}
                <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-slate-500 mb-1">
                Focus on values, safety, risk aversion, and psychological
                factors
              </p>
              <Textarea
                value={data.rootCauseCulture}
                onChange={(e) => updateData("rootCauseCulture", e.target.value)}
                className="mt-1 min-h-[100px]"
                placeholder="Describe culture/environment-related root causes..."
                required
              />
            </div>
          </div>
        </div>
        <div>
          <Label className="text-[#2E4059] font-semibold">
            Strategic Enabler: If solved, what would this enable your company to
            do? <span className="text-red-500">*</span>
          </Label>
          <p className="text-xs text-slate-500 mb-1">
            State this as a quantifiable business outcome (e.g., "Expand into
            two new regions" or "Increase NPS by 15 points")
          </p>
          <Textarea
            value={data.enableIfSolved}
            onChange={(e) => updateData("enableIfSolved", e.target.value)}
            className="mt-1 min-h-[100px]"
            placeholder="e.g., Expand into two new regions, Increase NPS by 15 points..."
            required
          />
        </div>
        <div>
          <Label className="text-[#2E4059] font-semibold">
            Current Impact (Select multiple){" "}
            <span className="text-red-500">*</span>
          </Label>
          <div className="flex flex-wrap gap-3 mt-2 p-3 border border-slate-200 rounded-lg bg-slate-50">
            {[
              "Lost revenue",
              "Reduced efficiency",
              "Low morale",
              "High turnover",
              "Poor customer satisfaction",
              "Compliance risk",
              "Loss of Competitive Edge",
              "Damaged External Reputation",
              "Other",
            ].map((impact) => (
              <div key={impact} className="flex items-center space-x-2">
                <Checkbox
                  id={`impact-${impact}`}
                  checked={data.currentImpact?.includes(impact) || false}
                  onCheckedChange={(checked) => {
                    const current = data.currentImpact || [];
                    const updated = checked
                      ? [...current, impact]
                      : current.filter((i) => i !== impact);
                    updateData("currentImpact", updated);
                  }}
                />
                <Label
                  htmlFor={`impact-${impact}`}
                  className="font-normal cursor-pointer text-sm"
                >
                  {impact}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AlignmentStep({
  data,
  updateData,
}: {
  data: BusinessCaseData;
  updateData: (field: keyof BusinessCaseData, value: any) => void;
}) {
  const stakeholders = [
    "CEO",
    "C-suite",
    "HR",
    "Department Heads",
    "L&D Team",
    "Frontline Managers",
    "Employees",
    "Clients/Customers",
  ];

  const toggleStakeholder = (stakeholder: string) => {
    const current = data.stakeholders || [];
    const updated = current.includes(stakeholder)
      ? current.filter((s) => s !== stakeholder)
      : [...current, stakeholder];
    updateData("stakeholders", updated);

    // Clear details when unchecking
    if (!updated.includes(stakeholder)) {
      if (stakeholder === "C-suite") {
        updateData("csuiteDetails", "");
      } else if (stakeholder === "Department Heads") {
        updateData("departmentHeadsDetails", "");
      } else if (stakeholder === "Frontline Managers") {
        updateData("frontlineManagersDetails", "");
      } else if (stakeholder === "Employees") {
        updateData("employeesDetails", "");
      }
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#2E4059] mb-2">
          Step 3: Strategic Alignment & SPSC Validation
        </h2>
        <p className="text-sm sm:text-base text-slate-600 italic">
          Instruction: We've diagnosed the SPSC root cause. Now, validate this
          challenge against your organization's highest priorities and key
          stakeholders.
        </p>
      </div>
      <div className="mb-6">
        <Label className="text-[#2E4059] font-semibold text-base sm:text-lg mb-3 block">
          Does this challenge your organization is facing have a Strategic Goal
          Alignment? <span className="text-red-500">*</span>
        </Label>
        <div className="flex gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="hasAlignmentYes"
              name="hasStrategicAlignment"
              value="Yes"
              checked={data.hasStrategicAlignment === "Yes"}
              onChange={(e) =>
                updateData("hasStrategicAlignment", e.target.value)
              }
              className="w-4 h-4"
            />
            <Label
              htmlFor="hasAlignmentYes"
              className="font-normal cursor-pointer"
            >
              Yes
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="hasAlignmentNo"
              name="hasStrategicAlignment"
              value="No"
              checked={data.hasStrategicAlignment === "No"}
              onChange={(e) =>
                updateData("hasStrategicAlignment", e.target.value)
              }
              className="w-4 h-4"
            />
            <Label
              htmlFor="hasAlignmentNo"
              className="font-normal cursor-pointer"
            >
              No
            </Label>
          </div>
        </div>
        {data.hasStrategicAlignment === "No" && (
          <p className="text-sm text-slate-600 mt-2">
            If No, you can proceed to the next step.
          </p>
        )}
      </div>
      {data.hasStrategicAlignment === "Yes" && (
        <>
          // A. Core Strategy Alignment
          <div className="mb-6 pt-4 border-t-2 border-[#2E4059]">
            <h3 className="text-lg sm:text-xl font-bold text-[#2E4059] mb-4">
              A. Core Strategy Alignment
            </h3>

            // Cost of Inaction - Moved Up and Bolded
            <div className="mb-6">
              <Label className="text-[#2E4059] font-bold text-base sm:text-lg">
                Cost of Inaction (Annual, ETB){" "}
                <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-slate-500 mb-2">
                This is the most important number for the ROI calculation and
                executive decision-making.
              </p>
              <Input
                type="number"
                value={data.costOfInaction || ""}
                onChange={(e) =>
                  updateData("costOfInaction", parseFloat(e.target.value) || 0)
                }
                className="mt-1 text-lg font-semibold"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <Label className="text-[#2E4059] font-semibold">
                  Strategic Priority <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={data.strategicPriority}
                  onValueChange={(v) => updateData("strategicPriority", v)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Growth">Growth</SelectItem>
                    <SelectItem value="Operational Excellence">
                      Operational Excellence
                    </SelectItem>
                    <SelectItem value="Innovation">Innovation</SelectItem>
                    <SelectItem value="Talent Development">
                      Talent Development
                    </SelectItem>
                    <SelectItem value="Digital Transformation">
                      Digital Transformation
                    </SelectItem>
                    <SelectItem value="Customer Experience">
                      Customer Experience
                    </SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[#2E4059] font-semibold">
                  Strategic Timeline Fit <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={data.strategyTimeline}
                  onValueChange={(v) => updateData("strategyTimeline", v)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Next 3 months">Next 3 months</SelectItem>
                    <SelectItem value="Next 6 months">Next 6 months</SelectItem>
                    <SelectItem value="Next 12 months">
                      Next 12 months
                    </SelectItem>
                    <SelectItem value="1–3 years">1–3 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div>
            <Label className="text-[#2E4059] font-semibold text-sm sm:text-base">
              Key Stakeholders (select multiple)
            </Label>
            <div className="flex flex-wrap gap-2 sm:gap-3 mt-2">
              {stakeholders.map((stakeholder) => (
                <div key={stakeholder} className="flex items-center space-x-2">
                  <Checkbox
                    id={`stakeholder-${stakeholder}`}
                    checked={data.stakeholders?.includes(stakeholder) || false}
                    onCheckedChange={() => toggleStakeholder(stakeholder)}
                  />
                  <Label
                    htmlFor={`stakeholder-${stakeholder}`}
                    className="font-normal cursor-pointer"
                  >
                    {stakeholder}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          // Conditional fields for specific stakeholders
          {data.stakeholders?.includes("C-suite") && (
            <div>
              <Label className="text-[#2E4059] font-semibold">
                Which C-suite executive(s) are involved?{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                value={data.csuiteDetails}
                onChange={(e) => updateData("csuiteDetails", e.target.value)}
                className="mt-1"
                placeholder="e.g., CFO, COO, CMO, CTO"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                Please specify which C-suite executives are involved
              </p>
            </div>
          )}

          {data.stakeholders?.includes("Department Heads") && (
            <div>
              <Label className="text-[#2E4059] font-semibold">
                Which Department Head(s) are responsible?{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                value={data.departmentHeadsDetails}
                onChange={(e) =>
                  updateData("departmentHeadsDetails", e.target.value)
                }
                className="mt-1"
                placeholder="e.g., Head of Sales, Head of Operations, Head of HR"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                Please specify which department heads are involved
              </p>
            </div>
          )}

          {data.stakeholders?.includes("Frontline Managers") && (
            <div>
              <Label className="text-[#2E4059] font-semibold">
                Which Frontline Manager(s) are involved?{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                value={data.frontlineManagersDetails}
                onChange={(e) =>
                  updateData("frontlineManagersDetails", e.target.value)
                }
                className="mt-1"
                placeholder="e.g., Sales Managers, Customer Service Managers"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                Please specify which frontline managers are involved
              </p>
            </div>
          )}

          {data.stakeholders?.includes("Employees") && (
            <div>
              <Label className="text-[#2E4059] font-semibold">
                Which Employee group(s) are involved?{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                value={data.employeesDetails}
                onChange={(e) => updateData("employeesDetails", e.target.value)}
                className="mt-1"
                placeholder="e.g., Sales Team, Customer Service Team, Operations Staff"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                Please specify which employee groups are involved
              </p>
            </div>
          )}

          <div>
            <Label className="text-[#2E4059] font-semibold">
              Alignment Narrative (how this supports strategy)
            </Label>
            <Textarea
              value={data.alignmentNarrative}
              onChange={(e) => updateData("alignmentNarrative", e.target.value)}
              className="mt-1 min-h-[100px]"
              placeholder="eg. Supports 3-year talent strategy by reducing attrition by 50%"
            />
          </div>

          // B. People Alignment
          <div className="mt-6 pt-6 border-t-2 border-[#2E4059]">
            <h3 className="text-lg sm:text-xl font-bold text-[#2E4059] mb-4">
              B. People Alignment (The Sponsorship Check)
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              This section validates the <strong>People/Competency</strong> root
              cause identified in Step 2 by checking for sponsorship and the
              scope of behavioral change.
            </p>
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <Label className="text-[#2E4059] font-semibold">
                  Is the required behavioral change supported by senior
                  leadership? <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={data.behavioralChangeSupported}
                  onValueChange={(v) =>
                    updateData("behavioralChangeSupported", v)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Unsure">Unsure</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500 mt-1">
                  Gauges the likelihood of Kirkpatrick Level 3 success; informs
                  SewAsset if Executive Coaching (Consulting) is required to
                  secure sponsorship.
                </p>
              </div>
              <div>
                <Label className="text-[#2E4059] font-semibold">
                  What is the current estimated GAPP in competency?{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={data.competencyGap}
                  onValueChange={(v) => updateData("competencyGap", v)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select gap level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Minor">Minor</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500 mt-1">
                  A direct check on the severity of the People root cause,
                  reinforcing the need for immediate intervention.
                </p>
              </div>
            </div>
          </div>

          // C. System/Process Alignment
          <div className="mt-6 pt-6 border-t-2 border-[#2E4059]">
            <h3 className="text-lg sm:text-xl font-bold text-[#2E4059] mb-4">
              C. System/Process Alignment (The Bottleneck Check)
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              This validates the <strong>System/Process</strong> root cause and
              pre-qualifies the client for process consulting.
            </p>
            <div className="space-y-4">
              <div>
                <Label className="text-[#2E4059] font-semibold">
                  Is the existing System/Process currently a bottleneck to the
                  solution? <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={data.systemProcessBottleneck}
                  onValueChange={(v) => {
                    updateData("systemProcessBottleneck", v);
                    if (v === "No") updateData("systemProcessRemediation", "");
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500 mt-1">
                  If Yes, the tool must auto-suggest Consulting Add-ons in Step
                  5.
                </p>
              </div>
              {data.systemProcessBottleneck === "Yes" && (
                <div>
                  <Label className="text-[#2E4059] font-semibold">
                    If Yes, what specific process/tool needs immediate
                    remediation? <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    value={data.systemProcessRemediation}
                    onChange={(e) =>
                      updateData("systemProcessRemediation", e.target.value)
                    }
                    className="mt-1 min-h-[100px]"
                    placeholder="e.g., Need CRM implementation support, Workflow automation required..."
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Provides SewAsset with a clear consulting opportunity.
                  </p>
                </div>
              )}
            </div>
          </div>

          // D. Culture Alignment
          <div className="mt-6 pt-6 border-t-2 border-[#2E4059]">
            <h3 className="text-lg sm:text-xl font-bold text-[#2E4059] mb-4">
              D. Culture Alignment (The Sustainability Check)
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              This section is vital, as culture determines the sustainability of
              any change.
            </p>
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <Label className="text-[#2E4059] font-semibold">
                  Is the organizational culture currently resistant to this type
                  of change? <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={data.cultureResistant}
                  onValueChange={(v) => updateData("cultureResistant", v)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Unsure">Unsure</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500 mt-1">
                  A "Yes" indicates a critical need for Culture Transformation
                  Consulting (Pillar 7) to sustain ROI.
                </p>
              </div>
              <div>
                <Label className="text-[#2E4059] font-semibold">
                  What is the organizational attitude toward failure/learning?{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={data.failureLearningAttitude}
                  onValueChange={(v) =>
                    updateData("failureLearningAttitude", v)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select attitude" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Punitive">Punitive</SelectItem>
                    <SelectItem value="Tolerant">Tolerant</SelectItem>
                    <SelectItem value="Growth-Oriented">
                      Growth-Oriented
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500 mt-1">
                  This diagnoses the need for programs like Growth Mindset or a
                  Psychological Safety Audit.
                </p>
              </div>
            </div>
          </div>

          // Solution Risk Assessment
          <div className="mt-6 pt-6 border-t-2 border-[#2E4059]">
            <h3 className="text-lg sm:text-xl font-bold text-[#2E4059] mb-4">
              Solution Risk Assessment (SewAsset Perspective)
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              This section is vital for assessing internal hurdles and
              anticipating implementation complexity/cost.
            </p>
            <div className="space-y-4">
              <div>
                <Label className="text-[#2E4059] font-semibold">
                  What is the greatest internal hurdle to implementing a
                  solution? <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={data.greatestInternalHurdle}
                  onValueChange={(v) => updateData("greatestInternalHurdle", v)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select hurdle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lack of Budget">
                      Lack of Budget
                    </SelectItem>
                    <SelectItem value="Staff Time/Capacity">
                      Staff Time/Capacity
                    </SelectItem>
                    <SelectItem value="Resistance from Management">
                      Resistance from Management
                    </SelectItem>
                    <SelectItem value="Existing Technology/Tools">
                      Existing Technology/Tools
                    </SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[#2E4059] font-semibold">
                  Is this problem currently being addressed by another internal
                  project? <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={data.conflictingProject}
                  onValueChange={(v) => {
                    updateData("conflictingProject", v);
                    if (v !== "Yes")
                      updateData("conflictingProjectDetails", "");
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Unsure">Unsure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {data.conflictingProject === "Yes" && (
                <div>
                  <Label className="text-[#2E4059] font-semibold">
                    If Yes, specify the conflicting project:{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={data.conflictingProjectDetails}
                    onChange={(e) =>
                      updateData("conflictingProjectDetails", e.target.value)
                    }
                    className="mt-1"
                    placeholder="Enter project name or description"
                  />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function DeptGoalsStep({
  data,
  updateData,
}: {
  data: BusinessCaseData;
  updateData: (field: keyof BusinessCaseData, value: any) => void;
}) {
  const deptList = Object.keys(deptGoals);
  const selectedDepts = Array.isArray(data.department) ? data.department : [];

  // Aggregate all goals from all selected departments
  const allGoals = selectedDepts.reduce((acc: string[], dept: string) => {
    const deptGoalsList = deptGoals[dept] || [];
    return [...acc, ...deptGoalsList];
  }, []);
  // Remove duplicates
  const uniqueGoals = [...new Set(allGoals)];

  const toggleDepartment = (dept: string) => {
    const current = Array.isArray(data.department) ? data.department : [];
    const updated = current.includes(dept)
      ? current.filter((d) => d !== dept)
      : [...current, dept];
    updateData("department", updated);
    // Clear training goals, competencies, and pillars when departments change
    updateData("trainingGoal", []);
    updateData("competencyRequired", "");
    updateData("alignedPillar", "");
  };

  const toggleTrainingGoal = (goal: string) => {
    const current = Array.isArray(data.trainingGoal) ? data.trainingGoal : [];
    const updated = current.includes(goal)
      ? current.filter((g) => g !== goal)
      : [...current, goal];
    updateData("trainingGoal", updated);

    // Auto-populate competencies and pillars based on selected goals
    if (updated.length > 0) {
      const { competencies, pillars } = getCompetenciesFromGoals(updated);
      updateData("competencyRequired", competencies.join(", "));
      if (pillars.length === 1) {
        updateData("alignedPillar", pillars[0]);
      } else if (pillars.length > 1) {
        updateData(
          "alignedPillar",
          `Solution requires alignment across ${pillars.join(" and ")}`
        );
      } else {
        updateData("alignedPillar", "");
      }
    } else {
      updateData("competencyRequired", "");
      updateData("alignedPillar", "");
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#2E4059] mb-2">
          Step 4: Competency Mapping & Solution Blueprint
        </h2>
        <p className="text-sm sm:text-base text-slate-600 italic">
          Instruction: Define the required <strong>Competency</strong>, the{" "}
          <strong>Audience</strong> (Level/Count), and the{" "}
          <strong>Urgency</strong> for deployment.
        </p>
      </div>
      <div className="space-y-4 sm:space-y-6">
        <div>
          <Label className="text-[#2E4059] font-semibold">
            Department (Select multiple) <span className="text-red-500">*</span>
          </Label>
          <div className="flex flex-wrap gap-3 mt-2 p-3 border border-slate-200 rounded-lg bg-slate-50">
            {deptList.map((dept) => (
              <div key={dept} className="flex items-center space-x-2">
                <Checkbox
                  id={`dept-${dept}`}
                  checked={selectedDepts.includes(dept)}
                  onCheckedChange={() => toggleDepartment(dept)}
                />
                <Label
                  htmlFor={`dept-${dept}`}
                  className="font-normal cursor-pointer text-sm"
                >
                  {dept}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Label className="text-[#2E4059] font-semibold">
            Training Goal (Select multiple - shows goals from all selected
            departments) <span className="text-red-500">*</span>
          </Label>
          <div className="flex flex-wrap gap-3 mt-2 p-3 border border-slate-200 rounded-lg bg-slate-50 min-h-[100px]">
            {selectedDepts.length === 0 ? (
              <p className="text-sm text-slate-500">
                Please select at least one department first
              </p>
            ) : (
              uniqueGoals.map((goal) => (
                <div key={goal} className="flex items-center space-x-2">
                  <Checkbox
                    id={`goal-${goal}`}
                    checked={
                      Array.isArray(data.trainingGoal) &&
                      data.trainingGoal.includes(goal)
                    }
                    onCheckedChange={() => toggleTrainingGoal(goal)}
                  />
                  <Label
                    htmlFor={`goal-${goal}`}
                    className="font-normal cursor-pointer text-sm"
                  >
                    {goal}
                  </Label>
                </div>
              ))
            )}
          </div>
        </div>
        // B. Mandatory Competency Mapping
        {data.trainingGoal && data.trainingGoal.length > 0 && (
          <div className="mt-6 pt-6 border-t-2 border-[#2E4059]">
            <h3 className="text-lg sm:text-xl font-bold text-[#2E4059] mb-4">
              B. Mandatory Competency Mapping (The Filter)
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Based on your selected training goals, the system has
              automatically identified the core competencies and aligned
              development pillars.
            </p>
            <div className="space-y-4">
              <div>
                <Label className="text-[#2E4059] font-semibold">
                  Competency Required <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={data.competencyRequired}
                  readOnly
                  className="mt-1 bg-slate-100 cursor-not-allowed"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Automatically populated from your selected training goals.
                  This confirms SewAsset's diagnosis and removes guesswork.
                </p>
              </div>
              <div>
                <Label className="text-[#2E4059] font-semibold">
                  Aligned Development Pillar{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={data.alignedPillar}
                  readOnly
                  className="mt-1 bg-slate-100 cursor-not-allowed"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Automatically displays the pillar(s) associated with the
                  selected Competency. This pre-sells the 7 Pillars framework
                  before Step 5.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      // Implementation Scope and Audience Detail
      <div className="mt-6 pt-6 border-t-2 border-[#2E4059]">
        <h3 className="text-lg sm:text-xl font-bold text-[#2E4059] mb-4">
          Implementation Scope and Audience Detail
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          We need to know the <strong>who</strong> (level/count) and{" "}
          <strong>when</strong> (priority) to properly scope the solution.
        </p>
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <Label className="text-[#2E4059] font-semibold">
              Total Number of Participants{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              value={data.participants || ""}
              onChange={(e) =>
                updateData("participants", parseFloat(e.target.value) || 0)
              }
              className="mt-1"
            />
            <p className="text-xs text-slate-500 mt-1">
              CRITICAL. This is the primary driver for all pricing (volume
              discounts, material costs, instructor fees).
            </p>
          </div>
          <div>
            <Label className="text-[#2E4059] font-semibold">
              Target Job Level/Audience <span className="text-red-500">*</span>
            </Label>
            <div className="flex flex-wrap gap-3 mt-2 p-3 border border-slate-200 rounded-lg bg-slate-50">
              {[
                "Frontline",
                "Specialist",
                "Supervisor",
                "Manager",
                "Executive",
              ].map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <Checkbox
                    id={`joblevel-${level}`}
                    checked={data.targetJobLevel?.includes(level) || false}
                    onCheckedChange={(checked) => {
                      const current = data.targetJobLevel || [];
                      const updated = checked
                        ? [...current, level]
                        : current.filter((l) => l !== level);
                      updateData("targetJobLevel", updated);
                    }}
                  />
                  <Label
                    htmlFor={`joblevel-${level}`}
                    className="font-normal cursor-pointer text-sm"
                  >
                    {level}
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Essential for customizing content and using the correct 7-Pillar
              tracks (e.g., Leadership Development programs are only relevant
              for Manager+).
            </p>
          </div>
          <div>
            <Label className="text-[#2E4059] font-semibold">
              Required Deployment Start <span className="text-red-500">*</span>
            </Label>
            <Select
              value={data.deploymentStart}
              onValueChange={(v) => updateData("deploymentStart", v)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select timeline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Within 3 months">Within 3 months</SelectItem>
                <SelectItem value="3-6 months">3-6 months</SelectItem>
                <SelectItem value="6-9 months">6-9 months</SelectItem>
                <SelectItem value="9-12 months">9-12 months</SelectItem>
                <SelectItem value="12+ months">12+ months</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500 mt-1">
              Links the People solution directly to the Strategic Timeline Fit
              from Step 3. Drives the Urgency Multiplier in final pricing.
            </p>
          </div>
          <div>
            <Label className="text-[#2E4059] font-semibold">
              Do you have an existing baseline measurement for this goal?{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Select
              value={data.baselineMeasurement}
              onValueChange={(v) => {
                updateData("baselineMeasurement", v);
                if (v !== "Yes") updateData("baselineMeasurementDetails", "");
              }}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
                <SelectItem value="Unsure">Unsure</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500 mt-1">
              Forces early consideration of metrics. If No, it pre-sells the
              Consulting Add-on for KPI Scorecard Design or Competency
              Assessment.
            </p>
            {data.baselineMeasurement === "Yes" && (
              <div className="mt-2">
                <Input
                  value={data.baselineMeasurementDetails}
                  onChange={(e) =>
                    updateData("baselineMeasurementDetails", e.target.value)
                  }
                  className="mt-1"
                  placeholder="Describe your existing baseline measurement..."
                />
              </div>
            )}
          </div>
        </div>
      </div>

      // C. Behavioral and Contextual Depth
      <div className="mt-6 pt-6 border-t-2 border-[#2E4059]">
        <h3 className="text-lg sm:text-xl font-bold text-[#2E4059] mb-4">
          C. Behavioral and Contextual Depth
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          This area explicitly checks if the solution requires more than just
          training, based on the SPSC flags from Step 3.
        </p>
        <div className="space-y-4 sm:space-y-6">
          <div>
            <Label className="text-[#2E4059] font-semibold">
              Behavior Goal (what behaviors should change?){" "}
              <span className="text-red-500">*</span>
            </Label>
            <p className="text-xs text-slate-500 mb-1">
              State the desired Kirkpatrick Level 3 outcome (e.g., "Managers
              consistently provide bi-weekly coaching feedback").
            </p>
            <Textarea
              value={data.behaviorGoal}
              onChange={(e) => updateData("behaviorGoal", e.target.value)}
              className="mt-1 min-h-[100px]"
              placeholder="e.g., Managers consistently provide bi-weekly coaching feedback..."
            />
            <p className="text-xs text-slate-500 mt-1">
              Ties the output to measurable, sustained change, which is key for
              ROI.
            </p>
          </div>
          <div>
            <Label className="text-[#2E4059] font-semibold">
              Specific Knowledge & Skills Required
            </Label>
            <Textarea
              value={data.knowledgeSkills}
              onChange={(e) => updateData("knowledgeSkills", e.target.value)}
              className="mt-1 min-h-[100px]"
              placeholder="e.g., Knowledge of the new HRIS system..."
            />
            <p className="text-xs text-slate-500 mt-1">
              Still allows clients to specify hyper-local requirements.
            </p>
          </div>
          <div>
            <Label className="text-[#2E4059] font-semibold">
              Contextual Notes (For the Consultant)
            </Label>
            <p className="text-xs text-slate-500 mb-1">
              Use this space to explain any SPSC issues (System, Policy,
              Culture) that might block the success of the training program.
            </p>
            <Textarea
              value={data.contextualNotes}
              onChange={(e) => updateData("contextualNotes", e.target.value)}
              className="mt-1 min-h-[100px]"
              placeholder="Describe any System, Policy, or Culture issues that might impact training success..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgramStep({
  data,
  updateData,
}: {
  data: BusinessCaseData;
  updateData: (field: keyof BusinessCaseData, value: any) => void;
}) {
  // Extract pillar names from Step 4
  const pillarNames = data.alignedPillar ? [data.alignedPillar] : [];
  const { pillars } = getCompetenciesFromGoals(data.trainingGoal || []);

  // Set program group to read-only pillar display
  useEffect(() => {
    if (data.alignedPillar && !data.programGroup) {
      updateData("programGroup", data.alignedPillar);
    }
  }, [data.alignedPillar, data.programGroup, updateData]);

  // Filter programs by pillar/competency (simplified - would need program-to-pillar mapping)
  const availablePrograms = programs.filter((p) => {
    // This is a simplified filter - in production, you'd have a program-to-pillar mapping
    // For now, we'll show all programs but could filter based on competency
    return true;
  });

  // Filter soft skills by pillar if required
  const availableSoftSkills =
    data.requiresSoftSkills === "Yes" && pillars.length > 0
      ? getSoftSkillsByPillar(pillars)
      : softSkills.map((s) => s.title);

  const toggleProgramName = (name: string) => {
    const current = Array.isArray(data.programName) ? data.programName : [];
    const updated = current.includes(name)
      ? current.filter((n) => n !== name)
      : [...current, name];
    updateData("programName", updated);
  };

  const toggleSoftSkill = (title: string) => {
    const current = data.softSkillSelections || [];
    const updated = current.includes(title)
      ? current.filter((s) => s !== title)
      : [...current, title];
    updateData("softSkillSelections", updated);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#2E4059] mb-2">
          Step 5: Solution Mapping & Investment Recommendation
        </h2>
        <p className="text-sm sm:text-base text-slate-600 italic">
          Instruction: Finalize the <strong>Customization Depth</strong> and
          confirm the necessary <strong>Consulting Add-ons</strong> required to
          solve the SPSC root causes identified.
        </p>
      </div>

      // A. Training Programs
      <div className="mb-6 pt-4 border-t-2 border-[#2E4059]">
        <h3 className="text-lg sm:text-xl font-bold text-[#2E4059] mb-4">
          A. Training Programs (Filtered by Competency & Pillar)
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          The system only displays SewAsset Programs that are mapped to the
          Competency and 7 Pillars selected in Step 4.
        </p>

        <div className="space-y-4">
          <div>
            <Label className="text-[#2E4059] font-semibold">
              Program Group (7 Pillars) <span className="text-red-500">*</span>
            </Label>
            <Input
              value={data.programGroup || data.alignedPillar || ""}
              readOnly
              className="mt-1 bg-slate-100 cursor-not-allowed"
            />
            <p className="text-xs text-slate-500 mt-1">
              Read-only. Displays the Pillar(s) identified in Step 4.
            </p>
          </div>

          <div>
            <Label className="text-[#2E4059] font-semibold">
              Program Name (Filtered by Pillar/Competency){" "}
              <span className="text-red-500">*</span>
            </Label>
            <div className="flex flex-wrap gap-3 mt-2 p-3 border border-slate-200 rounded-lg bg-slate-50 min-h-[100px]">
              {availablePrograms.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Please complete Step 4 first to see available programs
                </p>
              ) : (
                availablePrograms.map((program) => (
                  <div
                    key={program.name}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`program-${program.name}`}
                      checked={
                        Array.isArray(data.programName) &&
                        data.programName.includes(program.name)
                      }
                      onCheckedChange={() => toggleProgramName(program.name)}
                    />
                    <Label
                      htmlFor={`program-${program.name}`}
                      className="font-normal cursor-pointer text-sm"
                    >
                      {program.name}
                    </Label>
                  </div>
                ))
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Filtered to only show programs tied to the selected
              Pillar/Competency. This focuses the client on the most relevant
              solution.
            </p>
          </div>

          <div>
            <Label className="text-[#2E4059] font-semibold">
              Custom Program Title Request
            </Label>
            <Input
              value={data.additionalTrainingTitle}
              onChange={(e) =>
                updateData("additionalTrainingTitle", e.target.value)
              }
              className="mt-1"
              placeholder="Enter custom program title if needed..."
            />
            <p className="text-xs text-slate-500 mt-1">
              Captures bespoke opportunities.
            </p>
          </div>

          <div>
            <Label className="text-[#2E4059] font-semibold">
              Duration Override (hours, optional)
            </Label>
            <Input
              type="number"
              value={data.durationOverrideHours}
              onChange={(e) =>
                updateData("durationOverrideHours", e.target.value)
              }
              className="mt-1"
            />
            <p className="text-xs text-slate-500 mt-1">Allows flexibility.</p>
          </div>

          <div>
            <Label className="text-[#2E4059] font-semibold">
              Expected Start Date <span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              value={data.expectedStartDate}
              onChange={(e) => updateData("expectedStartDate", e.target.value)}
              className="mt-1"
            />
            <p className="text-xs text-slate-500 mt-1">
              Essential for the Strategic Timeline Fit and scheduling resources.
            </p>
          </div>
        </div>
      </div>

      // Soft Skills Section
      <div className="mt-6 pt-6 border-t-2 border-[#2E4059]">
        <div className="mb-4">
          <Label className="text-[#2E4059] font-semibold text-base sm:text-lg">
            Do you require focused soft skill modules?{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.requiresSoftSkills}
            onValueChange={(v) => {
              updateData("requiresSoftSkills", v);
              if (v !== "Yes") updateData("softSkillSelections", []);
            }}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-500 mt-1">
            Forces a deliberate decision.
          </p>
        </div>

        {data.requiresSoftSkills === "Yes" && (
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#2E4059] mb-3 sm:mb-4">
              Step 5.2: Behavior Shaping (Soft Skills)
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Filtered by Pillar: Display only the soft skills that belong to
              the Pillar(s) selected in Step 4.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
              {availableSoftSkills.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No soft skills available for the selected Pillar(s). Please
                  check your Step 4 selections.
                </p>
              ) : (
                availableSoftSkills.map((title) => (
                  <div key={title} className="flex items-center space-x-2">
                    <Checkbox
                      id={`softskill-${title}`}
                      checked={
                        data.softSkillSelections?.includes(title) || false
                      }
                      onCheckedChange={() => toggleSoftSkill(title)}
                    />
                    <Label
                      htmlFor={`softskill-${title}`}
                      className="font-normal cursor-pointer text-sm"
                    >
                      {title}
                    </Label>
                  </div>
                ))
              )}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Focuses on the <em>outcome</em> (behavior shaping). Reinforces the
              Competency Mapping.
            </p>
          </div>
        )}
      </div>

      // B. Training Customization
      <div className="mt-6 pt-6 border-t-2 border-[#2E4059]">
        <h3 className="text-lg sm:text-xl font-bold text-[#2E4059] mb-4">
          B. Training Customization (Impacts Cost)
        </h3>
        <div className="space-y-4 sm:space-y-6">
          <div>
            <Label className="text-[#2E4059] font-semibold">
              Required Customization Depth (Select One){" "}
              <span className="text-red-500">*</span>
            </Label>
            <Select
              value={data.customizationDepth}
              onValueChange={(v) => updateData("customizationDepth", v)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select customization depth" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Use Standard SewAsset Content (Low Cost)">
                  Use Standard SewAsset Content (Low Cost)
                </SelectItem>
                <SelectItem value="Minor Branding/Contextualization">
                  Minor Branding/Contextualization
                </SelectItem>
                <SelectItem value="Full Custom Content Development (High Cost)">
                  Full Custom Content Development (High Cost)
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500 mt-1">
              This is the key to pricing content development labor accurately.
              It justifies a significant price increase for bespoke solutions.
            </p>
          </div>

          <div>
            <Label className="text-[#2E4059] font-semibold">
              Preferred Delivery Format (Select Multiple){" "}
              <span className="text-red-500">*</span>
            </Label>
            <div className="flex flex-wrap gap-3 mt-2 p-3 border border-slate-200 rounded-lg bg-slate-50">
              {[
                "In-Person",
                "VILT (Virtual)",
                "Blended",
                "Self-Paced eLearning",
              ].map((format) => (
                <div key={format} className="flex items-center space-x-2">
                  <Checkbox
                    id={`delivery-${format}`}
                    checked={data.deliveryFormat?.includes(format) || false}
                    onCheckedChange={(checked) => {
                      const current = data.deliveryFormat || [];
                      const updated = checked
                        ? [...current, format]
                        : current.filter((f) => f !== format);
                      updateData("deliveryFormat", updated);
                    }}
                  />
                  <Label
                    htmlFor={`delivery-${format}`}
                    className="font-normal cursor-pointer text-sm"
                  >
                    {format}
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Essential for calculating logistics, travel fees, and justifying
              the final delivery cost/complexity.
            </p>
          </div>
        </div>
      </div>

      // C. SPSC Consulting Validation
      <div className="mt-6 pt-6 border-t-2 border-[#2E4059]">
        <h3 className="text-lg sm:text-xl font-bold text-[#2E4059] mb-4">
          C. SPSC Consulting Validation (Holistic Solution)
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          This section is vital for ensuring the client's System/Culture
          problems are addressed.
        </p>
        <div className="space-y-4 sm:space-y-6">
          {data.systemProcessBottleneck === "Yes" && (
            <div>
              <Label className="text-[#2E4059] font-semibold">
                Policy/System Gaps to Address{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                value={data.policySystemGaps}
                onChange={(e) => updateData("policySystemGaps", e.target.value)}
                className="mt-1 min-h-[100px]"
                placeholder="e.g., Performance review forms are outdated, Need CRM implementation support..."
              />
              <p className="text-xs text-slate-500 mt-1">
                Forces the client to articulate the exact policy/system that
                needs modification. This is the formal Consulting Scope
                document.
              </p>
            </div>
          )}

          {(data.cultureResistant === "Yes" ||
            data.cultureResistant === "Unsure") && (
            <div>
              <Label className="text-[#2E4059] font-semibold">
                Internal Change Management Readiness{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Select
                value={data.changeManagementReadiness}
                onValueChange={(v) =>
                  updateData("changeManagementReadiness", v)
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select readiness level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High (L&D staff ready)">
                    High (L&D staff ready)
                  </SelectItem>
                  <SelectItem value="Medium (Need help)">
                    Medium (Need help)
                  </SelectItem>
                  <SelectItem value="Low (Full external support needed)">
                    Low (Full external support needed)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label className="text-[#2E4059] font-semibold">
              Designated Internal Champion (Name & Title){" "}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              value={data.designatedChampion}
              onChange={(e) => updateData("designatedChampion", e.target.value)}
              className="mt-1"
              placeholder="e.g., John Doe, Head of L&D"
            />
            <p className="text-xs text-slate-500 mt-1">
              CRITICAL for success. Ensures there is a named, accountable leader
              who will drive Kirkpatrick Level 3 (Behavioral Change) success.
            </p>
          </div>
        </div>
      </div>

      // D. Consulting Add-ons by SPSC Dimensions
      <div className="mt-6 pt-6 border-t-2 border-[#2E4059]">
        <h3 className="text-lg sm:text-xl font-bold text-[#2E4059] mb-4">
          D. Strategic Consulting Add-ons (SPSC-Driven)
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          Instead of hiding options, use the SPSC inputs to display a{" "}
          <strong>"Recommended for You"</strong> badge next to the relevant
          consulting option. This validates the client's problem diagnosis and
          subtly guides them to the holistic solution.
        </p>

        <div className="space-y-6">
          // People & Culture Consulting
          <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
            <div className="flex items-center gap-2 mb-3">
              <h4 className="text-base font-bold text-[#2E4059]">
                People & Culture Consulting (Pillar 1, 4, 7)
              </h4>
              {(data.behavioralChangeSupported === "No" ||
                data.behavioralChangeSupported === "Unsure" ||
                data.cultureResistant === "Yes" ||
                data.cultureResistant === "Unsure") && (
                <span className="px-2 py-1 bg-[#FFC72F] text-[#2E4059] text-xs font-bold rounded">
                  Recommended for You
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600 mb-3">
              Competency Framework, Skill Matrix, Culture Transformation, Change
              Management, Coaching/Mentoring Systems
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Competency Framework",
                "Skill Matrix",
                "Culture Transformation",
                "Change Management",
                "Coaching/Mentoring Systems",
              ].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`consulting-people-${type}`}
                    checked={data.consultingType === type}
                    onCheckedChange={(checked) => {
                      updateData("consultingType", checked ? type : "");
                      updateData("consultingAddOn", checked);
                    }}
                  />
                  <Label
                    htmlFor={`consulting-people-${type}`}
                    className="font-normal cursor-pointer text-sm"
                  >
                    {type}
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Upsell Logic: Mandatory prompt if Step 3 → Culture/People → Yes
            </p>
          </div>

          // System & Process Consulting
          <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
            <div className="flex items-center gap-2 mb-3">
              <h4 className="text-base font-bold text-[#2E4059]">
                System & Process Consulting (Pillar 6, Functional)
              </h4>
              {data.systemProcessBottleneck === "Yes" && (
                <span className="px-2 py-1 bg-[#FFC72F] text-[#2E4059] text-xs font-bold rounded">
                  Recommended for You
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600 mb-3">
              Process Mapping/Design, Lean/Six Sigma Implementation, KPI
              Scorecard Design, Sales Process Design, ERP/CRM Adoption Support
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Process Mapping/Design",
                "Lean/Six Sigma Implementation",
                "KPI Scorecard Design",
                "Sales Process Design",
                "ERP/CRM Adoption Support",
              ].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`consulting-system-${type}`}
                    checked={data.consultingType === type}
                    onCheckedChange={(checked) => {
                      updateData("consultingType", checked ? type : "");
                      updateData("consultingAddOn", checked);
                    }}
                  />
                  <Label
                    htmlFor={`consulting-system-${type}`}
                    className="font-normal cursor-pointer text-sm"
                  >
                    {type}
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Upsell Logic: Mandatory prompt if Step 3 → System/Process → Yes
            </p>
          </div>

          // Strategy & Leadership Consulting
          <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
            <div className="flex items-center gap-2 mb-3">
              <h4 className="text-base font-bold text-[#2E4059]">
                Strategy & Leadership Consulting (Pillar 1, 7)
              </h4>
              <span className="px-2 py-1 bg-[#FFC72F] text-[#2E4059] text-xs font-bold rounded">
                Always Available
              </span>
            </div>
            <p className="text-sm text-slate-600 mb-3">
              Organizational Design, Strategic Planning Facilitation, Reframing
              Strategy, Executive Coaching
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Organizational Design",
                "Strategic Planning Facilitation",
                "Reframing Strategy",
                "Executive Coaching",
              ].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`consulting-strategy-${type}`}
                    checked={data.consultingType === type}
                    onCheckedChange={(checked) => {
                      updateData("consultingType", checked ? type : "");
                      updateData("consultingAddOn", checked);
                    }}
                  />
                  <Label
                    htmlFor={`consulting-strategy-${type}`}
                    className="font-normal cursor-pointer text-sm"
                  >
                    {type}
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Upsell Logic: Always visible. Positions SewAsset at the executive
              level regardless of SPSC diagnosis.
            </p>
          </div>
        </div>
      </div>

      // E. Training Add-ons (Refined from Old Step 8)
      <div className="mt-6 pt-6 border-t-2 border-[#2E4059]">
        <h3 className="text-lg sm:text-xl font-bold text-[#2E4059] mb-4">
          E. Training Add-ons (Refined)
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          This section is kept but clarified, ensuring pricing is transparent.
        </p>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="addPreAssess"
              checked={data.addPreAssess}
              onCheckedChange={(checked) => updateData("addPreAssess", checked)}
            />
            <Label
              htmlFor="addPreAssess"
              className="font-normal cursor-pointer"
            >
              Include Pre-assessment? (+X ETB per participant)
            </Label>
          </div>
          <p className="text-xs text-slate-500 ml-6">
            Kept. Essential for ROI defensibility.
          </p>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="addCoaching"
              checked={data.addCoaching}
              onCheckedChange={(checked) => updateData("addCoaching", checked)}
            />
            <Label htmlFor="addCoaching" className="font-normal cursor-pointer">
              Include Post-program Coaching? (+X ETB per participant)
            </Label>
          </div>
          <p className="text-xs text-slate-500 ml-6">
            Kept. Essential for SPSC behavioral change (Kirkpatrick Level 3).
          </p>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="addDigital"
              checked={data.addDigital}
              onCheckedChange={(checked) => updateData("addDigital", checked)}
            />
            <Label htmlFor="addDigital" className="font-normal cursor-pointer">
              Digital Learning Follow-ups? (+X ETB per participant)
            </Label>
          </div>
          <p className="text-xs text-slate-500 ml-6">
            Kept. Supports SPSC System (tools/methodology) adoption.
          </p>

          <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <Label className="text-[#2E4059] font-semibold">
              Logistics Handling Fee
            </Label>
            <p className="text-sm text-slate-600 mt-1">
              Calculated Field: Automatically applied based on{" "}
              <strong>Delivery Format</strong> and <strong>Region</strong> (from
              Step 1) to cover Venue, Catering, and Travel.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              New. This fee will be calculated in the final pricing step.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to auto-populate metric name from training goal
function getMetricNameFromGoal(trainingGoal: string[]): string {
  if (!trainingGoal || trainingGoal.length === 0) return "";

  // Extract metric-related keywords from training goals
  const goalText = trainingGoal.join(" ").toLowerCase();

  if (
    goalText.includes("attrition") ||
    goalText.includes("retention") ||
    goalText.includes("turnover")
  ) {
    return "Employee Attrition %";
  }
  if (
    goalText.includes("conversion") ||
    goalText.includes("close") ||
    goalText.includes("deal")
  ) {
    return "Sales Conversion %";
  }
  if (goalText.includes("productivity") || goalText.includes("efficiency")) {
    return "Productivity Gain %";
  }
  if (
    goalText.includes("satisfaction") ||
    goalText.includes("csat") ||
    goalText.includes("nps")
  ) {
    return "Customer Satisfaction Score";
  }
  if (
    goalText.includes("error") ||
    goalText.includes("defect") ||
    goalText.includes("quality")
  ) {
    return "Error/Defect Rate %";
  }
  if (
    goalText.includes("time") ||
    goalText.includes("cycle") ||
    goalText.includes("handle")
  ) {
    return "Process Time Reduction %";
  }

  // Default based on first goal
  return trainingGoal[0] || "";
}

function MetricsStep({
  data,
  updateData,
}: {
  data: BusinessCaseData;
  updateData: (field: keyof BusinessCaseData, value: any) => void;
}) {
  // Auto-populate metric name from training goal
  useEffect(() => {
    if (data.trainingGoal && data.trainingGoal.length > 0 && !data.metricName) {
      const autoMetric = getMetricNameFromGoal(data.trainingGoal);
      if (autoMetric) {
        updateData("metricName", autoMetric);
      }
    }
  }, [data.trainingGoal, data.metricName, updateData]);

  // Check if System or Culture consulting was added
  const hasSystemConsulting =
    data.systemProcessBottleneck === "Yes" && data.policySystemGaps;
  const hasCultureConsulting =
    (data.cultureResistant === "Yes" || data.cultureResistant === "Unsure") &&
    data.changeManagementReadiness;

  // Auto-populate benchmarks if "Needs Benchmark" is selected
  useEffect(() => {
    if (data.metricDataReadiness === "Needs Benchmark") {
      // Apply industry benchmarks (simplified - would use actual benchmark data)
      if (!data.currentMetric) {
        updateData("currentMetric", "12"); // Example benchmark
      }
      if (!data.targetMetric) {
        updateData("targetMetric", "9"); // Example benchmark
      }
    }
  }, [
    data.metricDataReadiness,
    data.currentMetric,
    data.targetMetric,
    updateData,
  ]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#2E4059] mb-2">
          Step 6: ROI Quantification & SPSC Impact Validation
        </h2>
        <p className="text-sm sm:text-base text-slate-600 italic">
          Instruction: We require targets across <strong>Levels 3 and 4</strong>{" "}
          (Behavior & Results). If you lack current data, select the{" "}
          <strong>"Benchmark"</strong> option, and SewAsset will apply{" "}
          <strong>Industry Benchmarks</strong> based on your{" "}
          <strong>Industry</strong> and <strong>Strategic Priority</strong>.
        </p>
      </div>

      // A. Metric Readiness Gate
      <div className="mb-6 pt-4 border-t-2 border-[#2E4059]">
        <h3 className="text-lg sm:text-xl font-bold text-[#2E4059] mb-4">
          A. Metric Data Readiness Gate
        </h3>
        <div>
          <Label className="text-[#2E4059] font-semibold">
            Metric Data Readiness <span className="text-red-500">*</span>
          </Label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="readiness-validated"
                name="metricDataReadiness"
                value="Validated Data"
                checked={data.metricDataReadiness === "Validated Data"}
                onChange={(e) =>
                  updateData("metricDataReadiness", e.target.value)
                }
                className="w-4 h-4"
              />
              <Label
                htmlFor="readiness-validated"
                className="font-normal cursor-pointer"
              >
                Validated Data: We have current/target metrics and will input
                them.
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="readiness-estimates"
                name="metricDataReadiness"
                value="Only Estimates"
                checked={data.metricDataReadiness === "Only Estimates"}
                onChange={(e) =>
                  updateData("metricDataReadiness", e.target.value)
                }
                className="w-4 h-4"
              />
              <Label
                htmlFor="readiness-estimates"
                className="font-normal cursor-pointer"
              >
                Only Estimates: We have approximate numbers, but they are not
                formally tracked.
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="readiness-benchmark"
                name="metricDataReadiness"
                value="Needs Benchmark"
                checked={data.metricDataReadiness === "Needs Benchmark"}
                onChange={(e) =>
                  updateData("metricDataReadiness", e.target.value)
                }
                className="w-4 h-4"
              />
              <Label
                htmlFor="readiness-benchmark"
                className="font-normal cursor-pointer"
              >
                Needs Benchmark: We lack all data and need SewAsset to apply
                industry benchmarks.
              </Label>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            If options 2 or 3 are selected, the system automatically flags the
            final ROI report as "Based on SewAsset Industry Benchmarks" and
            justifies the inclusion of a Consulting Add-on for KPI Scorecard
            Design (if not already selected in Step 5).
          </p>
        </div>
      </div>

      // B. Primary Metric Input (Refined)
      <div className="mb-6 pt-4 border-t-2 border-[#2E4059]">
        <h3 className="text-lg sm:text-xl font-bold text-[#2E4059] mb-4">
          B. Primary Metric Input (Read-Only / Auto-Populated)
        </h3>
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <Label className="text-[#2E4059] font-semibold">
              Primary Metric Name <span className="text-red-500">*</span>
            </Label>
            <Input
              value={
                data.metricName ||
                getMetricNameFromGoal(data.trainingGoal || [])
              }
              readOnly
              className="mt-1 bg-slate-100 cursor-not-allowed"
            />
            <p className="text-xs text-slate-500 mt-1">
              Read-only. Auto-populated based on the KPI pain and Training Goal
              from Step 4. Prevents the client from entering an irrelevant
              metric, ensuring alignment with the core problem.
            </p>
          </div>
          {data.metricDataReadiness === "Needs Benchmark" ? (
            <>
              <div>
                <Label className="text-[#2E4059] font-semibold">
                  Current Metric (SewAsset Benchmark){" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={data.currentMetric}
                  onChange={(e) => updateData("currentMetric", e.target.value)}
                  className="mt-1"
                  placeholder="e.g., 12 for 12%"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Pre-populated with SewAsset Benchmark figures based on your
                  Industry and Strategic Priority.
                </p>
              </div>
              <div>
                <Label className="text-[#2E4059] font-semibold">
                  Target Metric (SewAsset Benchmark){" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={data.targetMetric}
                  onChange={(e) => updateData("targetMetric", e.target.value)}
                  className="mt-1"
                  placeholder="e.g., 9 for 9%"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Pre-populated with SewAsset Benchmark figures.
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <Label className="text-[#2E4059] font-semibold">
                  Current Metric (e.g., 12 for 12%){" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={data.currentMetric}
                  onChange={(e) => updateData("currentMetric", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-[#2E4059] font-semibold">
                  Target Metric (e.g., 10 for 10%){" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={data.targetMetric}
                  onChange={(e) => updateData("targetMetric", e.target.value)}
                  className="mt-1"
                />
              </div>
            </>
          )}
        </div>
      </div>

      // C. Level 3 & 4 (Behavior & Results: The Financial Drivers)
      <div className="mb-6 pt-4 border-t-2 border-[#2E4059]">
        <h3 className="text-lg sm:text-xl font-bold text-[#2E4059] mb-4">
          C. Level 3 & 4 (Behavior & Results: The Financial Drivers)
        </h3>
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <Label className="text-[#2E4059] font-semibold">
              Target Behavior Adoption Rate (L3){" "}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              value={data.targetBehaviorAdoptionRate}
              onChange={(e) =>
                updateData("targetBehaviorAdoptionRate", e.target.value)
              }
              className="mt-1"
              placeholder="e.g., 80 for 80%"
            />
            <p className="text-xs text-slate-500 mt-1">
              New. Measures the success of the <strong>People</strong> solution.
              What % of participants must successfully adopt the new behavior
              (e.g., 80% of managers coaching bi-weekly)?
            </p>
          </div>
          <div>
            <Label className="text-[#2E4059] font-semibold">
              Estimated Productivity Gain (%){" "}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              value={data.estProductivityGain}
              onChange={(e) =>
                updateData("estProductivityGain", e.target.value)
              }
              className="mt-1"
            />
            <p className="text-xs text-slate-500 mt-1">Financial Driver.</p>
          </div>
          <div>
            <Label className="text-[#2E4059] font-semibold">
              Employee Retention Improvement (%){" "}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              value={data.estRetentionImprovement}
              onChange={(e) =>
                updateData("estRetentionImprovement", e.target.value)
              }
              className="mt-1"
            />
            <p className="text-xs text-slate-500 mt-1">Financial Driver.</p>
          </div>
          <div>
            <Label className="text-[#2E4059] font-semibold">
              Direct Cost Savings per Participant (ETB)
            </Label>
            <Input
              type="number"
              value={data.directCostSavingPerPerson}
              onChange={(e) =>
                updateData("directCostSavingPerPerson", e.target.value)
              }
              className="mt-1"
            />
            <p className="text-xs text-slate-500 mt-1">
              Financial Driver. Refined Instruction: Enter the Annual ETB
              savings <em>per participant</em> due to reduced errors, waste, or
              fines.
            </p>
          </div>
          <div>
            <Label className="text-[#2E4059] font-semibold">
              Average Monthly Salary per Participant (ETB){" "}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              value={data.avgMonthlySalary || ""}
              onChange={(e) =>
                updateData("avgMonthlySalary", parseFloat(e.target.value) || 0)
              }
              className="mt-1"
            />
            <p className="text-xs text-slate-500 mt-1">
              CRITICAL ROI DRIVER. Moved from Step 7. Needed for calculating the
              financial value of productivity and retention gains.
            </p>
          </div>
          <div>
            <Label className="text-[#2E4059] font-semibold">
              Total Employees (for context)
            </Label>
            <Input
              value={data.totalEmployees}
              onChange={(e) => updateData("totalEmployees", e.target.value)}
              className="mt-1"
            />
            <p className="text-xs text-slate-500 mt-1">
              Provides context for the scale (e.g., 10 participants out of 1,000
              employees is a 1% focus). Moved from Step 7.
            </p>
          </div>
        </div>
      </div>

      // D. SPSC Validation Metrics (Conditional)
      {(hasSystemConsulting || hasCultureConsulting) && (
        <div className="mb-6 pt-4 border-t-2 border-[#2E4059]">
          <h3 className="text-lg sm:text-xl font-bold text-[#2E4059] mb-4">
            D. SPSC Validation Metrics (The System/Culture Check)
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            This section is conditional, only appearing if System or Culture
            consulting was added in Step 5.
          </p>
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            {hasSystemConsulting && (
              <div>
                <Label className="text-[#2E4059] font-semibold">
                  System/Process Success Indicator{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={data.systemProcessSuccessIndicator}
                  onChange={(e) =>
                    updateData("systemProcessSuccessIndicator", e.target.value)
                  }
                  className="mt-1"
                  placeholder="e.g., 90% process compliance"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Measures the success of the <strong>System</strong> solution
                  defined in Step 5.
                </p>
              </div>
            )}
            {hasCultureConsulting && (
              <div>
                <Label className="text-[#2E4059] font-semibold">
                  Culture/Environment Success Indicator{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={data.cultureEnvironmentSuccessIndicator}
                  onChange={(e) =>
                    updateData(
                      "cultureEnvironmentSuccessIndicator",
                      e.target.value
                    )
                  }
                  className="mt-1"
                  placeholder="e.g., 20% improvement in Psychological Safety Score"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Measures the success of the <strong>Culture</strong> solution
                  defined in Step 5.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      // E. Executive Impact Summary
      <div className="mb-6 pt-4 border-t-2 border-[#2E4059]">
        <h3 className="text-lg sm:text-xl font-bold text-[#2E4059] mb-4">
          E. Executive Impact Summary (The Final Story)
        </h3>
        <div>
          <Label className="text-[#2E4059] font-semibold">
            Executive Impact Summary <span className="text-red-500">*</span>
          </Label>
          <p className="text-xs text-slate-500 mb-2">
            Combined & Renamed from "Success will look like" and "Observable
            changes". Instruct the client to synthesize the whole story:
            "Briefly summarize how the L3 behavior change will deliver the L4
            financial result." (e.g., "Managers adopting the new coaching
            behavior (L3) will reduce employee frustration, driving 2.5%
            Retention Improvement (L4).")
          </p>
          <Textarea
            value={data.executiveImpactSummary}
            onChange={(e) =>
              updateData("executiveImpactSummary", e.target.value)
            }
            className="mt-1 min-h-[120px]"
            placeholder="Briefly summarize how the L3 behavior change will deliver the L4 financial result..."
          />
        </div>
      </div>
    </div>
  );
}

function OrgStep({
  data,
  updateData,
}: {
  data: BusinessCaseData;
  updateData: (field: keyof BusinessCaseData, value: any) => void;
}) {
  // Auto-set budget estimate if "TBD" is selected
  useEffect(() => {
    if (
      data.budgetKnowledgeGate === "The budget is TBD" &&
      !data.annualBudget
    ) {
      // Set to 1.5% of revenue estimate (would need revenue field or use industry standard)
      // For now, we'll just flag it - actual calculation would be in pricing step
      updateData("annualBudget", 0); // Will be calculated/estimated
    }
  }, [data.budgetKnowledgeGate, data.annualBudget, updateData]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#2E4059] mb-2">
          Step 7: L&D Capacity & Budget Context
        </h2>
        <p className="text-sm sm:text-base text-slate-600 italic">
          The new Step 7 focuses purely on the client's internal L&D resources
          and culture. This data is essential for SewAsset to determine the need
          for Consulting on L&D System/Process (Pillar 6, 7) and assess the risk
          of Training Failure due to internal capacity issues.
        </p>
      </div>

      // A. Budget Affordability & Contingency
      <div className="mb-6 pt-4 border-t-2 border-[#2E4059]">
        <h3 className="text-lg sm:text-xl font-bold text-[#2E4059] mb-4">
          A. Budget Affordability & Contingency (Addressing Client Fear)
        </h3>
        <div className="space-y-4 sm:space-y-6">
          <div>
            <Label className="text-[#2E4059] font-semibold">
              Budget Knowledge Gate <span className="text-red-500">*</span>
            </Label>
            <Select
              value={data.budgetKnowledgeGate}
              onValueChange={(v) => {
                updateData("budgetKnowledgeGate", v);
                if (v === "The budget is TBD") {
                  // Will be estimated in pricing step
                  updateData("annualBudget", 0);
                }
              }}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="I know the budget">
                  I know the budget
                </SelectItem>
                <SelectItem value="The budget is TBD">
                  The budget is TBD
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500 mt-1">
              CRITICAL. If "The budget is TBD" is selected, the system must set
              the Annual Training Budget field to "Estimate based on 1.5% of
              Revenue" (or use an industry standard benchmark) and alert the
              SewAsset consultant.
            </p>
          </div>

          {data.budgetKnowledgeGate === "I know the budget" && (
            <div>
              <Label className="text-[#2E4059] font-semibold">
                Annual Training Budget (ETB){" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                value={data.annualBudget || ""}
                onChange={(e) =>
                  updateData("annualBudget", parseFloat(e.target.value) || 0)
                }
                className="mt-1"
              />
              <p className="text-xs text-slate-500 mt-1">
                Kept. Budgetary context for the proposed solution.
              </p>
            </div>
          )}

          {data.budgetKnowledgeGate === "The budget is TBD" && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Budget will be estimated based on 1.5% of
                Revenue or industry standard benchmark. SewAsset consultant will
                be notified.
              </p>
            </div>
          )}

          <div>
            <Label className="text-[#2E4059] font-semibold">
              Is the Consulting budget separate from the Training budget?{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Select
              value={data.consultingBudgetSeparate}
              onValueChange={(v) => updateData("consultingBudgetSeparate", v)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
                <SelectItem value="Unsure">Unsure</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500 mt-1">
              NEW. Essential for financial packaging when SPSC needs are
              flagged.
            </p>
          </div>

          <div>
            <Label className="text-[#2E4059] font-semibold">
              Cost Contingency % (Optional)
            </Label>
            <Input
              type="number"
              value={data.costContingencyPercent || ""}
              onChange={(e) =>
                updateData(
                  "costContingencyPercent",
                  parseFloat(e.target.value) || 0
                )
              }
              className="mt-1"
              placeholder="e.g., 10 for 10%"
            />
            <p className="text-xs text-slate-500 mt-1">
              Measures financial prudence. Used to justify a 10% padding in the
              final price.
            </p>
          </div>
        </div>
      </div>

      // B. L&D Capacity and Internal Cost
      <div className="mb-6 pt-4 border-t-2 border-[#2E4059]">
        <h3 className="text-lg sm:text-xl font-bold text-[#2E4059] mb-4">
          B. L&D Capacity and Internal Cost (SewAsset Context)
        </h3>
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <Label className="text-[#2E4059] font-semibold">
              Total L&D Staff (Trainers/Designers/Facilitators)
            </Label>
            <Input
              type="number"
              value={data.lndStaff || ""}
              onChange={(e) =>
                updateData("lndStaff", parseFloat(e.target.value) || 0)
              }
              className="mt-1"
            />
            <p className="text-xs text-slate-500 mt-1">
              <strong>SPSC-System/People:</strong> Gauges internal capacity to
              co-deliver or sustain the solution. Low count → high need for
              SewAsset support.
            </p>
          </div>

          <div>
            <Label className="text-[#2E4059] font-semibold">
              Trainer Hourly Rate (ETB)
            </Label>
            <Input
              type="number"
              value={data.trainerHourlyRate || ""}
              onChange={(e) =>
                updateData("trainerHourlyRate", parseFloat(e.target.value) || 0)
              }
              className="mt-1"
            />
            <p className="text-xs text-slate-500 mt-1">
              <strong>Cost of Internal Development:</strong> Used to calculate
              the internal opportunity cost of not using SewAsset.
            </p>
          </div>

          <div>
            <Label className="text-[#2E4059] font-semibold">
              # of distinct training initiatives planned annually
            </Label>
            <Input
              type="number"
              value={data.initiativesPerYear || ""}
              onChange={(e) =>
                updateData(
                  "initiativesPerYear",
                  parseFloat(e.target.value) || 0
                )
              }
              className="mt-1"
            />
            <p className="text-xs text-slate-500 mt-1">
              <strong>SPSC-Strategy:</strong> Indicates if the current L&D
              strategy is fragmented or focused, justifying a Competency
              Framework consulting add-on.
            </p>
          </div>

          <div>
            <Label className="text-[#2E4059] font-semibold">
              Annual Training Hours per Employee
            </Label>
            <Input
              type="number"
              value={data.annualHoursPerEmployee || ""}
              onChange={(e) =>
                updateData(
                  "annualHoursPerEmployee",
                  parseFloat(e.target.value) || 0
                )
              }
              className="mt-1"
            />
            <p className="text-xs text-slate-500 mt-1">
              <strong>SPSC-Culture:</strong> A low number indicates a low
              Culture of Learning, justifying Change Management consulting.
            </p>
          </div>

          <div>
            <Label className="text-[#2E4059] font-semibold">
              Development hours required per hour of training
            </Label>
            <Input
              type="number"
              value={data.devHoursPerTrainingHour || ""}
              onChange={(e) =>
                updateData(
                  "devHoursPerTrainingHour",
                  parseFloat(e.target.value) || 0
                )
              }
              className="mt-1"
            />
            <p className="text-xs text-slate-500 mt-1">
              Highly specific, best grouped under L&D operational data.
            </p>
          </div>

          <div>
            <Label className="text-[#2E4059] font-semibold">
              Required Follow-Up/Delivery Frequency
            </Label>
            <Select
              value={data.deliveryFrequency}
              onValueChange={(v) => updateData("deliveryFrequency", v)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="One-time">One-time</SelectItem>
                <SelectItem value="Quarterly">Quarterly</SelectItem>
                <SelectItem value="Bi-annually">Bi-annually</SelectItem>
                <SelectItem value="Annually">Annually</SelectItem>
                <SelectItem value="Ongoing Retainer">
                  Ongoing Retainer
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500 mt-1">
              <strong>SPSC-System/Process:</strong> Finalizes the nature of the
              engagement beyond the initial training (e.g., retainer for
              coaching).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// BudgetStep removed - Training Add-ons moved to Step 5 (ProgramStep)

function PricingStep({ data }: { data: BusinessCaseData }) {
  const evals = computePricingAndROI(data);

  const makeNarrative = () => {
    return [
      `We propose addressing your core challenge — "${
        data.biggestChallenge || "—"
      }" — which currently impacts the business through ${
        Array.isArray(data.currentImpact)
          ? data.currentImpact.join(", ")
          : data.currentImpact || "—"
      }.`,
      `This initiative aligns with your strategic priority "${
        data.strategicPriority || "—"
      }" and engages ${
        (data.stakeholders || []).join(", ") || "key stakeholders"
      }.`,
      `Cost of inaction is estimated at ${formatCurrency(
        data.costOfInaction
      )} per year.`,
      `Our solution maps your department ("${
        Array.isArray(data.department)
          ? data.department.join(", ")
          : data.department || "—"
      }") & goal ("${
        Array.isArray(data.trainingGoal)
          ? data.trainingGoal.join(", ")
          : data.trainingGoal || "—"
      }") to the selected programs, with expected ROI of ${formatPercent(
        evals.roi.expected
      )} and payback in ${evals.payback.expected?.toFixed(1) || "—"} months.`,
      `Executive Impact Summary: ${data.executiveImpactSummary || "—"}.`,
    ].join(" ");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      // Business Case Summary
      <Card className="p-4 sm:p-6 bg-gradient-to-br from-[#2E4059] to-slate-700 text-white">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
          Business Case Summary
        </h2>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div>
            <span className="text-sm opacity-80">Client:</span>
            <p className="font-semibold">{data.companyName || "—"}</p>
          </div>
          <div>
            <span className="text-sm opacity-80">Department:</span>
            <p className="font-semibold">
              {Array.isArray(data.department)
                ? data.department.join(", ")
                : data.department || "—"}
            </p>
          </div>
        </div>
        <div className="border-t border-white/20 pt-4 space-y-2 text-sm">
          <p>
            <strong>Problem:</strong> {data.biggestChallenge || "—"}
          </p>
          <p>
            <strong>Impact:</strong>{" "}
            {Array.isArray(data.currentImpact)
              ? data.currentImpact.join(", ")
              : data.currentImpact || "—"}
          </p>
          <p>
            <strong>If solved, this enables:</strong>{" "}
            {data.enableIfSolved || "—"}
          </p>
        </div>
        <div className="border-t border-white/20 pt-4 space-y-2 text-sm mt-4">
          <p>
            <strong>Strategic Priority:</strong> {data.strategicPriority || "—"}
          </p>
          <p>
            <strong>Stakeholders:</strong>{" "}
            {(data.stakeholders || []).join(", ") || "—"}
          </p>
          <p>
            <strong>Cost of Inaction (Annual):</strong>{" "}
            {formatCurrency(data.costOfInaction)}
          </p>
        </div>
      </Card>

      // Pricing Breakdown
      <Card className="p-4 sm:p-6 bg-white border-2 border-[#FFC72F]">
        <h2 className="text-xl sm:text-2xl font-bold text-[#2E4059] mb-3 sm:mb-4">
          Pricing Breakdown
        </h2>
        <div className="space-y-2">
          <div className="flex justify-between py-2 border-b">
            <span className="text-xs sm:text-sm md:text-base text-slate-600">
              Program(s) Base Cost
            </span>
            <span className="font-semibold text-[#2E4059]">
              {formatCurrency(evals.baseCost)}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-xs sm:text-sm md:text-base text-slate-600">
              Add-ons (variable + flat)
            </span>
            <span className="font-semibold text-[#2E4059]">
              {formatCurrency(evals.addOnsTotal)}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-xs sm:text-sm md:text-base text-slate-600">
              Urgency Multiplier
            </span>
            <span className="font-semibold text-[#2E4059]">
              {urgencyMap[data.urgency] || 1}×
            </span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-xs sm:text-sm md:text-base text-slate-600">
              Consulting Add-on
            </span>
            <span className="font-semibold text-[#2E4059]">
              {formatCurrency(evals.consultingCost)}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 mt-4 pt-3 border-t-2 border-[#2E4059]">
            <span className="text-base sm:text-lg font-bold text-[#2E4059]">
              Total Investment
            </span>
            <span className="text-xl sm:text-2xl font-bold text-[#FFC72F]">
              {formatCurrency(evals.totalInvestment)}
            </span>
          </div>
        </div>
      </Card>

      // ROI Section
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6 bg-white">
          <h2 className="text-xl sm:text-2xl font-bold text-[#2E4059] mb-3 sm:mb-4">
            ROI & Payback (Annualized)
          </h2>
          <div className="space-y-3">
            <div>
              <span className="text-sm sm:text-base text-slate-600">
                Annual Benefit (Expected)
              </span>
              <p className="text-xl sm:text-2xl font-bold text-[#2E4059]">
                {formatCurrency(evals.annualBenefit.expected)}
              </p>
            </div>
            <div>
              <span className="text-sm sm:text-base text-slate-600">
                ROI % (Expected)
              </span>
              <p
                className={`text-xl sm:text-2xl font-bold ${
                  (evals.roi.expected || 0) >= 0.5
                    ? "text-green-600"
                    : (evals.roi.expected || 0) >= 0.2
                    ? "text-[#FFC72F]"
                    : "text-red-600"
                }`}
              >
                {formatPercent(evals.roi.expected)}
              </p>
            </div>
            <div>
              <span className="text-slate-600">Payback (months)</span>
              <p className="text-xl font-semibold text-[#2E4059]">
                {evals.payback.expected?.toFixed(1) || "—"}
              </p>
            </div>
            <div className="border-t pt-4 mt-4">
              <p className="font-semibold text-[#2E4059] mb-2">Scenarios</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Conservative ROI</span>
                  <span
                    className={`font-semibold ${
                      (evals.roi.conservative || 0) >= 0.5
                        ? "text-green-600"
                        : (evals.roi.conservative || 0) >= 0.2
                        ? "text-[#FFC72F]"
                        : "text-red-600"
                    }`}
                  >
                    {formatPercent(evals.roi.conservative)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Expected ROI</span>
                  <span
                    className={`font-semibold ${
                      (evals.roi.expected || 0) >= 0.5
                        ? "text-green-600"
                        : (evals.roi.expected || 0) >= 0.2
                        ? "text-[#FFC72F]"
                        : "text-red-600"
                    }`}
                  >
                    {formatPercent(evals.roi.expected)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Optimistic ROI</span>
                  <span
                    className={`font-semibold ${
                      (evals.roi.optimistic || 0) >= 0.5
                        ? "text-green-600"
                        : (evals.roi.optimistic || 0) >= 0.2
                        ? "text-[#FFC72F]"
                        : "text-red-600"
                    }`}
                  >
                    {formatPercent(evals.roi.optimistic)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 bg-white">
          <h2 className="text-xl sm:text-2xl font-bold text-[#2E4059] mb-3 sm:mb-4">
            ROI Scenario Chart
          </h2>
          <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
            <div className="text-center text-slate-500">
              <p className="font-semibold mb-2">ROI Comparison</p>
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>
                    Conservative: {formatPercent(evals.roi.conservative)}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 bg-[#FFC72F] rounded"></div>
                  <span>Expected: {formatPercent(evals.roi.expected)}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Optimistic: {formatPercent(evals.roi.optimistic)}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      // Proposal Narrative
      <Card className="p-6 bg-white">
        <h2 className="text-2xl font-bold text-[#2E4059] mb-4">
          Proposal-Ready Narrative
        </h2>
        <p className="text-slate-700 leading-relaxed">{makeNarrative()}</p>
      </Card>
    </div>
  );
}
*/
// ============================================
// END OF ALL COMMENTED CODE
// ============================================
