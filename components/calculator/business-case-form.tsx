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
  isRegisteredBusiness: string; // "Yes" | "No"
  tinNumber: string;
  physicalAddress: string;
  officeNumber: string;
  subcity: string;
  placeName: string;
  region: string;
  biggestChallenge: string;
  kpiPain: string[]; // Changed to array for multi-select
  rootCause: string;
  enableIfSolved: string;
  currentImpact: string[]; // Changed to array for multi-select
  urgency: string;

  // Step 1 - Strategic Alignment
  hasStrategicAlignment: string; // "Yes" | "No"
  strategicPriority: string;
  stakeholders: string[];
  csuiteDetails: string;
  departmentHeadsDetails: string;
  frontlineManagersDetails: string;
  employeesDetails: string;
  costOfInaction: number;
  strategyTimeline: string;
  alignmentNarrative: string;

  // Step 2 - Dept & Goals
  department: string[]; // Changed to array for multi-select
  trainingGoal: string[]; // Changed to array for multi-select
  customGoal: string;
  behaviorGoal: string;
  competencyRequired: string;
  knowledgeSkills: string;

  // Step 3 - Program Selection
  programGroup: string[]; // Changed to array for multi-select
  programName: string[]; // Changed to array for multi-select
  additionalTrainingTitle: string;
  softSkillSelections: string[];
  durationOverrideHours: string;
  consultingAddOn: boolean;
  consultingType: string;

  // Step 4 - Metrics & Impact
  metricName: string;
  currentMetric: string;
  targetMetric: string;
  estProductivityGain: string;
  estRetentionImprovement: string;
  directCostSavingPerPerson: string;
  successLooksLike: string;
  observableChanges: string;

  // Step 5 - Org Details & Budget
  participants: number;
  avgMonthlySalary: number;
  totalEmployees: number;
  industry: string;
  trainingFormat: string[]; // Changed to array for multi-select
  annualBudget: number;
  annualHoursPerEmployee: number;
  initiativesPerYear: number;
  devHoursPerTrainingHour: number;
  lndStaff: number;
  trainerHourlyRate: number;
  deliveryFrequency: string;

  // Add-ons
  addPreAssess: boolean;
  addCoaching: boolean;
  addPrinted: boolean;
  addDigital: boolean;
  addVenue: boolean;
}

const initialData: BusinessCaseData = {
  companyName: "",
  contactName: "",
  phone: "",
  email: "",
  isRegisteredBusiness: "",
  tinNumber: "",
  physicalAddress: "",
  officeNumber: "",
  subcity: "",
  placeName: "",
  region: "",
  biggestChallenge: "",
  kpiPain: [],
  rootCause: "",
  enableIfSolved: "",
  currentImpact: [],
  urgency: "Standard (4+ weeks lead time)",
  hasStrategicAlignment: "",
  strategicPriority: "",
  stakeholders: [],
  csuiteDetails: "",
  departmentHeadsDetails: "",
  frontlineManagersDetails: "",
  employeesDetails: "",
  costOfInaction: 0,
  strategyTimeline: "",
  alignmentNarrative: "",
  department: [],
  trainingGoal: [],
  customGoal: "",
  behaviorGoal: "",
  competencyRequired: "",
  knowledgeSkills: "",
  programGroup: [],
  programName: [],
  additionalTrainingTitle: "",
  softSkillSelections: [],
  durationOverrideHours: "",
  consultingAddOn: false,
  consultingType: "",
  metricName: "",
  currentMetric: "",
  targetMetric: "",
  estProductivityGain: "",
  estRetentionImprovement: "",
  directCostSavingPerPerson: "",
  successLooksLike: "",
  observableChanges: "",
  participants: 0,
  avgMonthlySalary: 0,
  totalEmployees: 0,
  industry: "",
  trainingFormat: [],
  annualBudget: 0,
  annualHoursPerEmployee: 0,
  initiativesPerYear: 0,
  devHoursPerTrainingHour: 0,
  lndStaff: 0,
  trainerHourlyRate: 0,
  deliveryFrequency: "One-time",
  addPreAssess: false,
  addCoaching: false,
  addPrinted: false,
  addDigital: false,
  addVenue: false,
};

