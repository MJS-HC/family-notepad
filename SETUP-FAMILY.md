# Family Diary - Setup Family Guide

This guide explains how to create a custom Family Diary deployment for a friend or family member.

## Prerequisites

You need to complete these steps in Firebase Console for the family.

### Step 1: Create Firebase Project and Database

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Create a project"** or **"Add project"**
3. Enter project name (e.g., "Matthews Family Diary")
4. Click **"Continue"** → uncheck "Enable Google Analytics" → **"Create project"**
5. Wait for it to initialize (1-2 minutes)
6. In the left sidebar, find **"Databases and storage"** section
7. Click **"Realtime Database"**
8. Click **"Create Database"**
9. Choose a region close to you (e.g., `europe-west1` for Europe)
10. Select **"Start in test mode"**
11. Click **"Enable"**
12. Wait for the database to initialize

### Step 2: Enable Anonymous Authentication

1. In Firebase Console left sidebar, go to **Security** → **Authentication**
   - (Note: Your Firebase UI groups it under "Security", not "Build")
2. If you see a **"Get started"** button, click it
3. Look for a list of sign-in providers (Email/Password, Google, Phone, Anonymous, etc.)
4. Find **"Anonymous"** in the list
5. Click on it
6. Toggle the switch to turn it **ON** (it should turn blue)
7. Click **"Save"**

✅ **Anonymous sign-in is now enabled for this project.**

### Step 3: Update Realtime Database Rules

The database currently allows anyone to read/write without authentication. We need to change that so only authenticated users can access it:

1. In Firebase Console, go to **Realtime Database** (left sidebar)
2. Click the **"Rules"** tab (next to the "Data" tab)
3. You'll see the current rules (something like `".read": true, ".write": false`)
4. **Select all the text** (Ctrl+A or Cmd+A)
5. **Delete it all**
6. **Copy and paste this exactly:**
   ```json
   {
     "rules": {
       ".read": "auth != null",
       ".write": "auth != null"
     }
   }
   ```
7. Click the blue **"Publish"** button at the bottom right
8. Wait for it to confirm (you'll see "✓ Rules published")

✅ **Database rules are now updated to require authentication.**

## Getting the Firebase Config

1. In Firebase Console, click the **⚙️ Settings icon** (top left)
2. Click **"Project settings"**
3. Go to the **"General"** tab
4. Scroll down to **"Your apps"** section
5. Click the **Web icon** (`</>`) — if one exists, select it; if not, create one
6. You'll see a code block like:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "project.firebaseapp.com",
     databaseURL: "https://project-default-rtdb.firebaseio.com",
     projectId: "my-project",
     // ... other fields
   };
   ```
7. **Copy just the config object** (from `{` to `}`, including the curly braces)

## Running the Setup Tool

First, open a terminal (Command Prompt, PowerShell, or bash) and navigate to the Family Diary directory:

```bash
cd "C:\ClaudeCode\Shareable Multi-user Diary App"
```

### Option 1: Interactive Mode (Easiest)

```bash
node setup-family.js
```

Then follow the prompts:
1. Enter the family name (e.g., "Matthews")
2. Paste your Firebase config when prompted

### Option 2: Command Line Arguments

```bash
node setup-family.js --name "Matthews" --config '{"apiKey":"AIzaSy...","authDomain":"...","databaseURL":"...","projectId":"..."}'
```

## Output

The tool generates a file like: `matthews-diary.html`

This file:
- ✅ Has the Firebase config embedded (no setup wizard needed)
- ✅ Is ready to deploy immediately
- ✅ Will work for any family member who visits the URL

## Deploying to Netlify

1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Sign in to your account
3. Click **"Add new site"** → **"Deploy manually"**
4. Drag & drop the `matthews-diary.html` file onto Netlify
5. Wait for it to deploy (1-2 minutes)
6. Netlify will show you a URL like `mystuff-12345.netlify.app`

## Customizing the Netlify URL

After deployment:
1. Go to your Netlify site
2. Click **"Site settings"**
3. Go to **"Domain management"**
4. Click **"Edit site name"**
5. Change it to something like `matthews-family-diary`
6. Your new URL will be: `matthews-family-diary.netlify.app`

You can also add a custom domain here (e.g., `diary.yourdomain.com`).

## Sharing with Family

Just share the Netlify URL with the family:
- Example: `matthews-family-diary.netlify.app`

When they visit:
- ✅ No setup wizard
- ✅ No Firebase configuration
- ✅ Just click and start using
- ✅ All family members see the same messages

## Adding More Families

Repeat the process for each family:
1. Create Firebase project + database + auth + rules
2. Get their Firebase config
3. Run `node setup-family.js` again
4. Generate their custom HTML
5. Deploy to Netlify
6. Share the URL

Each family gets their own separate app, separate URL, separate Firebase project, and separate data.

## Troubleshooting

**"index.html not found"**
- Make sure you're running the script from the Family Diary directory where `index.html` is located

**"Invalid Firebase config"**
- Make sure you copied the entire config object (including the curly braces)
- The config should have these 4 fields minimum:
  - `apiKey`
  - `authDomain`
  - `databaseURL`
  - `projectId`

**Family members get "Sign-in failed" error**
- You didn't enable Anonymous Authentication in Firebase Console (see Prerequisites step 3)

**Family members can't read/write messages**
- You didn't update the Realtime Database rules correctly (see Prerequisites step 4)
- Make sure the rules are published (click "Publish" button)

## Questions?

Refer to [DEPLOYMENT.md](DEPLOYMENT.md) for detailed Firebase setup instructions.
