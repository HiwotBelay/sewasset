"use client";

import { useState, useCallback, useRef, useEffect } from "react";
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
import { 
  Info, 
  Crown, 
  MessageSquare, 
  Code, 
  Users,
  Search,
  X,
  Plus,
  Clock,
  Star,
  CheckCircle2,
  TrendingUp, 
  Sparkles,
  Brain,
  Shield,
  Target,
  Briefcase
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

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
  // Step 4: Training Topics
  selectedTopics: string[];
  customTopics: string[];
  // Step 5: Summary (no data needed, just display)
  // Step 6: Personal Info
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
  customTopics: [],
};

// Helper function to get icon for each category
function getCategoryIcon(value: string) {
  const iconMap: Record<string, any> = {
    "soft-skill": MessageSquare,
    "technical-hard-skill": Code,
    "behavior-mindset": Brain,
    "leadership-management": Crown,
    "compliance-mandatory": Shield,
    "team-culture": Users,
    "industry-specific": Briefcase,
    "motivation-engagement": Sparkles,
  };
  return iconMap[value] || Target;
}

// Helper function to get description for each category
function getCategoryDescription(value: string) {
  const descriptionMap: Record<string, string> = {
    "soft-skill": "Build interpersonal and communication excellence",
    "technical-hard-skill": "Upskill your team on modern technologies",
    "behavior-mindset": "Foster accountability, professionalism, and engagement",
    "leadership-management": "Develop effective leaders at every level",
    "compliance-mandatory": "Ensure regulatory compliance and safety standards",
    "team-culture": "Strengthen collaboration, trust, and culture-building",
    "industry-specific": "Enhance department-specific skills and expertise",
    "motivation-engagement": "Inspire and energize your workforce",
  };
  return descriptionMap[value] || "Enhance skills and capabilities";
}

