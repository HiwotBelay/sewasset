import * as fs from 'fs';
import * as path from 'path';

// Read TSV file
const tsvPath = path.join(process.cwd(), 'training-topics.tsv');
const tsvContent = fs.readFileSync(tsvPath, 'utf-8');

// Parse TSV
const lines = tsvContent.trim().split('\n');
const headers = lines[0].split('\t');

// Category mapping (C1-C8 to category names)
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

// Goal mapping (G1-G12 to goal names)
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

// Parse data
const topics = lines.slice(1).map((line, index) => {
  const values = line.split('\t');
  const topic: any = {};
  
  headers.forEach((header, i) => {
    const value = values[i]?.trim() || '';
    
    if (header.startsWith('goal_')) {
      // Remove any trailing \r characters
      const cleanValue = value.replace(/\r$/, '');
      topic[header] = parseInt(cleanValue) || 0;
    } else if (header === 'duration_hours') {
      topic[header] = parseInt(value) || 0;
    } else {
      // Remove any trailing \r characters
      topic[header] = value.replace(/\r$/, '');
    }
  });
  
  return topic;
});

// Generate TypeScript file
const output = `// Auto-generated from training-topics.tsv
// Total topics: ${topics.length}

export const allTrainingTopics = ${JSON.stringify(topics, null, 2)};

export const categoryMap: Record<string, string> = ${JSON.stringify(categoryMap, null, 2)};

export const goalMap: Record<string, string> = ${JSON.stringify(goalMap, null, 2)};
`;

// Write to file
const outputPath = path.join(process.cwd(), 'lib', 'training-topics-data-raw.ts');
fs.writeFileSync(outputPath, output, 'utf-8');

console.log(`✅ Generated ${topics.length} topics in ${outputPath}`);