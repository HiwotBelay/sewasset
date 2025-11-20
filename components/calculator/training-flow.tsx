"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface TrainingData {
  // Step 1: Training Support
  trainingSupport: string[];
  // Step 2: Training Audience
  trainingAudience: string;
  teamSize?: number;
  department?: string;
  companySize?: string;
  // Step 3: Outcomes
  outcomes: string[];
  specificNotes?: string;
  // Step 4: Personal Info
  name: string;
  email: string;
  phone: string;
  country: string;
  areaOfInterest?: string;
  learningGoal?: string;
  educationLevel?: string;
  preferredFormat?: string;
}

const initialData: TrainingData = {
  trainingSupport: [],
  trainingAudience: "",
  outcomes: [],
};

export function TrainingFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<TrainingData>(initialData);
  const [errors, setErrors] = useState<Record<number, string[]>>({});

  const totalSteps = 4;

  const updateData = (field: keyof TrainingData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
    // Clear errors for this step
    if (errors[currentStep]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[currentStep];
        return newErrors;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const stepErrors: string[] = [];

    if (step === 1) {
      if (data.trainingSupport.length === 0) {
        stepErrors.push(
          "Please select at least one training support category."
        );
      }
    }

    if (step === 2) {
      if (!data.trainingAudience) {
        stepErrors.push("Please select who this training is for.");
      } else {
        if (
          (data.trainingAudience === "team" ||
            data.trainingAudience === "department") &&
          !data.teamSize
        ) {
          stepErrors.push("Please enter team size.");
        }
        if (data.trainingAudience === "department" && !data.department) {
          stepErrors.push("Please choose a department.");
        }
        if (data.trainingAudience === "organization" && !data.companySize) {
          stepErrors.push("Please select company size.");
        }
      }
    }

    if (step === 3) {
      if (data.outcomes.length === 0) {
        stepErrors.push(
          "Choose at least one outcome. It helps us give accurate recommendations."
        );
      }
    }

    if (step === 4) {
      if (!data.name) stepErrors.push("Please enter your name.");
      if (!data.email) stepErrors.push("Please enter your email.");
      if (!data.phone) stepErrors.push("Please enter your phone number.");
      if (!data.country) stepErrors.push("Please enter your country.");
    }

    if (stepErrors.length > 0) {
      setErrors((prev) => ({ ...prev, [step]: stepErrors }));
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // TODO: Submit to API
    console.log("Training data submitted:", data);
    // For now, redirect to results or thank you page
    router.push("/calculator?training=true");
  };

  const toggleTrainingSupport = (value: string) => {
    setData((prev) => {
      const current = prev.trainingSupport || [];
      if (current.includes(value)) {
        return {
          ...prev,
          trainingSupport: current.filter((item) => item !== value),
        };
      } else {
        return { ...prev, trainingSupport: [...current, value] };
      }
    });
  };

  const toggleOutcome = (value: string) => {
    setData((prev) => {
      const current = prev.outcomes || [];
      if (current.includes(value)) {
        return {
          ...prev,
          outcomes: current.filter((item) => item !== value),
        };
      } else {
        return { ...prev, outcomes: [...current, value] };
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-600">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm font-medium text-slate-600">
            {Math.round((currentStep / totalSteps) * 100)}%
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-[#FFC72F] h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <Card className="p-6 sm:p-8 bg-white shadow-lg">
        {/* Step 1: Training Support Selection */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2E4059] mb-2">
              What training support do you need right now?
            </h2>
            <p className="text-slate-600 mb-6">
              We'll guide you to the right program.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trainingSupportOptions.map((option) => (
                <div key={option.value} className="relative">
                  <button
                    onClick={() => toggleTrainingSupport(option.value)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      data.trainingSupport.includes(option.value)
                        ? "border-[#FFC72F] bg-[#FFC72F]/10"
                        : "border-slate-200 hover:border-[#FFC72F]/50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            data.trainingSupport.includes(option.value)
                              ? "border-[#FFC72F] bg-[#FFC72F]"
                              : "border-slate-300"
                          }`}
                        >
                          {data.trainingSupport.includes(option.value) && (
                            <div className="w-2.5 h-2.5 rounded-full bg-white" />
                          )}
                        </div>
                        <span className="font-semibold text-[#2E4059]">
                          {option.label}
                        </span>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-slate-400 hover:text-[#2E4059]" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>{option.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </button>
                </div>
              ))}
            </div>

            {errors[1] && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors[1][0]}</p>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Training Audience */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2E4059] mb-2">
              Who is this training for?
            </h2>
            <p className="text-slate-600 mb-6">
              We'll adjust the design based on your audience.
            </p>

            <RadioGroup
              value={data.trainingAudience}
              onValueChange={(value) => updateData("trainingAudience", value)}
              className="space-y-4"
            >
              {audienceOptions.map((option) => (
                <div key={option.value} className="space-y-2">
                  <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-slate-200 hover:border-[#FFC72F]/50">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label
                      htmlFor={option.value}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-[#2E4059]">
                            {option.label}
                          </span>
                          <p className="text-sm text-slate-500 mt-1">
                            {option.tooltip}
                          </p>
                        </div>
                      </div>
                    </Label>
                  </div>

                  {/* Conditional Fields */}
                  {data.trainingAudience === option.value &&
                    option.conditionalField && (
                      <div className="ml-8 mt-2">
                        {option.conditionalField === "teamSize" && (
                          <div>
                            <Label htmlFor="teamSize">Team size</Label>
                            <Input
                              id="teamSize"
                              type="number"
                              min="1"
                              value={data.teamSize || ""}
                              onChange={(e) =>
                                updateData("teamSize", parseInt(e.target.value))
                              }
                              placeholder="Enter number of people"
                              className="mt-1"
                            />
                          </div>
                        )}
                        {option.conditionalField === "department" && (
                          <div className="space-y-2">
                            <Label htmlFor="department">
                              Select Department
                            </Label>
                            <Select
                              value={data.department || ""}
                              onValueChange={(value) =>
                                updateData("department", value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Choose department" />
                              </SelectTrigger>
                              <SelectContent>
                                {departments.map((dept) => (
                                  <SelectItem key={dept} value={dept}>
                                    {dept}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <div>
                              <Label htmlFor="deptTeamSize">Team size</Label>
                              <Input
                                id="deptTeamSize"
                                type="number"
                                min="1"
                                value={data.teamSize || ""}
                                onChange={(e) =>
                                  updateData(
                                    "teamSize",
                                    parseInt(e.target.value)
                                  )
                                }
                                placeholder="Enter number of people"
                                className="mt-1"
                              />
                            </div>
                          </div>
                        )}
                        {option.conditionalField === "companySize" && (
                          <div>
                            <Label htmlFor="companySize">Company Size</Label>
                            <Select
                              value={data.companySize || ""}
                              onValueChange={(value) =>
                                updateData("companySize", value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select company size" />
                              </SelectTrigger>
                              <SelectContent>
                                {companySizes.map((size) => (
                                  <SelectItem key={size} value={size}>
                                    {size}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    )}
                </div>
              ))}
            </RadioGroup>

            {errors[2] && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors[2][0]}</p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Outcomes Selection */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2E4059] mb-2">
              What outcomes do you want this training to achieve?
            </h2>
            <p className="text-slate-600 mb-6">
              Select the goals that matter most.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {outcomeCategories.map((category) => (
                <div key={category.name} className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Checkbox
                      checked={data.outcomes.some((o) =>
                        category.outcomes.includes(o)
                      )}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          category.outcomes.forEach((outcome) => {
                            if (!data.outcomes.includes(outcome)) {
                              toggleOutcome(outcome);
                            }
                          });
                        } else {
                          category.outcomes.forEach((outcome) => {
                            if (data.outcomes.includes(outcome)) {
                              toggleOutcome(outcome);
                            }
                          });
                        }
                      }}
                    />
                    <Label className="font-semibold text-[#2E4059]">
                      {category.name}
                    </Label>
                  </div>
                  <div className="ml-6 space-y-2">
                    {category.outcomes.map((outcome) => (
                      <div key={outcome} className="flex items-center gap-2">
                        <Checkbox
                          checked={data.outcomes.includes(outcome)}
                          onCheckedChange={() => toggleOutcome(outcome)}
                        />
                        <Label className="text-sm text-slate-700 cursor-pointer">
                          {outcome}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Label htmlFor="specificNotes">
                Optional — any unique goals or challenges.
              </Label>
              <Textarea
                id="specificNotes"
                value={data.specificNotes || ""}
                onChange={(e) => updateData("specificNotes", e.target.value)}
                placeholder="Short notes help us personalize your training recommendation."
                className="mt-2"
                rows={4}
              />
            </div>

            {errors[3] && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors[3][0]}</p>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Personal Information */}
        {currentStep === 4 && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2E4059] mb-2">
              Your Information
            </h2>
            <p className="text-slate-600 mb-6">
              We'll use this to contact you and personalize your training
              recommendation.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Your Name *</Label>
                <Input
                  id="name"
                  value={data.name || ""}
                  onChange={(e) => updateData("name", e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">Personal Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={data.email || ""}
                  onChange={(e) => updateData("email", e.target.value)}
                  placeholder="your.email@example.com"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={data.phone || ""}
                  onChange={(e) => updateData("phone", e.target.value)}
                  placeholder="Enter your phone number"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={data.country || ""}
                  onChange={(e) => updateData("country", e.target.value)}
                  placeholder="Enter your country"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="areaOfInterest">Area of Interest</Label>
                <Input
                  id="areaOfInterest"
                  value={data.areaOfInterest || ""}
                  onChange={(e) => updateData("areaOfInterest", e.target.value)}
                  placeholder="Optional"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="learningGoal">Learning Goal</Label>
                <Select
                  value={data.learningGoal || ""}
                  onValueChange={(value) => updateData("learningGoal", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select learning goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="skill-development">
                      Skill Development
                    </SelectItem>
                    <SelectItem value="career-advancement">
                      Career Advancement
                    </SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="team-building">Team Building</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="educationLevel">Education Level</Label>
                <Select
                  value={data.educationLevel || ""}
                  onValueChange={(value) => updateData("educationLevel", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-school">High School</SelectItem>
                    <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                    <SelectItem value="master">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="preferredFormat">
                  Preferred Training Format
                </Label>
                <Select
                  value={data.preferredFormat || ""}
                  onValueChange={(value) =>
                    updateData("preferredFormat", value)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-person">In-Person</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="self-paced">Self-Paced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {errors[4] && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors[4][0]}</p>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button
            onClick={handleBack}
            disabled={currentStep === 1}
            variant="outline"
            className="disabled:opacity-50"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            className="bg-[#FFC72F] text-[#2E4059] font-bold hover:bg-[#FFC72F]/90"
          >
            {currentStep === totalSteps ? "Submit" : "Continue"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

// Data constants
const trainingSupportOptions = [
  {
    value: "soft-skill",
    label: "Soft Skill",
    tooltip:
      "Communication, teamwork, time management, conflict resolution, coaching",
  },
  {
    value: "technical-hard-skill",
    label: "Technical/Hard Skill",
    tooltip: "Software, system skills, regulatory, safety, internal policies",
  },
  {
    value: "behavior-mindset",
    label: "Behavior & Mindset",
    tooltip:
      "Accountability, professionalism, motivation, collaboration, trust, engagement, culture-building",
  },
  {
    value: "leadership-management",
    label: "Leadership & Management",
    tooltip: "Planning, delegation, coaching, conflict management",
  },
  {
    value: "compliance-mandatory",
    label: "Compliance/Mandatory",
    tooltip: "Regulatory, safety, internal policies",
  },
  {
    value: "team-culture",
    label: "Team & Culture Development",
    tooltip: "Collaboration, intelligent, trust, engagement, culture-building",
  },
  {
    value: "industry-specific",
    label: "Industry/Department Specific Skill",
    tooltip: "Sales, customer service, finance, logistics, HR, tech, etc.",
  },
  {
    value: "motivation-engagement",
    label: "Motivation & Engagement",
    tooltip: "Employee morale, inspiration sessions, mindset boost.",
  },
];

const audienceOptions = [
  {
    value: "myself",
    label: "Myself",
    tooltip: "Personal development or upskilling.",
  },
  {
    value: "team",
    label: "My Team",
    tooltip: "A group you manage or supervise.",
    conditionalField: "teamSize",
  },
  {
    value: "department",
    label: "A Department",
    tooltip: "A full functional unit.",
    conditionalField: "department",
  },
  {
    value: "organization",
    label: "Entire Organization",
    tooltip: "Company-wide training initiative.",
    conditionalField: "companySize",
  },
];

const departments = [
  "Sales",
  "Customer Service",
  "Finance",
  "HR",
  "Logistics",
  "IT",
  "Marketing",
  "Operations",
  "Compliance",
  "Other",
];

const companySizes = ["1-50", "51-200", "201-500", "501-1000", "1000+"];

const outcomeCategories = [
  {
    name: "Performance/Productivity",
    outcomes: [
      "Improve team productivity",
      "Reduce errors",
      "Increase speed of work",
      "Improve problem-solving",
    ],
  },
  {
    name: "People Skills",
    outcomes: [
      "Improve communication",
      "Improve teamwork",
      "Improve customer service",
      "Strengthen emotional intelligence",
    ],
  },
  {
    name: "Culture & Retention",
    outcomes: ["Improve engagement", "Reduce turnover", "Strengthen culture"],
  },
  {
    name: "Leadership",
    outcomes: [
      "Improve leadership capability",
      "Strengthen coaching skills",
      "Improve conflict resolution",
      "Improve decision-making",
    ],
  },
  {
    name: "Commercial Impact",
    outcomes: [
      "Improve sales performance",
      "Increase customer satisfaction",
      "Reduce complaints",
    ],
  },
  {
    name: "Technical",
    outcomes: [
      "Improve technical skill proficiency",
      "Improve digital / software skill levels",
    ],
  },
  {
    name: "Compliance",
    outcomes: ["Ensure 100% compliance", "Reduce regulatory or process errors"],
  },
];
