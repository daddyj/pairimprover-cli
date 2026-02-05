/**
 * API Client for pAIrImprover Backend
 * 
 * This is a thin client that sends transcripts to our backend API.
 * All pattern matching and AI analysis happens on the server.
 */

import { config } from './config.js';

export interface AnalyzeRequest {
  transcript: string;
  framework?: string;
}

export interface AnalyzeResponse {
  success: boolean;
  analysis: {
    overallScore: number;
    pillars: {
      criticalThinking: number;
      libraryFirst: number;
      testDiscipline: number;
      architecture: number;
      maintainability: number;
    };
    strengths: Array<{
      title: string;
      description: string;
      pillar: string;
    }>;
    growthAreas: Array<{
      title: string;
      description: string;
      severity: string;
      pillar: string;
    }>;
    actionItems: string[];
    metadata: {
      lineCount: number;
      framework: string;
      frameworkDetectionSource: string;
      frameworkDetectionConfidence: number;
    };
  };
  parsed: {
    source: string;
    summary: {
      exchanges: number;
      codeBlocks: number;
      frameworks: string[];
      totalLines: number;
    };
  };
  error?: string;
}

/**
 * Analyze a transcript via the pAIrImprover API
 */
export async function analyzeTranscript(
  transcript: string,
  framework?: string
): Promise<AnalyzeResponse> {
  const response = await fetch(config.apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      transcript,
      framework,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `API request failed: ${response.statusText}`);
  }

  return response.json();
}