// Separate component for each outcome category card - ensures complete isolation
function OutcomeCategoryCard({ 
  category, 
  hasSelected,
  selectedOutcomes,
  onToggleOutcome,
  isExpanded,
  onToggleExpand
}: {
  category: { name: string; outcomes: string[] };
  hasSelected: boolean;
  selectedOutcomes: string[];
  onToggleOutcome: (outcome: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Call parent's toggle function - each category toggles independently
    onToggleExpand();
  };
  
  return (
    <div 
      ref={cardRef}
      className={`rounded-lg border-2 transition-all ${
        hasSelected
          ? "border-[#FFC72F] bg-[#FFC72F]/10"
          : "border-slate-200 bg-white"
      }`}
    >
      {/* Main Outcome Card Button */}
      <button
        type="button"
        onClick={handleToggle}
        className={`w-full p-4 text-left transition-all flex items-center gap-3 ${
          hasSelected
            ? "bg-[#FFC72F]/10"
            : "hover:bg-slate-50"
        }`}
      >
        {/* Checkmark Icon */}
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
            hasSelected
              ? "border-[#FFC72F] bg-[#FFC72F]"
              : "border-slate-300 bg-white"
          }`}
        >
          {hasSelected && (
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7"></path>
            </svg>
          )}
        </div>
        
        {/* Category Name */}
        <span
          className={`font-medium flex-1 ${
            hasSelected ? "text-[#2E4059]" : "text-slate-700"
          }`}
        >
          {category.name}
        </span>
        
        {/* Expand/Collapse Icon */}
        <div className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          <svg
            className="w-4 h-4 text-slate-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </button>

      {/* Expanded Subcategories - Inside the same card with vertical line */}
      {isExpanded && (
        <div className="relative pb-4 animate-fade-in-up">
          {/* Vertical line connecting subcategories */}
          <div className="absolute left-[1.625rem] top-0 bottom-4 w-0.5 bg-[#FFC72F]/30"></div>
          
          <div className="pl-12 pr-4 space-y-1.5 pt-2">
            {category.outcomes.map((outcome) => {
              const isSelected = selectedOutcomes.includes(outcome);
              return (
                <button
                  type="button"
                  key={`${category.name}-${outcome}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleOutcome(outcome);
                  }}
                  className={`w-full py-2 px-2 text-left transition-all flex items-center gap-2.5 group ${
                    isSelected
                      ? "text-[#2E4059] font-medium"
                      : "text-slate-600 hover:text-slate-800"
                  }`}
                >
                  {/* Bullet/Checkmark */}
                  <div className="flex-shrink-0 relative z-10">
                    {isSelected ? (
                      <div className="w-4 h-4 rounded-full bg-[#FFC72F] flex items-center justify-center">
                        <svg
                          className="w-2.5 h-2.5 text-white"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400 group-hover:bg-[#FFC72F] transition-colors" />
                    )}
                  </div>
                  {/* Subcategory Name */}
                  <span className="text-sm">
                    {outcome}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Training Topics Data - Recommendations based on selections
interface TrainingTopic {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  // 3-Layer Taxonomy (as per spec)
  category_layer1: string; // T1 Selection (8 Categories)
  subcategory_layer2: string; // Grouping for search/filter
  topic_name: string; // The actual course title (same as title for now)
  duration_hours: number; // Module length for summary
  goal_fit_score?: Record<string, number>; // Maps topic to T2 goals (1-5)
  relatedSupport: string[];
  relatedOutcomes: string[];
}

const allTrainingTopics: TrainingTopic[] = [
  // Soft Skills Topics
  {
    id: "effective-communication",
    title: "Effective Communication",
    topic_name: "Effective Communication",
    description: "Master verbal and written communication skills",
    duration: "2 days",
    duration_hours: 16,
    difficulty: "Beginner",
    category: "Soft Skills & Communication",
    category_layer1: "Soft Skills",
    subcategory_layer2: "Communication & Interpersonal",
    goal_fit_score: {
      "Improve communication": 5,
      "Improve teamwork": 4,
      "Improve customer service": 3
    },
    relatedSupport: ["soft-skill"],
    relatedOutcomes: ["Improve communication", "Improve teamwork"]
  },
  {
    id: "team-collaboration",
    title: "Team Collaboration",
    topic_name: "Team Collaboration",
    description: "Build stronger team dynamics and collaboration",
    duration: "1 day",
    duration_hours: 8,
    difficulty: "Intermediate",
    category: "Soft Skills & Communication",
    category_layer1: "Soft Skills",
    subcategory_layer2: "Team Dynamics",
    goal_fit_score: {
      "Improve teamwork": 5,
      "Improve engagement": 4,
      "Strengthen culture": 4
    },
    relatedSupport: ["soft-skill", "team-culture"],
    relatedOutcomes: ["Improve teamwork", "Improve engagement"]
  },
  // Leadership Topics
  {
    id: "managing-teams-effectively",
    title: "Managing Teams Effectively",
    topic_name: "Managing Teams Effectively",
    description: "Core skills for middle managers",
    duration: "2 days",
    duration_hours: 16,
    difficulty: "Intermediate",
    category: "Leadership & Management",
    category_layer1: "Leadership & Management",
    subcategory_layer2: "Team Management",
    goal_fit_score: {
      "Improve leadership capability": 5,
      "Improve team productivity": 5,
      "Strengthen coaching skills": 4
    },
    relatedSupport: ["leadership-management"],
    relatedOutcomes: ["Improve leadership capability", "Improve team productivity"]
  },
  {
    id: "decision-making-uncertainty",
    title: "Decision Making Under Uncertainty",
    topic_name: "Decision Making Under Uncertainty",
    description: "Strategic decision frameworks",
    duration: "1 day",
    duration_hours: 8,
    difficulty: "Advanced",
    category: "Leadership & Management",
    category_layer1: "Leadership & Management",
    subcategory_layer2: "Strategic Leadership",
    goal_fit_score: {
      "Improve decision-making": 5,
      "Improve problem-solving": 5
    },
    relatedSupport: ["leadership-management"],
    relatedOutcomes: ["Improve decision-making", "Improve problem-solving"]
  },
  {
    id: "delegation-empowerment",
    title: "Delegation & Empowerment",
    topic_name: "Delegation & Empowerment",
    description: "Master the art of delegation",
    duration: "1 day",
    duration_hours: 8,
    difficulty: "Beginner",
    category: "Leadership & Management",
    category_layer1: "Leadership & Management",
    subcategory_layer2: "Management Fundamentals",
    goal_fit_score: {
      "Improve leadership capability": 5,
      "Strengthen coaching skills": 4,
      "Improve team productivity": 3
    },
    relatedSupport: ["leadership-management"],
    relatedOutcomes: ["Improve leadership capability", "Strengthen coaching skills"]
  },
  {
    id: "visionary-leadership",
    title: "Visionary Leadership & Change",
    topic_name: "Visionary Leadership & Change",
    description: "Leading through vision and organizational change",
    duration: "2 days",
    duration_hours: 16,
    difficulty: "Advanced",
    category: "Leadership & Management",
    category_layer1: "Leadership & Management",
    subcategory_layer2: "Executive Leadership",
    goal_fit_score: {
      "Improve leadership capability": 5
    },
    relatedSupport: ["leadership-management"],
    relatedOutcomes: ["Improve leadership capability"]
  },
  {
    id: "ethical-leadership",
    title: "Ethical Leadership & Governance",
    topic_name: "Ethical Leadership & Governance",
    description: "Ethics and governance for senior leaders",
    duration: "1 day",
    duration_hours: 8,
    difficulty: "Intermediate",
    category: "Leadership & Management",
    category_layer1: "Leadership & Management",
    subcategory_layer2: "Executive Leadership",
    goal_fit_score: {
      "Improve leadership capability": 5
    },
    relatedSupport: ["leadership-management"],
    relatedOutcomes: ["Improve leadership capability"]
  },
  {
    id: "management-identity",
    title: "Building Your Management Identity",
    topic_name: "Building Your Management Identity",
    description: "Find your management style",
    duration: "1 day",
    duration_hours: 8,
    difficulty: "Beginner",
    category: "Leadership & Management",
    category_layer1: "Leadership & Management",
    subcategory_layer2: "Management Fundamentals",
    goal_fit_score: {
      "Improve leadership capability": 5,
      "Strengthen coaching skills": 4
    },
    relatedSupport: ["leadership-management"],
    relatedOutcomes: ["Improve leadership capability", "Strengthen coaching skills"]
  },
  // Technical Skills
  {
    id: "digital-literacy",
    title: "Digital Literacy & Tools",
    topic_name: "Digital Literacy & Tools",
    description: "Essential digital skills for modern workplace",
    duration: "1 day",
    duration_hours: 8,
    difficulty: "Beginner",
    category: "Technical & Digital Skills",
    category_layer1: "Technical / Hard Skills",
    subcategory_layer2: "Digital Tools & Software",
    goal_fit_score: {
      "Improve digital / software skill levels": 5,
      "Improve technical proficiency": 5
    },
    relatedSupport: ["technical-hard-skill"],
    relatedOutcomes: ["Improve digital / software skill levels"]
  },
];

// Training Topics Step Component
function TrainingTopicsStep({ 
  data, 
  updateData,
  trainingSupport,
  outcomes 
}: {
  data: TrainingData;
  updateData: (field: keyof TrainingData, value: any) => void;
  trainingSupport: string[];
  outcomes: string[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [customTopicInput, setCustomTopicInput] = useState("");
  const [aiRecommendedIds, setAiRecommendedIds] = useState<string[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Fetch AI recommendations when selections change
  useEffect(() => {
    const fetchAIRecommendations = async () => {
      if (trainingSupport.length === 0 || outcomes.length === 0) {
        setAiRecommendedIds([]);
        return;
      }

      setIsLoadingAI(true);
      setAiError(null);

      try {
        const response = await fetch("/api/recommendations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            trainingSupport,
            outcomes,
            trainingAudience: data.trainingAudience,
            specificNotes: data.specificNotes,
          }),
        });

        const result = await response.json();

        if (result.success && result.recommendedIds) {
          setAiRecommendedIds(result.recommendedIds);
          
          // Log the source
          if (result.source === "ai") {
            console.log("✅ AI Recommendations received:", result.recommendedIds);
            setAiError(null); // Clear any previous errors
          } else {
            console.warn("⚠️ Using rule-based recommendations (AI not available)");
            setAiError("AI unavailable - using rule-based recommendations");
          }
        } else {
          // Fallback to rule-based if AI fails
          const fallback = getRuleBasedRecommendations();
          setAiRecommendedIds(fallback);
          setAiError("Using fallback recommendations");
        }
      } catch (error) {
        console.error("Error fetching AI recommendations:", error);
        // Fallback to rule-based
        const fallback = getRuleBasedRecommendations();
        setAiRecommendedIds(fallback);
        setAiError("AI service unavailable, using fallback");
      } finally {
        setIsLoadingAI(false);
      }
    };

    fetchAIRecommendations();
  }, [trainingSupport, outcomes, data.trainingAudience, data.specificNotes]);

  // Fallback rule-based recommendations (if AI not available)
  const getRuleBasedRecommendations = (): string[] => {
    return allTrainingTopics
      .filter(topic => {
        const matchesSupport = topic.relatedSupport.some(support => 
          trainingSupport.includes(support)
        );
        const matchesOutcomes = topic.relatedOutcomes.some(outcome => 
          outcomes.includes(outcome)
        );
        return matchesSupport || matchesOutcomes;
      })
      .map(topic => topic.id);
  };

  // Get recommended topics (AI-powered or fallback)
  const getRecommendedTopics = () => {
    if (aiRecommendedIds.length > 0) {
      // Use AI recommendations
      return allTrainingTopics.filter(topic => aiRecommendedIds.includes(topic.id));
    } else {
      // Fallback to rule-based
      const fallbackIds = getRuleBasedRecommendations();
      return allTrainingTopics.filter(topic => fallbackIds.includes(topic.id));
    }
  };

  const recommendedTopics = getRecommendedTopics();
  const [allTopics, setAllTopics] = useState<TrainingTopic[]>(allTrainingTopics);
  
  // Enhanced Google-like fuzzy search function
  const fuzzySearch = (query: string, text: string): boolean => {
    if (!query) return false;
    const lowerQuery = query.toLowerCase().trim();
    const lowerText = text.toLowerCase();
    
    // Exact match (highest priority)
    if (lowerText.includes(lowerQuery)) return true;
    
    // Word-by-word match
    const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 0);
    if (queryWords.length > 0) {
      const allWordsMatch = queryWords.every(word => lowerText.includes(word));
      if (allWordsMatch) return true;
    }
    
    // Fuzzy match - check if all characters appear in order
    let queryIndex = 0;
    for (let i = 0; i < lowerText.length && queryIndex < lowerQuery.length; i++) {
      if (lowerText[i] === lowerQuery[queryIndex]) {
        queryIndex++;
      }
    }
    if (queryIndex === lowerQuery.length) return true;
    
    // Partial word match
    const textWords = lowerText.split(/\s+/);
    return queryWords.some(qWord => 
      textWords.some(tWord => tWord.startsWith(qWord) || qWord.startsWith(tWord))
    );
  };
  
  // Enhanced search - searches in all relevant fields
  const searchResults = searchQuery.trim() 
    ? allTopics.filter(topic => {
        const searchFields = [
          topic.title,
          topic.description,
          topic.category,
          topic.difficulty,
          topic.duration,
          ...(topic.relatedSupport || []),
          ...(topic.relatedOutcomes || [])
        ].join(" ");
        
        return fuzzySearch(searchQuery, searchFields);
      })
    : [];

  const toggleTopic = (topicId: string) => {
    const current = data.selectedTopics || [];
    if (current.includes(topicId)) {
      updateData("selectedTopics", current.filter(id => id !== topicId));
    } else {
      updateData("selectedTopics", [...current, topicId]);
    }
  };

  const addCustomTopic = () => {
    if (customTopicInput.trim()) {
      const current = data.customTopics || [];
      updateData("customTopics", [...current, customTopicInput.trim()]);
      setCustomTopicInput("");
    }
  };

  const removeCustomTopic = (topic: string) => {
    const current = data.customTopics || [];
    updateData("customTopics", current.filter(t => t !== topic));
  };

  // Calculate selected topics data
  const selectedTopics = (data.selectedTopics || []).map(id => 
    allTrainingTopics.find(t => t.id === id)
  ).filter(Boolean) as TrainingTopic[];
  
  const selectedCount = selectedTopics.length + (data.customTopics?.length || 0);
  
  // Calculate total duration in hours
  const totalDurationHours = selectedTopics.reduce((sum, t) => {
    const hours = parseInt(t.duration.split(' ')[0]) || 0;
    return sum + hours;
  }, 0);
  
  const totalDurationDays = Math.ceil(totalDurationHours / 8); // Assuming 8 hours per day
  
  // Get recommended topics (limit to 4-5, NOT pre-checked)
  const displayRecommendedTopics = recommendedTopics
    .filter(t => !data.selectedTopics?.includes(t.id)) // Don't show already selected
    .slice(0, 5); // Show exactly 4-5 recommendations
  
  // Filter search results (exclude already selected and recommended)
  const filteredSearchResults = searchQuery.trim() 
    ? searchResults.filter(topic => {
        const notSelected = !data.selectedTopics?.includes(topic.id);
        const notInRecommended = !displayRecommendedTopics.some(rt => rt.id === topic.id);
        return notSelected && notInRecommended;
      })
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#2E4059] mb-2">
          What specific training topics do you need?
        </h2>
        <p className="text-lg text-[#6B7280]">
          Choose the topics that match your needs.
        </p>
      </div>

      {/* Loading State */}
      {isLoadingAI && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3 text-[#6B7280]">
            <span className="animate-spin rounded-full h-5 w-5 border-2 border-[#FDC700] border-t-transparent"></span>
            <span className="font-medium">AI is analyzing your needs...</span>
          </div>
        </div>
      )}

      {/* ZONE 1: SMART RECOMMENDATIONS (TOP) */}
      {!isLoadingAI && displayRecommendedTopics.length > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div>
            <h3 className="text-xl font-bold text-[#2E4059] mb-1 flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              Recommended Topics for You
            </h3>
            <p className="text-sm text-[#6B7280]">
              Based on your selections, these match your goals best.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {displayRecommendedTopics.map((topic, idx) => {
              const isSelected = data.selectedTopics?.includes(topic.id);
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => toggleTopic(topic.id)}
                  className={`group relative p-4 rounded-xl border-2 transition-all duration-300 text-left bg-white hover:shadow-lg ${
                    isSelected
                      ? "border-[#FDC700] bg-[#FDC700]/5 shadow-md"
                      : "border-slate-200 hover:border-[#FDC700]/50"
                  }`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h4 className={`font-semibold text-sm ${isSelected ? "text-[#2E4059]" : "text-[#2E4059]"}`}>
                          {topic.title}
                        </h4>
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs font-medium whitespace-nowrap">
                          <Star className="w-3 h-3 fill-green-600" />
                          Recommended
                        </span>
                      </div>
                      <p className="text-xs text-[#6B7280] mb-2 line-clamp-2">{topic.description}</p>
                      <div className="flex items-center gap-3 text-xs text-[#6B7280]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {topic.duration}
                        </span>
                        <span>{topic.difficulty}</span>
                      </div>
                    </div>
                    {/* Checkbox */}
                    <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? "border-[#FDC700] bg-[#FDC700]"
                        : "border-slate-300 group-hover:border-[#FDC700]/50"
                    }`}>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ZONE 2: FULL CATALOG SEARCH (MIDDLE) */}
      <div className="space-y-4 animate-fade-in-up delay-200">
        <div>
          <h3 className="text-xl font-bold text-[#2E4059] mb-1">
            Browse All Topics
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
            <Input
              type="text"
              placeholder="Search topics (e.g., 'Excel', 'Customer Service', 'Safety'...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 border-2 border-slate-200 focus:border-[#FDC700] rounded-xl transition-all duration-300"
            />
          </div>
        </div>

        {/* Search Results */}
        {searchQuery.trim() && (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {filteredSearchResults.length > 0 ? (
              filteredSearchResults.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => toggleTopic(topic.id)}
                  className="w-full p-3 rounded-lg border border-slate-200 hover:border-[#FDC700] hover:bg-[#FDC700]/5 transition-all duration-200 text-left group"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-[#2E4059] mb-1">{topic.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                        <span>{topic.category}</span>
                        <span>•</span>
                        <span>{topic.duration}</span>
                      </div>
                    </div>
                    <Plus className="w-4 h-4 text-[#6B7280] group-hover:text-[#FDC700] transition-colors" />
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-6 text-[#6B7280]">
                <p className="text-sm mb-2">No topics found matching "{searchQuery}"</p>
                <p className="text-xs">Try different keywords or browse all topics above</p>
              </div>
            )}
          </div>
        )}

        {/* Custom Topic Field */}
        <div className="pt-4 border-t border-slate-200">
          <p className="text-sm text-[#6B7280] mb-2">Don't see what you need? Add a custom topic...</p>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Describe a custom topic (150 char max)"
              value={customTopicInput}
              onChange={(e) => {
                if (e.target.value.length <= 150) {
                  setCustomTopicInput(e.target.value);
                }
              }}
              onKeyPress={(e) => e.key === 'Enter' && addCustomTopic()}
              className="flex-1 border-2 border-slate-200 focus:border-[#FDC700] rounded-xl transition-all"
              maxLength={150}
            />
            <Button
              onClick={addCustomTopic}
              disabled={!customTopicInput.trim()}
              className="bg-[#FDC700] text-[#2E4059] hover:bg-[#F5AF19] font-semibold px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
          {customTopicInput.length > 0 && (
            <p className="text-xs text-[#6B7280] mt-1 text-right">
              {customTopicInput.length}/150
            </p>
          )}
        </div>
      </div>

      {/* ZONE 3: SELECTED TOPICS SUMMARY (BOTTOM) */}
      {selectedCount > 0 && (
        <div className="space-y-4 animate-fade-in-up delay-300">
          <div className="bg-gradient-to-r from-[#FDC700]/10 to-[#F5AF19]/10 rounded-xl border-2 border-[#FDC700]/20 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#2E4059]">
                Selected Topics
              </h3>
              <div className="flex items-center gap-4 text-sm font-semibold text-[#2E4059]">
                <span>{selectedCount} {selectedCount === 1 ? 'Topic' : 'Topics'}</span>
                <span className="text-[#6B7280]">•</span>
                <span>{totalDurationDays} {totalDurationDays === 1 ? 'Day' : 'Days'}</span>
                <span className="text-[#6B7280]">•</span>
                <span>{totalDurationHours} Hours</span>
              </div>
            </div>
            
            {/* Selected Chips */}
            <div className="flex flex-wrap gap-2">
              {selectedTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="group flex items-center gap-2 px-3 py-1.5 bg-[#FDC700] text-[#2E4059] rounded-full text-sm font-medium hover:bg-[#F5AF19] transition-all duration-200 animate-scale-in"
                >
                  <span>{topic.title}</span>
                  <button
                    onClick={() => toggleTopic(topic.id)}
                    className="hover:bg-[#2E4059]/10 rounded-full p-0.5 transition-colors"
                    type="button"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {data.customTopics?.map((topic, idx) => (
                <div
                  key={`custom-${idx}`}
                  className="group flex items-center gap-2 px-3 py-1.5 bg-[#FDC700] text-[#2E4059] rounded-full text-sm font-medium hover:bg-[#F5AF19] transition-all duration-200 animate-scale-in"
                >
                  <span>{topic}</span>
                  <button
                    onClick={() => removeCustomTopic(topic)}
                    className="hover:bg-[#2E4059]/10 rounded-full p-0.5 transition-colors"
                    type="button"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Validation Message */}
      {selectedCount === 0 && !isLoadingAI && (
        <div className="text-center py-8 text-[#6B7280]">
          <p className="text-sm">Choose at least one topic or describe a custom request for a tailored plan.</p>
        </div>
      )}

      {/* Warning for >12 topics */}
      {selectedCount > 12 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 animate-fade-in-up">
          <p className="text-sm text-yellow-800">
            <span className="font-semibold">Note:</span> Large training portfolios are delivered as phased programs. You can continue, but we will structure them into stages.
          </p>
        </div>
      )}
    </div>
  );
}

// Summary Step Component
function SummaryStep({ data }: { data: TrainingData }) {
  const getTrainingSupportLabels = () => {
    const labels: Record<string, string> = {
      "soft-skill": "Soft Skill",
      "technical-hard-skill": "Technical/Hard Skill",
      "behavior-mindset": "Behavior & Mindset",
      "leadership-management": "Leadership & Management",
      "compliance-mandatory": "Compliance/Mandatory",
      "team-culture": "Team & Culture Development",
      "industry-specific": "Industry/Department Specific Skill",
      "motivation-engagement": "Motivation & Engagement",
    };
    return data.trainingSupport.map(s => labels[s] || s);
  };

  const getSelectedTopics = () => {
    const topics = data.selectedTopics?.map(id => {
      const topic = allTrainingTopics.find(t => t.id === id);
      return topic ? topic.title : id;
    }) || [];
    return [...topics, ...(data.customTopics || [])];
  };

  return (
    <div>
      <h2 className="text-3xl sm:text-4xl font-bold text-[#2E4059] mb-2">
        Training Summary
      </h2>
      <p className="text-lg text-[#6B7280] mb-6">
        Review your training selections before proceeding.
      </p>

      <div className="space-y-6">
        {/* Training Support */}
        <div className="p-4 bg-slate-50 rounded-lg">
          <h3 className="font-semibold text-[#2E4059] mb-2">Training Support Needed</h3>
          <div className="flex flex-wrap gap-2">
            {getTrainingSupportLabels().map((label, idx) => (
              <span key={idx} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-sm">
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Outcomes */}
        <div className="p-4 bg-slate-50 rounded-lg">
          <h3 className="font-semibold text-[#2E4059] mb-2">Desired Outcomes</h3>
          <div className="flex flex-wrap gap-2">
            {data.outcomes.map((outcome, idx) => (
              <span key={idx} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-sm">
                {outcome}
              </span>
            ))}
          </div>
        </div>

        {/* Selected Topics */}
        <div className="p-4 bg-slate-50 rounded-lg">
          <h3 className="font-semibold text-[#2E4059] mb-2">Selected Training Topics</h3>
          <div className="flex flex-wrap gap-2">
            {getSelectedTopics().map((topic, idx) => (
              <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 border border-blue-200 rounded-full text-sm">
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Audience */}
        <div className="p-4 bg-slate-50 rounded-lg">
          <h3 className="font-semibold text-[#2E4059] mb-2">Training Audience</h3>
          <p className="text-sm text-slate-600">
            {data.trainingAudience === "myself" && "Myself"}
            {data.trainingAudience === "team" && `My Team (${data.teamSize || 'N/A'} people)`}
            {data.trainingAudience === "department" && `${data.department || 'Department'} (${data.teamSize || 'N/A'} people)`}
            {data.trainingAudience === "organization" && `Entire Organization (${data.companySize || 'N/A'})`}
          </p>
        </div>
      </div>
    </div>
  );
}

export function TrainingFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<TrainingData>(initialData);
  const [errors, setErrors] = useState<Record<number, string[]>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Track which outcome categories are expanded - each category is independent
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  // Check if user is a consultant or business
  const [isConsultant, setIsConsultant] = useState(false);
  const [isBusiness, setIsBusiness] = useState(false);

  const totalSteps = 6;

  // Check sessionStorage for consultant or business role
  useEffect(() => {
    if (typeof window !== "undefined") {
      const selectedRole = sessionStorage.getItem("selectedRole");
      if (selectedRole === "consultant") {
        setIsConsultant(true);
      } else if (selectedRole === "business") {
        setIsBusiness(true);
      }
    }
  }, []);

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
      if (data.selectedTopics.length === 0 && data.customTopics.length === 0) {
        stepErrors.push("Please select at least one training topic or add a custom topic.");
      }
    }

    if (step === 5) {
      // Summary step - no validation needed, just display
    }

    if (step === 6) {
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Map training data to API format
      const submissionData = {
        // Map name to contactName for API
        contactName: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        companyName: '', // Training flow doesn't have company name
        // Include all training data
        trainingSupport: data.trainingSupport,
        trainingAudience: data.trainingAudience,
        teamSize: data.teamSize,
        department: data.department,
        companySize: data.companySize,
        outcomes: data.outcomes,
        specificNotes: data.specificNotes,
        selectedTopics: data.selectedTopics,
        customTopics: data.customTopics,
        areaOfInterest: data.areaOfInterest,
        learningGoal: data.learningGoal,
        educationLevel: data.educationLevel,
        preferredFormat: data.preferredFormat,
        country: data.country,
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

      // Save training data to sessionStorage for proposal page
      if (typeof window !== "undefined") {
        sessionStorage.setItem("trainingSubmissionData", JSON.stringify(submissionData));
      }

      // Check if submission was successful OR if it's a database connection error (allow it for now)
      if (response.ok && result.success) {
        setIsSubmitted(true);
        // Redirect to training proposal page after 2 seconds
        setTimeout(() => {
          router.push("/training-proposal");
        }, 2000);
      } else if (result.error && result.error.includes("Cannot connect to database")) {
        // Database not set up - still show success for testing
        console.warn("Database not configured, but showing success for testing:", result.error);
        setIsSubmitted(true);
        setTimeout(() => {
          router.push("/training-proposal");
        }, 2000);
      } else {
        // Show more detailed error message for other errors
        const errorMessage = result.error || result.message || "Submission failed. Please try again.";
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error("Error submitting training data:", error);
      // If it's a network error or fetch failed, still allow success for testing
      if (error.message?.includes("fetch") || error.message?.includes("network")) {
        console.warn("Network error, but showing success for testing");
        setIsSubmitted(true);
        setTimeout(() => {
          router.push("/training-proposal");
        }, 2000);
      } else {
        alert(error.message || "There was an error submitting your request. Please try again.");
        setIsSubmitting(false);
      }
    }
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


  const hasSelectedSubcategory = (category: { name: string; outcomes: string[] }) => {
    return category.outcomes.some((outcome) => data.outcomes.includes(outcome));
  };

  // Consultant form state
  const [consultantData, setConsultantData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    areaOfInterest: "",
    consultancyCompany: "",
    purpose: "",
    nda: false,
    clientInformation: "",
  });
  const [consultantErrors, setConsultantErrors] = useState<Record<string, string>>({});

  // Business form state
  const [businessData, setBusinessData] = useState({
    name: "",
    mobileNumber: "",
    jobTitle: "",
    companyName: "",
    industry: "",
    phoneToggle: false,
    region: "",
    specificLandmark: "",
    officeNumber: "",
    preferredMode: "",
    companyEmail: "",
    country: "",
    department: "",
    companyType: "",
    companySize: "",
    tinToggle: false,
    citySubcity: "",
    bldgName: "",
    authorityLevel: "",
  });
  const [businessErrors, setBusinessErrors] = useState<Record<string, string>>({});

  const updateConsultantData = (field: string, value: any) => {
    setConsultantData((prev) => ({ ...prev, [field]: value }));
    if (consultantErrors[field]) {
      setConsultantErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const updateBusinessData = (field: string, value: any) => {
    setBusinessData((prev) => ({ ...prev, [field]: value }));
    if (businessErrors[field]) {
      setBusinessErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateConsultantForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!consultantData.name) newErrors.name = "Please enter your name";
    if (!consultantData.email) newErrors.email = "Please enter your email";
    if (!consultantData.phone) newErrors.phone = "Please enter your phone number";
    if (!consultantData.country) newErrors.country = "Please enter your country";
    if (!consultantData.consultancyCompany) newErrors.consultancyCompany = "Please enter your consultancy/company name";
    if (!consultantData.purpose) newErrors.purpose = "Please enter the purpose";
    setConsultantErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateBusinessForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!businessData.name) newErrors.name = "Please enter your name";
    if (!businessData.mobileNumber) newErrors.mobileNumber = "Please enter your mobile number";
    if (!businessData.companyEmail) newErrors.companyEmail = "Please enter company email";
    if (!businessData.companyName) newErrors.companyName = "Please enter company name";
    if (!businessData.country) newErrors.country = "Please enter country";
    setBusinessErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConsultantSubmit = async () => {
    if (!validateConsultantForm()) {
      return;
    }
    setIsSubmitting(true);
    try {
      const submissionData = {
        contactName: consultantData.name,
        email: consultantData.email,
        phone: consultantData.phone,
        companyName: consultantData.consultancyCompany,
        country: consultantData.country,
        areaOfInterest: consultantData.areaOfInterest,
        purpose: consultantData.purpose,
        nda: consultantData.nda,
        clientInformation: consultantData.clientInformation,
        type: "consultant",
      };
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setIsSubmitted(true);
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else if (result.error && result.error.includes("Cannot connect to database")) {
        console.warn("Database not configured, but showing success for testing:", result.error);
        setIsSubmitted(true);
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        throw new Error(result.error || result.message || "Submission failed");
      }
    } catch (error: any) {
      console.error("Error submitting consultant data:", error);
      if (error.message?.includes("fetch") || error.message?.includes("network")) {
        setIsSubmitted(true);
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        alert(error.message || "There was an error submitting your request. Please try again.");
        setIsSubmitting(false);
      }
    }
  };

  const handleBusinessSubmit = async () => {
    if (!validateBusinessForm()) {
      return;
    }
    setIsSubmitting(true);
    try {
      const submissionData = {
        contactName: businessData.name,
        email: businessData.companyEmail,
        phone: businessData.mobileNumber,
        companyName: businessData.companyName,
        country: businessData.country,
        jobTitle: businessData.jobTitle,
        industry: businessData.industry,
        department: businessData.department,
        companyType: businessData.companyType,
        companySize: businessData.companySize,
        region: businessData.region,
        city: businessData.citySubcity,
        buildingName: businessData.bldgName,
        officeNumber: businessData.officeNumber,
        specificLandmark: businessData.specificLandmark,
        authorityLevel: businessData.authorityLevel,
        preferredMode: businessData.preferredMode,
        phoneToggle: businessData.phoneToggle,
        tinToggle: businessData.tinToggle,
        type: "business",
      };
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setIsSubmitted(true);
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else if (result.error && result.error.includes("Cannot connect to database")) {
        console.warn("Database not configured, but showing success for testing:", result.error);
        setIsSubmitted(true);
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        throw new Error(result.error || result.message || "Submission failed");
      }
    } catch (error: any) {
      console.error("Error submitting business data:", error);
      if (error.message?.includes("fetch") || error.message?.includes("network")) {
        setIsSubmitted(true);
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        alert(error.message || "There was an error submitting your request. Please try again.");
        setIsSubmitting(false);
      }
    }
  };

  // Show thank you card if submitted
  if (isSubmitted) {
  return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <Card className="p-10 sm:p-16 lg:p-20 bg-gradient-to-br from-white via-slate-50 to-white shadow-2xl border-2 border-slate-200 rounded-3xl text-center relative overflow-hidden animate-scale-in">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FDC700]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#3B5998]/10 rounded-full blur-3xl"></div>
          
          <div className="max-w-md mx-auto relative z-10">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg animate-scale-in delay-300">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#2E4059] mb-6 animate-fade-in-up delay-500">
              Thank You!
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed animate-fade-in-up delay-700">
              {isConsultant 
                ? "We've received your consultant request. We'll contact you soon to discuss your needs."
                : isBusiness
                ? "We've received your business information. We'll contact you soon to discuss your training needs."
                : "We've received your training request. We'll contact you soon to discuss your training needs."
              }
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // If business, show business form instead of training flow
  if (isBusiness) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <Card className="p-6 sm:p-8 lg:p-10 bg-white shadow-2xl border-2 border-slate-100 rounded-2xl animate-fade-in-up delay-200">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2E4059] mb-2">
              Business Information
            </h2>
            <p className="text-lg text-[#6B7280] mb-8">
              Please provide your business details so we can assist you with training needs.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="business-name" className="text-[#2E4059] font-medium">
                    Your Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="business-name"
                    value={businessData.name}
                    onChange={(e) => updateBusinessData("name", e.target.value)}
                    placeholder="Personal"
                    className="border-slate-200 focus:border-[#FFC72F] focus:ring-[#FFC72F]/20 transition-all"
                  />
                  {businessErrors.name && <p className="text-sm text-red-600">{businessErrors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-mobile" className="text-[#2E4059] font-medium">
                    Mobile Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="business-mobile"
                    type="tel"
                    value={businessData.mobileNumber}
                    onChange={(e) => updateBusinessData("mobileNumber", e.target.value)}
                    placeholder="Personal"
                    className="border-slate-200 focus:border-[#FFC72F] focus:ring-[#FFC72F]/20 transition-all"
                  />
                  {businessErrors.mobileNumber && <p className="text-sm text-red-600">{businessErrors.mobileNumber}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-job-title" className="text-[#2E4059] font-medium">
                    Job Title
                  </Label>
                  <Input
                    id="business-job-title"
                    value={businessData.jobTitle}
                    onChange={(e) => updateBusinessData("jobTitle", e.target.value)}
                    placeholder="Personal"
                    className="border-slate-200 focus:border-[#FFC72F] focus:ring-[#FFC72F]/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-company-name" className="text-[#2E4059] font-medium">
                    Company Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="business-company-name"
                    value={businessData.companyName}
                    onChange={(e) => updateBusinessData("companyName", e.target.value)}
                    placeholder="Personal"
                    className="border-slate-200 focus:border-[#FFC72F] focus:ring-[#FFC72F]/20 transition-all"
                  />
                  {businessErrors.companyName && <p className="text-sm text-red-600">{businessErrors.companyName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-industry" className="text-[#2E4059] font-medium">
                    Industry
                  </Label>
                  <Input
                    id="business-industry"
                    value={businessData.industry}
                    onChange={(e) => updateBusinessData("industry", e.target.value)}
                    placeholder="Personal"
                    className="border-slate-200 focus:border-[#FFC72F] focus:ring-[#FFC72F]/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-phone-toggle" className="text-[#2E4059] font-medium">
                    Phone number
                  </Label>
                  <div className="flex items-center gap-3">
                    <Switch
                      id="business-phone-toggle"
                      checked={businessData.phoneToggle}
                      onCheckedChange={(checked) => updateBusinessData("phoneToggle", checked)}
                    />
                    <span className="text-sm text-slate-600">Toggle switch</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-region" className="text-[#2E4059] font-medium">
                    Region
                  </Label>
                  <Input
                    id="business-region"
                    value={businessData.region}
                    onChange={(e) => updateBusinessData("region", e.target.value)}
                    placeholder="Personal"
                    className="border-slate-200 focus:border-[#FFC72F] focus:ring-[#FFC72F]/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-landmark" className="text-[#2E4059] font-medium">
                    Specific /Landmark Place/name
                  </Label>
                  <Input
                    id="business-landmark"
                    value={businessData.specificLandmark}
                    onChange={(e) => updateBusinessData("specificLandmark", e.target.value)}
                    placeholder="Personal"
                    className="border-slate-200 focus:border-[#FFC72F] focus:ring-[#FFC72F]/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-office" className="text-[#2E4059] font-medium">
                    Office Number
                  </Label>
                  <Input
                    id="business-office"
                    value={businessData.officeNumber}
                    onChange={(e) => updateBusinessData("officeNumber", e.target.value)}
                    placeholder="Personal"
                    className="border-slate-200 focus:border-[#FFC72F] focus:ring-[#FFC72F]/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-mode" className="text-[#2E4059] font-medium">
                    Preferred mode for follow-up call
                  </Label>
                  <Input
                    id="business-mode"
                    value={businessData.preferredMode}
                    onChange={(e) => updateBusinessData("preferredMode", e.target.value)}
                    placeholder="Personal"
                    className="border-slate-200 focus:border-[#FFC72F] focus:ring-[#FFC72F]/20 transition-all"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="business-email" className="text-[#2E4059] font-medium">
                    Company Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="business-email"
                    type="email"
                    value={businessData.companyEmail}
                    onChange={(e) => updateBusinessData("companyEmail", e.target.value)}
                    placeholder="Personal"
                    className="border-slate-200 focus:border-[#FFC72F] focus:ring-[#FFC72F]/20 transition-all"
                  />
                  {businessErrors.companyEmail && <p className="text-sm text-red-600">{businessErrors.companyEmail}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-country" className="text-[#2E4059] font-medium">
                    Country <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="business-country"
                    value={businessData.country}
                    onChange={(e) => updateBusinessData("country", e.target.value)}
                    placeholder="Personal"
                    className="border-slate-200 focus:border-[#FFC72F] focus:ring-[#FFC72F]/20 transition-all"
                  />
                  {businessErrors.country && <p className="text-sm text-red-600">{businessErrors.country}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-department" className="text-[#2E4059] font-medium">
                    Department
                  </Label>
                  <Input
                    id="business-department"
                    value={businessData.department}
                    onChange={(e) => updateBusinessData("department", e.target.value)}
                    placeholder="Personal"
                    className="border-slate-200 focus:border-[#FFC72F] focus:ring-[#FFC72F]/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-type" className="text-[#2E4059] font-medium">
                    Company Type
                  </Label>
                  <Input
                    id="business-type"
                    value={businessData.companyType}
                    onChange={(e) => updateBusinessData("companyType", e.target.value)}
                    placeholder="Personal"
                    className="border-slate-200 focus:border-[#FFC72F] focus:ring-[#FFC72F]/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-size" className="text-[#2E4059] font-medium">
                    Company Size
                  </Label>
                  <Input
                    id="business-size"
                    value={businessData.companySize}
                    onChange={(e) => updateBusinessData("companySize", e.target.value)}
                    placeholder="(helping a client / benchmarking / research)"
                    className="border-slate-200 focus:border-[#FFC72F] focus:ring-[#FFC72F]/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-tin-toggle" className="text-[#2E4059] font-medium">
                    Tin Number
                  </Label>
                  <div className="flex items-center gap-3">
                    <Switch
                      id="business-tin-toggle"
                      checked={businessData.tinToggle}
                      onCheckedChange={(checked) => updateBusinessData("tinToggle", checked)}
                    />
                    <span className="text-sm text-slate-600">Toggle switch</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-city" className="text-[#2E4059] font-medium">
                    City/Subcity
                  </Label>
                  <Input
                    id="business-city"
                    value={businessData.citySubcity}
                    onChange={(e) => updateBusinessData("citySubcity", e.target.value)}
                    placeholder="Personal"
                    className="border-slate-200 focus:border-[#FFC72F] focus:ring-[#FFC72F]/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-building" className="text-[#2E4059] font-medium">
                    Bldg Name
                  </Label>
                  <Input
                    id="business-building"
                    value={businessData.bldgName}
                    onChange={(e) => updateBusinessData("bldgName", e.target.value)}
                    placeholder="Personal"
                    className="border-slate-200 focus:border-[#FFC72F] focus:ring-[#FFC72F]/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-authority" className="text-[#2E4059] font-medium">
                    Authority Level
                  </Label>
                  <Input
                    id="business-authority"
                    value={businessData.authorityLevel}
                    onChange={(e) => updateBusinessData("authorityLevel", e.target.value)}
                    placeholder="Personal"
                    className="border-slate-200 focus:border-[#FFC72F] focus:ring-[#FFC72F]/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-8 pt-6 border-t">
              <Button
                onClick={handleBusinessSubmit}
                disabled={isSubmitting}
                className="bg-[#FFC72F] text-[#2E4059] font-bold hover:bg-[#FFC72F]/90 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#2E4059] mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // If consultant, show consultant form instead of training flow
  if (isConsultant) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <Card className="p-6 sm:p-8 lg:p-10 bg-white shadow-2xl border-2 border-slate-100 rounded-2xl animate-fade-in-up delay-200">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2E4059] mb-2">
              Your Information
            </h2>
            <p className="text-lg text-[#6B7280] mb-8">
              Please provide your details so we can assist you with strategic consulting.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="consultant-name" className="text-[#2E4059] font-medium">
                    Your Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="consultant-name"
                    value={consultantData.name}
                    onChange={(e) => updateConsultantData("name", e.target.value)}
                    placeholder="Personal"
                    className="border-slate-200 focus:border-[#FFC72F] focus:ring-[#FFC72F]/20 transition-all"
                  />
                  {consultantErrors.name && <p className="text-sm text-red-600">{consultantErrors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consultant-phone" className="text-[#2E4059] font-medium">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="consultant-phone"
                    type="tel"
                    value={consultantData.phone}
                    onChange={(e) => updateConsultantData("phone", e.target.value)}
                    placeholder="Personal"
                    className="border-slate-200 focus:border-[#FFC72F] focus:ring-[#FFC72F]/20 transition-all"
                  />
                  {consultantErrors.phone && <p className="text-sm text-red-600">{consultantErrors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consultant-area" className="text-[#2E4059] font-medium">
                    Area of Interest
                  </Label>
                  <Input
                    id="consultant-area"
                    value={consultantData.areaOfInterest}
                    onChange={(e) => updateConsultantData("areaOfInterest", e.target.value)}
                    placeholder="Personal"
                    className="border-slate-200 focus:border-[#FFC72F] focus:ring-[#FFC72F]/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consultant-nda" className="text-[#2E4059] font-medium">
                    NDA
                  </Label>
                  <div className="flex items-center gap-3">
                    <Switch
                      id="consultant-nda"
                      checked={consultantData.nda}
                      onCheckedChange={(checked) => updateConsultantData("nda", checked)}
                    />
                    <span className="text-sm text-slate-600">Toggle switch</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-slate-500 italic">
                    *Client information will be required to generate full ROI
                  </p>
                  <Input
                    id="consultant-client"
                    value={consultantData.clientInformation}
                    onChange={(e) => updateConsultantData("clientInformation", e.target.value)}
                    placeholder="Personal"
                    className="border-slate-200 focus:border-[#FFC72F] focus:ring-[#FFC72F]/20 transition-all"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="consultant-email" className="text-[#2E4059] font-medium">
                    Personal Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="consultant-email"
                    type="email"
                    value={consultantData.email}
                    onChange={(e) => updateConsultantData("email", e.target.value)}
                    placeholder="Personal"
                    className="border-slate-200 focus:border-[#FFC72F] focus:ring-[#FFC72F]/20 transition-all"
                  />
                  {consultantErrors.email && <p className="text-sm text-red-600">{consultantErrors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consultant-country" className="text-[#2E4059] font-medium">
                    Country <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="consultant-country"
                    value={consultantData.country}
                    onChange={(e) => updateConsultantData("country", e.target.value)}
                    placeholder="Personal"
                    className="border-slate-200 focus:border-[#FFC72F] focus:ring-[#FFC72F]/20 transition-all"
                  />
                  {consultantErrors.country && <p className="text-sm text-red-600">{consultantErrors.country}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consultant-company" className="text-[#2E4059] font-medium">
                    Consultancy/Company <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="consultant-company"
                    value={consultantData.consultancyCompany}
                    onChange={(e) => updateConsultantData("consultancyCompany", e.target.value)}
                    placeholder="Personal"
                    className="border-slate-200 focus:border-[#FFC72F] focus:ring-[#FFC72F]/20 transition-all"
                  />
                  {consultantErrors.consultancyCompany && <p className="text-sm text-red-600">{consultantErrors.consultancyCompany}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consultant-purpose" className="text-[#2E4059] font-medium">
                    Purpose (helping a client / benchmarking / research) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="consultant-purpose"
                    value={consultantData.purpose}
                    onChange={(e) => updateConsultantData("purpose", e.target.value)}
                    placeholder="(helping a client / benchmarking / research)"
                    className="border-slate-200 focus:border-[#FFC72F] focus:ring-[#FFC72F]/20 transition-all"
                  />
                  {consultantErrors.purpose && <p className="text-sm text-red-600">{consultantErrors.purpose}</p>}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-8 pt-6 border-t">
              <Button
                onClick={handleConsultantSubmit}
                disabled={isSubmitting}
                className="bg-[#FFC72F] text-[#2E4059] font-bold hover:bg-[#FFC72F]/90 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#2E4059] mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Enhanced Progress Indicator */}
      <div className="mb-10 animate-fade-in-up">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-slate-600">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm font-semibold text-[#2E4059] bg-[#FDC700]/10 px-3 py-1 rounded-full">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-[#FDC700] via-[#F5AF19] to-[#FDC700] h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          </div>
        </div>
      </div>

      <Card className="p-6 sm:p-8 lg:p-10 bg-white shadow-2xl border-2 border-slate-100 rounded-2xl animate-fade-in-up delay-200">
        {/* Step 1: Training Support Selection */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2E4059] mb-2">
              What training support do you need right now?
            </h2>
            <p className="text-lg text-[#6B7280] mb-8">
              Select one or more training categories. You can pick as many as needed.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trainingSupportOptions.map((option) => {
                const isSelected = data.trainingSupport.includes(option.value);
                const subcategories = option.tooltip.split(',').map(s => s.trim());
                const IconComponent = getCategoryIcon(option.value);
                
                return (
                  <TooltipProvider key={option.value} delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                  <button
                    onClick={() => toggleTrainingSupport(option.value)}
                          className={`w-full p-6 rounded-lg border-2 text-left transition-all relative group ${
                            isSelected
                              ? "border-[#FFC72F] bg-[#FFC72F]/10 shadow-md"
                              : "border-slate-200 hover:border-[#FFC72F]/50 bg-white hover:shadow-sm"
                          }`}
                        >
                          {/* Checkbox in top right */}
                          <div className="absolute top-4 right-4">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                isSelected
                              ? "border-[#FFC72F] bg-[#FFC72F]"
                                  : "border-slate-300 bg-white"
                          }`}
                        >
                              {isSelected && (
                            <div className="w-2.5 h-2.5 rounded-full bg-white" />
                          )}
                        </div>
                      </div>

                          {/* Icon */}
                          <div className="mb-4">
                            <IconComponent 
                              className={`w-8 h-8 ${
                                isSelected ? "text-[#FFC72F]" : "text-slate-400"
                              }`} 
                            />
                          </div>

                          {/* Title */}
                          <h3 className="text-lg font-bold text-[#2E4059] mb-2 pr-8">
                            {option.label}
                          </h3>

                          {/* Description - using first part of tooltip as description */}
                          <p className="text-sm text-slate-600 line-clamp-2">
                            {getCategoryDescription(option.value)}
                          </p>
                        </button>
                          </TooltipTrigger>
                      <TooltipContent 
                        side="top" 
                        className="max-w-sm p-4 bg-slate-800 text-white border-0 shadow-xl"
                      >
                        <div className="space-y-2">
                          <p className="font-semibold mb-2 text-sm">{option.label} includes:</p>
                          <ul className="space-y-1">
                            {subcategories.map((subcat, idx) => (
                              <li key={idx} className="text-sm flex items-start">
                                <span className="mr-2">•</span>
                                <span>{subcat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                );
              })}
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
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2E4059] mb-2">
              Who is this training for?
            </h2>
            <p className="text-lg text-[#6B7280] mb-8">
              We'll adjust the design based on your audience.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {audienceOptions.map((option) => {
                const isSelected = data.trainingAudience === option.value;
                return (
                  <div key={option.value} className="space-y-3">
                    <button
                      type="button"
                      onClick={() => updateData("trainingAudience", option.value)}
                      className={`w-full p-6 rounded-lg border-2 text-left transition-all relative group ${
                        isSelected
                          ? "border-[#FFC72F] bg-[#FFC72F]/10 shadow-md"
                          : "border-slate-200 hover:border-[#FFC72F]/50 bg-white hover:shadow-sm"
                      }`}
                    >
                      {/* Radio Button Indicator */}
                      <div className="absolute top-4 right-4">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? "border-[#FFC72F] bg-[#FFC72F]"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2.5 h-2.5 rounded-full bg-white" />
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="pr-8">
                        <h3 className="text-lg font-bold text-[#2E4059] mb-2">
                          {option.label}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {option.tooltip}
                        </p>
                      </div>
                    </button>

                    {/* Conditional Fields */}
                    {isSelected && option.conditionalField && (
                      <div className="ml-2 space-y-3 animate-fade-in-up">
                        {option.conditionalField === "teamSize" && (
                          <div>
                            <Label htmlFor="teamSize" className="text-sm text-[#2E4059] font-medium">
                              Team size
                            </Label>
                            <Input
                              id="teamSize"
                              type="number"
                              min="1"
                              value={data.teamSize || ""}
                              onChange={(e) =>
                                updateData("teamSize", parseInt(e.target.value))
                              }
                              placeholder="Enter number of people"
                              className="mt-1.5 border-slate-200 focus:border-[#FFC72F] focus:ring-[#FFC72F]/20"
                            />
                          </div>
                        )}
                        {option.conditionalField === "department" && (
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor="department" className="text-sm text-[#2E4059] font-medium">
                                Select Department
                              </Label>
                              <Select
                                value={data.department || ""}
                                onValueChange={(value) =>
                                  updateData("department", value)
                                }
                              >
                                <SelectTrigger className="mt-1.5 border-slate-200 focus:border-[#FFC72F] focus:ring-[#FFC72F]/20">
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
                            </div>
                            <div>
                              <Label htmlFor="deptTeamSize" className="text-sm text-[#2E4059] font-medium">
                                Team size
                              </Label>
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
                                className="mt-1.5 border-slate-200 focus:border-[#FFC72F] focus:ring-[#FFC72F]/20"
                              />
                            </div>
                          </div>
                        )}
                        {option.conditionalField === "companySize" && (
                          <div>
                            <Label htmlFor="companySize" className="text-sm text-[#2E4059] font-medium">
                              Company Size
                            </Label>
                            <Select
                              value={data.companySize || ""}
                              onValueChange={(value) =>
                                updateData("companySize", value)
                              }
                            >
                              <SelectTrigger className="mt-1.5 border-slate-200 focus:border-[#FFC72F] focus:ring-[#FFC72F]/20">
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
                );
              })}
            </div>

            {errors[2] && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg animate-fade-in-up">
                <p className="text-sm text-red-600">{errors[2][0]}</p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Outcomes Selection */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2E4059] mb-2">
              What are your training goals?
            </h2>
            <p className="text-lg text-[#6B7280] mb-8">
              Select the goals this training should help achieve. This helps us recommend the most relevant topics.
            </p>

            {/* Main Outcome Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {outcomeCategories.map((category, index) => {
                const hasSelected = hasSelectedSubcategory(category);
                const isExpanded = expandedCategories[category.name] || false;
                
                const handleToggleExpand = () => {
                  // Toggle this specific category independently
                  setExpandedCategories(prev => ({
                    ...prev,
                    [category.name]: !prev[category.name]
                  }));
                };
                
                return (
                  <OutcomeCategoryCard
                    key={`outcome-category-${category.name}`}
                    category={category}
                    hasSelected={hasSelected}
                    selectedOutcomes={data.outcomes}
                    onToggleOutcome={toggleOutcome}
                    isExpanded={isExpanded}
                    onToggleExpand={handleToggleExpand}
                  />
                );
              })}
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

        {/* Step 4: Training Topics Selection */}
        {currentStep === 4 && (
          <TrainingTopicsStep 
            data={data} 
            updateData={updateData}
            trainingSupport={data.trainingSupport}
            outcomes={data.outcomes}
          />
        )}

        {/* Step 5: Summary */}
        {currentStep === 5 && (
          <SummaryStep data={data} />
        )}

        {/* Step 6: Personal Information */}
        {currentStep === 6 && (
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2E4059] mb-2">
              Your Information
            </h2>
            <p className="text-lg text-[#6B7280] mb-8">
              We'll use this to contact you and personalize your training
              recommendation.
            </p>

            <div className="space-y-6">
              {/* Required Fields Section */}
              <div>
                <h3 className="text-lg font-semibold text-[#2E4059] mb-4 pb-2 border-b border-slate-200">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[#2E4059] font-medium">
                      Your Name <span className="text-red-500">*</span>
                    </Label>
                <Input
                  id="name"
                  value={data.name || ""}
                  onChange={(e) => updateData("name", e.target.value)}
                  placeholder="Enter your full name"
                      className="border-slate-200 focus:border-[#FFC72F] focus:ring-[#FFC72F]/20 transition-all"
                />
              </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#2E4059] font-medium">
                      Personal Email <span className="text-red-500">*</span>
                    </Label>
                <Input
                  id="email"
                  type="email"
                  value={data.email || ""}
                  onChange={(e) => updateData("email", e.target.value)}
                  placeholder="your.email@example.com"
                      className="border-slate-200 focus:border-[#FFC72F] focus:ring-[#FFC72F]/20 transition-all"
                />
              </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[#2E4059] font-medium">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={data.phone || ""}
                  onChange={(e) => updateData("phone", e.target.value)}
                  placeholder="Enter your phone number"
                      className="border-slate-200 focus:border-[#FFC72F] focus:ring-[#FFC72F]/20 transition-all"
                />
              </div>

                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-[#2E4059] font-medium">
                      Country <span className="text-red-500">*</span>
                    </Label>
                <Input
                  id="country"
                  value={data.country || ""}
                  onChange={(e) => updateData("country", e.target.value)}
                  placeholder="Enter your country"
                      className="border-slate-200 focus:border-[#FFC72F] focus:ring-[#FFC72F]/20 transition-all"
                />
                  </div>
                </div>
              </div>

              {/* Optional Fields Section */}
              <div>
                <h3 className="text-lg font-semibold text-[#2E4059] mb-4 pb-2 border-b border-slate-200">
                  Additional Information <span className="text-sm font-normal text-slate-500">(Optional)</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="areaOfInterest" className="text-[#2E4059] font-medium">
                      Area of Interest
                    </Label>
                <Input
                  id="areaOfInterest"
                  value={data.areaOfInterest || ""}
                  onChange={(e) => updateData("areaOfInterest", e.target.value)}
                  placeholder="Optional"
                      className="border-slate-200 focus:border-[#FFC72F] focus:ring-[#FFC72F]/20 transition-all"
                />
              </div>

                  <div className="space-y-2">
                    <Label htmlFor="learningGoal" className="text-[#2E4059] font-medium">
                      Learning Goal
                    </Label>
                <Select
                  value={data.learningGoal || ""}
                  onValueChange={(value) => updateData("learningGoal", value)}
                >
                      <SelectTrigger className="border-slate-200 focus:border-[#FFC72F] focus:ring-[#FFC72F]/20">
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

                  <div className="space-y-2">
                    <Label htmlFor="educationLevel" className="text-[#2E4059] font-medium">
                      Education Level
                    </Label>
                <Select
                  value={data.educationLevel || ""}
                  onValueChange={(value) => updateData("educationLevel", value)}
                >
                      <SelectTrigger className="border-slate-200 focus:border-[#FFC72F] focus:ring-[#FFC72F]/20">
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

                  <div className="space-y-2">
                    <Label htmlFor="preferredFormat" className="text-[#2E4059] font-medium">
                  Preferred Training Format
                </Label>
                <Select
                  value={data.preferredFormat || ""}
                  onValueChange={(value) =>
                    updateData("preferredFormat", value)
                  }
                >
                      <SelectTrigger className="border-slate-200 focus:border-[#FFC72F] focus:ring-[#FFC72F]/20">
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
              </div>
            </div>

            {errors[6] && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in-up">
                <p className="text-sm text-red-600">{errors[6][0]}</p>
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
            disabled={isSubmitting}
            className="bg-[#FFC72F] text-[#2E4059] font-bold hover:bg-[#FFC72F]/90 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#2E4059] mr-2"></div>
                Submitting...
              </>
            ) : (
              currentStep === totalSteps ? "Submit" : "Continue"
            )}
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
