#!/usr/bin/env node

/**
 * Complete Automated Translation Workflow
 * Runs the full translation process from scan to validation
 */

const { execSync } = require('child_process');
const path = require('path');

class AutoTranslationWorkflow {
  constructor() {
    this.scriptsDir = path.join(__dirname);
    this.steps = [
      {
        name: 'Apply translations to components',
        command: `node ${path.join(this.scriptsDir, 'auto-replace-strings.js')}`,
        description: 'Scan, replace hardcoded strings, and add translation keys to all language files'
      },
      {
        name: 'Generate missing translations',
        command: `node ${path.join(this.scriptsDir, 'ai-translator.js')} translate`,
        description: 'Auto-generate translations for all languages'
      },
      {
        name: 'Validate translation coverage',
        command: `node ${path.join(this.scriptsDir, 'ai-translator.js')} validate`,
        description: 'Check translation completeness'
      }
    ];
  }

  async runStep(step, index) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📋 Step ${index + 1}/${this.steps.length}: ${step.name}`);
    console.log(`📝 ${step.description}`);
    console.log(`${'='.repeat(60)}\n`);

    try {
      execSync(step.command, { 
        stdio: 'inherit',
        cwd: path.join(__dirname, '../..')
      });
      console.log(`\n✅ Step ${index + 1} completed successfully!`);
      return true;
    } catch (error) {
      console.error(`\n❌ Step ${index + 1} failed:`, error.message);
      return false;
    }
  }

  async runFullWorkflow() {
    console.log('🚀 Starting Automated Translation Workflow');
    console.log('🎯 This will process all components and generate translations');
    console.log(`⏰ Started at: ${new Date().toLocaleString()}\n`);

    const startTime = Date.now();
    let successCount = 0;

    for (let i = 0; i < this.steps.length; i++) {
      const success = await this.runStep(this.steps[i], i);
      if (success) {
        successCount++;
      } else {
        console.log(`\n🛑 Workflow stopped at step ${i + 1}`);
        break;
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(`\n${'='.repeat(60)}`);
    console.log('🎉 WORKFLOW COMPLETE');
    console.log(`${'='.repeat(60)}`);
    console.log(`✅ Steps completed: ${successCount}/${this.steps.length}`);
    console.log(`⏱️  Total time: ${duration} seconds`);
    console.log(`⏰ Finished at: ${new Date().toLocaleString()}`);

    if (successCount === this.steps.length) {
      console.log('\n🎯 Next Steps:');
      console.log('1. Test your application with language switching');
      console.log('2. Run: npm run build (to validate everything works)');
      console.log('3. Review auto-replacement-report.json for details');
      console.log('4. Commit your changes');
    } else {
      console.log('\n⚠️  Some steps failed. Please check the errors above.');
    }
  }

  async runQuickCheck() {
    console.log('🔍 Running Quick Translation Check...\n');

    try {
      execSync(`node ${path.join(this.scriptsDir, 'ai-translator.js')} validate`, {
        stdio: 'inherit',
        cwd: path.join(__dirname, '../..')
      });

      console.log('\n✅ Quick check completed!');
    } catch (error) {
      console.error('\n❌ Quick check failed:', error.message);
    }
  }
}

// CLI interface
if (require.main === module) {
  const workflow = new AutoTranslationWorkflow();
  const command = process.argv[2];

  switch (command) {
    case 'full':
      workflow.runFullWorkflow().catch(console.error);
      break;
    case 'check':
      workflow.runQuickCheck().catch(console.error);
      break;
    default:
      console.log('🌍 Automated Translation Workflow');
      console.log('\nUsage:');
      console.log('  node auto-translate-workflow.js full   - Run complete workflow');
      console.log('  node auto-translate-workflow.js check  - Quick scan and validation');
      console.log('\nFull workflow steps:');
      workflow.steps.forEach((step, i) => {
        console.log(`  ${i + 1}. ${step.description}`);
      });
  }
}

module.exports = AutoTranslationWorkflow;