const stepDefs = [
  { key: "companyInfo", title: "Company Information", number: 1 },
  { key: "problemContext", title: "Problem & Context", number: 2 },
  { key: "align", title: "Strategic Alignment", number: 3 },
  { key: "deptGoals", title: "Department & Goals", number: 4 },
  { key: "program", title: "Solution Mapping", number: 5 },
  { key: "metrics", title: "Metrics & Impact", number: 6 },
  { key: "org", title: "Organization Details", number: 7 },
  { key: "budget", title: "Training & Budget", number: 8 },
  { key: "pricing", title: "Pricing & ROI", number: 9 },
];

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
        if (!data.email.trim()) stepErrors.push("Company Email is required");
        if (!data.isRegisteredBusiness)
          stepErrors.push("Business registration status is required");
        if (data.isRegisteredBusiness === "Yes" && !data.tinNumber.trim())
          stepErrors.push("TIN Number is required for registered businesses");
        break;

      case 1: // Problem & Context
        if (!data.biggestChallenge.trim())
          stepErrors.push("Biggest Challenge is required");
        if (!data.kpiPain || data.kpiPain.length === 0)
          stepErrors.push("At least one KPI Pain is required");
        if (!data.rootCause.trim()) stepErrors.push("Root Cause is required");
        if (!data.enableIfSolved.trim())
          stepErrors.push("Enable If Solved is required");
        if (!data.currentImpact || data.currentImpact.length === 0)
          stepErrors.push("At least one Current Impact is required");
        break;

      case 2: // Strategic Alignment
        if (!data.hasStrategicAlignment) {
          stepErrors.push(
            "Please select Yes or No for Strategic Goal Alignment"
          );
        } else if (data.hasStrategicAlignment === "Yes") {
          if (!data.strategicPriority)
            stepErrors.push("Strategic Priority is required");
          if (!data.costOfInaction || data.costOfInaction <= 0)
            stepErrors.push("Cost of Inaction must be greater than 0");
          if (!data.strategyTimeline)
            stepErrors.push("Strategic Timeline is required");
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

      case 3: // Dept & Goals
        if (!data.department || data.department.length === 0)
          stepErrors.push("At least one Department is required");
        if (
          (!data.trainingGoal || data.trainingGoal.length === 0) &&
          !data.customGoal.trim()
        )
          stepErrors.push("Training Goal or Custom Goal is required");
        if (!data.behaviorGoal.trim())
          stepErrors.push("Behavior Goal is required");
        break;

      case 4: // Program Selection
        if (
          (!data.programName || data.programName.length === 0) &&
          !data.additionalTrainingTitle.trim() &&
          (!data.softSkillSelections || data.softSkillSelections.length === 0)
        ) {
          stepErrors.push(
            "Please select a Program, enter Additional Training Title, or select at least one Soft Skill"
          );
        }
        if (data.consultingAddOn && !data.consultingType) {
          stepErrors.push(
            "Consulting Type is required when Consulting Add-on is selected"
          );
        }
        break;

      case 5: // Metrics & Impact
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
        if (!data.successLooksLike.trim())
          stepErrors.push("Success Looks Like is required");
        break;

      case 6: // Org Details
        if (!data.participants || data.participants <= 0)
          stepErrors.push(
            "Number of Participants is required and must be greater than 0"
          );
        if (!data.avgMonthlySalary || data.avgMonthlySalary <= 0)
          stepErrors.push(
            "Average Monthly Salary is required and must be greater than 0"
          );
        if (!data.totalEmployees || data.totalEmployees <= 0)
          stepErrors.push(
            "Total Employees is required and must be greater than 0"
          );
        if (!data.industry) stepErrors.push("Industry is required");
        break;

      case 7: // Budget - no validation needed (add-ons are optional)
        break;

      case 8: // Pricing - no validation needed (read-only)
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
        return <BudgetStep data={data} updateData={updateData} />;
      case 8:
        return <PricingStep data={data} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#2E4059] mb-2">
            Sew Asset — Strategic Business Case Builder
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            A story-driven, problem-first Pricing & ROI calculator that turns
            cost discussions into strategic investments.
          </p>
        </div>

        {/* Step Pills */}
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

        {/* Form Content */}
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

        {/* Navigation Bar */}
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

      {/* Thank You Dialog */}
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

// Step Components
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
      {/* Data Accuracy Warning */}
      <Card className="p-4 bg-yellow-50 border-yellow-200 border-2 mb-4 sm:mb-6">
        <div className="flex items-start gap-3">
          <div className="text-yellow-600 font-bold text-lg">⚠️</div>
          <div className="flex-1">
            <p className="text-sm sm:text-base font-semibold text-yellow-800 mb-1">
              Important Notice
            </p>
            <p className="text-xs sm:text-sm text-yellow-700">
              Please make sure you input the correct data because your report
              will be sent personally to your office and our team will be in
              contact with you. If you provide accurate information, you will
              get accurate results.
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
          <Label className="text-[#2E4059] font-semibold">Phone Number</Label>
          <Input
            type="tel"
            value={data.phone}
            onChange={(e) => updateData("phone", e.target.value)}
            className="mt-1"
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
            Are you a legally Registered business in Ethiopia?{" "}
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
              TIN Number <span className="text-red-500">*</span>
            </Label>
            <Input
              value={data.tinNumber}
              onChange={(e) => updateData("tinNumber", e.target.value)}
              className="mt-1"
              placeholder="Enter TIN Number"
            />
          </div>
        )}
        <div>
          <Label className="text-[#2E4059] font-semibold">
            Physical Address
          </Label>
          <Input
            value={data.physicalAddress}
            onChange={(e) => updateData("physicalAddress", e.target.value)}
            className="mt-1"
            placeholder="Enter physical address"
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
          <Label className="text-[#2E4059] font-semibold">Subcity</Label>
          <Input
            value={data.subcity}
            onChange={(e) => updateData("subcity", e.target.value)}
            className="mt-1"
            placeholder="Enter subcity"
          />
        </div>
        <div>
          <Label className="text-[#2E4059] font-semibold">Place Name</Label>
          <Input
            value={data.placeName}
            onChange={(e) => updateData("placeName", e.target.value)}
            className="mt-1"
            placeholder="Enter place name"
          />
        </div>
        <div>
          <Label className="text-[#2E4059] font-semibold">Region</Label>
          <Input
            value={data.region}
            onChange={(e) => updateData("region", e.target.value)}
            className="mt-1"
            placeholder="Enter region"
          />
        </div>
      </div>
      <div className="mt-6 sm:mt-8">
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
      <h2 className="text-xl sm:text-2xl font-bold text-[#2E4059] mb-3 sm:mb-4">
        Problem & Context
      </h2>
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
            Root cause (client view): why is this happening?{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Textarea
            value={data.rootCause}
            onChange={(e) => updateData("rootCause", e.target.value)}
            className="mt-1 min-h-[100px]"
            required
          />
        </div>
        <div>
          <Label className="text-[#2E4059] font-semibold">
            If solved, what would this enable your company to do?{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Textarea
            value={data.enableIfSolved}
            onChange={(e) => updateData("enableIfSolved", e.target.value)}
            className="mt-1 min-h-[100px]"
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
      <h2 className="text-xl sm:text-2xl font-bold text-[#2E4059] mb-3 sm:mb-4">
        Strategic Alignment
      </h2>
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
                Cost of Inaction (Annual, ETB){" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                value={data.costOfInaction || ""}
                onChange={(e) =>
                  updateData("costOfInaction", parseFloat(e.target.value) || 0)
                }
                className="mt-1"
              />
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
                  <SelectItem value="Next 12 months">Next 12 months</SelectItem>
                  <SelectItem value="1–3 years">1–3 years</SelectItem>
                </SelectContent>
              </Select>
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

          {/* Conditional fields for specific stakeholders */}
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
    // Clear training goals when departments change
    updateData("trainingGoal", []);
  };

  const toggleTrainingGoal = (goal: string) => {
    const current = Array.isArray(data.trainingGoal) ? data.trainingGoal : [];
    const updated = current.includes(goal)
      ? current.filter((g) => g !== goal)
      : [...current, goal];
    updateData("trainingGoal", updated);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-[#2E4059] mb-3 sm:mb-4">
        Department & Training Goals
      </h2>
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
        <div>
          <Label className="text-[#2E4059] font-semibold">
            Custom Goal (optional)
          </Label>
          <Input
            value={data.customGoal}
            onChange={(e) => updateData("customGoal", e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
      <div>
        <Label className="text-[#2E4059] font-semibold">
          Behavior Goal (what behaviors should change?){" "}
          <span className="text-red-500">*</span>
        </Label>
        <Textarea
          value={data.behaviorGoal}
          onChange={(e) => updateData("behaviorGoal", e.target.value)}
          className="mt-1 min-h-[100px]"
        />
      </div>
      <div>
        <Label className="text-[#2E4059] font-semibold">
          Competency Required
        </Label>
        <Textarea
          value={data.competencyRequired}
          onChange={(e) => updateData("competencyRequired", e.target.value)}
          className="mt-1 min-h-[100px]"
        />
      </div>
      <div>
        <Label className="text-[#2E4059] font-semibold">
          Specific Knowledge & Skills Required
        </Label>
        <Textarea
          value={data.knowledgeSkills}
          onChange={(e) => updateData("knowledgeSkills", e.target.value)}
          className="mt-1 min-h-[100px]"
        />
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
  const groups = [...new Set(programs.map((p) => p.group))];
  const selectedGroups = Array.isArray(data.programGroup)
    ? data.programGroup
    : [];

  // Get all programs from all selected groups
  const allPrograms = selectedGroups.reduce((acc: string[], grp: string) => {
    const groupPrograms = programs
      .filter((p) => p.group === grp)
      .map((p) => p.name);
    return [...acc, ...groupPrograms];
  }, []);
  const uniquePrograms = [...new Set(allPrograms)];

  const softTitles = softSkills.map((s) => s.title);

  const toggleProgramGroup = (grp: string) => {
    const current = Array.isArray(data.programGroup) ? data.programGroup : [];
    const updated = current.includes(grp)
      ? current.filter((g) => g !== grp)
      : [...current, grp];
    updateData("programGroup", updated);
    // Clear program names when groups change
    updateData("programName", []);
  };

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
      <h2 className="text-xl sm:text-2xl font-bold text-[#2E4059] mb-3 sm:mb-4">
        Solution Mapping — Programs
      </h2>
      <div className="space-y-4 sm:space-y-6">
        <div>
          <Label className="text-[#2E4059] font-semibold">
            Program Group (Select multiple)
          </Label>
          <div className="flex flex-wrap gap-3 mt-2 p-3 border border-slate-200 rounded-lg bg-slate-50">
            {groups.map((grp) => (
              <div key={grp} className="flex items-center space-x-2">
                <Checkbox
                  id={`group-${grp}`}
                  checked={selectedGroups.includes(grp)}
                  onCheckedChange={() => toggleProgramGroup(grp)}
                />
                <Label
                  htmlFor={`group-${grp}`}
                  className="font-normal cursor-pointer text-sm"
                >
                  {grp}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Label className="text-[#2E4059] font-semibold">
            Program Name (Select multiple - shows programs from all selected
            groups)
          </Label>
          <div className="flex flex-wrap gap-3 mt-2 p-3 border border-slate-200 rounded-lg bg-slate-50 min-h-[100px]">
            {selectedGroups.length === 0 ? (
              <p className="text-sm text-slate-500">
                Please select at least one program group first
              </p>
            ) : (
              uniquePrograms.map((name) => (
                <div key={name} className="flex items-center space-x-2">
                  <Checkbox
                    id={`program-${name}`}
                    checked={
                      Array.isArray(data.programName) &&
                      data.programName.includes(name)
                    }
                    onCheckedChange={() => toggleProgramName(name)}
                  />
                  <Label
                    htmlFor={`program-${name}`}
                    className="font-normal cursor-pointer text-sm"
                  >
                    {name}
                  </Label>
                </div>
              ))
            )}
          </div>
        </div>
        <div>
          <Label className="text-[#2E4059] font-semibold">
            Additional training title request (free text)
          </Label>
          <Input
            value={data.additionalTrainingTitle}
            onChange={(e) =>
              updateData("additionalTrainingTitle", e.target.value)
            }
            className="mt-1"
          />
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
        </div>
      </div>

      <div className="mt-6 sm:mt-8">
        <h3 className="text-lg sm:text-xl font-bold text-[#2E4059] mb-3 sm:mb-4">
          Add Individual Soft Skill Modules
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
          {softTitles.map((title) => (
            <div key={title} className="flex items-center space-x-2">
              <Checkbox
                id={`softskill-${title}`}
                checked={data.softSkillSelections?.includes(title) || false}
                onCheckedChange={() => toggleSoftSkill(title)}
              />
              <Label
                htmlFor={`softskill-${title}`}
                className="font-normal cursor-pointer text-sm"
              >
                {title}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 sm:mt-8">
        <h3 className="text-lg sm:text-xl font-bold text-[#2E4059] mb-3 sm:mb-4">
          Consulting Add-on
        </h3>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="consultingAddOn"
              checked={data.consultingAddOn}
              onCheckedChange={(checked) => {
                updateData("consultingAddOn", checked);
                if (!checked) updateData("consultingType", "");
              }}
            />
            <Label
              htmlFor="consultingAddOn"
              className="font-normal cursor-pointer"
            >
              Include Consulting?
            </Label>
          </div>
          {data.consultingAddOn && (
            <div>
              <Label className="text-[#2E4059] font-semibold">
                Consulting Type
              </Label>
              <Select
                value={data.consultingType}
                onValueChange={(v) => updateData("consultingType", v)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Competency Framework">
                    Competency Framework
                  </SelectItem>
                  <SelectItem value="Skill Matrix">Skill Matrix</SelectItem>
                  <SelectItem value="Org Design">Org Design</SelectItem>
                  <SelectItem value="Change Management">
                    Change Management
                  </SelectItem>
                  <SelectItem value="Coaching Systems">
                    Coaching Systems
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricsStep({
  data,
  updateData,
}: {
  data: BusinessCaseData;
  updateData: (field: keyof BusinessCaseData, value: any) => void;
}) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-[#2E4059] mb-3 sm:mb-4">
        Performance Metrics & Impact
      </h2>
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <Label className="text-[#2E4059] font-semibold">
            Primary Metric Name (e.g., Attrition %, Conversion %){" "}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            value={data.metricName}
            onChange={(e) => updateData("metricName", e.target.value)}
            className="mt-1"
          />
        </div>
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
        <div>
          <Label className="text-[#2E4059] font-semibold">
            Estimated Productivity Gain (%)
          </Label>
          <Input
            type="number"
            value={data.estProductivityGain}
            onChange={(e) => updateData("estProductivityGain", e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-[#2E4059] font-semibold">
            Employee Retention Improvement (%)
          </Label>
          <Input
            type="number"
            value={data.estRetentionImprovement}
            onChange={(e) =>
              updateData("estRetentionImprovement", e.target.value)
            }
            className="mt-1"
          />
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
        </div>
      </div>
      <div>
        <Label className="text-[#2E4059] font-semibold">
          Success will look like… <span className="text-red-500">*</span>
        </Label>
        <Textarea
          value={data.successLooksLike}
          onChange={(e) => updateData("successLooksLike", e.target.value)}
          className="mt-1 min-h-[100px]"
        />
      </div>
      <div>
        <Label className="text-[#2E4059] font-semibold">
          Observable changes we expect…
        </Label>
        <Textarea
          value={data.observableChanges}
          onChange={(e) => updateData("observableChanges", e.target.value)}
          className="mt-1 min-h-[100px]"
        />
      </div>
      <Card className="p-4 bg-slate-50 border-slate-200">
        <p className="text-sm text-slate-600">
          <strong>Tip:</strong> If productivity/retention improvements are left
          blank, we will auto-apply department benchmarks.
        </p>
      </Card>
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
  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-[#2E4059] mb-3 sm:mb-4">
        Organization Details
      </h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <div>
          <Label className="text-[#2E4059] font-semibold">
            # Participants <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            value={data.participants || ""}
            onChange={(e) =>
              updateData("participants", parseFloat(e.target.value) || 0)
            }
            className="mt-1"
          />
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
        </div>
        <div>
          <Label className="text-[#2E4059] font-semibold">
            Total Employees <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            value={data.totalEmployees || ""}
            onChange={(e) =>
              updateData("totalEmployees", parseFloat(e.target.value) || 0)
            }
            className="mt-1"
          />
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
            Training Format (Select multiple)
          </Label>
          <div className="flex flex-wrap gap-3 mt-2 p-3 border border-slate-200 rounded-lg bg-slate-50">
            {[
              "Instructor-Led Training (ILT)",
              "eLearning / Online Courses",
              "Blended Learning",
              "Microlearning",
              "Video-Based Learning",
              "Coaching/Mentoring",
              "Simulations (VR/AR or Scenario-Based)",
              "Gamified Learning",
              "Social Learning",
              "On-the-Job Training (OJT)",
            ].map((format) => (
              <div key={format} className="flex items-center space-x-2">
                <Checkbox
                  id={`format-${format}`}
                  checked={
                    Array.isArray(data.trainingFormat) &&
                    data.trainingFormat.includes(format)
                  }
                  onCheckedChange={(checked) => {
                    const current = Array.isArray(data.trainingFormat)
                      ? data.trainingFormat
                      : [];
                    const updated = checked
                      ? [...current, format]
                      : current.filter((f) => f !== format);
                    updateData("trainingFormat", updated);
                  }}
                />
                <Label
                  htmlFor={`format-${format}`}
                  className="font-normal cursor-pointer text-sm"
                >
                  {format}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Label className="text-[#2E4059] font-semibold">
            Annual Training Budget (ETB)
          </Label>
          <Input
            type="number"
            value={data.annualBudget || ""}
            onChange={(e) =>
              updateData("annualBudget", parseFloat(e.target.value) || 0)
            }
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-[#2E4059] font-semibold">
            Annual training hours per employee
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
        </div>
        <div>
          <Label className="text-[#2E4059] font-semibold">
            # of distinct training initiatives planned annually
          </Label>
          <Input
            type="number"
            value={data.initiativesPerYear || ""}
            onChange={(e) =>
              updateData("initiativesPerYear", parseFloat(e.target.value) || 0)
            }
            className="mt-1"
          />
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
        </div>
        <div>
          <Label className="text-[#2E4059] font-semibold">
            Total L&D staff (trainers/designers/facilitators)
          </Label>
          <Input
            type="number"
            value={data.lndStaff || ""}
            onChange={(e) =>
              updateData("lndStaff", parseFloat(e.target.value) || 0)
            }
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-[#2E4059] font-semibold">
            Trainer hourly rate (ETB)
          </Label>
          <Input
            type="number"
            value={data.trainerHourlyRate || ""}
            onChange={(e) =>
              updateData("trainerHourlyRate", parseFloat(e.target.value) || 0)
            }
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-[#2E4059] font-semibold">
            Delivery frequency
          </Label>
          <Select
            value={data.deliveryFrequency}
            onValueChange={(v) => updateData("deliveryFrequency", v)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="One-time">One-time</SelectItem>
              <SelectItem value="Quarterly">Quarterly</SelectItem>
              <SelectItem value="Bi-annually">Bi-annually</SelectItem>
              <SelectItem value="Annually">Annually</SelectItem>
              <SelectItem value="Ongoing">Ongoing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

function BudgetStep({
  data,
  updateData,
}: {
  data: BusinessCaseData;
  updateData: (field: keyof BusinessCaseData, value: any) => void;
}) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-[#2E4059] mb-3 sm:mb-4">
        Training Add-ons
      </h2>
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="addPreAssess"
            checked={data.addPreAssess}
            onCheckedChange={(checked) => updateData("addPreAssess", checked)}
          />
          <Label htmlFor="addPreAssess" className="font-normal cursor-pointer">
            Pre-assessment (+5,000 ETB per participant)
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="addCoaching"
            checked={data.addCoaching}
            onCheckedChange={(checked) => updateData("addCoaching", checked)}
          />
          <Label htmlFor="addCoaching" className="font-normal cursor-pointer">
            Post-program coaching (+15,000 ETB per participant)
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="addPrinted"
            checked={data.addPrinted}
            onCheckedChange={(checked) => updateData("addPrinted", checked)}
          />
          <Label htmlFor="addPrinted" className="font-normal cursor-pointer">
            Printed materials/workbooks (+2,500 ETB per participant)
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="addDigital"
            checked={data.addDigital}
            onCheckedChange={(checked) => updateData("addDigital", checked)}
          />
          <Label htmlFor="addDigital" className="font-normal cursor-pointer">
            Digital learning follow-ups (+8,000 ETB per participant)
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="addVenue"
            checked={data.addVenue}
            onCheckedChange={(checked) => updateData("addVenue", checked)}
          />
          <Label htmlFor="addVenue" className="font-normal cursor-pointer">
            Venue & catering (25,000 ETB flat)
          </Label>
        </div>
      </div>
      <Card className="p-4 bg-slate-50 border-slate-200">
        <p className="text-sm text-slate-600">
          <strong>Note:</strong> Urgency automatically applies a surcharge
          (Priority +15%, Rush +25%).
        </p>
      </Card>
    </div>
  );
}

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
          : data.trainingGoal || data.customGoal || "—"
      }") to the selected programs, with expected ROI of ${formatPercent(
        evals.roi.expected
      )} and payback in ${evals.payback.expected?.toFixed(1) || "—"} months.`,
      `Success will look like: ${
        data.successLooksLike || "—"
      }. Observable behavior changes: ${data.observableChanges || "—"}.`,
    ].join(" ");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Business Case Summary */}
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

      {/* Pricing Breakdown */}
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

      {/* ROI Section */}
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

      {/* Proposal Narrative */}
      <Card className="p-6 bg-white">
        <h2 className="text-2xl font-bold text-[#2E4059] mb-4">
          Proposal-Ready Narrative
        </h2>
        <p className="text-slate-700 leading-relaxed">{makeNarrative()}</p>
      </Card>
    </div>
  );
}
