#!/usr/bin/env node

/**
 * pAIrImprover CLI - Main entry point
 * 
 * Privacy-first AI code quality analysis for React Native developers.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { analyzeCommand } from './commands/analyze.js';
import { loginWithAccessCode, loginWithGitHub, logout, showStatus } from './commands/auth.js';
import { config } from './config.js';

const program = new Command();

program
  .name('pairimprover')
  .description('🎯 AI Code Quality Analysis for React Native Developers')
  .version(config.version);

// Auth commands
program
  .command('login [access-code]')
  .description('Login with GitHub or beta access code')
  .option('--github', 'Login with GitHub OAuth')
  .action((accessCode: string | undefined, options: { github?: boolean }) => {
    if (options.github) {
      loginWithGitHub();
    } else if (accessCode) {
      loginWithAccessCode(accessCode);
    } else {
      console.log(chalk.yellow('Please provide an access code or use --github flag'));
      console.log('');
      console.log(chalk.dim('Examples:'));
      console.log(chalk.cyan('  pairimprover login BETA-CODE-123'));
      console.log(chalk.cyan('  pairimprover login --github'));
      console.log('');
      process.exit(1);
    }
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
