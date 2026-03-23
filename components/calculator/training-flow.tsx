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

function getCategoryEmoji(value: string) {
  const emojiMap: Record<string, string> = {
    "soft-skill": "💬",
    "technical-hard-skill": "⚙️",
    "behavior-mindset": "🧠",
    "leadership-management": "🎯",
    "compliance-mandatory": "📋",
    "team-culture": "🌱",
    "industry-specific": "🏭",
    "motivation-engagement": "🔥",
  };
  return emojiMap[value] || "•";
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

// Import real training topics data
import { allTrainingTopics as realTopics, categoryMap } from "@/lib/training-topics-data";

// Training Topics Data - Use real data from TSV
interface TrainingTopic {
  id: string;
  title: string;
  topic_name: string;
  description: string;
  duration: string;
  duration_hours: number;
  difficulty: "Basic" | "Intermediate" | "Advanced" | "Beginner";
  category: string;
  category_layer1: string;
  subcategory_layer2: string;
  department_relevance: string;
  delivery_mode: string;
  goal_fit_score?: number; // Calculated score
}

// Transform real topics to frontend format
const allTrainingTopics: TrainingTopic[] = realTopics.map(topic => ({
  id: topic.id,
  title: topic.topic_name,
  topic_name: topic.topic_name,
  description: topic.description || '',
  duration: `${topic.duration_hours} Hours`,
  duration_hours: topic.duration_hours,
  difficulty: topic.difficulty_level === "Basic" ? "Beginner" : topic.difficulty_level,
  category: categoryMap[topic.category_id] || topic.category_id,
  category_layer1: categoryMap[topic.category_id] || topic.category_id,
  subcategory_layer2: topic.subcategory,
  department_relevance: topic.department_relevance,
  delivery_mode: topic.delivery_mode,
}));

// Legacy hardcoded topics (removed - using real data now)
const allTrainingTopicsOld: TrainingTopic[] = [
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
          // API returned error, clear recommendations
          setAiRecommendedIds([]);
          setAiError("Failed to get recommendations");
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setAiRecommendedIds([]);
        setAiError("Service unavailable");
      } finally {
        setIsLoadingAI(false);
      }
    };

    fetchAIRecommendations();
  }, [trainingSupport, outcomes, data.trainingAudience, data.specificNotes]);

  // Get recommended topics from API response
  const [recommendedTopicsData, setRecommendedTopicsData] = useState<TrainingTopic[]>([]);
  
  // Update recommended topics when API returns data
  useEffect(() => {
    if (aiRecommendedIds.length > 0) {
      // Fetch full topic details for recommended IDs
      const recommended = allTrainingTopics.filter(topic => aiRecommendedIds.includes(topic.id));
      setRecommendedTopicsData(recommended);
    } else {
      setRecommendedTopicsData([]);
    }
  }, [aiRecommendedIds]);

  const recommendedTopics = recommendedTopicsData;
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
          topic.topic_name,
          topic.description,
          topic.category,
          topic.category_layer1,
          topic.subcategory_layer2,
          topic.difficulty,
          topic.duration,
          topic.department_relevance,
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
  
  // Custom topic counts as 1 selection if filled (as per spec)
  const hasCustomTopic = data.customTopics && data.customTopics.length > 0 && data.customTopics[0]?.trim();
  const selectedCount = selectedTopics.length + (hasCustomTopic ? 1 : 0);
  
  // Calculate total duration in hours
  const totalDurationHours = selectedTopics.reduce((sum, t) => {
    return sum + (t.duration_hours || 0);
  }, 0);
  
  const totalDurationDays = Math.ceil(totalDurationHours / 8); // Assuming 8 hours per day
  const totalModules = selectedCount;
  
  // Get recommended topics (limit to 6-12, NOT pre-checked) - as per spec
  const displayRecommendedTopics = recommendedTopics
    .filter(t => !data.selectedTopics?.includes(t.id)) // Don't show already selected
    .slice(0, 12); // Show up to 12 recommendations (spec says 6-12)
  
  // Filter search results (exclude already selected and recommended)
  const filteredSearchResults = searchQuery.trim() 
    ? searchResults.filter(topic => {
        const notSelected = !data.selectedTopics?.includes(topic.id);
        const notInRecommended = !displayRecommendedTopics.some(rt => rt.id === topic.id);
        return notSelected && notInRecommended;
      })
    : [];

  const audienceIcon: Record<string, string> = {
    myself: "👤",
    team: "👥",
    department: "🏬",
    organization: "🏢",
  };

  const selectAudience = (value: string) => {
    updateData("trainingAudience", value);
    if (value !== "team" && value !== "department") {
      updateData("teamSize", undefined);
    }
    if (value !== "department") {
      updateData("department", undefined);
    }
    if (value !== "organization") {
      updateData("companySize", undefined);
    }
  };

  return (
    <div>
      <div className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#B8862F] mb-3">
        Capability Development - Step 4 of 5
      </div>
      <h2
        className="text-[44px] sm:text-[52px] leading-[1.06] font-bold text-[#171717] mb-2"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Select modules &<br />
        <em className="text-[#C8973A] italic font-bold">who this is for</em>
      </h2>
      <p className="text-[14px] text-[#5F5A55] mb-6 max-w-2xl">
        Smart recommendations based on your capability areas and goals. Search or add custom topics.
      </p>

      {isLoadingAI && (
        <div className="flex items-center gap-2 text-[#6B7280] text-sm mb-4">
          <span className="animate-spin rounded-full h-4 w-4 border-2 border-[#C8973A] border-t-transparent"></span>
          <span>AI is analyzing your needs...</span>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#B8862F] mb-2 flex items-center gap-2">
            <span>🎯</span>
            <span>Recommended Modules</span>
          </div>
          {!isLoadingAI && displayRecommendedTopics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {displayRecommendedTopics.map((topic) => {
                const isSelected = data.selectedTopics?.includes(topic.id);
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => toggleTopic(topic.id)}
                    className={`w-full p-3 rounded-[4px] border text-left transition-colors duration-150 ${
                      isSelected
                        ? "border-[#C8973A] bg-[#FAF4E8]"
                        : "border-[#E8E2D8] bg-[#FDFCF9] hover:border-[#C8973A] hover:bg-[#FAF4E8]"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className={`w-[14px] h-[14px] mt-0.5 border rounded-[2px] ${isSelected ? "bg-[#C8973A] border-[#C8973A]" : "border-[#CFC7BC]"}`} />
                      <div className="min-w-0">
                        <div className="text-[14px] font-semibold text-[#0A0A0A]">{topic.title}</div>
                        <div className="text-[11px] text-[#7A7570]">{topic.category} · {topic.duration_hours} hrs</div>
                        {topic.goal_fit_score && (
                          <div className="text-[11px] text-[#B8862F] font-medium">✦ Matches 1 goal</div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            !isLoadingAI && <div className="text-[12px] text-[#7A7570]">No recommendations available yet.</div>
          )}
        </div>

        <div>
          <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#B8862F] mb-2 flex items-center gap-2">
            <span>🔍</span>
            <span>Search Full Catalog (400+ Modules)</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B857D]" />
            <Input
              type="text"
              placeholder="Search by topic, skill, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 border border-[#E8E2D8] bg-[#FDFCF9] rounded-[3px] focus:border-[#C8973A]"
            />
          </div>
          {searchQuery.trim() && (
            <div className="mt-2 max-h-[190px] overflow-y-auto border border-[#E8E2D8] rounded-[3px] bg-[#FDFCF9]">
              {filteredSearchResults.length > 0 ? (
                filteredSearchResults.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => toggleTopic(topic.id)}
                    className="w-full px-3 py-2 text-left border-b last:border-b-0 border-[#E8E2D8] hover:bg-[#FAF4E8]"
                  >
                    <div className="text-[13px] text-[#0A0A0A] font-medium">{topic.title}</div>
                    <div className="text-[11px] text-[#7A7570]">{topic.category} · {topic.duration}</div>
                  </button>
                ))
              ) : (
                <div className="p-3 text-[12px] text-[#7A7570]">No topics found.</div>
              )}
            </div>
          )}
        </div>

        <div>
          <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#B8862F] mb-2 flex items-center gap-2">
            <span>✅</span>
            <span>Your Development Plan</span>
          </div>
          <div className="border border-[#E8E2D8] rounded-[3px] bg-[#FDFCF9] p-3">
            <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#7A7570] mb-1">Selected Modules</div>
            {selectedCount > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {selectedTopics.map((topic) => (
                  <span key={topic.id} className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-[#E8E2D8] bg-white text-[11px]">
                    {topic.title}
                    <button type="button" onClick={() => toggleTopic(topic.id)} className="text-[#7A7570] hover:text-[#B84C2B]">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {hasCustomTopic && data.customTopics?.[0]?.trim() && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-[#E8E2D8] bg-white text-[11px]">
                    {data.customTopics[0]}
                    <button
                      type="button"
                      onClick={() => {
                        setCustomTopicInput("");
                        updateData("customTopics", []);
                      }}
                      className="text-[#7A7570] hover:text-[#B84C2B]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            ) : (
              <div className="text-[12px] text-[#7A7570] italic">No modules selected yet.</div>
            )}
          </div>
        </div>

        <div>
          <Label className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#3C3A36] mb-2 block">
            Can&apos;t find it? Describe a custom module
          </Label>
          <Textarea
            placeholder="e.g. Advanced B2B negotiation for the Ethiopian manufacturing sector..."
            value={customTopicInput}
            onChange={(e) => {
              if (e.target.value.length <= 150) {
                setCustomTopicInput(e.target.value);
                if (e.target.value.trim()) updateData("customTopics", [e.target.value.trim()]);
                else updateData("customTopics", []);
              }
            }}
            className="min-h-[84px] border border-[#E8E2D8] bg-[#FDFCF9] rounded-[3px] resize-none"
            maxLength={150}
          />
        </div>

        <div>
          <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#B8862F] mb-2 flex items-center gap-2">
            <span>👥</span>
            <span>Who Is This For?</span>
            <span className="flex-1 h-px bg-[#E8E2D8]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {audienceOptions.map((option) => {
              const isSelected = data.trainingAudience === option.value;
              return (
                <button
                  key={`aud-${option.value}`}
                  type="button"
                  onClick={() => selectAudience(option.value)}
                  className={`p-3 rounded-[3px] min-h-[78px] border text-left transition-colors duration-150 ${
                    isSelected
                      ? "border-[#C8973A] bg-[#FAF4E8]"
                      : "border-[#E8E2D8] bg-[#FDFCF9] hover:border-[#C8973A] hover:bg-[#FAF4E8]"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[14px] leading-none">{audienceIcon[option.value] || "•"}</span>
                    <div className="text-[14px] font-semibold text-[#0A0A0A]">{option.label}</div>
                  </div>
                  <div className="text-[11px] text-[#7A7570]">{option.tooltip}</div>
                </button>
              );
            })}
          </div>
          {data.trainingAudience === "team" && (
            <div className="mt-2">
              <Input
                type="number"
                min="1"
                value={data.teamSize || ""}
                onChange={(e) => updateData("teamSize", parseInt(e.target.value))}
                placeholder="Team size"
                className="h-9 border border-[#E8E2D8] bg-[#FDFCF9] rounded-[3px] max-w-xs"
              />
            </div>
          )}
          {data.trainingAudience === "department" && (
            <div className="mt-2 flex flex-wrap gap-2">
              <Select value={data.department || ""} onValueChange={(value) => updateData("department", value)}>
                <SelectTrigger className="h-9 border border-[#E8E2D8] bg-[#FDFCF9] rounded-[3px] max-w-xs">
                  <SelectValue placeholder="Department..." />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={`dept-${dept}`} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                min="1"
                value={data.teamSize || ""}
                onChange={(e) => updateData("teamSize", parseInt(e.target.value))}
                placeholder="Team size"
                className="h-9 border border-[#E8E2D8] bg-[#FDFCF9] rounded-[3px] max-w-xs"
              />
            </div>
          )}
          {data.trainingAudience === "organization" && (
            <div className="mt-2 max-w-xs">
              <Select value={data.companySize || ""} onValueChange={(value) => updateData("companySize", value)}>
                <SelectTrigger className="h-9 border border-[#E8E2D8] bg-[#FDFCF9] rounded-[3px]">
                  <SelectValue placeholder="Org size..." />
                </SelectTrigger>
                <SelectContent>
                  {companySizes.map((size) => (
                    <SelectItem key={`size-${size}`} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div>
          <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#3C3A36] mb-2">
            Preferred Delivery Mode
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "online", label: "Virtual / Live Online" },
              { value: "in-person", label: "In-Person" },
              { value: "hybrid", label: "Blended" },
              { value: "self-paced", label: "Self-Paced (LMS)" },
            ].map((mode) => {
              const isSelected = data.preferredFormat === mode.value;
              return (
                <button
                  key={`mode-${mode.value}`}
                  type="button"
                  onClick={() => updateData("preferredFormat", mode.value)}
                  className={`px-3 py-1.5 rounded-full border text-[12px] transition-colors ${
                    isSelected
                      ? "border-[#C8973A] bg-[#C8973A] text-white"
                      : "border-[#E8E2D8] bg-[#FDFCF9] text-[#3C3A36] hover:border-[#C8973A] hover:text-[#C8973A]"
                  }`}
                >
                  {mode.label}
                </button>
              );
            })}
          </div>
        </div>

        {selectedCount === 0 && !isLoadingAI && (
          <div className="text-[12px] text-[#7A7570]">
            Choose at least one topic or describe a custom request for a tailored plan.
          </div>
        )}
        {selectedCount > 12 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-[4px] p-3">
            <p className="text-[12px] text-yellow-800">
              <span className="font-semibold">Note:</span> Large portfolios are delivered as phased programs.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Summary Step Component
function SummaryStep({
  data,
}: {
  data: TrainingData;
}) {
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

  const selectedTopics = getSelectedTopics();
  const totalHours = (data.selectedTopics || []).reduce((sum, id) => {
    const topic = allTrainingTopics.find((t) => t.id === id);
    return sum + (topic?.duration_hours || 0);
  }, 0);
  const primaryGoal = data.outcomes?.[0] || "N/A";
  const capabilityAreas = getTrainingSupportLabels().join(", ") || "N/A";
  const audienceLabel =
    data.trainingAudience === "myself"
      ? "Individual"
      : data.trainingAudience === "team"
      ? `My Team (${data.teamSize || "N/A"})`
      : data.trainingAudience === "department"
      ? `${data.department || "Department"} (${data.teamSize || "N/A"})`
      : data.trainingAudience === "organization"
      ? `Entire Organization (${data.companySize || "N/A"})`
      : "N/A";
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <div className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#B8862F] mb-3">
        Capability Development - Your Plan
      </div>
      <h2
        className="text-[46px] sm:text-[56px] leading-[1.02] font-bold text-[#171717] mb-2"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Your Capability<br />
        <em className="text-[#C8973A] italic font-bold">Development Plan</em>
      </h2>
      <p className="text-[14px] text-[#5F5A55] mb-6 max-w-2xl">
        A SewAsset specialist will confirm this plan within 24 hours. Book a call to secure your dates.
      </p>

      <div className="border border-[#E8E2D8] bg-[#FDFCF9] rounded-[3px] overflow-hidden">
        <div className="bg-[#1A1815] px-4 py-4 border-b border-[#2A2722]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[#C8973A] text-[14px] font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                SewAsset™ Catalyst
              </div>
              <div className="text-white text-[40px] leading-tight font-bold mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                Capability Development Plan
              </div>
              <div className="text-[#B5ACA0] text-[11px] mt-1">Prepared {today}</div>
            </div>
            <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#C8973A] border border-[#5A4A2E] px-2 py-1 rounded-[2px]">
              Draft Proposal
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#B8862F] mb-2 border-b border-[#E8E2D8] pb-1">
              Plan Overview
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="border border-[#E8E2D8] bg-white p-2.5">
                <div className="text-[10px] text-[#7A7570] uppercase tracking-[0.08em]">Capability Areas</div>
                <div className="text-[13px] font-semibold text-[#0A0A0A] mt-0.5">{capabilityAreas}</div>
              </div>
              <div className="border border-[#E8E2D8] bg-white p-2.5">
                <div className="text-[10px] text-[#7A7570] uppercase tracking-[0.08em]">Primary Goals</div>
                <div className="text-[13px] font-semibold text-[#0A0A0A] mt-0.5">{primaryGoal}</div>
              </div>
              <div className="border border-[#E8E2D8] bg-white p-2.5">
                <div className="text-[10px] text-[#7A7570] uppercase tracking-[0.08em]">Audience</div>
                <div className="text-[13px] font-semibold text-[#0A0A0A] mt-0.5">{audienceLabel}</div>
              </div>
              <div className="border border-[#E8E2D8] bg-white p-2.5">
                <div className="text-[10px] text-[#7A7570] uppercase tracking-[0.08em]">Total Modules</div>
                <div className="text-[13px] font-semibold text-[#0A0A0A] mt-0.5">
                  {selectedTopics.length} module{selectedTopics.length === 1 ? "" : "s"} · {Math.max(totalHours, 0)} hrs
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#B8862F] mb-2 border-b border-[#E8E2D8] pb-1">
              Development Modules
            </div>
            <div className="space-y-1.5">
              {selectedTopics.length > 0 ? (
                selectedTopics.map((topic, idx) => (
                  <div key={`${topic}-${idx}`} className="border border-[#E8E2D8] bg-white px-3 py-2 text-[13px] text-[#0A0A0A] flex justify-between">
                    <span>{topic}</span>
                    <span className="text-[#7A7570] text-[11px]">
                      {allTrainingTopics.find((t) => t.title === topic)?.duration_hours || 8} hrs
                    </span>
                  </div>
                ))
              ) : (
                <div className="border border-[#E8E2D8] bg-white px-3 py-2 text-[12px] text-[#7A7570] italic">
                  No modules selected yet.
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#B8862F] mb-2 border-b border-[#E8E2D8] pb-1">
              What Happens Next
            </div>
            <div className="space-y-2">
              {[
                "Planning Call - A SewAsset specialist reviews your plan, confirms scope, dates, and delivery format.",
                "Full Proposal Delivered - Detailed capability plan with modules, timeline, and investment breakdown within 24 hours.",
                "Capability Development Begins - In-person, virtual, or LMS - built around your team's schedule and context.",
              ].map((item, idx) => (
                <div key={`next-${idx}`} className="border border-[#EDE8DF] bg-[#FBF9F6] px-3 py-2 flex gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#C8973A] text-white text-[11px] font-bold flex items-center justify-center mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-[12px] text-[#3C3A36]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-[#E2D3B5] bg-[#FAF4E8] px-3 py-2 text-[12px] text-[#3C3A36]">
            ⏰ This plan is held for <strong>7 days</strong>. Book your call to secure preferred dates.
          </div>

          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.location.href = "/";
              }
            }}
            className="w-full h-[48px] rounded-[2px] bg-[#C8973A] text-[#0A0A0A] text-[16px] font-black uppercase tracking-[0.08em] hover:bg-[#B8862F] transition-colors"
          >
            📅 Book a Planning Call
          </button>
        </div>
      </div>
    </div>
  );
}

export function TrainingFlow({
  onProgressChange,
}: {
  onProgressChange?: (percent: number) => void;
}) {
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
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");

  const totalSteps = 6;
  const displayStep = currentStep >= 3 ? currentStep - 1 : currentStep;
  const displayTotalSteps = totalSteps - 1;

  // Check sessionStorage for consultant or business role
  useEffect(() => {
    if (typeof window !== "undefined") {
      const selectedRole = sessionStorage.getItem("selectedRole");
      const savedFlow = sessionStorage.getItem("trainingFlowState");
      if (savedFlow) {
        try {
          const parsed = JSON.parse(savedFlow) as {
            currentStep?: number;
            data?: TrainingData;
          };
          if (parsed.data) {
            setData({ ...initialData, ...parsed.data });
          }
          if (parsed.currentStep && parsed.currentStep >= 1 && parsed.currentStep <= 6) {
            setCurrentStep(parsed.currentStep);
          }
        } catch (error) {
          console.error("Failed to restore training flow state:", error);
        }
      }
      if (selectedRole === "consultant") {
        setIsConsultant(true);
      } else if (selectedRole === "business") {
        setIsBusiness(true);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setSaveState("saving");
    const timeout = setTimeout(() => {
      sessionStorage.setItem(
        "trainingFlowState",
        JSON.stringify({ currentStep, data })
      );
      setSaveState("saved");
    }, 250);

    return () => clearTimeout(timeout);
  }, [currentStep, data]);

  useEffect(() => {
    if (!onProgressChange) return;
    // UX requirement: once user generates the plan (summary screen), show full progress.
    const percent =
      currentStep >= 5
        ? 100
        : Math.round((displayStep / displayTotalSteps) * 100);
    onProgressChange(percent);
  }, [currentStep, displayStep, displayTotalSteps, onProgressChange]);

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
      const hasSelectedTopics = (data.selectedTopics?.length || 0) > 0;
      const hasCustomTopic = data.customTopics && data.customTopics.length > 0 && data.customTopics[0]?.trim();
      if (!hasSelectedTopics && !hasCustomTopic) {
        stepErrors.push("Choose at least one topic or describe a custom request for a tailored plan.");
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
      if (!data.learningGoal) stepErrors.push("Please select your learning goal.");
      if (!data.preferredFormat) stepErrors.push("Please select preferred training format.");
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
        // Temporarily skip Step 2 (audience screen) from UI flow.
        if (currentStep === 1) {
          if (!data.trainingAudience) {
            updateData("trainingAudience", "myself");
          }
          setCurrentStep(3);
          return;
        }
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      // Keep backward navigation aligned with temporary Step 2 skip.
      if (currentStep === 3) {
        setCurrentStep(1);
        return;
      }
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <Card className="p-0 bg-transparent shadow-none border-0 rounded-none animate-fade-in-up delay-200">
        {/* Step 1: Training Support Selection */}
        {currentStep === 1 && (
          <div>
            <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#C8973A] mb-3">
              Capability Development - Step 2 of 5
            </div>
            <h2 className="text-[44px] sm:text-[52px] leading-[1.06] font-bold text-[#171717] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Select your <em className="text-[#C8973A] not-italic">capability areas</em>
            </h2>
            <p className="text-[13px] text-[#6B7280] mb-6 max-w-2xl">
              Choose the development areas that match your priorities. Select all that apply.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {trainingSupportOptions.map((option) => {
                const isSelected = data.trainingSupport.includes(option.value);
                const icon = getCategoryEmoji(option.value);
                
                return (
                  <div key={option.value}>
                  <button
                    onClick={() => toggleTrainingSupport(option.value)}
                          className={`w-full p-4 rounded-[4px] border text-left transition-colors duration-150 ease-out relative ${
                            isSelected
                              ? "border-[#C8973A] bg-[#FAF4E8]"
                              : "border-[#E8E2D8] bg-[#FDFCF9] hover:border-[#C8973A] hover:bg-[#FAF4E8]"
                          }`}
                        >
                          {isSelected && (
                            <span className="absolute top-2 right-2 w-[17px] h-[17px] rounded-full bg-[#C8973A] text-white text-[10px] font-bold flex items-center justify-center">
                              ✓
                            </span>
                          )}
                          <div className="flex items-center gap-2 mb-1 pr-5">
                            <span className="text-[14px] leading-none">{icon}</span>
                            <h3 className="text-[14px] font-bold text-[#0A0A0A]">
                              {option.label}
                            </h3>
                          </div>

                          {/* Description - using first part of tooltip as description */}
                          <p className="text-[11px] text-[#7A7570] leading-[1.35] line-clamp-2">
                            {option.tooltip}
                          </p>
                        </button>
                  </div>
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
            <div className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#B8862F] mb-3">
              Capability Development - Step 2 of 5
            </div>
            <h2
              className="text-[48px] sm:text-[58px] leading-[1.04] font-bold text-[#111111] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              What <em className="text-[#C8973A] not-italic">outcomes</em> matter most?
            </h2>
            <p className="text-[14px] text-[#5F5A55] mb-6 max-w-2xl">
              Select the performance results you want this development program to achieve.
            </p>

            <div className="space-y-4">
              {outcomeCategories.map((category) => (
                <div key={`outcome-group-${category.name}`}>
                  <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#B8862F] mb-2 pb-1 border-b border-[#E8E2D8]">
                    {category.name}
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {category.outcomes.map((outcome) => {
                      const selected = data.outcomes.includes(outcome);
                      return (
                        <button
                          key={`outcome-pill-${outcome}`}
                          type="button"
                          onClick={() => toggleOutcome(outcome)}
                          className={`px-3.5 py-2 rounded-full border text-[13px] font-medium transition-all duration-150 ${
                            selected
                              ? "border-[#C8973A] bg-[#C8973A] text-white shadow-sm"
                              : "border-[#E8E2D8] bg-[#FDFCF9] text-[#3C3A36] hover:border-[#C8973A] hover:text-[#C8973A] hover:bg-[#FFF9EE]"
                          }`}
                        >
                          {outcome}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Label
                htmlFor="specificNotes"
                className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#3C3A36]"
              >
                Anything specific to add? (Optional)
              </Label>
              <Textarea
                id="specificNotes"
                value={data.specificNotes || ""}
                onChange={(e) => updateData("specificNotes", e.target.value)}
                placeholder="e.g. We are preparing for ISO certification and need compliance training across two departments..."
                className="mt-2 border-[#E8E2D8] bg-[#FDFCF9] min-h-[92px] text-[12px] placeholder:text-[#9A948D]"
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
                  Additional Information
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
                      Learning Goal <span className="text-red-500">*</span>
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
                  Preferred Training Format <span className="text-red-500">*</span>
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
            className="h-10 px-8 rounded-[2px] border border-[#E8E2D8] bg-[#FDFCF9] text-[#7A7570] text-[12px] font-medium hover:bg-[#FDFCF9] hover:border-[#CFC7BC] hover:text-[#3C3A36] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Back
          </Button>
          {currentStep !== 5 ? (
            <Button
              onClick={handleNext}
              disabled={isSubmitting}
              className="h-[54px] px-14 rounded-[2px] bg-[#FFC72F] text-[#2E4059] text-[12px] font-black uppercase tracking-[0.12em] hover:bg-[#F5AF19] disabled:opacity-45 disabled:cursor-not-allowed transition-colors duration-150"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#2E4059] mr-2"></div>
                  Submitting...
                </>
              ) : currentStep === 4 ? (
                "Generate Capability Plan →"
              ) : currentStep === totalSteps ? (
                "Submit"
              ) : (
                "Continue →"
              )}
            </Button>
          ) : (
            <div />
          )}
        </div>
        <div className="mt-3 text-right text-xs text-slate-500">
          {saveState === "saving" ? "Saving progress..." : "Progress auto-saved"}
        </div>
      </Card>
    </div>
  );
}

// Data constants
const trainingSupportOptions = [
  {
    value: "soft-skill",
    label: "Soft Skills",
    tooltip:
      "Communication, teamwork, time management, conflict resolution, coaching",
  },
  {
    value: "technical-hard-skill",
    label: "Technical / Hard Skills",
    tooltip: "Software, system skills, regulatory, safety, internal policies",
  },
  {
    value: "behavior-mindset",
    label: "Behavioral & Mindset",
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
    label: "Compliance & Mandatory",
    tooltip: "Regulatory, safety, internal policies",
  },
  {
    value: "team-culture",
    label: "Team & Culture Development",
    tooltip: "Collaboration, intelligent, trust, engagement, culture-building",
  },
  {
    value: "industry-specific",
    label: "Industry / Department Specific",
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
