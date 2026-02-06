/**
 * Auth Commands
 * Handle user authentication via access code or GitHub OAuth
 */

import chalk from 'chalk';
import ora from 'ora';
import open from 'open';
import { config } from '../config.js';
import { saveAuthToken, getAuthToken, saveUserInfo, clearConfig, getUserInfo } from '../auth-config.js';
import * as readline from 'readline';

export interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    github_username: string;
    tier: 'public-beta' | 'invited-beta' | 'free' | 'pro' | 'expert';
    analyses_count: number;
    monthly_limit: number | null;
    unlimited?: boolean;
  };
  token?: string;
  error?: string;
}

export interface VerifyResponse {
  success: boolean;
  user: {
    id: string;
    github_username: string;
    tier: 'public-beta' | 'invited-beta' | 'free' | 'pro' | 'expert';
    email: string | null;
    avatar_url: string | null;
    invited_beta_tester: boolean;
    analyses_count: number;
  };
  usage: {
    thisMonth: number;
    limit: number;
    unlimited: boolean;
    remaining: number | null;
  };
  error?: string;
}

/**
 * Prompt user for input
 */
function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

/**
 * Login with GitHub OAuth (for public beta)
 */
export async function loginWithGitHub(): Promise<void> {
  console.log(chalk.bold.cyan('🔐 GitHub Authentication'));
  console.log('');
  console.log(chalk.dim('Opening browser for GitHub OAuth...'));
  console.log('');

  const authUrl = `${config.urls.website}/api/auth/github/start`;

  try {
    // Open browser
    await open(authUrl);
    console.log(chalk.green('✓ Browser opened'));
    console.log('');
    console.log(chalk.dim('After authorizing on GitHub:'));
    console.log(chalk.dim('1. Copy the token from the success page'));
    console.log(chalk.dim('2. Paste it below'));
    console.log('');

    // Prompt for token
    const token = await prompt(chalk.cyan('Paste your token: '));

    if (!token || token.length === 0) {
      console.log(chalk.yellow('No token provided. Authentication cancelled.'));
      process.exit(1);
    }

    // Verify token with backend
    const spinner = ora('Verifying token...').start();

    const response = await fetch(`${config.urls.website}/api/auth/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json() as VerifyResponse;

    if (!response.ok || !data.success) {
      spinner.fail(chalk.red('Invalid token'));
      console.log(chalk.yellow('\n' + (data.error || 'Token verification failed')));
      console.log(chalk.dim('\nPlease try again or contact: acun@pairimprover.com'));
      process.exit(1);
    }

    // Save token and user info
    saveAuthToken(token);
    saveUserInfo({
      id: data.user.id,
      github_username: data.user.github_username,
      tier: data.user.tier,
      analyses_count: data.usage.thisMonth,
      monthly_limit: data.usage.limit,
    });

    spinner.succeed(chalk.green('Authentication successful!'));
    console.log(chalk.dim(`\nWelcome, ${data.user.github_username}!`));
    console.log(chalk.dim(`Tier: ${data.user.tier}`));
    
    if (data.usage.unlimited) {
      console.log(chalk.dim('Usage: Unlimited analyses'));
    } else {
      const remaining = data.usage.remaining || 0;
      console.log(chalk.dim(`Usage: ${data.usage.thisMonth}/${data.usage.limit} this month (${remaining} remaining)`));
    }
  } catch (error) {
    console.log(chalk.red('\n✗ Authentication failed'));
    console.log(chalk.yellow('\n' + (error instanceof Error ? error.message : 'Unknown error')));
    console.log(chalk.dim('\nPlease check your internet connection and try again.'));
    process.exit(1);
  }
}

/**
 * Login with access code (for invited beta testers)
 */
export async function loginWithAccessCode(accessCode: string): Promise<void> {
  const spinner = ora('Authenticating...').start();

  try {
    const response = await fetch(`${config.urls.website}/api/auth/access-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_code: accessCode,
      }),
    });

    const data = await response.json() as AuthResponse;

    if (!response.ok || !data.success) {
      spinner.fail(chalk.red('Authentication failed'));
      console.log(chalk.yellow('\n' + (data.error || 'Invalid access code')));
      console.log(chalk.dim('\nIf you need an access code, contact: acun@pairimprover.com'));
      process.exit(1);
    }

    // Save auth token and user info
    saveAuthToken(data.token!);
    saveUserInfo({
      id: data.user!.id,
      github_username: data.user!.github_username,
      tier: data.user!.tier,
      analyses_count: data.user!.analyses_count,
      monthly_limit: data.user!.monthly_limit,
    });

    spinner.succeed(chalk.green('Authentication successful!'));
    console.log(chalk.dim(`\nWelcome, ${data.user!.github_username}!`));
    console.log(chalk.dim(`Tier: ${data.user!.tier}`));
    
    if (data.user!.unlimited || data.user!.monthly_limit === null) {
      console.log(chalk.dim('Usage: Unlimited analyses'));
    } else {
      const remaining = data.user!.monthly_limit - data.user!.analyses_count;
      console.log(chalk.dim(`Usage: ${data.user!.analyses_count}/${data.user!.monthly_limit} this month (${remaining} remaining)`));
    }
  } catch (error) {
    spinner.fail(chalk.red('Authentication failed'));
    console.log(chalk.yellow('\n' + (error instanceof Error ? error.message : 'Unknown error')));
    console.log(chalk.dim('\nPlease check your internet connection and try again.'));
    process.exit(1);
  }
}

