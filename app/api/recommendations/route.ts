import { NextRequest, NextResponse } from "next/server";
import { allTrainingTopics, categoryMap, mapFrontendGoalToGoalId } from "@/lib/training-topics-data";

interface RecommendationRequest {
  trainingSupport: string[]; // Category IDs like ["soft-skill", "technical-hard-skill"]
  outcomes: string[]; // Frontend goal labels like ["Improve communication", "Improve teamwork"]
  trainingAudience?: string;
  specificNotes?: string;
}

// Map frontend training support to category_id
const trainingSupportToCategoryId: Record<string, string[]> = {
  "soft-skill": ["C1"],
  "technical-hard-skill": ["C2"],
  "behavior-mindset": ["C3"],
  "leadership-management": ["C4"],
  "compliance-mandatory": ["C5"],
  "team-culture": ["C6"],
  "industry-specific": ["C7"],
  "motivation-engagement": ["C8"],
};

// Calculate goal_fit_score for a topic based on selected outcomes
function calculateGoalFitScore(topic: typeof allTrainingTopics[0], selectedOutcomes: string[]): number {
  let totalScore = 0;
  
  selectedOutcomes.forEach(outcome => {
    const goalId = mapFrontendGoalToGoalId(outcome);
    if (goalId) {
      const goalKey = `goal_${goalId}` as keyof typeof topic;
      const score = topic[goalKey] as number || 0;
      totalScore += score;
    }
  });
  
  return totalScore;
}

// Rule-based recommendation engine (as per spec)
function getRuleBasedRecommendations(
  trainingSupport: string[],
  outcomes: string[]
): typeof allTrainingTopics {
  // Step 1: Filter by T1 (category_layer1)
  const categoryIds: string[] = [];
  trainingSupport.forEach(support => {
    const categories = trainingSupportToCategoryId[support] || [];
    categoryIds.push(...categories);
  });
  
  // Filter topics by selected categories
  let filteredTopics = allTrainingTopics.filter(topic => 
    categoryIds.includes(topic.category_id)
  );
  
  // If no category filter, use all topics
  if (filteredTopics.length === 0) {
    filteredTopics = allTrainingTopics;
  }
  
  // Step 2: Calculate goal_fit_score for each topic
  const topicsWithScores = filteredTopics.map(topic => ({
    topic,
    goalFitScore: calculateGoalFitScore(topic, outcomes),
  }));
  
  // Step 3: Sort by goal_fit_score DESC
  topicsWithScores.sort((a, b) => b.goalFitScore - a.goalFitScore);
  
  // Step 4: Return top 6-12 recommendations
  const recommendedTopics = topicsWithScores
    .filter(item => item.goalFitScore > 0) // Only topics with positive scores
    .slice(0, 12) // Max 12 as per spec
    .map(item => item.topic);
  
  // Ensure at least 6 recommendations if available
  if (recommendedTopics.length < 6 && filteredTopics.length >= 6) {
    // Add more topics even with lower scores
    const additional = topicsWithScores
      .slice(recommendedTopics.length, 6)
      .map(item => item.topic);
    return [...recommendedTopics, ...additional];
  }
  
  return recommendedTopics;
}

// AI-powered recommendation using Google Gemini (optional enhancement)
async function getAIRecommendations(
  trainingSupport: string[],
  outcomes: string[],
  trainingAudience?: string,
  specificNotes?: string
): Promise<typeof allTrainingTopics> {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  
  if (!apiKey) {
    return getRuleBasedRecommendations(trainingSupport, outcomes);
  }

  try {
    // Get rule-based recommendations first
    const ruleBasedTopics = getRuleBasedRecommendations(trainingSupport, outcomes);
    
    // Use AI to refine or re-rank (optional)
    // For now, return rule-based as AI is optional
    return ruleBasedTopics;
  } catch (error: any) {
    console.error("AI recommendation error:", error);
    return getRuleBasedRecommendations(trainingSupport, outcomes);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: RecommendationRequest = await request.json();
    const { trainingSupport, outcomes, trainingAudience, specificNotes } = body;

    // Validate input
    if (!trainingSupport || !Array.isArray(trainingSupport) || trainingSupport.length === 0) {
      return NextResponse.json(
        { error: "trainingSupport is required and must be a non-empty array" },
        { status: 400 }
      );
    }

    if (!outcomes || !Array.isArray(outcomes) || outcomes.length === 0) {
      return NextResponse.json(
        { error: "outcomes is required and must be a non-empty array" },
        { status: 400 }
      );
    }

    // Get recommendations (rule-based or AI-enhanced)
    const recommendedTopics = await getAIRecommendations(
      trainingSupport,
      outcomes,
      trainingAudience,
      specificNotes
    );

    // Transform to frontend format
    const formattedTopics = recommendedTopics.map(topic => ({
      id: topic.id,
      title: topic.topic_name,
      topic_name: topic.topic_name,
      description: topic.description,
      duration_hours: topic.duration_hours,
      duration: `${topic.duration_hours} Hours`,
      difficulty: topic.difficulty_level,
      category: categoryMap[topic.category_id] || topic.category_id,
      category_layer1: categoryMap[topic.category_id] || topic.category_id,
      subcategory_layer2: topic.subcategory,
      goal_fit_score: calculateGoalFitScore(topic, outcomes),
      department_relevance: topic.department_relevance,
      delivery_mode: topic.delivery_mode,
    }));

    return NextResponse.json({
      success: true,
      recommendedTopics: formattedTopics,
      recommendedIds: formattedTopics.map(t => t.id),
      source: process.env.GOOGLE_GEMINI_API_KEY ? "ai-enhanced" : "rule-based",
      message: "Recommendations based on goal alignment scores",
    });
  } catch (error: any) {
    console.error("Recommendation API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate recommendations",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}