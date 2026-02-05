#!/usr/bin/env node

/**
 * CLI wrapper for pAIrImprover
 * Executes the TypeScript CLI using tsx in development
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const cliPath = join(__dirname, '..', 'src', 'index.ts');

// Run with tsx for development, will use compiled version after build
const child = spawn('npx', ['tsx', cliPath, ...process.argv.slice(2)], {
  stdio: 'inherit',
  shell: true,
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
