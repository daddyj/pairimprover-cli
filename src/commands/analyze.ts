/**
 * Analyze command - Main CLI command for analyzing transcripts
 */

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import open from 'open';
import { analyzeTranscript } from '../api-client.js';
import { formatResults, formatMetadata } from '../formatter.js';
import { config } from '../config.js';

export const analyzeCommand = new Command('analyze')
  .description('Analyze an AI coding session transcript')
  .argument('<file>', 'Path to transcript file (.md or .txt)')
  .option('--framework <name>', 'Override framework detection (react-native, nextjs)')
  .option('--open', 'Open web dashboard after analysis (coming soon)')
  .action(async (file: string, options) => {
    console.log('');
    console.log(chalk.bold.cyan(`🔍 pAIrImprover CLI v${config.version}`));
    console.log('');

    // Privacy notice
    console.log(chalk.bold('🔒 Privacy Mode: Cloud Analysis (No Storage)'));
    console.log(chalk.gray('   Transcript analyzed and immediately deleted'));
    console.log('');

    // Read file
    const spinner = ora('Reading transcript...').start();
    let content: string;
    
    try {
      const filePath = path.resolve(process.cwd(), file);
      content = fs.readFileSync(filePath, 'utf-8');
      
      const lines = content.split('\n').length;
      const sizeKB = (content.length / 1024).toFixed(1);
      
      spinner.succeed(chalk.green(`✓ Read: ${lines.toLocaleString()} lines (${sizeKB} KB)`));
    } catch (error) {
      spinner.fail(chalk.red('Failed to read file'));
      console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
      process.exit(1);
    }

    // Analyze via API
    const analyzeSpinner = ora('Analyzing with AI (this may take 20-60 seconds)...').start();
    
    try {
      const startTime = Date.now();
      const response = await analyzeTranscript(content, options.framework);
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      
      analyzeSpinner.succeed(chalk.green(`✓ Analysis complete (${duration}s)`));
      
      // Show metadata
      console.log('');
      console.log(formatMetadata(response));
      
      // Show results
      console.log(formatResults(response));
      
      // Auto-open browser (if explicitly requested)
      if (options.open) {
        console.log(chalk.gray('Opening web dashboard...'));
        console.log(chalk.yellow('Note: Web dashboard is coming soon!'));
        // TODO: Create actual report page with session ID
        await open(config.urls.website);
      }
      
      console.log(chalk.green('✨ Analysis complete!'));
      console.log('');
      
    } catch (error) {
      analyzeSpinner.fail(chalk.red('Analysis failed'));
      console.error('');
      console.error(chalk.red('Error: ') + (error instanceof Error ? error.message : 'Unknown error'));
      console.error('');
      console.error(chalk.gray('Possible issues:'));
      console.error(chalk.gray('  • Backend is down'));
      console.error(chalk.gray('  • Network connection issue'));
      console.error(chalk.gray('  • Transcript file is too large (>5MB)'));
      console.error('');
      console.error(chalk.gray(`If this persists, please report at: ${config.urls.docs}/issues`));
      console.error('');
      process.exit(1);
    }
  });
