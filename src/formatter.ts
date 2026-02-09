/**
 * Terminal output formatter
 * 
 * Formats analysis results for beautiful terminal display
 */

import chalk from 'chalk';
import { AnalyzeResponse } from './api-client.js';

export function formatResults(response: AnalyzeResponse): string {
  const { analysis } = response;
  const lines: string[] = [];

  // Header
  lines.push('');
  lines.push(chalk.bold('━'.repeat(60)));
  lines.push(chalk.bold(`📊 Session Quality: ${analysis.overallScore.toFixed(1)}/10 (${getGrade(analysis.overallScore)})`));
  lines.push(chalk.bold('━'.repeat(60)));
  lines.push('');
  
  // Disclaimer
  lines.push(chalk.gray('ℹ️  Analysis based on this session only, not your entire codebase.'));
  lines.push('');

  // Strengths
  if (analysis.strengths.length > 0) {
    lines.push(chalk.bold.green('💪 What worked well in this session:'));
    analysis.strengths.slice(0, 3).forEach(strength => {
      lines.push(chalk.green(`   ${strength.description || strength.title}`));
    });
    lines.push('');
  }

  // Growth Areas
  if (analysis.growthAreas.length > 0) {
    lines.push(chalk.bold.yellow('🎯 Opportunities you might have missed:'));
    analysis.growthAreas.slice(0, 3).forEach(area => {
      lines.push(chalk.yellow(`   ${area.description || area.title}`));
    });
    lines.push('');
  }

  // Action Items
  if (analysis.actionItems.length > 0) {
    lines.push(chalk.bold.cyan('💡 Quick Wins (based on what was discussed):'));
    lines.push('');
    analysis.actionItems.slice(0, 3).forEach((action, index) => {
      lines.push(chalk.cyan(`${index + 1}. ${action.title}`));
      lines.push(chalk.gray(`   ⏱  15 minutes  💪 Impact: High  🎯 ${analysis.metadata.framework}`));
      
      // Show prompt snippet if available (A/B testing feature)
      if (action.promptSnippet) {
        lines.push('');
        lines.push(chalk.dim('   💬 Ask your AI next time:'));
        // Indent each line of the prompt snippet
        const snippetLines = action.promptSnippet.split('\n');
        snippetLines.forEach(line => {
          lines.push(chalk.dim(`   ${line}`));
        });
      }
    });
    lines.push('');
  }

  // Footer with upgrade CTA
  lines.push(chalk.bold('━'.repeat(60)));
  lines.push(chalk.bold.magenta('💎 Want to track your improvement over time?'));
  lines.push(chalk.gray('   Upgrade for:'));
  lines.push(chalk.gray('   • Unlimited analyses'));
  lines.push(chalk.gray('   • 5-10 actions per session'));
  lines.push(chalk.gray('   • Historical tracking'));
  lines.push(chalk.gray('   • Pattern recognition'));
  lines.push('');
  lines.push(chalk.gray('   Contact: acun@pairimprover.com'));
  lines.push(chalk.bold('━'.repeat(60)));
  lines.push('');

  return lines.join('\n');
}

function getGrade(score: number): string {
  if (score >= 9.0) return chalk.green('Excellent');
  if (score >= 8.0) return chalk.green('Strong');
  if (score >= 7.0) return chalk.cyan('Good');
  if (score >= 6.0) return chalk.yellow('Fair');
  return chalk.red('Needs Work');
}

export function formatMetadata(response: AnalyzeResponse): string {
  const { analysis } = response;
  const lines: string[] = [];

  lines.push(chalk.gray(`✓ Parsed: ${analysis.metadata.lineCount.toLocaleString()} lines`));
  lines.push(chalk.gray(`✓ Framework: ${analysis.metadata.framework} (${Math.round(analysis.metadata.frameworkDetectionConfidence * 100)}% confidence)`));
  
  return lines.join('\n');
}
