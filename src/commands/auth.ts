/**
 * Auth Commands
 * Handle user authentication via access code or GitHub OAuth
 */

import chalk from 'chalk';
import ora from 'ora';
import { config } from '../config.js';
import { saveAuthToken, saveUserInfo, clearConfig, getUserInfo } from '../auth-config.js';

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
 * Show current auth status
 */
export function showStatus(): void {
  const userInfo = getUserInfo();

  if (!userInfo) {
    console.log(chalk.yellow('Not logged in'));
    console.log(chalk.dim('\nRun `pairimprover login <access-code>` to authenticate'));
    return;
  }

  console.log(chalk.green('✓ Authenticated'));
  console.log(chalk.dim(`\nUser: ${userInfo.github_username}`));
  console.log(chalk.dim(`Tier: ${userInfo.tier}`));
  
  if (userInfo.monthly_limit === null) {
    console.log(chalk.dim('Usage: Unlimited analyses'));
  } else if (userInfo.monthly_limit > 0) {
    const remaining = Math.max(0, userInfo.monthly_limit - userInfo.analyses_count);
    console.log(chalk.dim(`Usage: ${userInfo.analyses_count}/${userInfo.monthly_limit} this month (${remaining} remaining)`));
  }
}
