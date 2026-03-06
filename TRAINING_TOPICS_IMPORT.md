# Training Topics Import Guide

## Overview
Your mentor provided a comprehensive training topics ontology with 200+ topics and goal alignment scores. This guide will help you import it into the database.

## Step 1: Save the Data

1. Copy the **entire TSV data** from your mentor (the table with all columns)
2. Open `sewasset/scripts/import-topics-direct.ts`
3. Find the `TOPICS_DATA` constant (around line 12)
4. **Replace** the example data with your full TSV data
5. Make sure to keep the header row (first line) and all data rows

## Step 2: Run the Import

```bash
# Make sure you have tsx installed
npm install -g tsx

# Or use npx
npx tsx scripts/import-topics-direct.ts
```

## Step 3: Verify Import

The script will:
- ✅ Create the `training_topics` table if it doesn't exist
- ✅ Clear existing topics (if any)
- ✅ Import all topics from your data
- ✅ Show a summary of imported topics

## Step 4: Test the API

Once imported, test the API endpoint:

```bash
# Get all topics
curl http://localhost:3000/api/training-topics

# Search topics
curl http://localhost:3000/api/training-topics?search=communication

# Filter by category
curl http://localhost:3000/api/training-topics?category=C1

# Filter by difficulty
curl http://localhost:3000/api/training-topics?difficulty=Advanced
```

## Data Structure

The database table includes:
- **Basic Info**: `topic_id`, `topic_name`, `description`, `duration_hours`
- **Taxonomy**: `category_id` (C1-C8), `subcategory`, `difficulty_level`
- **Metadata**: `delivery_mode`, `department_relevance`
- **Goal Alignment**: `goal_G1` through `goal_G12` (scores 0-5)

## Category Mapping

- **C1**: Soft Skills
- **C2**: Technical / Hard Skills
- **C3**: Behavioral & Mindset
- **C4**: Leadership & Management
- **C5**: Compliance / Mandatory
- **C6**: Team & Culture Development
- **C7**: Industry / Department-Specific
- **C8**: Motivation & Engagement

## Goal Mapping

- **G1**: Improve team productivity
- **G2**: Reduce errors / rework
- **G3**: Increase speed of work / throughput
- **G4**: Improve problem-solving & decision-making
- **G5**: Improve communication & collaboration
- **G6**: Improve customer service / CSAT
- **G7**: Improve sales performance / conversion
- **G8**: Improve leadership capability / coaching
- **G9**: Improve engagement / reduce turnover
- **G10**: Ensure 100% compliance
- **G11**: Improve technical skill proficiency
- **G12**: Increase participation & completion of L&D programs

## Troubleshooting

### Error: "Database configuration is missing"
- Make sure your `.env.local` file has database credentials:
  ```
  DB_HOST=localhost
  DB_USER=your_username
  DB_PASSWORD=your_password
  DB_NAME=your_database
  DB_PORT=3306
  ```

### Error: "No topics found in data"
- Make sure you pasted the full TSV data including the header row
- Check that the data is tab-separated (not spaces)

### Error: "Table doesn't exist"
- The script should create it automatically
- If not, check database permissions

## Next Steps

After importing:
1. ✅ Topics are stored in database
2. ✅ API endpoint `/api/training-topics` is ready
3. ⏳ Update frontend to fetch from API (next step)
4. ⏳ Update recommendation algorithm to use goal scores
