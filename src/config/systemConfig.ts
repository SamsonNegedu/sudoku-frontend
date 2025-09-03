/**
 * System Configuration Manager
 * Centralized configuration for development, production, and feature flags
 */

export interface SystemConfig {
  // Development features
  isDevelopment: boolean;
  enableDebugLogs: boolean;
  enableUnlimitedHints: boolean;
  enableUnlimitedMistakes: boolean;

  // Analytics
  enableAnalytics: boolean;
  enableAnalyticsDebug: boolean;

  // Performance
  enablePerformanceMonitoring: boolean;
  enableStorageDebug: boolean;

  // UI Features
  showDeveloperTools: boolean;
  enableExperimentalFeatures: boolean;
}

class SystemConfigManager {
  private static instance: SystemConfigManager;
  private config: SystemConfig;

  private constructor() {
    this.config = this.initializeConfig();
  }

  public static getInstance(): SystemConfigManager {
    if (!SystemConfigManager.instance) {
      SystemConfigManager.instance = new SystemConfigManager();
    }
    return SystemConfigManager.instance;
  }

  private initializeConfig(): SystemConfig {
    const isDevelopment = process.env.NODE_ENV === 'development';

    return {
      // Development features
      isDevelopment,
      enableDebugLogs: isDevelopment,
      enableUnlimitedHints: isDevelopment,
      enableUnlimitedMistakes: false, // Can be enabled separately if needed

      // Analytics
      enableAnalytics: true,
      enableAnalyticsDebug: isDevelopment,

      // Performance
      enablePerformanceMonitoring: !isDevelopment, // Enable in production for monitoring
      enableStorageDebug: isDevelopment,

      // UI Features
      showDeveloperTools: isDevelopment,
      enableExperimentalFeatures: isDevelopment,
    };
  }

  // Getters for easy access
  public get isDevelopment(): boolean {
    return this.config.isDevelopment;
  }

  public get enableUnlimitedHints(): boolean {
    return this.config.enableUnlimitedHints;
  }

  public get enableDebugLogs(): boolean {
    return this.config.enableDebugLogs;
  }

  public get enableAnalyticsDebug(): boolean {
    return this.config.enableAnalyticsDebug;
  }

  public get showDeveloperTools(): boolean {
    return this.config.showDeveloperTools;
  }

  public get enableUnlimitedMistakes(): boolean {
    return this.config.enableUnlimitedMistakes;
  }

  // Get full config
  public getConfig(): SystemConfig {
    return { ...this.config };
  }

  // Override config for testing or special cases
  public override(overrides: Partial<SystemConfig>): void {
    this.config = { ...this.config, ...overrides };
  }

  // Reset to default
  public reset(): void {
    this.config = this.initializeConfig();
  }

  // Helper methods for common checks
  public isFeatureEnabled(feature: keyof SystemConfig): boolean {
    return Boolean(this.config[feature]);
  }

  // Development helpers
  public enableDeveloperMode(enable: boolean = true): void {
    this.override({
      enableUnlimitedHints: enable,
      enableDebugLogs: enable,
      enableAnalyticsDebug: enable,
      showDeveloperTools: enable,
      enableExperimentalFeatures: enable,
    });
  }
}

// Export singleton instance
export const SystemConfig = SystemConfigManager.getInstance();

// Export convenient helper functions
export const isDevelopment = () => SystemConfig.isDevelopment;
export const enableUnlimitedHints = () => SystemConfig.enableUnlimitedHints;
export const enableDebugLogs = () => SystemConfig.enableDebugLogs;
export const enableAnalyticsDebug = () => SystemConfig.enableAnalyticsDebug;
export const showDeveloperTools = () => SystemConfig.showDeveloperTools;

// Console logging helper that respects debug settings
export const debugLog = (message: string, ...args: any[]) => {
  if (SystemConfig.enableDebugLogs) {
    console.log(`[DEBUG] ${message}`, ...args);
  }
};

export const analyticsLog = (message: string, ...args: any[]) => {
  if (SystemConfig.enableAnalyticsDebug) {
    console.log(`[ANALYTICS] ${message}`, ...args);
  }
};
