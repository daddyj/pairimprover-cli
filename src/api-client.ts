/**
 * API Client for pAIrImprover Backend
 * 
 * This is a thin client that sends transcripts to our backend API.
 * All pattern matching and AI analysis happens on the server.
 */

import chalk from 'chalk';
import { config } from './config.js';
import { getAuthToken } from './auth-config.js';

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
    actionItems: Array<{
      title: string;
      promptSnippet?: string;
    }>;
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
  authRequired?: boolean;
  limitExceeded?: boolean;
  tier?: string;
  upgradeUrl?: string;
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class RateLimitError extends Error {
  public tier: string;
  public upgradeUrl: string;

  constructor(message: string, tier: string, upgradeUrl: string) {
    super(message);
    this.name = 'RateLimitError';
    this.tier = tier;
    this.upgradeUrl = upgradeUrl;
  }
}

/**
 * Analyze a transcript via the pAIrImprover API
 */
export async function analyzeTranscript(
  transcript: string,
  framework?: string
): Promise<AnalyzeResponse> {
  // Check for auth token
  const token = getAuthToken();
  if (!token) {
    throw new AuthenticationError('Not authenticated. Run `pairimprover login <access-code>` first.');
  }

  const response = await fetch(config.apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      transcript,
      framework,
    }),
  });

  const data = await response.json().catch(() => ({ error: 'Unknown error' })) as AnalyzeResponse;

  // Handle authentication errors
  if (response.status === 401 || data.authRequired) {
    throw new AuthenticationError(
      data.error || 'Authentication failed. Please login again with `pairimprover login <access-code>`'
    );
  }

  // Handle rate limit errors
  if (response.status === 429 || data.limitExceeded) {
    throw new RateLimitError(
      data.error || 'Monthly analysis limit reached',
      data.tier || 'unknown',
      data.upgradeUrl || config.urls.pricing
    );
  }

  // Handle other errors
  if (!response.ok) {
    throw new Error(data.error || `API request failed: ${response.statusText}`);
  }

  return data;
}
