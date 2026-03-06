"use client";

import { useState, useEffect } from "react";
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
import { Info, Search, X, Clock, Star, Sparkles } from "lucide-react";
import { allTrainingTopics, categoryMap, goalMap, type TrainingTopic } from "@/lib/training-topics-data";

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
  // Step 2.5: Topic Selection
  selectedTopics: string[];
  customTopicRequest?: string;
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
  selectedTopics: [],
};

export function TrainingFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<TrainingData>(initialData);
  const [errors, setErrors] = useState<Record<number, string[]>>({});
  
  // Topic Selector state
  const [searchQuery, setSearchQuery] = useState("");
  const [aiRecommendedIds, setAiRecommendedIds] = useState<string[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [filteredTopics, setFilteredTopics] = useState<TrainingTopic[]>([]);

  const totalSteps = 5; // Updated to include Topic Selector

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

    if (step === 2.5) {
      if (data.selectedTopics.length === 0 && !data.customTopicRequest?.trim()) {
        stepErrors.push(
          "Choose at least one topic or describe a custom request for a tailored plan."
        );
      }
      if (data.selectedTopics.length > 12) {
        // Soft warning, but allow continuation
        console.warn("Large training portfolio selected");
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
      // Check if we need to show Topic Selector
      if (currentStep === 3) {
        // Check if categories require topic selection
        const requiresTopics = data.trainingSupport.some(support => 
          ['soft-skill', 'technical-hard-skill', 'leadership-management', 'industry-specific', 'compliance-mandatory'].includes(support)
        );
        
        if (requiresTopics && data.trainingSupport.length > 0) {
          // Show Topic Selector (step 2.5)
          setCurrentStep(2.5);
          // Fetch recommendations
          fetchRecommendations();
        } else {
          // Skip to Personal Info
          setCurrentStep(4);
        }
      } else if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      if (currentStep === 4) {
        // Check if we came from Topic Selector
        const requiresTopics = data.trainingSupport.some(support => 
          ['soft-skill', 'technical-hard-skill', 'leadership-management', 'industry-specific', 'compliance-mandatory'].includes(support)
        );
        if (requiresTopics) {
          setCurrentStep(2.5);
        } else {
          setCurrentStep(3);
        }
      } else if (currentStep === 2.5) {
        setCurrentStep(3);
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  // Fetch AI recommendations
  const fetchRecommendations = async () => {
    setIsLoadingAI(true);
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trainingSupport: data.trainingSupport,
          outcomes: data.outcomes,
          trainingAudience: data.trainingAudience,
          department: data.department,
          specificNotes: data.specificNotes,
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        setAiRecommendedIds(result.recommendations?.slice(0, 5).map((t: any) => t.id) || []);
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      // Fallback: use rule-based recommendations
      getRuleBasedRecommendations();
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Rule-based fallback recommendations
  const getRuleBasedRecommendations = () => {
    const categoryMap: Record<string, string[]> = {
      'soft-skill': ['C1'],
      'technical-hard-skill': ['C2'],
      'behavior-mindset': ['C3'],
      'leadership-management': ['C4'],
      'compliance-mandatory': ['C5'],
      'team-culture': ['C6'],
      'industry-specific': ['C7'],
      'motivation-engagement': ['C8'],
    };

    const relevantCategories: string[] = [];
    data.trainingSupport.forEach(support => {
      if (categoryMap[support]) {
        relevantCategories.push(...categoryMap[support]);
      }
    });

    const filtered = allTrainingTopics.filter(topic => 
      relevantCategories.includes(topic.category_id)
    );

    // Score by goal alignment
    const goalMap: Record<string, string> = {
      'Improve team productivity': 'G1',
      'Reduce errors': 'G2',
      'Increase speed of work': 'G3',
      'Improve problem-solving': 'G4',
      'Improve communication': 'G5',
      'Improve customer service': 'G6',
      'Improve sales performance': 'G7',
      'Improve leadership capability': 'G8',
      'Improve engagement': 'G9',
      'Ensure 100% compliance': 'G10',
      'Improve technical proficiency': 'G11',
    };

    const scored = filtered.map(topic => {
      let score = 0;
      data.outcomes.forEach(outcome => {
        const goalId = goalMap[outcome];
        if (goalId) {
          const goalKey = `goal_${goalId}` as keyof TrainingTopic;
          const goalValue = topic[goalKey];
          if (typeof goalValue === 'number') {
            score += goalValue;
          }
        }
      });
      return { topic, score };
    });

    scored.sort((a, b) => b.score - a.score);
    setAiRecommendedIds(scored.slice(0, 5).map(item => item.topic.id));
  };

  // Filter topics based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTopics([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = allTrainingTopics.filter(topic => {
      const matchesName = topic.topic_name.toLowerCase().includes(query);
      const matchesDesc = topic.description.toLowerCase().includes(query);
      const matchesSub = topic.subcategory.toLowerCase().includes(query);
      const matchesCategory = categoryMap[topic.category_id]?.toLowerCase().includes(query);
      return matchesName || matchesDesc || matchesSub || matchesCategory;
    });

    setFilteredTopics(filtered.slice(0, 20)); // Limit to 20 results
  }, [searchQuery]);

  // Toggle topic selection
  const toggleTopic = (topicId: string) => {
    setData(prev => {
      const current = prev.selectedTopics || [];
      if (current.includes(topicId)) {
        return { ...prev, selectedTopics: current.filter(id => id !== topicId) };
      } else {
        return { ...prev, selectedTopics: [...current, topicId] };
      }
    });
  };

  // Get selected topics data
  const selectedTopicsData = allTrainingTopics.filter(t => data.selectedTopics.includes(t.id));
  const totalDuration = selectedTopicsData.reduce((sum, t) => sum + t.duration_hours, 0);
  const moduleCount = data.selectedTopics.length + (data.customTopicRequest?.trim() ? 1 : 0);

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
            Step {currentStep === 2.5 ? '2.5' : currentStep} of {totalSteps}
          </span>
          <span className="text-sm font-medium text-slate-600">
            {Math.round((currentStep / totalSteps) * 100)}%
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-[#FFC72F] h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep === 2.5 ? 2.5 : currentStep) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <Card className="p-6 sm:p-8 bg-white shadow-lg animate-scale-in">
        {/* Step 1: Training Support Selection */}
        {currentStep === 1 && (
          <div className="animate-fade-in-up">
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
          <div className="animate-fade-in-up">
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
          <div className="animate-fade-in-up">
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
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
                <p className="text-sm text-red-600">{errors[3][0]}</p>
              </div>
            )}
          </div>
        )}

        {/* Step 2.5: Topic Selector (3-Zone Layout) */}
        {currentStep === 2.5 && (
          <div className="animate-fade-in-up">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2E4059] mb-2">
              What specific training topics do you need?
            </h2>
            <p className="text-slate-600 mb-6">
              Choose the topics that match your needs.
            </p>

            {/* Zone 1: Smart Recommendations */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-[#FFC72F]" />
                <h3 className="text-lg font-semibold text-[#2E4059]">
                  🎯 Recommended Topics for You
                </h3>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Based on your selections, these match your goals best.
              </p>
              
              {isLoadingAI ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-pulse text-slate-500">Loading recommendations...</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {aiRecommendedIds.slice(0, 5).map(topicId => {
                    const topic = allTrainingTopics.find(t => t.id === topicId);
                    if (!topic) return null;
                    const isSelected = data.selectedTopics.includes(topicId);
                    
                    return (
                      <Card 
                        key={topicId}
                        className={`p-4 cursor-pointer transition-all duration-300 card-hover ${
                          isSelected ? 'border-[#FFC72F] bg-[#FFC72F]/10' : 'border-slate-200'
                        }`}
                        onClick={() => toggleTopic(topicId)}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleTopic(topicId)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-[#2E4059] mb-1">{topic.topic_name}</h4>
                            {topic.description && (
                              <p className="text-sm text-slate-600 mb-2 line-clamp-2">{topic.description}</p>
                            )}
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{topic.duration_hours}h</span>
                              </div>
                              <span className="px-2 py-0.5 bg-slate-100 rounded">
                                {topic.difficulty_level}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Zone 2: Full Catalog Search */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-5 h-5 text-[#2E4059]" />
                <h3 className="text-lg font-semibold text-[#2E4059]">
                  Browse All Topics
                </h3>
              </div>
              
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search topics (e.g., 'Excel', 'Customer Service', 'Safety'...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full"
                />
              </div>

              {searchQuery && (
                <div className="max-h-96 overflow-y-auto space-y-2 animate-fade-in">
                  {filteredTopics.length > 0 ? (
                    filteredTopics.map(topic => {
                      const isSelected = data.selectedTopics.includes(topic.id);
                      return (
                        <Card
                          key={topic.id}
                          className={`p-3 cursor-pointer transition-all duration-300 card-hover ${
                            isSelected ? 'border-[#FFC72F] bg-[#FFC72F]/10' : 'border-slate-200'
                          }`}
                          onClick={() => toggleTopic(topic.id)}
                        >
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleTopic(topic.id)}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-[#2E4059]">{topic.topic_name}</h4>
                                <span className="text-xs text-slate-500">
                                  {categoryMap[topic.category_id]}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-slate-500">
                                <span>{topic.subcategory}</span>
                                <span>•</span>
                                <span>{topic.duration_hours}h</span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      No topics found matching "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Zone 3: Selected Topics Summary */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-[#FFC72F]" />
                <h3 className="text-lg font-semibold text-[#2E4059]">
                  Selected Topics
                </h3>
              </div>

              {data.selectedTopics.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedTopicsData.map(topic => (
                      <div
                        key={topic.id}
                        className="flex items-center gap-2 px-3 py-2 bg-[#FFC72F]/10 border border-[#FFC72F] rounded-full animate-scale-in"
                      >
                        <span className="text-sm font-medium text-[#2E4059]">{topic.topic_name}</span>
                        <button
                          onClick={() => toggleTopic(topic.id)}
                          className="hover:bg-[#FFC72F] rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-4 h-4 text-[#2E4059]" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-600">Total Modules:</span>
                        <span className="ml-2 font-semibold text-[#2E4059]">{moduleCount}</span>
                      </div>
                      <div>
                        <span className="text-slate-600">Estimated Duration:</span>
                        <span className="ml-2 font-semibold text-[#2E4059]">{totalDuration} hours</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500">No topics selected yet</p>
              )}
            </div>

            {/* Custom Request Field */}
            <div className="mb-6">
              <Label htmlFor="customTopic">
                Can't find it? Describe a custom topic.
              </Label>
              <Textarea
                id="customTopic"
                value={data.customTopicRequest || ""}
                onChange={(e) => updateData("customTopicRequest", e.target.value)}
                placeholder="Describe your custom training need..."
                className="mt-2"
                rows={3}
                maxLength={150}
              />
              <p className="text-xs text-slate-500 mt-1">
                {(data.customTopicRequest?.length || 0)}/150 characters
              </p>
            </div>

            {errors[2.5] && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
                <p className="text-sm text-red-600">{errors[2.5][0]}</p>
              </div>
            )}

            {data.selectedTopics.length > 12 && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Large training portfolios are delivered as phased programs. You can continue, but we will structure them into stages.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Personal Information */}
        {currentStep === 4 && (
          <div className="animate-fade-in-up">
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
            className="bg-[#FFC72F] text-[#2E4059] font-bold hover:bg-[#FFC72F]/90 transition-all duration-300 hover:scale-105"
            disabled={currentStep === 2.5 && moduleCount === 0 && !data.customTopicRequest?.trim()}
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
