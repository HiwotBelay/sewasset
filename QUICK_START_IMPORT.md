# Quick Start: Import Training Topics

## Step 1: Create the TSV File

1. **Create a new file** in your project root called: `training-topics.tsv`
   - Location: `C:\Users\HP\Desktop\sewasset\training-topics.tsv`

2. **Copy ALL the TSV data** from your mentor's message
   - Start with the header row: `id	category_id	subcategory	topic_name	...`
   - Include ALL data rows (200+ topics)
   - Make sure it's tab-separated (not spaces)

3. **Save the file**

## Step 2: Install tsx (if needed)

```bash
npm install -g tsx
```

Or use npx (no install needed):
```bash
npx tsx scripts/import-from-file.ts
```

## Step 3: Run the Import

```bash
npx tsx scripts/import-from-file.ts
```

## Step 4: Verify

The script will:
- ✅ Create the database table
- ✅ Import all topics
- ✅ Show a summary with count
- ✅ Display sample topics

## Expected Output

```
🚀 Starting import...
📄 Reading from training-topics.tsv file...
📊 Found 200+ topics to import
🗑️  Clearing existing topics...
✅ Imported 200+ topics!
📊 Total topics in database: 200+
```

## Troubleshooting

### "File not found: training-topics.tsv"
- Make sure the file is in the project root (same folder as `package.json`)
- Check the filename is exactly `training-topics.tsv` (not `.txt`)

### "Database configuration is missing"
- Check your `.env.local` file has database credentials
- Make sure the database is accessible

### "No topics found"
- Check your TSV file has the header row
- Make sure data is tab-separated (copy from Excel/Sheets as TSV)

## Next Steps

After successful import:
1. Test the API: `http://localhost:3000/api/training-topics`
2. Test recommendations: POST to `/api/recommendations`
3. Your system is ready! 🎉
