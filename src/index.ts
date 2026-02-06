#!/usr/bin/env node

/**
 * pAIrImprover CLI - Main entry point
 * 
 * Privacy-first AI code quality analysis for React Native developers.
 */

import { Command } from 'commander';
import { analyzeCommand } from './commands/analyze.js';
import { loginWithAccessCode, logout, showStatus } from './commands/auth.js';
import { config } from './config.js';

const program = new Command();

program
  .name('pairimprover')
  .description('🎯 AI Code Quality Analysis for React Native Developers')
  .version(config.version);

// Auth commands
program
  .command('login <access-code>')
  .description('Login with your beta access code')
  .action((accessCode: string) => {
    loginWithAccessCode(accessCode);
  });

program
  .command('logout')
  .description('Logout and clear stored credentials')
  .action(() => {
    logout();
  });

program
  .command('status')
  .description('Show authentication status and usage')
  .action(() => {
    showStatus();
  });

// Add analyze command
program.addCommand(analyzeCommand);

// Parse CLI arguments
program.parse();
