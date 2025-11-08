# Vercel Database Setup Guide

Your app is deployed at: **https://sewasset.vercel.app/**

Now we need to connect it to your cPanel database.

---

## Step 1: Enable Remote MySQL in cPanel

Since Vercel is an external service, we need to allow it to connect to your database.

1. **Go to cPanel** (https://www.sewasset.com:2083)
2. **Log in** with your username and password
3. **Find "Databases" section**
4. **Click "Remote MySQL"** (or "Remote MySQL Access")
5. **You'll see a text box to add hosts**

### Option A: Allow All IPs (Easier for Testing)

- In the text box, type: `%`
- Click **"Add Host"** or **"Add"**
- This allows connections from any IP (less secure, but works for testing)

### Option B: Allow Only Vercel IPs (More Secure)

- Vercel uses dynamic IPs, so this is harder
- You can add `%` for now, then restrict later

6. **You should see a success message**

---

## Step 2: Find Your Database Host

The database host might NOT be `localhost` when connecting from Vercel.

1. **In cPanel → MySQL Databases**
2. **Look for connection information** - it might show:
   - "MySQL Host: localhost"
   - OR "MySQL Host: sewasset.com"
   - OR another hostname

**Common hosts for external connections:**

- `sewasset.com` (your domain)
- `mysql.sewasset.com`
- `localhost` (only works if database is on same server)

**For Vercel, try:** `sewasset.com` or your domain name

---

## Step 3: Add Environment Variables in Vercel

1. **Go to Vercel Dashboard:** https://vercel.com/dashboard
2. **Click on your project** (sewasset)
3. **Click "Settings"** (top menu)
4. **Click "Environment Variables"** (left sidebar)
5. **Add these variables one by one:**

Click **"Add New"** for each:

**Variable 1:**

- **Key:** `DB_HOST`
- **Value:** `sewasset.com` (or whatever host you found, try this first)
- **Environment:** Production, Preview, Development (check all)
- Click **"Save"**

**Variable 2:**

- **Key:** `DB_USER`
- **Value:** `sewassts_sewasset_user`
- **Environment:** Production, Preview, Development (check all)
- Click **"Save"**

**Variable 3:**

- **Key:** `DB_PASSWORD`
- **Value:** `sewasset12345`
- **Environment:** Production, Preview, Development (check all)
- Click **"Save"**

**Variable 4:**

- **Key:** `DB_NAME`
- **Value:** `sewassts_sewasset_submissions`
- **Environment:** Production, Preview, Development (check all)
- Click **"Save"**

**Variable 5:**

- **Key:** `DB_PORT`
- **Value:** `3306`
- **Environment:** Production, Preview, Development (check all)
- Click **"Save"**

**Variable 6:**

- **Key:** `ADMIN_SECRET`
- **Value:** `sewasset-admin-secret-key-2024-change-this` (or change to something more secure)
- **Environment:** Production, Preview, Development (check all)
- Click **"Save"**

---

## Step 4: Redeploy Your App

After adding environment variables:

1. **In Vercel**, go to your project
2. **Click "Deployments"** tab
3. **Click the three dots** (⋯) on the latest deployment
4. **Click "Redeploy"**
5. **Wait for it to finish** (usually 1-2 minutes)

---

## Step 5: Test the Connection

1. **Go to:** https://sewasset.vercel.app/calculator
2. **Fill out the form completely**
3. **Click "Finish" to submit**
4. **Check if you see the "Thank You" message**

---

## Step 6: Verify Data Was Saved

1. **Go to cPanel → phpMyAdmin**
2. **Select your database:** `sewassts_sewasset_submissions`
3. **Click on "submissions" table**
4. **Click "Browse" tab**
5. **You should see your form submission!** 🎉

---

## Troubleshooting

### If you get "Cannot connect to database":

1. **Check Remote MySQL:**

   - Make sure you added `%` in Remote MySQL
   - Wait a few minutes for changes to take effect

2. **Try different DB_HOST values:**

   - Try: `sewasset.com`
   - Try: `mysql.sewasset.com`
   - Try: `www.sewasset.com`

3. **Check Vercel logs:**

   - In Vercel → Your Project → Deployments
   - Click on the latest deployment
   - Click "Functions" tab
   - Look for error messages

4. **Verify environment variables:**
   - Make sure all 6 variables are added
   - Make sure they're enabled for "Production"

### If Remote MySQL is not available:

Some hosting companies don't allow remote MySQL. In that case:

- You might need to contact your hosting provider
- OR deploy to the same server as the database (cPanel with Node.js)

---

## Success Checklist

- [ ] Remote MySQL enabled in cPanel (added `%`)
- [ ] All 6 environment variables added in Vercel
- [ ] App redeployed in Vercel
- [ ] Form submission works
- [ ] Data visible in phpMyAdmin

---

**Let's start with Step 1 - Enable Remote MySQL in cPanel!**
