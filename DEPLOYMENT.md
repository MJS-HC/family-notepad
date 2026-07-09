# Family Diary - Deployment Guide

This is the **Multi-Family Deployable Edition** of Family Diary. Each family can deploy this app to their own Firebase project and host it on the web.

## What You'll Need

1. **A Google Account** - To create a Firebase project (free)
2. **The HTML file** - `index.html` from this package
3. **A way to host it** - GitHub Pages, Netlify, or Firebase Hosting (all free)
4. **5-10 minutes** - To complete the setup

## Step 1: Create a Firebase Project

### 1.1 Go to Firebase Console

1. Visit [https://console.firebase.google.com](https://console.firebase.google.com)
2. Sign in with your Google Account
3. Click **"Create a project"** or **"Add project"**

### 1.2 Configure Your Project

1. **Project Name**: Enter something like "Family Notepad" or your family name
2. Click **"Continue"**
3. **Enable Google Analytics**: You can skip this (uncheck the box)
4. Click **"Create project"**
5. Wait for your project to initialize (about 1 minute)

### 1.3 Create a Realtime Database

Your Firebase project starts without a database. You need to create one:

1. In the Firebase console left sidebar, find **"Databases and storage"** (or scroll to find it)
2. Click **Realtime Database** 
3. Click **"Create Database"**
4. **Location**: Select a region close to you (e.g., `europe-west1` for Europe, `us-central1` for US)
5. **Security Rules**: Select **"Start in test mode"** 
6. Click **"Enable"**
7. Wait for the database to initialize (1-2 minutes)
8. You'll see a screen showing **"Data"** with your database URL at the top — **save this URL**, you'll need it later

### 1.4 Enable Anonymous Authentication

The app requires Firebase Anonymous Authentication. This must be done before you use the setup wizard:

1. In the Firebase console left sidebar, go to **Security** → **Authentication**
   - (Note: On some Firebase UIs, this is under the **"Security"** category, not "Build")
2. If you see a **"Get started"** button, click it to initialize Authentication
3. Click the **"Sign-in method"** tab
4. Find **"Anonymous"** in the provider list and click it
5. Toggle the switch to **"Enable"** (it should turn blue)
6. Click **"Save"**

**Important**: Without this step, the setup wizard will fail with "Sign-in failed" error.

### 1.5 Update Realtime Database Security Rules

Now that Anonymous Authentication is enabled, update your database rules to require authentication:

1. In the Firebase console left sidebar, click **Realtime Database**
2. Click the **"Rules"** tab (next to "Data")
3. Select all the text in the rules editor and delete it
4. Copy and paste this exactly:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

5. Click **"Publish"**
6. Wait for the publish to complete

This ensures only authenticated users can read or write to your database. The app handles authentication automatically, so your family won't notice any difference.

### 1.6 Get Your Credentials

Now collect the 4 credentials the setup wizard needs. They're in different places:

**For API Key, Auth Domain, and Project ID:**
1. Click the **⚙️ Settings gear icon** (top left of Firebase Console)
2. Click **"Project settings"**
3. Go to the **"General"** tab
4. Scroll down to **"Your apps"** section
5. Click the **Web app icon** (`</>`) — if one exists, select it; if not, click to create a new one
6. You'll see a code block with your config. Copy these values:
   - **API Key** (the `apiKey:` value, starts with `AIza...`)
   - **Auth Domain** (the `authDomain:` value, looks like `your-project.firebaseapp.com`)
   - **Project ID** (the `projectId:` value, e.g., `my-project`)

**For Database URL:**
1. Go back to **Realtime Database** (left sidebar)
2. Make sure you're on the **"Data"** tab
3. At the top of the page, you'll see your database URL (looks like `https://your-project-default-rtdb.region.firebasedatabase.app`)
4. Copy this URL

Keep all 4 values nearby — you'll need them in Step 3 for the setup wizard.

---

## Step 2: Download and Prepare the HTML File

1. Download `index.html` from this package
2. Open it in a text editor (VS Code, Notepad++, or even Notepad)
3. Save it somewhere you can find it (e.g., Desktop or Documents)
4. **Do not modify anything yet** - the setup wizard will configure it

---

## Step 3: Initial Setup Wizard

### 3.1 Open the File Locally

1. Open `index.html` in a web browser (just double-click it, or drag it into a browser window)
2. You should see a setup wizard modal with three steps

### 3.2 Step 1: Firebase Configuration

1. **API Key**: Paste your Firebase API Key from Step 1.6
2. **Auth Domain**: Paste your Auth Domain (e.g., `your-app.firebaseapp.com`)
3. **Database URL**: Paste your Database URL from Step 1.6 (e.g., `https://your-app-default-rtdb.firebaseio.com`)
4. **Project ID**: Paste your Project ID from Step 1.6
5. Click **"Test & Continue →"** to verify the connection
6. If successful, proceed to Step 2
   - **If you get a "Sign-in failed" error**: You didn't complete Step 1.4 (Enable Anonymous Authentication). Go back to Firebase Console and enable it, then try the test again.

### 3.3 Step 2: Create Admin PIN

1. **Create PIN**: Enter a 6+ digit PIN (e.g., `123456`)
2. **Confirm PIN**: Re-enter the same PIN
3. Click **"Continue →"**
4. ⚠️ **Write this PIN down!** You'll need it to add/remove users and access admin settings

### 3.4 Step 3: Add First User

1. **Display Name**: Enter the first user's name (e.g., "Matthew")
2. Username will auto-generate (e.g., "matthew")
3. A random color will be assigned
4. Click **"Generate different color"** if you want a different color
5. Click **"Create App →"**

### 3.5 First Use

Your app will reload with the newly configured settings. You should see:
- A list of user pills (currently just one user)
- A message area ready for input
- An admin button (⚙️) in the top right

---

## Step 4: Add More Users

1. Click the **⚙️ (Admin)** button in the top right
2. You'll be prompted for your admin PIN (from Step 3.3)
3. In the **"Users"** tab, click **"+ Add User"**
4. Enter the display name (e.g., "Rebecca")
5. A username and random color will be generated
6. Repeat to add all family members

---

## Step 5: Deploy to the Web

You can now host your app on the internet so family members can access it from anywhere.

### Option A: GitHub Pages (Easiest)

1. **Create a GitHub account** (if you don't have one): [https://github.com/signup](https://github.com/signup)

2. **Create a new repository**:
   - Go to [https://github.com/new](https://github.com/new)
   - Repository name: `family-notepad` (or any name)
   - Make it **Public**
   - Click **"Create repository"**

3. **Upload your file**:
   - Click **"uploading an existing file"** (in the quick setup section)
   - Drag and drop your `index.html` file
   - Commit the changes

4. **Enable GitHub Pages**:
   - Go to repository **Settings**
   - Go to **Pages** (left sidebar)
   - Source: Select **main** branch, **root** folder
   - Click **"Save"**

5. **Access your app**:
   - Wait a minute for GitHub to deploy
   - Your app will be at: `https://YOUR_USERNAME.github.io/family-notepad/`
   - Share this URL with your family

### Option B: Netlify (Also Easy)

1. Go to [https://netlify.com](https://netlify.com)
2. Click **"Sign up"**
3. Choose to sign up with GitHub (easiest)
4. Click **"New site from Git"**
5. Connect your GitHub account
6. Select your `family-notepad` repository
7. Keep default settings, click **"Deploy site"**
8. Your app will be live at a URL like `https://random-name.netlify.app`
9. You can change this to a custom domain in Site Settings

### Option C: Firebase Hosting

1. **Install Firebase CLI**:
   - Go to [https://firebase.google.com/docs/cli](https://firebase.google.com/docs/cli)
   - Follow installation instructions for your OS

2. **Initialize Firebase hosting** (in your project folder):
   ```
   firebase init hosting
   ```

3. **Deploy**:
   ```
   firebase deploy
   ```

4. Your app will be at `https://your-project-id.web.app`

---

## Sharing with Family

Once deployed, share the URL with family members. They can:
- **Add messages** by entering text and selecting their user
- **Tag messages** with dates/times for scheduling reminders
- **Manage messages** (delete, view deleted messages, etc.)
- **Print messages** for physical records

**Only you (the admin) can:**
- Add/remove users
- Change the admin PIN
- Reset the app

---

## Troubleshooting

### "Connection failed" during setup

- Check that Firebase credentials are correct
- Verify your Realtime Database is created in Firebase
- Make sure your database is in "Test Mode" (readable)
- Try refreshing and starting setup again

### Can't access the app from my phone

- Make sure the URL is correct and accessible
- Check that your phone is on the same internet or public internet
- If using GitHub Pages, it might take a minute after deployment

### Lost your admin PIN

Unfortunately, you'll need to do a factory reset:
1. Open the app in browser developer tools (F12)
2. Go to Console tab
3. Type: `localStorage.clear()` and press Enter
4. Refresh the page - setup wizard will reappear
5. Go through setup again

### Want to move to a different Firebase project

1. Click **⚙️ Admin** → **Settings**
2. Click **"Reset Configuration"**
3. Refresh the page - setup wizard will reappear
4. Configure new Firebase credentials

---

## Security Notes

- **Your Firebase credentials are stored in the HTML file** - This is normal for client-side apps. The API Key is public.
- **Real security comes from Firebase Rules** - Configure them to prevent unauthorized access
- **All users can read/edit messages** - This is a feature, not a bug. It's meant for family members
- **The admin PIN is not cryptographically secure** - It's just for UX convenience

---

## Need Help?

If you encounter issues:

1. Check that all Firebase credentials are correct
2. Verify your Realtime Database exists and is in Test Mode
3. Make sure JavaScript is enabled in your browser
4. Try clearing browser cache (Ctrl+Shift+Delete on Chrome)
5. Check browser console for error messages (F12 → Console tab)

---

## Advanced: Custom Domain

If hosting on GitHub Pages or Netlify, you can use a custom domain:

- **GitHub Pages**: Settings → Pages → Custom domain
- **Netlify**: Site settings → Domain management → Add custom domain

This allows URLs like `family-notes.yourdomain.com` instead of `github.io` URLs.

---

## Feedback and Updates

This is version 2.0 of Family Diary. If you have suggestions or find issues, please report them.

---

## License & Attribution

### Important Legal Notice

**Family Diary** is licensed under the **MIT License with Commons Clause**.

#### License Summary

- **Base License**: MIT License (permissive open-source license)
- **Commercial Restriction**: Commons Clause (requires negotiation for commercial use)
- **Status**: Free for personal/family/non-commercial use

#### Your Rights (Non-Commercial)
- ✅ Use the software freely
- ✅ Modify the source code
- ✅ Distribute your modifications
- ✅ Run the software on your own servers

#### Your Obligations
- **Attribution**: You must credit Matthew Swindells as the original author
- **Include License**: Distribute this license with the software

#### Commercial Use

If you intend to **commercialize** this software (sell, charge access fees, use in a paid service, or generate revenue), you must:

1. Contact: [matthew.j.swindells@gmail.com](mailto:matthew.j.swindells@gmail.com)
2. Negotiate a commercial license agreement
3. Discuss applicable licensing terms

**What counts as commercial use:**
- Selling access or subscriptions
- Offering as a SaaS product
- White-labeling for clients
- Bundling with paid products
- Using in a for-profit business
- Generating ad revenue from it

#### Disclaimer & Limitations

**No Warranty**: This software is provided "AS IS" without any warranty. Specifically:
- Functionality is not guaranteed
- Data persistence is not guaranteed
- Security is not guaranteed
- The author is not responsible for data loss or service interruptions

See `LICENSE.md` for the complete, legally binding license terms.

### Attribution Example

When using or distributing this software, include:

```
Family Diary
Copyright (c) 2026 Matthew Swindells
Licensed under MIT License with Commons Clause
https://github.com/[your-repo]
```

### Legal Resources

- **Full License**: See `LICENSE.md` in the project
- **Commons Clause**: [commonclause.com](https://commonclause.com)
- **MIT License**: [opensource.org/licenses/MIT](https://opensource.org/licenses/MIT)

---

**Happy note-taking!** 📝
