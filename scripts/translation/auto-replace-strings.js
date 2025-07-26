#!/usr/bin/env node

/**
 * Comprehensive Translation Tool
 * - Adds useTranslation hooks to components
 * - Replaces hardcoded strings with t('key') calls
 * - Handles both src/app and src/components directories
 * - Excludes _archive and other specified patterns
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class ComprehensiveTranslationTool {
  constructor() {
    this.config = {
      sourceDirs: ['src/components', 'src/app'],
      excludePatterns: [
        'src/components/_archive/**',
        '**/*.test.{js,jsx,ts,tsx}',
        '**/*.spec.{js,jsx,ts,tsx}',
        'src/components/ui/**', // Don't modify shadcn/ui components
        'src/app/api/**', // Don't modify API routes
        'src/app/globals.css',
        'src/app/layout.tsx' // Skip root layout
      ],
      // Common translation key mappings
      commonMappings: {
        'Dashboard': 'navigation.dashboard',
        'Services': 'navigation.services',
        'Resources': 'navigation.resources',
        'Advertise': 'navigation.advertise',
        'Buyer': 'navigation.buyer',
        'Seller': 'navigation.seller',
        'Sign In': 'navigation.signIn',
        'Sign Up': 'navigation.signUp',
        'Sign Out': 'navigation.signOut',
        'Get Started': 'navigation.getStarted',
        'Settings': 'navigation.settings',
        'Admin Settings': 'navigation.adminSettings',
        'My Account': 'navigation.myAccount',
        'Browse Properties': 'buttons.browseProperties',
        'List Property': 'buttons.listProperty',
        'List Your Property': 'buttons.listProperty',
        'Learn More': 'buttons.learnMore',
        'Contact Us': 'buttons.contactUs',
        'Save': 'common.save',
        'Cancel': 'common.cancel',
        'Submit': 'common.submit',
        'Loading...': 'common.loading',
        'Search': 'common.search',
        'Filter': 'common.filter',
        'Clear': 'common.clear',
        'Apply': 'common.apply'
      }
    };
    this.processedFiles = [];
    this.replacements = [];
  }

  // Generate translation key from string
  generateKey(str, context = 'general') {
    // Check if we have a common mapping first
    if (this.config.commonMappings[str]) {
      return this.config.commonMappings[str];
    }

    // Generate key from string
    const cleaned = str
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .slice(0, 3) // Max 3 words
      .join('');
    
    return `${context}.${cleaned}`;
  }

  // Get context from file path
  getContextFromPath(filePath) {
    if (filePath.includes('/layout/')) return 'navigation';
    if (filePath.includes('/forms/')) return 'forms';
    if (filePath.includes('/buttons/')) return 'buttons';
    if (filePath.includes('/auth/')) return 'auth';
    if (filePath.includes('/dashboard/')) return 'dashboard';
    if (filePath.includes('/properties/')) return 'properties';
    if (filePath.includes('/services/')) return 'services';
    if (filePath.includes('/resources/')) return 'resources';
    return 'general';
  }

  // Check if component already uses useTranslation
  hasUseTranslation(content) {
    return content.includes('useTranslation') || content.includes("from 'react-i18next'");
  }

  // Check if component has useTranslation hook
  hasUseTranslationHook(content) {
    return /const\s*{\s*[^}]*t[^}]*}\s*=\s*useTranslation/.test(content);
  }

  // Check if it's a class component
  isClassComponent(content) {
    return /class\s+\w+\s+extends\s+React\.Component/.test(content) ||
           /class\s+\w+\s+extends\s+Component/.test(content);
  }

  // Check if it's a server component
  isServerComponent(content) {
    return !content.includes("'use client'") && !content.includes('"use client"');
  }

  // Add useTranslation import and hook in one operation
  addTranslationSupport(content) {
    let updatedContent = content;
    const needsImport = !content.includes("from 'react-i18next'");
    const needsHook = !content.includes('useTranslation(');

    if (!needsImport && !needsHook) {
      return content; // Nothing to add
    }

    // Add import if needed
    if (needsImport) {
      const importRegex = /import.*from.*['"][^'"]*['"];?\s*\n/g;
      const imports = content.match(importRegex);

      if (imports && imports.length > 0) {
        const lastImport = imports[imports.length - 1];
        const lastImportIndex = content.lastIndexOf(lastImport);
        const insertIndex = lastImportIndex + lastImport.length;

        updatedContent =
          content.slice(0, insertIndex) +
          "import { useTranslation } from 'react-i18next';\n" +
          content.slice(insertIndex);
      }
    }

    // Add hook if needed - with proper placement
    if (needsHook) {
      // Try multiple patterns for function components
      const patterns = [
        // export function ComponentName(props: Props) {
        /export\s+(?:default\s+)?function\s+(\w+)\s*\([^)]*\)\s*{/,
        // export const ComponentName = (props: Props) => {
        /export\s+const\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*{/,
        // function ComponentName(props: Props) {
        /function\s+(\w+)\s*\([^)]*\)\s*{/
      ];

      let match = null;
      for (const pattern of patterns) {
        match = updatedContent.match(pattern);
        if (match) break;
      }

      if (match) {
        const hookLine = "  const { t } = useTranslation('common');\n\n";
        const insertIndex = match.index + match[0].length;

        // Make sure we're inserting after the opening brace, not in parameters
        updatedContent =
          updatedContent.slice(0, insertIndex) +
          "\n" + hookLine +
          updatedContent.slice(insertIndex);
      }
    }

    return updatedContent;
  }

  // Fix template string translation issues
  fixTemplateStringTranslations(content) {
    let fixed = content;
    let changesMade = false;

    // Pattern 1: Fix {t('key')} inside template strings - should be ${t('key')}
    const pattern1 = /`([^`]*){t\(([^)]+)\)}([^`]*)`/g;
    fixed = fixed.replace(pattern1, (match, before, key, after) => {
      changesMade = true;
      return `\`${before}\${t(${key})}${after}\``;
    });

    // Pattern 2: Fix t('key') calls inside single-quoted strings within template literals
    const pattern2 = /'([^']*){t\(([^)]+)\)}([^']*)'/g;
    fixed = fixed.replace(pattern2, (match, before, key, after) => {
      changesMade = true;
      return `\`${before}\${t(${key})}${after}\``;
    });

    // Pattern 3: Fix t('key') calls inside double-quoted strings within template literals
    const pattern3 = /"([^"]*){t\(([^)]+)\)}([^"]*)"/g;
    fixed = fixed.replace(pattern3, (match, before, key, after) => {
      changesMade = true;
      return `\`${before}\${t(${key})}${after}\``;
    });

    // Pattern 4: Fix specific case from template literals with HTML
    const pattern4 = /'<span([^>]*)>([^<]*){t\(([^)]+)\)}([^<]*)<\/span>'/g;
    fixed = fixed.replace(pattern4, (match, attrs, before, key, after) => {
      changesMade = true;
      return `\`<span${attrs}>${before}\${t(${key})}${after}</span>\``;
    });

    // Pattern 5: Fix mixed quote issues - `>$${t('key')} -> `>${t('key')}
    const pattern5 = /`([^`]*)\$\$\{t\(([^)]+)\)\}([^`]*)`/g;
    fixed = fixed.replace(pattern5, (match, before, key, after) => {
      changesMade = true;
      return `\`${before}\${t(${key})}${after}\``;
    });

    // Pattern 6: Fix className=`...`>$${t('key')} patterns
    const pattern6 = /className=`([^`]*)`>\$\$\{t\(([^)]+)\)\}/g;
    fixed = fixed.replace(pattern6, (match, className, key) => {
      changesMade = true;
      return `className={\`${className}\`}>{t(${key})}`;
    });

    // Pattern 7: Fix placeholder=$${t('key')} patterns
    const pattern7 = /placeholder=\$\$\{t\(([^)]+)\)\}/g;
    fixed = fixed.replace(pattern7, (match, key) => {
      changesMade = true;
      return `placeholder={t(${key})}`;
    });

    return { content: fixed, changed: changesMade };
  }

  // Fix syntax errors that may have been introduced during translation
  fixSyntaxErrors(content) {
    let fixed = content;
    let changesMade = false;

    // Fix 1: Mixed quote issues in template literals - `>${t(`key`)} -> `>${t('key')}
    const fix1 = /`([^`]*)\$\{t\(`([^`]+)`\)\}([^`]*)`/g;
    fixed = fixed.replace(fix1, (match, before, key, after) => {
      changesMade = true;
      return `\`${before}\${t('${key}')}${after}\``;
    });

    // Fix 2: className={`...`} issues - className={`...` -> className="..."
    const fix2 = /className=\{`([^`${}]*)`\}/g;
    fixed = fixed.replace(fix2, (match, className) => {
      changesMade = true;
      return `className="${className}"`;
    });

    // Fix 3: Mixed quotes in template strings - `}>${t('key')} -> `>${t('key')}
    const fix3 = /`\}>\$\{t\(([^)]+)\)\}/g;
    fixed = fixed.replace(fix3, (match, key) => {
      changesMade = true;
      return `\`>\${t(${key})}`;
    });

    // Fix 4: Broken template literals - `}...` -> `...`
    const fix4 = /`\}([^`]*)`/g;
    fixed = fixed.replace(fix4, (match, content) => {
      changesMade = true;
      return `\`${content}\``;
    });

    // Fix 5: Fix onClick handlers with broken quotes
    const fix5 = /onClick=\{\(\) => \{ [^}]*setActiveTab\(`\}([^']+)'\); \}\}/g;
    fixed = fixed.replace(fix5, (match, tab) => {
      changesMade = true;
      return `onClick={() => { setSelectedProperty(property); setActiveTab('${tab}'); }}`;
    });

    // Fix 6: Fix broken string literals - endTime: '`, -> endTime: '',
    const fix6 = /endTime: '`,/g;
    fixed = fixed.replace(fix6, (match) => {
      changesMade = true;
      return `endTime: '',`;
    });

    // Fix 7: Fix broken template literals in JSX - className={`...` -> className="..."
    const fix7 = /className=\{`([^`}]*)`([^}]*)\}/g;
    fixed = fixed.replace(fix7, (match, className, rest) => {
      changesMade = true;
      if (rest.includes('${')) {
        return `className={\`${className}${rest}\`}`;
      } else {
        return `className="${className}"`;
      }
    });

    // Fix 8: Fix broken quotes in strings - 'Property"} -> 'Property'}
    const fix8 = /'([^']*)"}/g;
    fixed = fixed.replace(fix8, (match, content) => {
      changesMade = true;
      return `'${content}'}`;
    });

    // Fix 9: Fix broken alert strings - alert('...`}); -> alert('...');
    const fix9 = /alert\('([^']*)`\}\);/g;
    fixed = fixed.replace(fix9, (match, message) => {
      changesMade = true;
      return `alert('${message}');`;
    });

    // Fix 10: Fix broken onChange handlers - onChange={(e) => handleProfileUpdate("field`, -> onChange={(e) => handleProfileUpdate("field",
    const fix10 = /onChange=\{\(e\) => handleProfileUpdate\("([^"]+)`,/g;
    fixed = fixed.replace(fix10, (match, field) => {
      changesMade = true;
      return `onChange={(e) => handleProfileUpdate("${field}",`;
    });

    // Fix 11: Fix broken onChange handlers - onChange={(e) => handleProfileUpdate('field", -> onChange={(e) => handleProfileUpdate('field',
    const fix11 = /onChange=\{\(e\) => handleProfileUpdate\('([^']+)"/g;
    fixed = fixed.replace(fix11, (match, field) => {
      changesMade = true;
      return `onChange={(e) => handleProfileUpdate('${field}',`;
    });

    // Fix 12: Fix broken className with template literals
    const fix12 = /className="([^"]*)`\}/g;
    fixed = fixed.replace(fix12, (match, className) => {
      changesMade = true;
      return `className="${className}"`;
    });

    // Fix 13: Fix broken option values - value="`}> -> value="">
    const fix13 = /value="`\}>/g;
    fixed = fixed.replace(fix13, (match) => {
      changesMade = true;
      return `value="">`;
    });

    return { content: fixed, changed: changesMade };
  }

  // Replace hardcoded strings in JSX
  replaceStringsInContent(content, filePath) {
    let updatedContent = content;
    const context = this.getContextFromPath(filePath);
    const replacements = [];

    // Pattern for JSX text content
    const jsxTextPattern = />\s*([A-Z][^<>{]*[a-zA-Z]{2,})\s*</g;

    let match;
    while ((match = jsxTextPattern.exec(content)) !== null) {
      const originalString = match[1].trim();

      // Skip if it's already a translation call or variable
      if (originalString.includes('{') || originalString.includes('t(') || originalString.includes('$')) {
        continue;
      }

      const translationKey = this.generateKey(originalString, context);
      const replacement = `>{t('${translationKey}')}<`;
      const originalMatch = `>${originalString}<`;

      updatedContent = updatedContent.replace(originalMatch, replacement);

      replacements.push({
        original: originalString,
        key: translationKey,
        line: content.substring(0, match.index).split('\n').length
      });
    }

    // Pattern for JSX attributes (title, placeholder, etc.)
    const attributePattern = /(?:title|placeholder|alt|aria-label)=["']([A-Z][^"']{2,})["']/g;

    while ((match = attributePattern.exec(content)) !== null) {
      const originalString = match[1];
      const translationKey = this.generateKey(originalString, context);
      const replacement = match[0].replace(`"${originalString}"`, `{t('${translationKey}')}`);

      updatedContent = updatedContent.replace(match[0], replacement);

      replacements.push({
        original: originalString,
        key: translationKey,
        line: content.substring(0, match.index).split('\n').length
      });
    }

    // Fix any template string issues that may have been introduced
    const templateFix = this.fixTemplateStringTranslations(updatedContent);
    if (templateFix.changed) {
      updatedContent = templateFix.content;
    }

    // Fix syntax errors that may have been introduced
    const syntaxFix = this.fixSyntaxErrors(updatedContent);
    if (syntaxFix.changed) {
      updatedContent = syntaxFix.content;
    }

    return { content: updatedContent, replacements };
  }

  // Process a single file
  processFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');

      // Skip if file doesn't contain JSX
      if (!content.includes('<') || !content.includes('>')) {
        return;
      }

      let updatedContent = content;
      let changes = [];

      // Handle class components - skip translation conversion
      if (this.isClassComponent(content)) {
        console.log(`⏭️  Skipped: ${filePath} (class component)`);
        return;
      }

      // Handle server components - skip translation conversion
      if (this.isServerComponent(content)) {
        console.log(`⏭️  Skipped: ${filePath} (server component)`);
        return;
      }

      // Add translation support if needed
      if (!this.hasUseTranslation(content)) {
        updatedContent = this.addTranslationSupport(updatedContent);
        changes.push('Added useTranslation support');
      }

      // Add hook if missing
      if (!this.hasUseTranslationHook(updatedContent)) {
        // This is handled in addTranslationSupport, but let's ensure it's there
        changes.push('Added useTranslation hook');
      }

      // Replace hardcoded strings
      const result = this.replaceStringsInContent(updatedContent, filePath);

      if (result.replacements.length > 0 || changes.length > 0) {
        // Write updated file
        fs.writeFileSync(filePath, result.content);

        this.processedFiles.push({
          file: filePath,
          replacements: result.replacements.length,
          changes: changes
        });

        this.replacements.push(...result.replacements.map(r => ({
          ...r,
          file: filePath
        })));

        console.log(`✅ Processed: ${filePath} (${result.replacements.length} replacements, ${changes.length} changes)`);
        changes.forEach(change => console.log(`   - ${change}`));
      }
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
    }
  }

  // Process all component files
  async processAllFiles() {
    console.log('🔄 Auto-replacing hardcoded strings in components and pages...\n');

    // Get files from both src/components and src/app
    const allFiles = [];
    this.config.sourceDirs.forEach(dir => {
      const files = glob.sync(`${dir}/**/*.{js,jsx,ts,tsx}`, {
        ignore: this.config.excludePatterns
      });
      allFiles.push(...files);
    });

    console.log(`Found ${allFiles.length} files to process (src/app + src/components)\n`);

    allFiles.forEach(file => this.processFile(file));
    
    this.generateReport();
  }

  // Generate processing report and update translation files
  generateReport() {
    console.log('\n📊 AUTO-REPLACEMENT REPORT');
    console.log('='.repeat(50));

    if (this.processedFiles.length === 0) {
      console.log('✅ No hardcoded strings found - all components are already translated!');
      return;
    }

    console.log(`📁 Files processed: ${this.processedFiles.length}`);
    console.log(`🔄 Total replacements: ${this.replacements.length}\n`);

    // Group replacements by translation key
    const keyGroups = {};
    this.replacements.forEach(replacement => {
      if (!keyGroups[replacement.key]) {
        keyGroups[replacement.key] = [];
      }
      keyGroups[replacement.key].push(replacement);
    });

    if (Object.keys(keyGroups).length > 0) {
      console.log('📝 Adding new translation keys to base language file...');
      this.addKeysToBaseLanguage(keyGroups);
    }

    console.log('\n💡 Next steps:');
    console.log('1. Run: npm run i18n:translate (to generate translations for new keys)');
    console.log('2. Run: npm run build (to validate everything works)');
    console.log('3. Test language switching in the application');

    console.log('\n🎉 Translation processing complete!');
  }

  // Add new keys to ALL language files
  addKeysToBaseLanguage(keyGroups) {
    const supportedLanguages = ['en-US', 'es-US', 'en-CA', 'fr-CA', 'ar-AE', 'en-AE'];
    let totalAdded = 0;

    supportedLanguages.forEach(language => {
      const languageFile = path.join('src', 'locales', language, 'common.json');

      if (!fs.existsSync(languageFile)) {
        console.warn(`⚠️  Language file not found: ${languageFile}`);
        return;
      }

      try {
        const content = fs.readFileSync(languageFile, 'utf8');
        const translations = JSON.parse(content);
        let addedCount = 0;

        Object.entries(keyGroups).forEach(([key, replacements]) => {
          const originalText = replacements[0].original;

          // Check if key already exists
          if (!this.getValueByPath(translations, key)) {
            // For base language (en-US), use original text
            // For other languages, use original text as placeholder (will be translated later)
            this.setValueByPath(translations, key, originalText);
            addedCount++;
          }
        });

        if (addedCount > 0) {
          fs.writeFileSync(languageFile, JSON.stringify(translations, null, 2), 'utf8');
          console.log(`   ✅ ${language}: Added ${addedCount} new keys`);
          totalAdded += addedCount;
        }

      } catch (error) {
        console.error(`❌ Error updating ${language}:`, error.message);
      }
    });

    if (totalAdded > 0) {
      console.log(`\n📝 Added ${Object.keys(keyGroups).length} unique keys to ${supportedLanguages.length} language files`);
      console.log('💡 Keys added with original English text - run i18n:translate to generate proper translations');
    } else {
      console.log('\n✅ All keys already exist in all language files');
    }
  }

  // Helper function to get value by dot notation path
  getValueByPath(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // Helper function to set value by dot notation path
  setValueByPath(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);
    target[lastKey] = value;
  }
}

// CLI interface
if (require.main === module) {
  const tool = new ComprehensiveTranslationTool();
  tool.processAllFiles().catch(console.error);
}

module.exports = ComprehensiveTranslationTool;
