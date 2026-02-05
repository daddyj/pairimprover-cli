#!/usr/bin/env node

/**
 * pAIrImprover CLI - Main entry point
 * 
 * Privacy-first AI code quality analysis for React Native developers.
 */

import { Command } from 'commander';
import { analyzeCommand } from './commands/analyze.js';
import { config } from './config.js';

const program = new Command();

program
  .name('pairimprover')
  .description('🎯 AI Code Quality Analysis for React Native Developers')
  .version(config.version);

// Add commands
program.addCommand(analyzeCommand);

// Parse CLI arguments
program.parse();
