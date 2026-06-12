# Dual Deployment Guide - Original + Multi-Family Versions

This guide helps you maintain two separate deployments:
1. **Original Version** (Hardcoded) - For your family (already running)
2. **Multi-Family Version** (Configurable) - For families to self-deploy

## Deployment Architecture

```
Your Firebase Account
├─ Project A: "m-r-d-notepad" (Original - Swindells family)
└─ Project B: "notepad-multi-family" (New - Multi-family template)

Your Netlify Account
├─ Site A: "swindells-notepad" (Original - your family)
└─ Site B: "notepad-template" (New - for distribution)
```

---

## Pre-Deployment Checklist

### ✅ Verify No Setting Conflicts

Before deploying, confirm these settings are DIFFERENT between versions:

| Setting | Original | Multi-Family | Status |
|---------|----------|--------------|--------|
| **localStorage Key - Config** | N/A (hardcoded) | `fn_config_v2` | ✓ Different |
| **localStorage Key - User** | `fn_user` | `fn_user` | ⚠️ **SAME** |
| **localStorage Key - Pin** | `fn_derek_locked` | `fn_derek_locked` | ⚠️ **SAME** |
| **localStorage Key - Fonts** | `fn_font_main` | `fn_font_main` | ⚠️ **SAME** |
| **Firebase Project ID** | `m-r-d-notepad` | (different) | ✓ Different |
| **Netlify Site Name** | `swindells-notepad` | (different) | ✓ Different |
| **Domain/URL** | yourdomain.com | different-domain.com | ✓ Different |

### ⚠️ Important: localStorage Namespace Conflict

**The original and multi-family versions share the SAME localStorage keys** for:
- `fn_user` (current user)
- `fn_derek_locked` (PIN lock state)
- `fn_font_main` (font sizes)

**This is FINE because:**
- They're on different domains/URLs
- Each browser instance has separate localStorage per domain
- No risk of interference

**Example:**
```
Browser at: yourfamily.yoursite.com
  └─ localStorage: fn_user = "matthew"

Browser at: template.netlify.app
  └─ localStorage: fn_user = "jane" (different instance)
```

---

## Step 1: Keep Original Deployment Unchanged

### Current Setup (Don't Modify)
```
URL: https://yourfamily.yoursite.com/
File: index.html (ORIGINAL with hardcoded credentials)
Firebase Project: m-r-d-notepad
Status: LIVE - YOUR FAMILY USING THIS
```

**Action**: Do nothing. Leave this running.

---

## Step 2: Create New Firebase Project for Multi-Family Version

### 2.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Create a project"** (in your existing Firebase account)
3. **Project Name**: `notepad-multi-family` (or similar)
4. Keep default settings
5. **Uncheck** "Enable Google Analytics"
6. Click **"Create project"**

### 2.2 Create Realtime Database

1. In Firebase console → **Build** → **Realtime Database**
2. Click **"Create Database"**
3. **Location**: Same region as original (e.g., `europe-west1`)
4. **Security Rules**: **"Start in test mode"**
5. Click **"Enable"**

### 2.3 Get Credentials

1. Click ⚙️ **Settings** → **Project settings**
2. Go to **"General"** tab
3. Copy these values:
   - **API Key**
   - **Auth Domain**
   - **Project ID**
4. In **"Realtime Database"** section, copy:
   - **Database URL**

### 2.4 Verify New Project ID

```
Original:      m-r-d-notepad
Multi-Family:  notepad-multi-family (or your new name)
              ✓ DIFFERENT - Good!
```

---

## Step 3: Deploy to Netlify

### 3.1 Prepare Files

1. Download `index.html` from this repository
2. Verify it's the **Multi-Family Version** (should have setup wizard code)
3. Verify it does NOT contain your personal Firebase credentials
4. Check the file does NOT have:
   ```javascript
   var FIREBASE_CFG = {
     apiKey: "AIzaSyAxoyvPSNdJuh0fQBra_PJf-mNITrDzvdg",  // Your keys
     // ...
   };
   ```

### 3.2 Create New Netlify Site

