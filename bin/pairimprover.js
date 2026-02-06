#!/usr/bin/env node

/**
 * CLI wrapper for pAIrImprover
 * Executes the compiled JavaScript
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const cliPath = join(__dirname, '..', 'dist', 'index.js');

// Import and run the compiled CLI
import(cliPath).catch((error) => {
  console.error('Failed to load CLI:', error);
  process.exit(1);
});