/**
 * Logout (clear stored credentials)
 */
export function logout(): void {
  const userInfo = getUserInfo();
  
  if (!userInfo) {
    console.log(chalk.yellow('You are not logged in.'));
    return;
  }

  clearConfig();
  console.log(chalk.green('✓ Logged out successfully'));
  console.log(chalk.dim(`Goodbye, ${userInfo.github_username}!`));
}

/**
 * Show current auth status (fetches fresh data from backend)
 */
export async function showStatus(): Promise<void> {
  const token = getAuthToken();

  if (!token) {
    console.log(chalk.yellow('Not logged in'));
    console.log(chalk.dim('\nRun `pairimprover login <access-code>` or `pairimprover login --github` to authenticate'));
    return;
  }

  // Fetch fresh usage data from backend
  try {
    const response = await fetch(`${config.urls.website}/api/auth/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json() as VerifyResponse;

    if (!response.ok || !data.success) {
      console.log(chalk.yellow('Token expired or invalid'));
      console.log(chalk.dim('\nPlease login again'));
      return;
    }

    // Update local cache with fresh data
    saveUserInfo({
      id: data.user.id,
      github_username: data.user.github_username,
      tier: data.user.tier,
      analyses_count: data.usage.thisMonth,
      monthly_limit: data.usage.limit,
    });

    console.log(chalk.green('✓ Authenticated'));
    console.log(chalk.dim(`\nUser: ${data.user.github_username}`));
    console.log(chalk.dim(`Tier: ${data.user.tier}`));

    if (data.usage.unlimited) {
      console.log(chalk.dim('Usage: Unlimited analyses'));
    } else {
      const remaining = data.usage.remaining || 0;
      console.log(chalk.dim(`Usage: ${data.usage.thisMonth}/${data.usage.limit} this month (${remaining} remaining)`));
    }
  } catch (error) {
    console.log(chalk.red('Failed to fetch status'));
    console.log(chalk.dim('Showing cached data:\n'));
    
    // Fallback to cached data
    const userInfo = getUserInfo();
    if (userInfo) {
      console.log(chalk.green('✓ Authenticated (offline)'));
      console.log(chalk.dim(`\nUser: ${userInfo.github_username}`));
      console.log(chalk.dim(`Tier: ${userInfo.tier}`));
      
      if (userInfo.monthly_limit === null) {
        console.log(chalk.dim('Usage: Unlimited analyses'));
      } else if (userInfo.monthly_limit > 0) {
        const remaining = Math.max(0, userInfo.monthly_limit - userInfo.analyses_count);
        console.log(chalk.dim(`Usage: ${userInfo.analyses_count}/${userInfo.monthly_limit} this month (${remaining} remaining)`));
      }
    }
  }
}
