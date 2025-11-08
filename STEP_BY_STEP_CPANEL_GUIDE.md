# Step-by-Step cPanel Database Setup Guide

Follow these steps EXACTLY in order. I'll guide you through each click.

---

## STEP 1: Open cPanel Website

1. Open your web browser (Chrome, Firefox, Edge, etc.)
2. Go to your cPanel URL (the company should have given you this)
   - Usually looks like: `https://yourdomain.com/cpanel` or `https://cpanel.yourdomain.com`
   - OR: `https://yourdomain.com:2083`
3. You should see a login page

---

## STEP 2: Login to cPanel

1. Enter your **Username** (the company gave you this)
2. Enter your **Password** (the company gave you this)
3. Click the **"Log in"** or **"Sign In"** button
4. Wait for the cPanel dashboard to load

---

## STEP 3: Find MySQL Databases Section

Once you're logged in, you'll see many icons/links. Look for:

1. Scroll down or look for a section called **"Databases"**
2. Find and click on **"MySQL Databases"** (it might have a database icon)
   - OR look for **"MySQL Database Wizard"** (this is easier for beginners)
3. The page will load with database options

---

## STEP 4: Create a New Database

**If you clicked "MySQL Databases":**

1. Scroll down to the section **"Create New Database"**
2. In the text box, type: `sewasset_submissions`
3. Click the **"Create Database"** button
4. You'll see a success message
5. **IMPORTANT**: Look at the FULL database name shown - it will have your username prefix
   - Example: If your username is `company123`, the full name will be: `company123_sewasset_submissions`
   - **WRITE THIS DOWN** - you'll need it later!

**If you clicked "MySQL Database Wizard":**

1. Step 1: Enter database name: `sewasset_submissions`
2. Click **"Next Step"**
3. You'll see the full database name with prefix
4. **WRITE DOWN THE FULL NAME** (e.g., `company123_sewasset_submissions`)
5. Click **"Next Step"** to continue

---

## STEP 5: Create a Database User

**If you're in "MySQL Databases":**

1. Scroll down to **"Add New User"** section
2. In the **"Username"** field, type: `sewasset_user`
3. In the **"Password"** field, type a strong password (or click "Generate Password" for a secure one)
   - **WRITE DOWN THIS PASSWORD** - you'll need it!
4. Click **"Create User"** button
5. You'll see a success message
6. **IMPORTANT**: Look at the FULL username shown - it will have your username prefix
   - Example: `company123_sewasset_user`
   - **WRITE THIS DOWN** - you'll need it later!

**If you're in "MySQL Database Wizard":**

1. Step 2: Enter username: `sewasset_user`
2. Enter a strong password (or generate one)
   - **WRITE DOWN THIS PASSWORD**
3. Click **"Create User"**
4. You'll see the full username with prefix
5. **WRITE DOWN THE FULL USERNAME** (e.g., `company123_sewasset_user`)
6. Click **"Next Step"**

---

## STEP 6: Add User to Database (Give Permissions)

**If you're in "MySQL Databases":**

1. Scroll down to **"Add User to Database"** section
2. In the first dropdown, select your user: `company123_sewasset_user` (or whatever your full username is)
3. In the second dropdown, select your database: `company123_sewasset_submissions` (or whatever your full database name is)
4. Click the **"Add"** button
5. On the next page, you'll see checkboxes for privileges
6. **Check the box "ALL PRIVILEGES"** (this gives full access)
7. Click **"Make Changes"** button
8. You'll see a success message

**If you're in "MySQL Database Wizard":**

1. Step 3: Select your user and database (they should already be selected)
2. Check **"ALL PRIVILEGES"**
3. Click **"Next Step"**
4. You're done! Click **"Return Home"** or close the wizard

---

## STEP 7: Find Your Database Host

1. Still in cPanel, look for **"Remote MySQL"** in the Databases section
   - OR look at the top of the MySQL Databases page
2. The host is usually shown there
3. **Most common hosts are:**
   - `localhost` (90% of the time)
   - `127.0.0.1`
   - Sometimes: `mysql.yourdomain.com`
