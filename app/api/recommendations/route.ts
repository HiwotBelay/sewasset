import { NextRequest, NextResponse } from "next/server";

// Simple in-memory cache (in production, use Redis or similar)
const recommendationCache = new Map<string, { topics: any[]; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour cache

interface RecommendationRequest {
  trainingSupport: string[];
  outcomes: string[];
  trainingAudience?: string;
  specificNotes?: string;
}

// All available training topics with relationships (same as in component)
const allTrainingTopics = [
  {
    id: "effective-communication",
    title: "Effective Communication",
    description: "Master verbal and written communication skills",
    duration: "2 days",
    difficulty: "Beginner",
    category: "Soft Skills & Communication",
    relatedSupport: ["soft-skill"],
    relatedOutcomes: ["Improve communication", "Improve teamwork"],
  },
  {
    id: "team-collaboration",
    title: "Team Collaboration",
    description: "Build stronger team dynamics and collaboration",
    duration: "1 day",
    difficulty: "Intermediate",
    category: "Soft Skills & Communication",
    relatedSupport: ["soft-skill", "team-culture"],
    relatedOutcomes: ["Improve teamwork", "Improve engagement"],
  },
  {
    id: "managing-teams-effectively",
    title: "Managing Teams Effectively",
    description: "Core skills for middle managers",
    duration: "2 days",
    difficulty: "Intermediate",
    category: "Leadership & Management",
    relatedSupport: ["leadership-management"],
    relatedOutcomes: ["Improve leadership capability", "Improve team productivity"],
  },
  {
    id: "decision-making-uncertainty",
    title: "Decision Making Under Uncertainty",
    description: "Strategic decision frameworks",
    duration: "1 day",
    difficulty: "Advanced",
    category: "Leadership & Management",
    relatedSupport: ["leadership-management"],
    relatedOutcomes: ["Improve decision-making", "Improve problem-solving"],
  },
  {
    id: "delegation-empowerment",
    title: "Delegation & Empowerment",
    description: "Master the art of delegation",
    duration: "1 day",
    difficulty: "Beginner",
    category: "Leadership & Management",
    relatedSupport: ["leadership-management"],
    relatedOutcomes: ["Improve leadership capability", "Strengthen coaching skills"],
  },
  {
    id: "visionary-leadership",
    title: "Visionary Leadership & Change",
    description: "Leading through vision and organizational change",
    duration: "2 days",
    difficulty: "Advanced",
    category: "Leadership & Management",
    relatedSupport: ["leadership-management"],
    relatedOutcomes: ["Improve leadership capability"],
  },
  {
    id: "ethical-leadership",
    title: "Ethical Leadership & Governance",
    description: "Ethics and governance for senior leaders",
    duration: "1 day",
    difficulty: "Intermediate",
    category: "Leadership & Management",
    relatedSupport: ["leadership-management"],
    relatedOutcomes: ["Improve leadership capability"],
  },
  {
    id: "management-identity",
    title: "Building Your Management Identity",
    description: "Find your management style",
    duration: "1 day",
    difficulty: "Beginner",
    category: "Leadership & Management",
    relatedSupport: ["leadership-management"],
    relatedOutcomes: ["Improve leadership capability", "Strengthen coaching skills"],
  },
  {
    id: "digital-literacy",
    title: "Digital Literacy & Tools",
    description: "Essential digital skills for modern workplace",
    duration: "1 day",
    difficulty: "Beginner",
    category: "Technical & Digital Skills",
    relatedSupport: ["technical-hard-skill"],
    relatedOutcomes: ["Improve digital / software skill levels"],
  },
];

// Fallback rule-based recommendation (if AI fails)
function getRuleBasedRecommendations(
  trainingSupport: string[],
  outcomes: string[]
): string[] {
  const recommendedIds: string[] = [];
  
  // Smart matching logic based on relatedSupport and relatedOutcomes
  allTrainingTopics.forEach((topic) => {
    // Check if topic matches selected training support
    const matchesSupport = topic.relatedSupport?.some(support => 
      trainingSupport.includes(support)
    );
    // Check if topic matches selected outcomes
    const matchesOutcomes = topic.relatedOutcomes?.some(outcome => 
      outcomes.includes(outcome)
    );
    
    // Recommend if it matches either support category OR desired outcomes
    if (matchesSupport || matchesOutcomes) {
      recommendedIds.push(topic.id);
    }
  });
  
  // If no matches found, return all topics as last resort
  if (recommendedIds.length === 0) {
    console.warn("No rule-based matches found, returning all topics");
    return allTrainingTopics.map(t => t.id);
  }
  
  return recommendedIds;
}

// AI-powered recommendation using Google Gemini (FREE TIER)
async function getAIRecommendations(
  trainingSupport: string[],
  outcomes: string[],
  trainingAudience?: string,
  specificNotes?: string
): Promise<string[]> {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn("Google Gemini API key not found, using rule-based recommendations");
    return getRuleBasedRecommendations(trainingSupport, outcomes);
  }

  try {
    // Create cache key - include all relevant data for personalized caching
    // Sort arrays to ensure consistent cache keys for same selections
    const cacheKey = JSON.stringify({ 
      trainingSupport: [...trainingSupport].sort(), 
      outcomes: [...outcomes].sort(), 
      trainingAudience,
      specificNotes: specificNotes?.substring(0, 100) // Include notes for context
    });
    const cached = recommendationCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log("Returning cached recommendations for:", { trainingSupport, outcomes });
      return cached.topics.map((t: any) => t.id);
    }
    
    console.log("Fetching NEW AI recommendations for:", {
      trainingSupport,
      outcomes,
      trainingAudience,
      hasNotes: !!specificNotes
    });

    // Prepare context for AI
    const trainingSupportLabels: Record<string, string> = {
      "soft-skill": "Soft Skills & Communication",
      "technical-hard-skill": "Technical/Hard Skills",
      "behavior-mindset": "Behavior & Mindset",
      "leadership-management": "Leadership & Management",
      "compliance-mandatory": "Compliance/Mandatory Training",
      "team-culture": "Team & Culture Development",
      "industry-specific": "Industry/Department Specific Skills",
      "motivation-engagement": "Motivation & Engagement",
    };

    const supportText = trainingSupport.map(s => trainingSupportLabels[s] || s).join(", ");
    const outcomesText = outcomes.join(", ");
    const audienceText = trainingAudience || "Not specified";
    const notesText = specificNotes || "None";

    // Create detailed, context-aware prompt for AI
    const prompt = `You are an expert training recommendation system. Your task is to analyze the user's specific needs and recommend ONLY the most relevant training topics that directly address their requirements.

**USER'S SPECIFIC REQUIREMENTS:**
- Training Support Categories Needed: ${supportText}
- Desired Outcomes/Goals: ${outcomesText}
- Training Audience: ${audienceText}
- Additional Context/Notes: ${notesText}

**ANALYSIS INSTRUCTIONS:**
1. Carefully analyze which training topics directly address the user's selected training support categories
2. Prioritize topics that help achieve the user's specific desired outcomes
3. Consider the training audience context (${audienceText}) when making recommendations
4. If the user mentioned specific notes (${notesText}), use that context to refine recommendations
5. DO NOT recommend generic topics - be specific to the user's actual needs
6. If the user selected "Leadership & Management" support and wants "Improve leadership capability", prioritize leadership topics
7. If the user selected "Soft Skills" and wants "Improve communication", prioritize communication topics
8. Match the difficulty level and duration to the audience needs when relevant

**AVAILABLE TRAINING TOPICS:**
${allTrainingTopics.map((t, i) => `${i + 1}. ${t.title} (ID: ${t.id})
   - Description: ${t.description}
   - Category: ${t.category}
   - Difficulty: ${t.difficulty}
   - Duration: ${t.duration}
   - Related Support Categories: ${t.relatedSupport?.join(", ") || "N/A"}
   - Related Outcomes: ${t.relatedOutcomes?.join(", ") || "N/A"}`).join("\n\n")}

**YOUR TASK:**
Based on the user's specific selections above, recommend ONLY the topics that are MOST RELEVANT to their actual needs. 
- If they selected "Leadership & Management" and want "Improve leadership capability", recommend leadership topics
- If they selected "Soft Skills" and want "Improve communication", recommend communication topics
- If they selected "Technical Skills" and want "Improve digital skills", recommend technical topics
- Be selective - recommend 3-8 topics that truly match their needs, not generic recommendations

Return ONLY a valid JSON array of topic IDs. Example format: ["managing-teams-effectively", "effective-communication"]
IMPORTANT: Return different recommendations based on different user selections. Do not return the same topics for everyone.`;

    // Call Google Gemini API (FREE TIER)
    // Using gemini-pro (free tier model)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a helpful training recommendation assistant. Always return valid JSON arrays of topic IDs.\n\n${prompt}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.8, // Higher temperature for more varied, personalized responses
            maxOutputTokens: 800, // Increased for better reasoning
            topP: 0.9,
            topK: 40,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Gemini API error: ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "[]";
    
    // Parse AI response (handle markdown code blocks if present)
    let topicIds: string[] = [];
    try {
      // Remove markdown code blocks if present
      const cleaned = aiResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      topicIds = JSON.parse(cleaned);
      
      // Validate that all IDs exist
      const validIds = topicIds.filter((id: string) => 
        allTrainingTopics.some(t => t.id === id)
      );
      
      // Log AI recommendations for debugging
      console.log("=== AI RECOMMENDATION RESULTS ===");
      console.log("User selected Support:", trainingSupport);
      console.log("User selected Outcomes:", outcomes);
      console.log("AI recommended topic IDs:", validIds);
      console.log("AI recommended topics:", validIds.map(id => {
        const topic = allTrainingTopics.find(t => t.id === id);
        return topic ? `${topic.title} (${topic.category})` : id;
      }));
      console.log("=================================");
      
      // If AI returned no valid IDs, fallback to rule-based
      if (validIds.length === 0) {
        console.warn("AI returned no valid topic IDs, using fallback rule-based system");
        return getRuleBasedRecommendations(trainingSupport, outcomes);
      }
      
      // Cache the results
      const recommendedTopics = allTrainingTopics.filter(t => validIds.includes(t.id));
      recommendationCache.set(cacheKey, {
        topics: recommendedTopics,
        timestamp: Date.now(),
      });
      
      return validIds;
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      console.error("AI Response:", aiResponse);
      // Fallback to rule-based
      return getRuleBasedRecommendations(trainingSupport, outcomes);
    }
  } catch (error: any) {
    console.error("AI recommendation error:", error);
    // Fallback to rule-based recommendations
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

    // Get AI recommendations
    const recommendedTopicIds = await getAIRecommendations(
      trainingSupport,
      outcomes,
      trainingAudience,
      specificNotes
    );

    // Return recommended topics with full details
    const recommendedTopics = allTrainingTopics.filter(topic =>
      recommendedTopicIds.includes(topic.id)
    );

      // Determine source
      const source = process.env.GOOGLE_GEMINI_API_KEY ? "ai" : "rule-based";
      
      console.log("=== RECOMMENDATION API RESPONSE ===");
      console.log("Source:", source);
      console.log("Recommended IDs:", recommendedTopicIds);
      console.log("Number of recommendations:", recommendedTopicIds.length);
      console.log("====================================");
      
      return NextResponse.json({
        success: true,
        recommendedTopics: recommendedTopics,
        recommendedIds: recommendedTopicIds,
        source: source,
        message: source === "ai" 
          ? "AI-powered personalized recommendations" 
          : "Rule-based recommendations (AI unavailable)",
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
