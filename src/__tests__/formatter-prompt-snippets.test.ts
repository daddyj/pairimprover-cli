/**
 * Tests for CLI Formatter - Prompt Snippets
 * Verifies prompt snippets are displayed correctly in CLI output
 * 
 * RED Stage: These will fail until we update the formatter
 */

import { formatResults } from '../formatter';

describe('Formatter - Prompt Snippets', () => {
  it('should display prompt snippet when action item has one', () => {
    const response = {
      success: true,
      analysis: {
        overallScore: 7.5,
        pillars: {
          criticalThinking: 8.0,
          libraryFirst: 7.0,
          testDiscipline: 7.5,
          architecture: 7.0,
          maintainability: 8.0,
        },
        strengths: [],
        growthAreas: [],
        actionItems: [
          {
            title: 'TDD Red Stage Skipped (8 instances)',
            promptSnippet: 'Ask your AI: "Write a failing test first for [feature]"'
          }
        ],
        metadata: {
          lineCount: 1000,
          framework: 'react-native',
          frameworkDetectionSource: 'auto-detected',
          frameworkDetectionConfidence: 0.8,
        },
      },
      parsed: {
        source: 'test',
        summary: {
          exchanges: 10,
          codeBlocks: 5,
          frameworks: ['react-native'],
          totalLines: 1000
        }
      }
    };

    const output = formatResults(response);

    // Should include the action item title
    expect(output).toContain('TDD Red Stage Skipped');
    
    // Should include the prompt snippet with special formatting
    expect(output).toContain('Ask your AI');
    expect(output).toContain('💬'); // Prompt icon
  });

  it('should NOT show prompt snippet section for action items without one', () => {
    const response = {
      success: true,
      analysis: {
        overallScore: 7.5,
        pillars: {
          criticalThinking: 8.0,
          libraryFirst: 7.0,
          testDiscipline: 7.5,
          architecture: 7.0,
          maintainability: 8.0,
        },
        strengths: [],
        growthAreas: [],
        actionItems: [
          {
            title: 'Add error boundaries to App component'
            // No promptSnippet
          }
        ],
        metadata: {
          lineCount: 1000,
          framework: 'react-native',
          frameworkDetectionSource: 'auto-detected',
          frameworkDetectionConfidence: 0.8,
        },
      },
      parsed: {
        source: 'test',
        summary: {
          exchanges: 10,
          codeBlocks: 5,
          frameworks: ['react-native'],
          totalLines: 1000
        }
      }
    };

    const output = formatResults(response);

    // Should include the action item
    expect(output).toContain('Add error boundaries');
    
    // Should NOT include prompt snippet formatting
    expect(output).not.toContain('💬');
    expect(output).not.toContain('Ask your AI');
  });
});
