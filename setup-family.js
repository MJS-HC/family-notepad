#!/usr/bin/env node

/**
 * Family Diary - Automated Setup Tool
 *
 * Generates a customized index.html with embedded Firebase config
 * for each family, ready to deploy to Netlify.
 *
 * Usage:
 *   node setup-family.js --name "Family Name" --config "{...firebase config...}"
 *
 * Or interactive mode:
 *   node setup-family.js
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
  }

  // Interactive mode if not provided
  if (!familyName) {
    familyName = await prompt('Family name (e.g., "Matthews"): ');
    if (!familyName) {
      console.error('❌ Family name is required');
      process.exit(1);
    }
  }

  if (!firebaseConfig) {
    console.log('\nEnter your Firebase config. You can find this in Firebase Console:');
    console.log('  1. Go to Project Settings (⚙️ icon, top left)');
    console.log('  2. Click "General" tab');
    console.log('  3. Scroll to "Your apps" and click Web icon (</>)');
    console.log('  4. Copy the firebaseConfig object\n');

    const configStr = await prompt('Paste your Firebase config (as JSON): ');
    if (!configStr) {
      console.error('❌ Firebase config is required');
      process.exit(1);
    }

    try {
      firebaseConfig = JSON.parse(configStr);
    } catch (e) {
      console.error('❌ Invalid JSON. Make sure to paste the entire firebaseConfig object');
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

  // Inject Firebase config as a global variable (before the APPSTART comment)
  const configInjection = `\nwindow.PRE_CONFIGURED_FIREBASE = ${JSON.stringify(firebaseConfig)};\n`;
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
  console.log(`Next steps:`);
  console.log(`  1. Deploy this file to Netlify:`);
  console.log(`     - Go to https://app.netlify.com`);
  console.log(`     - Drag & drop ${sanitizedName}-diary.html onto the deploy area`);
  console.log(`  2. Once deployed, Netlify will give you a URL`);
  console.log(`  3. Share that URL with ${familyName}'s family members`);
  console.log(`  4. They visit the URL and start using it immediately (no setup needed!)\n`);
  console.log(`📝 Make sure you've completed this in Firebase Console for ${familyName}:`);
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
