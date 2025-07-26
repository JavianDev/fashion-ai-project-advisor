#!/usr/bin/env node

/**
 * Build-Time Translation Validation
 * Runs during build process to ensure all text is translated
 * Fails build if hardcoded strings are found in production components
 */

const AITranslator = require('./ai-translator');
const fs = require('fs');
const path = require('path');

class BuildTimeI18nCheck {
  constructor() {
    this.translator = new AITranslator();
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  async runChecks() {
    console.log('🔍 Running build-time i18n validation...\n');

    // Check translation coverage using existing AI translator
    const isValid = await this.translator.validateTranslations();

    if (!isValid) {
      console.error('❌ Build failed due to translation coverage issues');
      process.exit(1);
    }

    console.log('✅ i18n validation passed - build can proceed');
    return true;
  }


}

// CLI interface
if (require.main === module) {
  const checker = new BuildTimeI18nCheck();
  checker.runChecks().catch(error => {
    console.error('Build-time i18n check failed:', error);
    process.exit(1);
  });
}

module.exports = BuildTimeI18nCheck;
