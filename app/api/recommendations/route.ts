import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

// Goal mapping
const goalMap: Record<string, string> = {
  'G1': 'Improve team productivity',
  'G2': 'Reduce errors / rework',
  'G3': 'Increase speed of work / throughput',
  'G4': 'Improve problem-solving & decision-making',
  'G5': 'Improve communication & collaboration',
  'G6': 'Improve customer service / CSAT',
  'G7': 'Improve sales performance / conversion',
  'G8': 'Improve leadership capability / coaching',
  'G9': 'Improve engagement / reduce turnover',
  'G10': 'Ensure 100% compliance',
  'G11': 'Improve technical skill proficiency',
  'G12': 'Increase participation & completion of L&D programs',
};

// Map user-selected outcomes to goal IDs
function mapOutcomesToGoals(outcomes: string[]): string[] {
  const outcomeToGoal: Record<string, string> = {
    'Improve team productivity': 'G1',
    'Reduce errors': 'G2',
    'Increase speed of work': 'G3',
    'Improve problem-solving': 'G4',
    'Improve decision-making': 'G4',
    'Improve communication': 'G5',
    'Improve teamwork': 'G5',
    'Improve customer service': 'G6',
    'Improve sales performance': 'G7',
    'Improve leadership capability': 'G8',
    'Strengthen coaching skills': 'G8',
    'Improve engagement': 'G9',
    'Reduce turnover': 'G9',
    'Ensure 100% compliance': 'G10',
    'Improve technical proficiency': 'G11',
    'Improve digital / software skill levels': 'G11',
    'Increase participation & completion of L&D programs': 'G12',
  };

  const goalIds: string[] = [];
  outcomes.forEach(outcome => {
    // Try exact match first
    if (outcomeToGoal[outcome]) {
      goalIds.push(outcomeToGoal[outcome]);
    } else {
      // Try partial match
      for (const [key, goal] of Object.entries(outcomeToGoal)) {
        if (outcome.toLowerCase().includes(key.toLowerCase()) || 
            key.toLowerCase().includes(outcome.toLowerCase())) {
          if (!goalIds.includes(goal)) {
            goalIds.push(goal);
          }
        }
      }
    }
  });

  return goalIds;
}