1. Go to [netlify.com](https://netlify.com)
2. Sign in with your account
3. Click **"Add new site"** → **"Deploy manually"**
4. Drag & drop the `index.html` file
5. Netlify will assign a temporary URL (e.g., `notepad-template.netlify.app`)

### 3.3 Verify New Netlify Site

```
Original Netlify:      swindells-notepad.netlify.app (or yourdomain)
Multi-Family Netlify:  notepad-template.netlify.app (or custom domain)
                      ✓ DIFFERENT URLs - Good!
```

### 3.4 Optional: Custom Domain for Multi-Family

If you want a branded URL:
1. In Netlify → **Site settings** → **Domain management**
2. Add custom domain (e.g., `notepad-template.yoursite.com`)

---

## Step 4: Test Both Deployments

### Test Original (Should Work Unchanged)
```
1. Go to: https://yourfamily.yoursite.com/
2. Verify: Your family's app loads
3. Verify: Users and messages appear
4. Verify: Admin panel works with your PIN
5. Verify: No setup wizard appears
```

### Test Multi-Family (Should Show Setup Wizard)
```
1. Go to: https://notepad-template.netlify.app/
2. Verify: Setup wizard appears (Step 1)
3. Leave Firebase fields blank
4. Click "Continue"
5. Verify: Firebase creation guide modal appears
6. Click "Got It"
7. Verify: Setup wizard still there, ready for input
```

---

## Step 5: Final Verification Checklist

### ✅ Original Deployment
- [ ] Still accessible at current URL
- [ ] Uses original Firebase project (m-r-d-notepad)
- [ ] Hardcoded credentials work
- [ ] Family can still access messages
- [ ] PIN lock/admin features work

### ✅ Multi-Family Deployment
- [ ] Accessible at new URL
- [ ] Setup wizard appears on first load
- [ ] Different Firebase project assigned
- [ ] Does NOT contain your personal credentials
- [ ] Ready for others to configure

### ✅ No Conflicts
- [ ] Different Firebase projects
- [ ] Different Netlify URLs
- [ ] Different Firebase accounts/projects
- [ ] localStorage won't conflict (different domains)
- [ ] No hardcoded credentials in multi-family version

---

## Distribution: Sharing the Multi-Family Version

Once verified, you can share the multi-family version with others:

### For Families to Deploy:

**Option 1: Direct Download**
1. Download `index.html` from your template site
2. Open locally in browser
3. Follow setup wizard
4. Deploy to their own Netlify/GitHub Pages

**Option 2: GitHub Template**
1. Create GitHub repo with `index.html` + `DEPLOYMENT.md`
2. Mark as "template repository"
3. Families can click "Use this template"
4. Deploy their fork to Netlify

**Option 3: Live Template**
1. Share URL: `https://notepad-template.netlify.app/`
2. They complete setup in-browser
3. Can save locally and re-deploy

---

## Ongoing Management

### Updating Original Version
```
1. Keep current version running
2. Make updates only to your deployed version
3. No need to update template
```

### Updating Multi-Family Version
```
1. Update the template repository/files
2. Update on Netlify
3. No impact on your original deployment
4. Users deploying new versions will get updates
```

### Billing Check
```
Firebase:
  └─ Original: m-r-d-notepad (your usage)
  └─ Multi-Family: notepad-multi-family (template usage)
     (If used, separate project = separate billing)

Netlify:
  └─ Original: swindells-notepad (your usage)
  └─ Multi-Family: notepad-template (template usage)
     (Free tier covers both if low traffic)
```

---

## Quick Reference

### URLs to Remember

| Purpose | URL | Notes |
|---------|-----|-------|
| Your Family App | `yourfamily.yoursite.com` | Keep this unchanged |
| Multi-Family Template | `notepad-template.netlify.app` | For distribution |
| Original Firebase | `m-r-d-notepad` project | Your family data |
| Template Firebase | `notepad-multi-family` project | Others' data |

### Files to Keep Safe

- **Original `index.html`**: Your deployed version (has your credentials)
- **Template `index.html`**: Multi-family version (no credentials) - OK to share
- **LICENSE.md**: Same in both - required for distribution
- **DEPLOYMENT.md**: Same in both - for setup guide

---

## Troubleshooting

### Original Version Broken After Update
**Solution**: You didn't update the original. Check your current deployed version at `yourfamily.yoursite.com` - should still work.

### Template Showing Wrong Firebase Credentials
**Problem**: Original credentials leaked into template  
**Solution**: Verify `index.html` doesn't have `FIREBASE_CFG` hardcoded. Only `var USERS = [...]` should exist.

### localStorage Conflicts
**Problem**: Switching between URLs gives wrong user  
**Solution**: This is normal. Each URL has separate localStorage.

### Both Versions Pointing to Same Firebase
**Problem**: If both use same Firebase project, there's data collision  
**Solution**: Create separate Firebase project for template (Step 2)

---

## Summary

✅ **Original**: Running unchanged at your URL with your Firebase  
✅ **Multi-Family**: Deployed to separate URL with separate Firebase  
✅ **No Conflicts**: Different domains = different localStorage  
✅ **Shared Account**: Both under your Firebase/Netlify accounts  
✅ **Ready to Share**: Template version ready for families to deploy  

You can now safely distribute the multi-family version while keeping your family's original deployment completely separate and stable.
