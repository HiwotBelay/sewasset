/**
 * Import Training Topics from TSV File
 * 
 * Usage:
 * 1. Save your TSV data as: training-topics.tsv in the project root
 * 2. Run: npx tsx scripts/import-from-file.ts
 */

import { getPool, initTrainingTopicsTable } from '../lib/db';
import * as fs from 'fs';
import * as path from 'path';

// Parse TSV data
function parseTSV(tsvContent: string) {
  const lines = tsvContent.trim().split('\n').filter(line => line.trim());
  if (lines.length < 2) {
    throw new Error('Invalid TSV data: Need at least header and one data row');
  }
  
  const headers = lines[0].split('\t').map(h => h.trim());
  const topics: any[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Handle both tab and multiple spaces as separators
    const values = line.split(/\t+/).map(v => v.trim());
    if (values.length < headers.length) {
      console.warn(`Skipping incomplete row ${i + 1}: ${line.substring(0, 50)}...`);
      continue;
    }
    
    const row: any = {};
    headers.forEach((header, index) => {
      let value = values[index] || '';
      
      // Parse numeric values
      if (header.startsWith('goal_G') || header === 'duration_hours') {
        value = value ? parseInt(value) || 0 : 0;
      }
      
      row[header] = value;
    });
    
    topics.push(row);
  }
  
  return topics;
}

async function importTopics() {
  try {
    console.log('🚀 Starting import...');
    await initTrainingTopicsTable();
    
    // Try to read from file first
    const tsvPath = path.join(process.cwd(), 'training-topics.tsv');
    let tsvContent: string;
    
    if (fs.existsSync(tsvPath)) {
      console.log('📄 Reading from training-topics.tsv file...');
      tsvContent = fs.readFileSync(tsvPath, 'utf-8');
    } else {
      console.error('❌ File not found: training-topics.tsv');
      console.log('\n📝 Please create a file called "training-topics.tsv" in your project root');
      console.log('   Copy your TSV data from your mentor and paste it into that file.');
      console.log('   Make sure it includes the header row and all data rows.');
      process.exit(1);
    }
    
    const topics = parseTSV(tsvContent);
    console.log(`📊 Found ${topics.length} topics to import`);
    
    if (topics.length === 0) {
      console.error('❌ No topics found in data. Please check your TSV file format.');
      process.exit(1);
    }
    
    const pool = getPool();
    
    // Clear existing data
    console.log('🗑️  Clearing existing topics...');
    await pool.query('DELETE FROM training_topics');
    
    // Insert topics in batches
    let imported = 0;
    let errors = 0;
    
    for (const topic of topics) {
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
        if (imported % 50 === 0) {
          process.stdout.write(`\r✅ Imported ${imported}/${topics.length} topics...`);
        }
      } catch (error: any) {
        errors++;
        console.error(`\n❌ Error importing topic ${topic.id}:`, error.message);
      }
    }
    
    console.log(`\n✅ Successfully imported ${imported} topics!`);
    if (errors > 0) {
      console.log(`⚠️  ${errors} topics had errors`);
    }
    
    // Show summary
    const [countResult]: any = await pool.query('SELECT COUNT(*) as count FROM training_topics');
    console.log(`📊 Total topics in database: ${countResult[0].count}`);
    
    // Show sample of imported topics
    const [sample]: any = await pool.query('SELECT topic_id, topic_name, category_id FROM training_topics LIMIT 5');
    console.log('\n📋 Sample of imported topics:');
    sample.forEach((row: any) => {
      console.log(`   - ${row.topic_id}: ${row.topic_name} (${row.category_id})`);
    });
    
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Import failed:', error);
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n💡 Tip: Make sure your database is running and .env.local is configured correctly.');
    }
    process.exit(1);
  }
}

if (require.main === module) {
  importTopics();
}

export { importTopics };
