/**
 * Tests for Auth Config Manager
 * Manages user authentication token storage in ~/.pairimprover/config.json
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import {
  saveAuthToken,
  getAuthToken,
  clearAuthToken,
  getConfigPath,
  getUserInfo,
  saveUserInfo,
} from '../auth-config.js';

const TEST_CONFIG_DIR = path.join(os.tmpdir(), '.pairimprover-test');
const TEST_CONFIG_FILE = path.join(TEST_CONFIG_DIR, 'config.json');

describe('Auth Config Manager', () => {
  beforeEach(() => {
    // Override config path for testing
    process.env.PAIRIMPROVER_CONFIG_DIR = TEST_CONFIG_DIR;
    
    // Clean up any existing test config
    if (fs.existsSync(TEST_CONFIG_DIR)) {
      fs.rmSync(TEST_CONFIG_DIR, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up test config
    if (fs.existsSync(TEST_CONFIG_DIR)) {
      fs.rmSync(TEST_CONFIG_DIR, { recursive: true });
    }
    delete process.env.PAIRIMPROVER_CONFIG_DIR;
  });

  describe('getConfigPath', () => {
    it('should return path to config file', () => {
      const configPath = getConfigPath();
      expect(configPath).toContain('.pairimprover');
      expect(configPath).toContain('config.json');
    });

    it('should use custom config dir from env var', () => {
      const configPath = getConfigPath();
      expect(configPath).toBe(TEST_CONFIG_FILE);
    });
  });

  describe('saveAuthToken / getAuthToken', () => {
    it('should save and retrieve auth token', () => {
      const token = 'test-jwt-token-12345';
      saveAuthToken(token);

      const retrieved = getAuthToken();
      expect(retrieved).toBe(token);
    });

    it('should create config directory if it does not exist', () => {
      expect(fs.existsSync(TEST_CONFIG_DIR)).toBe(false);

      saveAuthToken('test-token');

      expect(fs.existsSync(TEST_CONFIG_DIR)).toBe(true);
      expect(fs.existsSync(TEST_CONFIG_FILE)).toBe(true);
    });

    it('should return null when no token is saved', () => {
      const token = getAuthToken();
      expect(token).toBeNull();
    });

    it('should overwrite existing token', () => {
      saveAuthToken('token-1');
      saveAuthToken('token-2');

      const retrieved = getAuthToken();
      expect(retrieved).toBe('token-2');
    });
  });

  describe('clearAuthToken', () => {
    it('should clear saved auth token', () => {
      saveAuthToken('test-token');
      expect(getAuthToken()).toBe('test-token');

      clearAuthToken();
      expect(getAuthToken()).toBeNull();
    });

    it('should not throw error if no token exists', () => {
      expect(() => clearAuthToken()).not.toThrow();
    });
  });

  describe('saveUserInfo / getUserInfo', () => {
    it('should save and retrieve user info', () => {
      const userInfo = {
        id: 'user-123',
        github_username: 'testuser',
        tier: 'public-beta' as const,
        analyses_count: 2,
        monthly_limit: 5,
      };

      saveUserInfo(userInfo);

      const retrieved = getUserInfo();
      expect(retrieved).toEqual(userInfo);
    });

    it('should return null when no user info is saved', () => {
      const userInfo = getUserInfo();
      expect(userInfo).toBeNull();
    });

    it('should preserve token when saving user info', () => {
      saveAuthToken('test-token');
      saveUserInfo({
        id: 'user-123',
        github_username: 'testuser',
        tier: 'public-beta',
        analyses_count: 0,
        monthly_limit: 5,
      });

      expect(getAuthToken()).toBe('test-token');
      expect(getUserInfo()?.id).toBe('user-123');
    });
  });

  describe('config file format', () => {
    it('should store config as valid JSON', () => {
      saveAuthToken('test-token');
      saveUserInfo({
        id: 'user-123',
        github_username: 'testuser',
        tier: 'invited-beta',
        analyses_count: 5,
        monthly_limit: null,
      });

      const raw = fs.readFileSync(TEST_CONFIG_FILE, 'utf-8');
      const parsed = JSON.parse(raw);

      expect(parsed.token).toBe('test-token');
      expect(parsed.user.id).toBe('user-123');
      expect(parsed.user.monthly_limit).toBeNull();
    });

    it('should set file permissions to 600 on Unix-like systems', () => {
      // Skip on Windows
      if (process.platform === 'win32') {
        return;
      }

      saveAuthToken('test-token');

      const stats = fs.statSync(TEST_CONFIG_FILE);
      const mode = stats.mode & 0o777; // Extract permission bits

      // Should be 0o600 (read/write owner only)
      expect(mode).toBe(0o600);
    });
  });
});
