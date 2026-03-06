/**
 * Write TSV Data to File
 * This script extracts the TSV data and writes it to training-topics.tsv
 */

import * as fs from 'fs';
import * as path from 'path';

// The full TSV data from your mentor's message
const FULL_TSV_DATA = `id	category_id	subcategory	topic_name	description	duration_hours	difficulty_level	delivery_mode	department_relevance	goal_G1	goal_G2	goal_G3	goal_G4	goal_G5	goal_G6	goal_G7	goal_G8	goal_G9	goal_G10	goal_G11	goal_G12
T053	C3	Adaptability	Innovation Mindset Development	Creative problem-solving orientation	8	Advanced	Workshop	All	4	2	3	5	3	1	3	3	3	0	1	2
T252	C3	Adaptability	Agility in Fast-Changing Markets	Responding to market shifts effectively	6	Advanced	Workshop	All	4	2	4	4	3	2	2	3	3	0	2	2
T067	C4	Change Management	Leading Organizational Change	Driving change adoption effectively	10	Advanced	Workshop	Senior Management	4	3	4	4	3	2	2	5	3	1	3	1
T076	C4	Change Management	Leading Through Crisis	Crisis decision-making leadership	8	Advanced	Workshop	Senior Management	4	3	4	5	3	2	2	5	3	1	2	1
T209	C4	Change Management	Transformation Leadership Strategy	Leading large-scale organizational change	12	Advanced	Workshop	Senior Management	5	4	4	5	4	2	2	5	3	1	3	1
T259	C4	Change Management	Digital Change Leadership	Leading digital adoption successfully	10	Advanced	Workshop	Senior Management	5	4	4	5	4	2	2	5	3	1	4	1
T065	C4	Coaching & Feedback	Coaching for Performance	Developing people through feedback	8	Advanced	Workshop	Managers	4	3	3	4	4	2	2	5	4	0	2	2
T152	C4	Coaching & Feedback	Advanced Coaching & Mentoring		8	Advanced	Workshop	Managers	4	2	2	3	3	1	1	5	4	0	0	1
T176	C4	Coaching & Feedback	Difficult Feedback Delivery	Delivering corrective feedback constructively	6	Advanced	Workshop	Managers	4	3	3	4	5	2	2	5	4	0	1	2
T258	C4	Coaching & Feedback	Feedback Culture Transformation	Building a feedback-rich organization	8	Advanced	Workshop	Managers	4	3	3	4	5	2	2	5	4	0	2	2
T192	C1	Collaboration	Stakeholder Collaboration Management	Managing internal and external stakeholders effectively	8	Advanced	Workshop	Managers	4	3	3	4	5	3	2	4	3	0	2	1
T174	C6	Collaboration Culture	High-Performance Culture Design		8	Advanced	Workshop	Leaders	4	2	2	4	3	1	1	5	5	0	0	1
T186	C6	Collaboration Culture	Building Collaborative Culture Systems	Embedding collaboration in company DNA	8	Advanced	Workshop	Management	5	3	4	4	5	2	2	4	5	0	1	2
T095	C1	Communication	Advanced Business Communication		8	Advanced	Workshop	All	4	3	3	4	5	2	2	3	3	0	0	1
T241	C1	Communication	Executive Communication Excellence	High-level communication for senior leaders	8	Advanced	Workshop	Senior Management	4	2	3	4	5	3	3	5	3	0	1	1`;

function writeTSVFile() {
  try {
    const filePath = path.join(process.cwd(), 'training-topics.tsv');
    
    // Check if we have data
    if (!FULL_TSV_DATA || FULL_TSV_DATA.split('\n').length < 2) {
      console.error('❌ No TSV data found. Please add the full dataset to this script.');
      process.exit(1);
    }
    
    // Write to file
    fs.writeFileSync(filePath, FULL_TSV_DATA, 'utf-8');
    
    const lineCount = FULL_TSV_DATA.split('\n').filter(l => l.trim()).length;
    console.log(`✅ Written ${lineCount - 1} topics to ${filePath}`);
    console.log(`📊 File size: ${(fs.statSync(filePath).size / 1024).toFixed(2)} KB`);
    
    return true;
  } catch (error: any) {
    console.error('❌ Error writing file:', error.message);
    return false;
  }
}

if (require.main === module) {
  writeTSVFile();
}

export { writeTSVFile };
