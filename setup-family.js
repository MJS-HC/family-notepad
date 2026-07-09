#!/usr/bin/env node

/**
 * Family Diary - Automated Setup Tool
 *
 * Generates a customized index.html with embedded Firebase config
 * for each family, ready to deploy to Netlify.
 *
 * The app will ask for Family Name, Admin PIN, and First User on first load
 * and save them to Firebase.
 *
 * Usage:
 *   node setup-family.js --config "{...firebase config...}"
 *   node setup-family.js --config-file liz-config.json
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
  let firebaseConfig = null;
  let configFilePath = null;

  for (let i = 0; i < args.length; i++) {
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

  // Interactive mode if config not provided via CLI
  if (!firebaseConfig && !configFilePath) {
    const useFile = await prompt('Do you have a Firebase config file? (e.g., liz-config.json) [y/n]: ');
    if (useFile.toLowerCase() === 'y') {
      configFilePath = await prompt('Config file name: ');
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

  // Inject Firebase config to localStorage before the app runs
  const config_v2 = {
    firebaseConfig: firebaseConfig,
    adminPin: '',
    users: {}
  };
  const configInjection = `<script>(function(){try{localStorage.setItem('fn_config_v2',${JSON.stringify(JSON.stringify(config_v2))});}catch(e){console.error('Failed to save config:',e)}})()</script>\n`;
  const appStartIndex = htmlContent.indexOf('<!--APPSTART-->');

  if (appStartIndex === -1) {
    console.error('❌ Could not find <!--APPSTART--> marker in index.html');
    process.exit(1);
  }

  htmlContent = htmlContent.slice(0, appStartIndex) + configInjection + htmlContent.slice(appStartIndex);

  // Generate output filename from project ID
  const sanitizedName = firebaseConfig.projectId.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  const outputPath = path.join(__dirname, `${sanitizedName}-diary.html`);

  // Write the customized file
  fs.writeFileSync(outputPath, htmlContent, 'utf8');

  console.log(`\n✅ Success!\n`);
  console.log(`Generated: ${outputPath}\n`);
  console.log(`Next steps:`);
  console.log(`  1. Deploy this file to Netlify:`);
  console.log(`     - Go to https://app.netlify.com`);
  console.log(`     - Drag & drop ${sanitizedName}-diary.html onto the deploy area`);
  console.log(`  2. Once deployed, Netlify will give you a URL`);
  console.log(`  3. Share that URL with your family members`);
  console.log(`  4. When someone opens it for the FIRST TIME:`);
  console.log(`     - They'll see "Welcome to Family Diary"`);
  console.log(`     - They'll enter: Family Name, Admin PIN (6+ digits), First User Name`);
  console.log(`     - This is saved to Firebase for everyone to use\n`);
  console.log(`  5. On subsequent loads, the app loads from Firebase\n`);
  console.log(`📝 Admin Access:`);
  console.log(`  - Click the ⚙️ button in the top right`);
  console.log(`  - Enter the PIN that was set during first setup`);
  console.log(`  - Add more users, change PIN, or adjust settings\n`);
  console.log(`📝 Firebase Setup Verification (complete these first):`);
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