// Calculate relevance score for a topic based on selected goals
function calculateRelevanceScore(topic: any, selectedGoals: string[]): number {
  if (selectedGoals.length === 0) return 0;

  let totalScore = 0;
  let maxPossibleScore = 0;

  selectedGoals.forEach(goalId => {
    const goalKey = `goal_${goalId}`;
    const score = topic[goalKey] || 0;
    totalScore += score;
    maxPossibleScore += 5; // Max score per goal is 5
  });

  // Normalize to 0-100 scale
  return maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      trainingSupport = [],
      outcomes = [],
      trainingAudience = '',
      department = '',
      specificNotes = '',
    } = body;

    // Map outcomes to goal IDs
    const selectedGoals = mapOutcomesToGoals(outcomes);

    // Use hardcoded data for now
    let rows: any[] = [];
    
    try {
      const { allTrainingTopics } = await import('@/lib/training-topics-data');
      rows = allTrainingTopics.map(topic => ({
        topic_id: topic.id,
        category_id: topic.category_id,
        subcategory: topic.subcategory,
        topic_name: topic.topic_name,
        description: topic.description,
        duration_hours: topic.duration_hours,
        difficulty_level: topic.difficulty_level,
        delivery_mode: topic.delivery_mode,
        department_relevance: topic.department_relevance,
        goal_G1: topic.goal_G1,
        goal_G2: topic.goal_G2,
        goal_G3: topic.goal_G3,
        goal_G4: topic.goal_G4,
        goal_G5: topic.goal_G5,
        goal_G6: topic.goal_G6,
        goal_G7: topic.goal_G7,
        goal_G8: topic.goal_G8,
        goal_G9: topic.goal_G9,
        goal_G10: topic.goal_G10,
        goal_G11: topic.goal_G11,
        goal_G12: topic.goal_G12,
      }));

      // Filter by department if provided
      if (department) {
        rows = rows.filter(topic => 
          topic.department_relevance.includes(department) || 
          topic.department_relevance === 'All'
        );
      }

      // Filter by training support categories
      const categoryMapFilter: Record<string, string[]> = {
        'soft-skill': ['C1'],
        'technical-hard-skill': ['C2'],
        'behavior-mindset': ['C3'],
        'leadership-management': ['C4'],
        'compliance-mandatory': ['C5'],
        'team-culture': ['C6'],
        'industry-specific': ['C7'],
        'motivation-engagement': ['C8'],
      };

      if (trainingSupport.length > 0) {
        const categories: string[] = [];
        trainingSupport.forEach((support: string) => {
          if (categoryMapFilter[support]) {
            categories.push(...categoryMapFilter[support]);
          }
        });
        
        if (categories.length > 0) {
          rows = rows.filter(topic => categories.includes(topic.category_id));
        }
      }
    } catch (error) {
      console.error('Error loading hardcoded topics:', error);
      // Fallback to database if available
      try {
        const pool = getPool();
        let query = 'SELECT * FROM training_topics WHERE 1=1';
        const params: any[] = [];

        if (department) {
          query += ' AND (department_relevance LIKE ? OR department_relevance = "All")';
          params.push(`%${department}%`);
        }

        const categoryMapFilter: Record<string, string[]> = {
          'soft-skill': ['C1'],
          'technical-hard-skill': ['C2'],
          'behavior-mindset': ['C3'],
          'leadership-management': ['C4'],
          'compliance-mandatory': ['C5'],
          'team-culture': ['C6'],
          'industry-specific': ['C7'],
          'motivation-engagement': ['C8'],
        };

        if (trainingSupport.length > 0) {
          const categories: string[] = [];
          trainingSupport.forEach((support: string) => {
            if (categoryMapFilter[support]) {
              categories.push(...categoryMapFilter[support]);
            }
          });
          
          if (categories.length > 0) {
            query += ` AND category_id IN (${categories.map(() => '?').join(',')})`;
            params.push(...categories);
          }
        }

        query += ' ORDER BY topic_name';
        const [dbRows]: any = await pool.query(query, params);
        rows = dbRows;
      } catch (dbError) {
        console.error('Database fallback failed:', dbError);
      }
    }

    // Calculate relevance scores for each topic
    const topicsWithScores = rows.map((topic: any) => {
      const relevanceScore = calculateRelevanceScore(topic, selectedGoals);
      return {
        ...topic,
        relevanceScore,
      };
    });

    // Sort by relevance score (highest first)
    topicsWithScores.sort((a: any, b: any) => b.relevanceScore - a.relevanceScore);

    // Get top 4-5 recommendations
    const recommendedTopics = topicsWithScores.slice(0, 5).map((topic: any) => ({
      id: topic.topic_id,
      title: topic.topic_name,
      topic_name: topic.topic_name,
      description: topic.description || '',
      duration: `${topic.duration_hours}h`,
      duration_hours: topic.duration_hours || 0,
      difficulty: topic.difficulty_level === 'Basic' ? 'Beginner' : 
                  topic.difficulty_level === 'Intermediate' ? 'Intermediate' : 'Advanced',
      category: topic.category_id,
      subcategory: topic.subcategory || '',
      delivery_mode: topic.delivery_mode || 'Workshop',
      relevanceScore: topic.relevanceScore,
      goal_scores: {
        G1: topic.goal_G1 || 0,
        G2: topic.goal_G2 || 0,
        G3: topic.goal_G3 || 0,
        G4: topic.goal_G4 || 0,
        G5: topic.goal_G5 || 0,
        G6: topic.goal_G6 || 0,
        G7: topic.goal_G7 || 0,
        G8: topic.goal_G8 || 0,
        G9: topic.goal_G9 || 0,
        G10: topic.goal_G10 || 0,
        G11: topic.goal_G11 || 0,
        G12: topic.goal_G12 || 0,
      },
    }));

    return NextResponse.json({
      recommendations: recommendedTopics,
      source: 'database',
      selectedGoals,
      totalTopics: topicsWithScores.length,
    });
  } catch (error: any) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate recommendations', 
        details: error.message,
        recommendations: [] // Return empty array as fallback
      },
      { status: 500 }
    );
  }
}
