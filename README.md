# Derek's Family Notepad - Multi-Family Deployable Edition

A free, open-source family activity tracker and shared notepad. Create your own instance with one click, configure your Firebase project with a guided walkthrough, and start tracking family activities immediately.

## ✨ Features

- 📝 **Shared Notepad**: Add messages, notes, and reminders
- 👥 **Multi-User**: Create users dynamically, assign colors
- 📅 **Date & Time Tagging**: Schedule reminders and upcoming activities
- 🗑️ **Message Management**: Archive, delete, or restore messages
- 🔐 **Admin Panel**: Manage users and settings
- 📱 **Mobile-Friendly**: Works on phones, tablets, and computers
- ⚡ **Free & Open Source**: No ads, no tracking, no cost
- 🔗 **Self-Hosted**: Your data stays with you

## 🚀 Quick Start (Recommended)

The fastest way to get started: **Click one button, follow 5 simple steps**.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/[your-username]/family-notepad&utm_source=github&utm_medium=readme)

> **What happens when you click:**
> 1. App deploys to Netlify automatically ✓
> 2. You get a live URL instantly ✓
> 3. Setup wizard opens to guide Firebase creation
> 4. Follow 5 simple steps (takes 5 minutes)
> 5. Start using your app!

### No Deploy Button? Manual Setup

If the button doesn't work:
1. Fork this repo to your GitHub account
2. Download `index.html` to your computer
3. Go to [Netlify](https://netlify.com) and drag-drop `index.html`
4. Follow the Firebase setup wizard that appears

## 📋 Setup Steps (After Deployment)

Once the app loads, the setup wizard will guide you through:

1. **Create Firebase Project** (guided walkthrough opens Firebase Console)
   - 5 simple steps with direct links
   - Project created automatically
   
2. **Set Admin PIN** (6+ digits)
   - You'll use this to manage users
   - Write it down!

3. **Add First User** (display name → auto-generates username & color)
   - Can add more users anytime from Admin Panel

4. **Start Using!**
   - Add messages, schedule activities, manage family info

## 🎯 Use Cases

### Family Coordination
- "Soccer game Friday at 3pm"
- "Grocery list for Saturday"
- "Who's cooking dinner?"

### Activity Tracking
- Upcoming appointments and reminders
- Family events and birthdays
- Chore assignments and tracking

### Shared Notes
- Family announcements
- Important information
- Quick reminders

## 🔐 License & Attribution

**MIT License with Commons Clause**

- ✅ **Free for personal/family use**
- ✅ **Modify and customize freely**
- ⚠️ **Commercial use requires permission** (see LICENSE.md)
- ✅ **Attribution required** - Credit Matthew Swindells

See [LICENSE.md](LICENSE.md) for complete terms.

## 💾 What You Get

This deployment includes:
- `index.html` - Complete app (all-in-one file)
- `LICENSE.md` - License terms
- `DEPLOYMENT.md` - Detailed deployment guide
- `netlify.toml` - Netlify configuration

## 🔧 How It Works

1. **One-Click Deploy**: Netlify automatically hosts your app
2. **Setup Wizard**: Guides you through Firebase project creation
3. **Dynamic Configuration**: Choose your own Firebase project
4. **Self-Hosted Data**: Your Firebase project = your data control
5. **Admin Panel**: Manage users, settings, and preferences from the app

## 📊 Architecture

```
Your Deployment
├── App (Netlify)
│   ├── HTML + CSS + JavaScript (all-in-one file)
│   └── Firebase SDK (embedded)
│
└── Database (Firebase)
    ├── Your Firebase Project
    ├── Realtime Database
    └── Your Family's Data
```

## ❓ FAQ

### Is this secure?
- Firebase project is yours - you control access
- Database rules are set to "Test Mode" initially (can be restricted)
- No data leaves your Firebase project
- HTTPS/SSL on all connections

### How much does it cost?
- **Netlify**: Free tier covers most families (12.5K requests/month)
- **Firebase**: Free tier includes 100 connections, 1GB storage
- Both have generous free tiers that work for families

### Can I customize it?
Yes! Download the code and modify it. You have full source code.

### What if I stop using it?
- Your data stays in Firebase
- You can export or download it anytime
- Just stop paying/hosting and it goes away

### Can I share this with other families?
Yes! See [DEPLOYMENT_SEPARATE.md](DEPLOYMENT_SEPARATE.md) for how to create a separate template for others.

## 🐛 Support & Issues

- **Setup problems?** See [DEPLOYMENT.md](DEPLOYMENT.md)
- **License questions?** See [LICENSE.md](LICENSE.md)
- **Want to improve it?** Fork and submit improvements!

## 📚 Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Detailed setup guide
- **[DEPLOYMENT_SEPARATE.md](DEPLOYMENT_SEPARATE.md)** - Guide for dual deployments
- **[LICENSE.md](LICENSE.md)** - License and terms
- **[CODEBASE_OVERVIEW.md](CODEBASE_OVERVIEW.md)** - Technical overview

## 🙏 Credits

**Original Author**: Matthew Swindells  
**License**: MIT + Commons Clause  
**Built with**: Firebase, Netlify, Vanilla JavaScript

## 🚀 Next Steps

1. **Click Deploy Button** (above) or download `index.html`
2. **Follow Setup Wizard** when app loads
3. **Create Firebase Project** using guided steps
4. **Add your family members** as users
5. **Start using!**

Questions? See [DEPLOYMENT.md](DEPLOYMENT.md) for complete instructions.

---

Made with ❤️ for families. Free, open-source, and yours to customize.
