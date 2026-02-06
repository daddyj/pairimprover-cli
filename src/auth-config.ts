/**
 * Auth Config Manager
 * Manages user authentication token and info in ~/.pairimprover/config.json
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface UserInfo {
  id: string;
  github_username: string;
  tier: 'public-beta' | 'invited-beta' | 'free' | 'pro' | 'expert';
  analyses_count: number;
  monthly_limit: number | null; // null = unlimited
}

interface ConfigData {
  token?: string;
  user?: UserInfo;
}

/**
 * Get path to config file
 * Uses env var PAIRIMPROVER_CONFIG_DIR for testing, otherwise ~/.pairimprover
 */
export function getConfigPath(): string {
  const configDir =
    process.env.PAIRIMPROVER_CONFIG_DIR ||
    path.join(os.homedir(), '.pairimprover');
  return path.join(configDir, 'config.json');
}

/**
 * Read config file
 */
function readConfig(): ConfigData {
  const configPath = getConfigPath();

  if (!fs.existsSync(configPath)) {
    return {};
  }

  try {
    const raw = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    // Invalid config, return empty
    return {};
  }
}

/**
 * Write config file
 */
function writeConfig(data: ConfigData): void {
  const configPath = getConfigPath();
  const configDir = path.dirname(configPath);

  // Create directory if it doesn't exist
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  fs.writeFileSync(configPath, JSON.stringify(data, null, 2), 'utf-8');

  // Set file permissions to 600 (read/write owner only) for security
  // Only on Unix-like systems (macOS, Linux)
  if (process.platform !== 'win32') {
    try {
      fs.chmodSync(configPath, 0o600);
    } catch (error) {
      // Non-fatal: permissions are a best-effort security measure
      console.warn('Warning: Could not set config file permissions');
    }
  }
}

/**
 * Save auth token
 */
export function saveAuthToken(token: string): void {
  const config = readConfig();
  config.token = token;
  writeConfig(config);
}

/**
 * Get auth token
 */
export function getAuthToken(): string | null {
  const config = readConfig();
  return config.token || null;
}

/**
 * Clear auth token
 */
export function clearAuthToken(): void {
  const config = readConfig();
  delete config.token;
  writeConfig(config);
}

/**
 * Save user info
 */
export function saveUserInfo(user: UserInfo): void {
  const config = readConfig();
  config.user = user;
  writeConfig(config);
}

/**
 * Get user info
 */
export function getUserInfo(): UserInfo | null {
  const config = readConfig();
  return config.user || null;
}

/**
 * Clear all config (logout)
 */
export function clearConfig(): void {
  const configPath = getConfigPath();
  if (fs.existsSync(configPath)) {
    fs.unlinkSync(configPath);
  }
}
