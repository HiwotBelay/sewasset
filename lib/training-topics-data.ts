export interface TrainingTopic {
  id: string;
  category_id: string;
  subcategory: string;
  topic_name: string;
  description: string;
  duration_hours: number;
  difficulty_level: "Basic" | "Intermediate" | "Advanced";
  delivery_mode: string;
  department_relevance: string;
  goal_G1: number;
  goal_G2: number;
  goal_G3: number;
  goal_G4: number;
  goal_G5: number;
  goal_G6: number;
  goal_G7: number;
  goal_G8: number;
  goal_G9: number;
  goal_G10: number;
  goal_G11: number;
  goal_G12: number;
}

// Import the generated data
import { allTrainingTopics as rawTopics } from './training-topics-data-raw';

// Transform to match frontend interface
export const allTrainingTopics: TrainingTopic[] = rawTopics.map((topic: any) => ({
  id: topic.id,
  category_id: topic.category_id,
  subcategory: topic.subcategory,
  topic_name: topic.topic_name,
  description: topic.description || '',
  duration_hours: topic.duration_hours || 0,
  difficulty_level: topic.difficulty_level as "Basic" | "Intermediate" | "Advanced",
  delivery_mode: topic.delivery_mode || 'Workshop',
  department_relevance: topic.department_relevance || 'All',
  goal_G1: topic.goal_G1 || 0,
  goal_G2: topic.goal_G2 || 0,
  goal_G3: topic.goal_G3 || 0,
  goal_G4: topic.goal_G4 || 0,
  goal_G5: topic.goal_G5 || 0,
  goal_G6: topic.goal_G6 || 0,
  goal_G7: topic.goal_G7 || 0,
  goal_G8: topic.goal_G8 || 0,
  goal_G9: topic.goal_G9 || 0,
  goal_G10: topic.goal_G10 || 0,
  goal_G11: topic.goal_G11 || 0,
  goal_G12: topic.goal_G12 || 0,
}));

// Category mapping (C1-C8 to category names)
export const categoryMap: Record<string, string> = {
  'C1': 'Soft Skills',
  'C2': 'Technical / Hard Skills',
  'C3': 'Behavioral & Mindset',
  'C4': 'Leadership & Management',
  'C5': 'Compliance / Mandatory',
  'C6': 'Team & Culture Development',
  'C7': 'Industry / Department-Specific',
  'C8': 'Motivation & Engagement',
};

// Goal mapping (G1-G12 to goal names for frontend)
export const goalMap: Record<string, string> = {
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

// Frontend goal labels (for display)
export const frontendGoalLabels: Record<string, string> = {
  'Improve team productivity': 'G1',
  'Reduce errors': 'G2',
  'Increase speed': 'G3',
  'Improve problem-solving': 'G4',
  'Improve communication': 'G5',
  'Improve teamwork': 'G5',
  'Improve customer service': 'G6',
  'Strengthen emotional intelligence': 'G5',
  'Improve leadership capability': 'G8',
  'Strengthen coaching skills': 'G8',
  'Conflict resolution': 'G8',
  'Decision-making': 'G8',
  'Improve sales performance': 'G7',
  'Increase CSAT': 'G6',
  'Reduce complaints': 'G6',
  'Improve engagement': 'G9',
  'Reduce turnover': 'G9',
  'Strengthen culture': 'G9',
  'Improve technical proficiency': 'G11',
  'Digital skills': 'G11',
  '100% compliance': 'G10',
  'Reduce regulatory errors': 'G10',
};

// Helper function to map frontend goal labels to goal IDs
export function mapFrontendGoalToGoalId(frontendGoal: string): string {
  // Direct mapping
  if (frontendGoalLabels[frontendGoal]) {
    return frontendGoalLabels[frontendGoal];
  }
  
  // Fuzzy matching
  const lowerGoal = frontendGoal.toLowerCase();
  if (lowerGoal.includes('productivity')) return 'G1';
  if (lowerGoal.includes('error')) return 'G2';
  if (lowerGoal.includes('speed') || lowerGoal.includes('throughput')) return 'G3';
  if (lowerGoal.includes('problem') || lowerGoal.includes('decision')) return 'G4';
  if (lowerGoal.includes('communication') || lowerGoal.includes('teamwork') || lowerGoal.includes('emotional')) return 'G5';
  if (lowerGoal.includes('customer') || lowerGoal.includes('csat') || lowerGoal.includes('complaint')) return 'G6';
  if (lowerGoal.includes('sales') || lowerGoal.includes('conversion')) return 'G7';
  if (lowerGoal.includes('leadership') || lowerGoal.includes('coaching') || lowerGoal.includes('conflict')) return 'G8';
  if (lowerGoal.includes('engagement') || lowerGoal.includes('turnover') || lowerGoal.includes('culture')) return 'G9';
  if (lowerGoal.includes('compliance') || lowerGoal.includes('regulatory')) return 'G10';
  if (lowerGoal.includes('technical') || lowerGoal.includes('digital') || lowerGoal.includes('software')) return 'G11';
  if (lowerGoal.includes('participation') || lowerGoal.includes('completion') || lowerGoal.includes('l&d')) return 'G12';
  
  return '';
}

