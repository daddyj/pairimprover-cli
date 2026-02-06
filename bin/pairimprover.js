#!/usr/bin/env node

/**
 * CLI wrapper for pAIrImprover
 * Uses compiled JS if available, falls back to tsx for development
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distPath = join(__dirname, '..', 'dist', 'index.js');
const srcPath = join(__dirname, '..', 'src', 'index.ts');

// Use compiled version if available, otherwise use tsx
if (existsSync(distPath)) {
  // Production: use compiled JS
  import(distPath).catch((error) => {
    console.error('Failed to load CLI:', error);
    process.exit(1);
  });
} else {
  // Development: use tsx
  const child = spawn('npx', ['tsx', srcPath, ...process.argv.slice(2)], {
    stdio: 'inherit',
    shell: true,
  });

  child.on('exit', (code) => {
    process.exit(code || 0);
  });
}
