import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

// Goal mapping for API responses
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

// Category mapping
const categoryMap: Record<string, string> = {
  'C1': 'Soft Skills',
  'C2': 'Technical / Hard Skills',
  'C3': 'Behavioral & Mindset',
  'C4': 'Leadership & Management',
  'C5': 'Compliance / Mandatory',
  'C6': 'Team & Culture Development',
  'C7': 'Industry / Department-Specific',
  'C8': 'Motivation & Engagement',
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');
    const department = searchParams.get('department');
    const limit = parseInt(searchParams.get('limit') || '1000');

    const pool = getPool();
    let query = 'SELECT * FROM training_topics WHERE 1=1';
    const params: any[] = [];

    if (category) {
      query += ' AND category_id = ?';
      params.push(category);
    }

    if (subcategory) {
      query += ' AND subcategory = ?';
      params.push(subcategory);
    }

    if (difficulty) {
      query += ' AND difficulty_level = ?';
      params.push(difficulty);
    }

    if (department) {
      query += ' AND (department_relevance LIKE ? OR department_relevance = "All")';
      params.push(`%${department}%`);
    }

    if (search) {
      query += ' AND (MATCH(topic_name, description, subcategory) AGAINST(? IN NATURAL LANGUAGE MODE) OR topic_name LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(search, searchTerm, searchTerm);
    }

    query += ' ORDER BY topic_name LIMIT ?';
    params.push(limit);

    const [rows]: any = await pool.query(query, params);

    // Transform to match frontend interface
    const topics = rows.map((row: any) => ({
      id: row.topic_id,
      title: row.topic_name,
      topic_name: row.topic_name,
      description: row.description || '',
      duration: `${row.duration_hours}h`,
      duration_hours: row.duration_hours || 0,
      difficulty: row.difficulty_level === 'Basic' ? 'Beginner' : 
                  row.difficulty_level === 'Intermediate' ? 'Intermediate' : 'Advanced',
      category: categoryMap[row.category_id] || row.category_id,
      category_layer1: categoryMap[row.category_id] || row.category_id,
      subcategory_layer2: row.subcategory || '',
      delivery_mode: row.delivery_mode || 'Workshop',
      department_relevance: row.department_relevance || 'All',
      // Goal alignment scores
      goal_fit_score: {
        [goalMap['G1']]: row.goal_G1 || 0,
        [goalMap['G2']]: row.goal_G2 || 0,
        [goalMap['G3']]: row.goal_G3 || 0,
        [goalMap['G4']]: row.goal_G4 || 0,
        [goalMap['G5']]: row.goal_G5 || 0,
        [goalMap['G6']]: row.goal_G6 || 0,
        [goalMap['G7']]: row.goal_G7 || 0,
        [goalMap['G8']]: row.goal_G8 || 0,
        [goalMap['G9']]: row.goal_G9 || 0,
        [goalMap['G10']]: row.goal_G10 || 0,
        [goalMap['G11']]: row.goal_G11 || 0,
        [goalMap['G12']]: row.goal_G12 || 0,
      },
      // Raw goal scores for recommendation algorithm
      goal_scores: {
        G1: row.goal_G1 || 0,
        G2: row.goal_G2 || 0,
        G3: row.goal_G3 || 0,
        G4: row.goal_G4 || 0,
        G5: row.goal_G5 || 0,
        G6: row.goal_G6 || 0,
        G7: row.goal_G7 || 0,
        G8: row.goal_G8 || 0,
        G9: row.goal_G9 || 0,
        G10: row.goal_G10 || 0,
        G11: row.goal_G11 || 0,
        G12: row.goal_G12 || 0,
      },
    }));

    return NextResponse.json({ topics, count: topics.length });
  } catch (error: any) {
    console.error('Error fetching training topics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch training topics', details: error.message },
      { status: 500 }
    );
  }
}
