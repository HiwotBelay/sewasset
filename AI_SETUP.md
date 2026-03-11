# AI Recommendation System Setup Guide

## Overview
The recommendation system uses **Google Gemini Pro** (FREE TIER) to provide intelligent, personalized training topic recommendations based on user selections.

## Features
- ✅ **100% FREE** - Uses Google Gemini free tier (no credit card required!)
- ✅ **Real-time AI recommendations** using Google Gemini API
- ✅ **Automatic fallback** to rule-based system if AI is unavailable
- ✅ **Caching** to reduce API calls (1-hour cache)
- ✅ **Secure** - API key stored server-side only

## Setup Instructions

### 1. Get Google Gemini API Key (FREE!)

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account (Gmail account works!)
3. Click **"Create API Key"**
4. Select or create a Google Cloud project (you can use default)
5. Copy the API key (starts with `AIza...`)

**That's it! No credit card required!**

### 2. Add API Key to Environment Variables

Create or update `.env.local` file in the root directory:

```bash
GOOGLE_GEMINI_API_KEY=AIza-your-api-key-here
```

**Important:** 
- Never commit `.env.local` to git (it's already in `.gitignore`)
- The API key is only used server-side for security

### 3. Install Dependencies (if needed)

The project already includes all necessary dependencies. No additional packages needed!

### 4. Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate through the training flow:
   - Select training support categories
   - Choose desired outcomes
   - Go to Step 4 (Training Topics)

3. You should see:
   - Loading indicator: "AI is analyzing your needs..."
   - AI-powered recommendations with "Recommended" badges
   - If API key is missing, it will use fallback rule-based system

## How It Works

### API Endpoint: `/api/recommendations`

**Request:**
```json
{
  "trainingSupport": ["soft-skill", "leadership-management"],
  "outcomes": ["Improve communication", "Improve teamwork"],
  "trainingAudience": "team",
  "specificNotes": "Need training for remote team"
}
```

**Response:**
```json
{
  "success": true,
  "recommendedTopics": [...],
  "recommendedIds": ["effective-communication", "team-collaboration"],
  "source": "ai"
}
```

### AI Model Used
- **Model:** `gemini-pro` (Google's free tier model)
- **Free Tier Limits:**
  - 15 requests per minute
  - 1,500 requests per day
  - More than enough for most use cases!

### Cost
- **100% FREE** - No charges, no credit card needed
- Free tier is generous for development and small-medium production use

## Troubleshooting

### AI Recommendations Not Working?

1. **Check API Key:**
   - Verify `.env.local` exists and has `GOOGLE_GEMINI_API_KEY`
   - Restart dev server after adding key
   - Make sure key starts with `AIza`

2. **Check Console:**
   - Look for errors in browser console
   - Check server logs for API errors

3. **Fallback System:**
   - If AI fails, system automatically uses rule-based recommendations
   - You'll see a yellow warning message

4. **API Rate Limits:**
   - Free tier: 15 requests/minute
   - Caching helps reduce API calls
   - If you hit limits, wait a minute and try again

### Common Issues

**"AI service unavailable"**
- API key missing or invalid
- Network issues
- Google Gemini API down (rare)
- Check if you've exceeded free tier limits

**Slow recommendations**
- First request takes 2-5 seconds (AI processing)
- Subsequent requests are cached (instant)
- Consider adding a loading skeleton

**"API key invalid"**
- Make sure you copied the full key
- Key should start with `AIza`
- Try generating a new key

## Customization

### Change AI Model
Edit `sewasset/app/api/recommendations/route.ts`:
```typescript
// Change model in the API URL
models/gemini-1.5-pro:generateContent  // More advanced (if available)
```

### Adjust Cache Duration
Edit `sewasset/app/api/recommendations/route.ts`:
```typescript
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours instead of 1 hour
```

### Modify AI Prompt
Edit the `prompt` variable in `route.ts` to change how AI makes recommendations.

## Production Deployment

1. **Add environment variable** in your hosting platform:
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Environment Variables
   - Other: Add `GOOGLE_GEMINI_API_KEY` to your environment

2. **Monitor usage:**
   - Check Google AI Studio dashboard for usage stats
   - Free tier is generous, but monitor if you have high traffic

3. **Consider:**
   - Upgrading to Redis for distributed caching
   - Adding rate limiting
   - Monitoring API response times

## Support

If you encounter issues:
1. Check Google AI Studio: https://aistudio.google.com/
2. Review Gemini API docs: https://ai.google.dev/docs
3. Check server logs for detailed error messages
4. Verify your API key is active in Google AI Studio
