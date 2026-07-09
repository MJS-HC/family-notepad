#!/usr/bin/env node

/**
 * Family Diary - Automated Setup Tool
 *
 * Generates a customized index.html with embedded Firebase config
 * for each family, ready to deploy to Netlify.
 *
 * Usage:
 *   node setup-family.js --name "Family Name" --config "{...firebase config...}"
 *   node setup-family.js --name "Family Name" --config-file config.json
 *   node setup-family.js (interactive mode)
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(question) {
  return new Promise(resolve => {
    rl.question(question, resolve);
  });
}

async function main() {
  console.log('\n🚀 Family Diary - Setup Tool\n');

  // Get arguments
  const args = process.argv.slice(2);
  let familyName = '';
  let firebaseConfig = null;
  let configFilePath = null;
  let adminPin = '';
  let firstUserName = '';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--name' && args[i + 1]) {
      familyName = args[i + 1];
      i++;
    }
    if (args[i] === '--config' && args[i + 1]) {
      try {
        firebaseConfig = JSON.parse(args[i + 1]);
      } catch (e) {
        console.error('❌ Invalid Firebase config JSON');
        process.exit(1);
      }
      i++;
    }
    if (args[i] === '--config-file' && args[i + 1]) {
      configFilePath = args[i + 1];
      i++;
    }
    if (args[i] === '--admin-pin' && args[i + 1]) {
      adminPin = args[i + 1];
      i++;
    }
    if (args[i] === '--first-user' && args[i + 1]) {
      firstUserName = args[i + 1];
      i++;
    }
  }

  // Load config from file if specified
  if (configFilePath && !firebaseConfig) {
    try {
      const configContent = fs.readFileSync(configFilePath, 'utf8');
      firebaseConfig = JSON.parse(configContent);
    } catch (e) {
      console.error(`❌ Failed to read or parse config file "${configFilePath}": ${e.message}`);
      process.exit(1);
    }
  }

  // Interactive mode if not provided
  if (!familyName) {
    familyName = await prompt('Family name (e.g., "Matthews"): ');
    if (!familyName) {
      console.error('❌ Family name is required');
      process.exit(1);
    }

    // Ask for admin PIN
    while (!adminPin || adminPin.length < 6) {
      adminPin = await prompt('Admin PIN (6+ digits, e.g., "123456"): ');
      if (!adminPin || adminPin.length < 6) {
        console.log('❌ PIN must be at least 6 characters');
      }
    }

    // Ask for first user name
    firstUserName = await prompt('First user name (e.g., "Liz"): ');
    if (!firstUserName) {
      console.error('❌ First user name is required');
      process.exit(1);
    }
  }

  // Load config from file if not already loaded
  if (!firebaseConfig && !configFilePath) {
    const useFile = await prompt('Do you have a Firebase config file? (liz-config.json) [y/n]: ');
    if (useFile.toLowerCase() === 'y') {
      configFilePath = await prompt('Config file name (e.g., "liz-config.json"): ');
    }
  }

  if (!firebaseConfig) {
    console.log('\nEnter your Firebase config. You can find this in Firebase Console:');
    console.log('  1. Go to Project Settings (⚙️ icon, top left)');
    console.log('  2. Click "General" tab');
    console.log('  3. Scroll to "Your apps" and click Web icon (</>)');
    console.log('  4. Copy the firebaseConfig object\n');
    console.log('Paste the JSON (it can span multiple lines), then press Enter twice:\n');

    let configStr = '';
    let lastWasEmpty = false;

    // Read until we get two consecutive empty lines or valid JSON
    while (true) {
      const line = await prompt('');

      if (!line) {
        if (lastWasEmpty && configStr.trim()) break;
        lastWasEmpty = true;
      } else {
        lastWasEmpty = false;
        configStr += (configStr ? '\n' : '') + line;
      }

      // Try to parse what we have so far
      if (configStr.trim()) {
        try {
          firebaseConfig = JSON.parse(configStr.trim());
          break;
        } catch (e) {
          // Not valid JSON yet, keep reading
        }
      }
    }

    if (!firebaseConfig) {
      console.error('❌ Firebase config is required');
      process.exit(1);
    }
  }

  // Validate required fields
  const required = ['apiKey', 'authDomain', 'databaseURL', 'projectId'];
  const missing = required.filter(field => !firebaseConfig[field]);

  if (missing.length > 0) {
    console.error(`❌ Missing required Firebase fields: ${missing.join(', ')}`);
    process.exit(1);
  }

  // Read the template index.html
  const templatePath = path.join(__dirname, 'index.html');
  if (!fs.existsSync(templatePath)) {
    console.error('❌ index.html template not found in current directory');
    process.exit(1);
  }

  let htmlContent = fs.readFileSync(templatePath, 'utf8');

  // Generate username and color for first user
  let firstUserId = null;
  let users = {};

  if (firstUserName) {
    const COLOR_PALETTE = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
      '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#52C7A1',
      '#FF8C94', '#7DCFFF', '#FFDAB9', '#B4E7FF', '#FFB3BA'
    ];
    const username = firstUserName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    const color = COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
    firstUserId = 'user_' + Date.now();
    users[firstUserId] = {
      displayName: firstUserName,
      username: username,
      color: color,
      createdAt: Date.now()
    };
  }

  // Inject Firebase config to localStorage before the app runs
  const config_v2 = {
    firebaseConfig: firebaseConfig,
    adminPin: adminPin,
    users: users
  };
  const configInjection = `<script>(function(){try{localStorage.setItem('fn_config_v2',${JSON.stringify(JSON.stringify(config_v2))});}catch(e){console.error('Failed to save config:',e)}})()</script>\n`;
  const appStartIndex = htmlContent.indexOf('<!--APPSTART-->');

  if (appStartIndex === -1) {
    console.error('❌ Could not find <!--APPSTART--> marker in index.html');
    process.exit(1);
  }

  htmlContent = htmlContent.slice(0, appStartIndex) + configInjection + htmlContent.slice(appStartIndex);

  // Also update the initialization to auto-load the pre-configured Firebase
  const fnBootRegex = /var fnBooted=false;\s*function fnBoot\(\)/;
  const fnBootReplacement = `var fnBooted=false;
function fnBoot()`;

  htmlContent = htmlContent.replace(fnBootRegex, fnBootReplacement);

  // Insert auto-load logic after fnBoot function
  const autoLoadLogic = `
// Auto-load pre-configured Firebase if available
if(window.PRE_CONFIGURED_FIREBASE){
  currentConfig={firebaseConfig:window.PRE_CONFIGURED_FIREBASE,adminPin:'',users:{}};
  saveConfig(currentConfig);
  delete window.PRE_CONFIGURED_FIREBASE;
}`;

  const loadConfigIndex = htmlContent.indexOf('function fnBoot()');
  const fnBootBodyStart = htmlContent.indexOf('{', loadConfigIndex) + 1;
  htmlContent = htmlContent.slice(0, fnBootBodyStart) + autoLoadLogic + htmlContent.slice(fnBootBodyStart);

  // Generate output filename
  const sanitizedName = familyName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  const outputPath = path.join(__dirname, `${sanitizedName}-diary.html`);

  // Write the customized file
  fs.writeFileSync(outputPath, htmlContent, 'utf8');

  console.log(`\n✅ Success!\n`);
  console.log(`Generated: ${outputPath}\n`);
  console.log(`Configuration:`);
  if (adminPin) {
    console.log(`  📌 Admin PIN: ${adminPin}`);
  }
  if (firstUserName) {
    const username = firstUserName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    console.log(`  👤 First user: ${firstUserName} (username: ${username})`);
  }
  console.log(`\nNext steps:`);
  console.log(`  1. Deploy this file to Netlify:`);
  console.log(`     - Go to https://app.netlify.com`);
  console.log(`     - Drag & drop ${sanitizedName}-diary.html onto the deploy area`);
  console.log(`  2. Once deployed, Netlify will give you a URL`);
  console.log(`  3. Share that URL with ${familyName}'s family members`);
  console.log(`  4. They visit the URL and start using it immediately (no setup needed!)\n`);
  console.log(`📝 Admin Access:`);
  console.log(`  - Click the ⚙️ button in the top right`);
  if (adminPin) {
    console.log(`  - Enter PIN: ${adminPin}`);
  }
  console.log(`  - Add more users, change PIN, or adjust settings\n`);
  console.log(`📝 Firebase Setup Verification:`);
  console.log(`  ✓ Created Realtime Database`);
  console.log(`  ✓ Enabled Anonymous Authentication (Security → Authentication → Sign-in method)`);
  console.log(`  ✓ Updated Rules to: { ".read": "auth != null", ".write": "auth != null" }\n`);

  rl.close();
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  rl.close();
  process.exit(1);
});