4. **WRITE DOWN THE HOST** (it's probably `localhost`)

---

## STEP 8: Write Down All Your Information

You should now have these 4 pieces of information:

1. **DB_HOST**: `localhost` (or whatever you found)
2. **DB_USER**: `company123_sewasset_user` (your FULL username with prefix)
3. **DB_PASSWORD**: `YourPassword123!` (the password you created)
4. **DB_NAME**: `company123_sewasset_submissions` (your FULL database name with prefix)

**Keep this information safe!**

---

## STEP 9: Create .env.local File in Your Project

1. Go back to your code editor (VS Code, etc.)
2. In your project root folder (where `package.json` is), create a new file
3. Name it exactly: `.env.local` (with the dot at the beginning!)
4. Open this file and paste this template:

```env
DB_HOST=localhost
DB_USER=your_full_username_here
DB_PASSWORD=your_password_here
DB_NAME=your_full_database_name_here
DB_PORT=3306
ADMIN_SECRET=change-this-to-a-secure-random-string-12345
```

5. **Replace the values with YOUR actual information:**
   - Replace `your_full_username_here` with your full username (e.g., `company123_sewasset_user`)
   - Replace `your_password_here` with your database password
   - Replace `your_full_database_name_here` with your full database name (e.g., `company123_sewasset_submissions`)
   - Replace `change-this-to-a-secure-random-string-12345` with any random string (e.g., `mySecretKey2024!`)

**Example of what it should look like:**

```env
DB_HOST=localhost
DB_USER=company123_sewasset_user
DB_PASSWORD=MySecurePass123!
DB_NAME=company123_sewasset_submissions
DB_PORT=3306
ADMIN_SECRET=mySecretAdminKey2024
```

6. **Save the file** (Ctrl+S or Cmd+S)

---

## STEP 10: Install MySQL Package

1. Open your terminal/command prompt in your project folder
2. Run this command:

```bash
npm install mysql2 --legacy-peer-deps
```

3. Wait for it to finish installing
4. You should see "added 1 package" or similar message

---

## STEP 11: Test the Connection

1. Make sure your `.env.local` file is saved with the correct information
2. Start your development server:

```bash
npm run dev
```

3. Wait for it to start (you'll see "Ready" message)
4. Open your browser and go to: `http://localhost:3000/calculator`
5. Fill out the form completely
6. Click "Finish" to submit
7. Check the terminal/console for any errors

---

## STEP 12: Check if Data Was Saved

### Option A: Check in phpMyAdmin (Easiest)

1. Go back to cPanel
2. Find **"phpMyAdmin"** in the Databases section
3. Click on **"phpMyAdmin"**
4. On the left sidebar, click on your database name (e.g., `company123_sewasset_submissions`)
5. You should see a table called **"submissions"**
6. Click on **"submissions"** table
7. Click the **"Browse"** tab at the top
8. **You should see your form submission data!** 🎉

### Option B: Check via Admin Page

1. In your browser, go to: `http://localhost:3000/admin`
2. Enter your ADMIN_SECRET (the one you put in `.env.local`)
3. Click "View Submissions"
4. You should see your submission!

---

## TROUBLESHOOTING

### If you get "Access denied" error:

- Double-check your username and password in `.env.local`
- Make sure you're using the FULL username (with prefix)
- Make sure the user was added to the database with ALL PRIVILEGES

### If you get "Unknown database" error:

- Double-check your database name in `.env.local`
- Make sure you're using the FULL database name (with prefix)
- Verify the database was created successfully in cPanel

### If you get "Can't connect" error:

- Check that DB_HOST is correct (usually `localhost`)
- Try `127.0.0.1` instead of `localhost`
- Check if your hosting provider has a different host

### If the table doesn't exist:

- The table is created automatically on first submission
- If it doesn't work, check the server logs for errors
- Make sure the user has CREATE privileges

---

## SUCCESS CHECKLIST

✅ Database created in cPanel  
✅ Database user created  
✅ User added to database with ALL PRIVILEGES  
✅ `.env.local` file created with correct information  
✅ mysql2 package installed  
✅ Form submission works without errors  
✅ Data visible in phpMyAdmin  
✅ Data visible on admin page

---

## Once Everything Works:

1. **Share with the company:**

   - The admin page URL: `https://yourdomain.com/admin`
   - The ADMIN_SECRET key (from `.env.local`)
   - They can now view all submissions!

2. **For production deployment:**
   - Make sure to add the same environment variables to your hosting platform
   - Never commit `.env.local` to git (it's already in `.gitignore`)

---

**Ready? Start with STEP 1 and let me know when you complete each step!**
