/**
 * Import Training Topics from CSV/TSV data
 * 
 * Usage:
 * 1. Save the CSV data from your mentor as a file: training-topics.tsv
 * 2. Run: npx tsx scripts/import-training-topics.ts
 */

import { getPool, initTrainingTopicsTable } from '../lib/db';
import * as fs from 'fs';
import * as path from 'path';

// Category mapping from C1-C8 to full names
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

interface TopicRow {
  id: string;
  category_id: string;
  subcategory: string;
  topic_name: string;
  description: string;
  duration_hours: number;
  difficulty_level: string;
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

function parseTSV(tsvContent: string): TopicRow[] {
  const lines = tsvContent.trim().split('\n');
  const headers = lines[0].split('\t').map(h => h.trim());
  
  const topics: TopicRow[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = line.split('\t').map(v => v.trim());
    if (values.length < headers.length) continue;
    
    const row: any = {};
    headers.forEach((header, index) => {
      let value = values[index] || '';
      
      // Parse numeric values
      if (header.startsWith('goal_G') || header === 'duration_hours') {
        value = value ? parseInt(value) || 0 : 0;
      }
      
      row[header] = value;
    });
    
    topics.push(row as TopicRow);
  }
  
  return topics;
}

async function importTopics() {
  try {
    console.log('Initializing training topics table...');
    await initTrainingTopicsTable();
    
    // Read the TSV file - you'll need to save the data from your mentor as training-topics.tsv
    const tsvPath = path.join(process.cwd(), 'training-topics.tsv');
    
    if (!fs.existsSync(tsvPath)) {
      console.error('❌ File not found: training-topics.tsv');
      console.log('📝 Please save the CSV data from your mentor as "training-topics.tsv" in the project root');
      console.log('   The file should be tab-separated (TSV format)');
      process.exit(1);
    }
    
    console.log('Reading TSV file...');
    const tsvContent = fs.readFileSync(tsvPath, 'utf-8');
    const topics = parseTSV(tsvContent);
    
    console.log(`Found ${topics.length} topics to import`);
    
    const pool = getPool();
    
    // Clear existing data (optional - comment out if you want to keep existing)
    console.log('Clearing existing topics...');
    await pool.query('DELETE FROM training_topics');
    
    // Insert topics in batches
    const batchSize = 50;
    let imported = 0;
    
    for (let i = 0; i < topics.length; i += batchSize) {
      const batch = topics.slice(i, i + batchSize);
      
      for (const topic of batch) {
        try {
          await pool.query(`
            INSERT INTO training_topics (
              topic_id, category_id, subcategory, topic_name, description,
              duration_hours, difficulty_level, delivery_mode, department_relevance,
              goal_G1, goal_G2, goal_G3, goal_G4, goal_G5, goal_G6,
              goal_G7, goal_G8, goal_G9, goal_G10, goal_G11, goal_G12
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
              category_id = VALUES(category_id),
              subcategory = VALUES(subcategory),
              topic_name = VALUES(topic_name),
              description = VALUES(description),
              duration_hours = VALUES(duration_hours),
              difficulty_level = VALUES(difficulty_level),
              delivery_mode = VALUES(delivery_mode),
              department_relevance = VALUES(department_relevance),
              goal_G1 = VALUES(goal_G1),
              goal_G2 = VALUES(goal_G2),
              goal_G3 = VALUES(goal_G3),
              goal_G4 = VALUES(goal_G4),
              goal_G5 = VALUES(goal_G5),
              goal_G6 = VALUES(goal_G6),
              goal_G7 = VALUES(goal_G7),
              goal_G8 = VALUES(goal_G8),
              goal_G9 = VALUES(goal_G9),
              goal_G10 = VALUES(goal_G10),
              goal_G11 = VALUES(goal_G11),
              goal_G12 = VALUES(goal_G12)
          `, [
            topic.id,
            topic.category_id,
            topic.subcategory || null,
            topic.topic_name,
            topic.description || null,
            topic.duration_hours || 0,
            topic.difficulty_level || 'Basic',
            topic.delivery_mode || null,
            topic.department_relevance || null,
            topic.goal_G1 || 0,
            topic.goal_G2 || 0,
            topic.goal_G3 || 0,
            topic.goal_G4 || 0,
            topic.goal_G5 || 0,
            topic.goal_G6 || 0,
            topic.goal_G7 || 0,
            topic.goal_G8 || 0,
            topic.goal_G9 || 0,
            topic.goal_G10 || 0,
            topic.goal_G11 || 0,
            topic.goal_G12 || 0,
          ]);
          
          imported++;
          if (imported % 10 === 0) {
            process.stdout.write(`\r✅ Imported ${imported}/${topics.length} topics...`);
          }
        } catch (error: any) {
          console.error(`\n❌ Error importing topic ${topic.id}:`, error.message);
        }
      }
    }
    
    console.log(`\n✅ Successfully imported ${imported} topics!`);
    
    // Show summary
    const [countResult]: any = await pool.query('SELECT COUNT(*) as count FROM training_topics');
    console.log(`📊 Total topics in database: ${countResult[0].count}`);
    
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  importTopics();
}

export { importTopics };
