/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║                       CONFIG SERVICE - CANONICAL                         ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║ Serviço unificado para gerenciamento de configurações                   ║
 * ║                                                                          ║
 * ║ CONSOLIDATES (9 services → 1):                                          ║
 * ║  1. ConfigurationManager      - Application config management           ║
 * ║  2. EnvironmentConfigService  - Environment variables                   ║
 * ║  3. FeatureFlagsService       - Feature flags & A/B tests               ║
 * ║  4. AppConfigService          - App-level configuration                 ║
 * ║  5. ThemeConfigService        - Theme & styling config                  ║
 * ║  6. IntegrationConfigService  - External integrations config            ║
 * ║  7. ABTestConfigService       - A/B testing configuration               ║
 * ║  8. SettingsManager           - User/app settings                       ║
 * ║  9. UserPreferencesService    - User preferences storage                ║
 * ║                                                                          ║
 * ║ FEATURES:                                                                ║
 * ║  • Environment configuration (DEV, STAGING, PROD)                       ║
 * ║  • Feature flags with rollout percentages                               ║
 * ║  • Theme configuration (colors, fonts, layout)                          ║
 * ║  • Integration settings (API keys, webhooks)                            ║
 * ║  • A/B test management                                                   ║
 * ║  • User preferences (language, notifications)                           ║
 * ║  • Configuration validation                                              ║
 * ║  • Hot reload support                                                    ║
 * ║                                                                          ║
 * ║ ARCHITECTURE:                                                            ║
 * ║  • BaseCanonicalService lifecycle                                        ║
 * ║  • Result<T> pattern                                                     ║
 * ║  • Singleton pattern                                                     ║
 * ║  • Specialized APIs (env, flags, theme, integrations, preferences)      ║
 * ║  • Change listeners                                                      ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

import { BaseCanonicalService, ServiceResult } from './types';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

/**
 * Environment types
 */
export type Environment = 'development' | 'staging' | 'production' | 'test';

/**
 * Environment configuration
 */
export interface EnvironmentConfig {
  environment: Environment;
  apiUrl: string;
  cdnUrl?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  isDevelopment: boolean;
  isStaging: boolean;
  isProduction: boolean;
  isTest: boolean;
  debug: boolean;
}

/**
 * Feature flag definition
 */
export interface FeatureFlag {
  key: string;
  enabled: boolean;
  rolloutPercentage?: number; // 0-100
  description?: string;
  enabledForUsers?: string[]; // User IDs
  enabledForGroups?: string[]; // Group names
}

/**
 * Theme configuration
 */
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  fontSize: number;
  borderRadius: number;
  spacing: number;
  customCSS?: string;
}

/**
 * Integration configuration
 */
export interface IntegrationConfig {
  name: string;
  enabled: boolean;
  apiKey?: string;
  apiSecret?: string;
  webhookUrl?: string;
  settings?: Record<string, any>;
}

/**
 * A/B test configuration
 */
export interface ABTestConfig {
  testId: string;
  name: string;
  enabled: boolean;
  variants: ABTestVariant[];
  trafficAllocation: number; // 0-100
  targetAudience?: {
    userIds?: string[];
    groups?: string[];
    percentage?: number;
  };
}

/**
 * A/B test variant
 */
export interface ABTestVariant {
  id: string;
  name: string;
  weight: number; // 0-100
  config: Record<string, any>;
}

/**
 * User preferences
 */
export interface UserPreferences {
  userId?: string;
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    analytics: boolean;
    marketing: boolean;
  };
  accessibility: {
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
    reducedMotion: boolean;
  };
  custom?: Record<string, any>;
}

/**
 * Configuration change event
 */
export interface ConfigChangeEvent {
  type: 'environment' | 'feature-flag' | 'theme' | 'integration' | 'preferences';
  key: string;
  oldValue: any;
  newValue: any;
  timestamp: Date;
}

/**
 * Config service options
 */
export interface ConfigServiceOptions {
  autoLoadEnvironment?: boolean;
  enableHotReload?: boolean;
  validateOnSet?: boolean;
  persistPreferences?: boolean;
  storagePrefix?: string;
}

// ============================================================================
// CONFIG SERVICE
// ============================================================================

/**
 * Unified configuration service
 */
export class ConfigService extends BaseCanonicalService {
  private static instance: ConfigService | null = null;
  
  private environmentConfig: EnvironmentConfig | null = null;
  private featureFlags: Map<string, FeatureFlag> = new Map();
  private themeConfig: ThemeConfig | null = null;
  private integrationsMap: Map<string, IntegrationConfig> = new Map();
  private abTestsMap: Map<string, ABTestConfig> = new Map();
  private userPreferences: UserPreferences | null = null;
  
  private readonly autoLoadEnvironment: boolean;
  private readonly enableHotReload: boolean;
  private readonly validateOnSet: boolean;
  private readonly persistPreferences: boolean;
  private readonly storagePrefix: string;
  
  // Change listeners
  private changeListeners: Array<(event: ConfigChangeEvent) => void> = [];

  private constructor(options: ConfigServiceOptions = {}) {
    super('ConfigService', '1.0.0');
    
    this.autoLoadEnvironment = options.autoLoadEnvironment ?? true;
    this.enableHotReload = options.enableHotReload ?? false;
    this.validateOnSet = options.validateOnSet ?? true;
    this.persistPreferences = options.persistPreferences ?? true;
    this.storagePrefix = options.storagePrefix || 'qfp_config_';
  }

  static getInstance(options?: ConfigServiceOptions): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService(options);
    }
    return ConfigService.instance;
  }

  protected async onInitialize(): Promise<void> {
    this.log('Initializing ConfigService...');
    
    // Load environment configuration
    if (this.autoLoadEnvironment) {
      this.loadEnvironmentConfig();
    }
    
    // Load default feature flags
    this.loadDefaultFeatureFlags();
    
    // Load default theme
    this.loadDefaultTheme();
    
    // Load user preferences from storage
    if (this.persistPreferences) {
      this.loadUserPreferences();
    }
    
    this.log('ConfigService initialized successfully');
  }

  protected async onDispose(): Promise<void> {
    this.log('Disposing ConfigService...');
    
    // Clear all data
    this.featureFlags.clear();
    this.integrationsMap.clear();
    this.abTestsMap.clear();
    this.changeListeners = [];
    
    this.log('ConfigService disposed');
  }

  async healthCheck(): Promise<boolean> {
    try {
      // Check if environment is loaded
      if (!this.environmentConfig) {
        this.error('Environment config not loaded');
        return false;
      }

      // Check browser storage availability
      if (typeof window !== 'undefined' && this.persistPreferences) {
        try {
          localStorage.setItem('__test__', 'test');
          localStorage.removeItem('__test__');
        } catch (e) {
          this.error('Browser storage not available');
          return false;
        }
      }

      return true;
    } catch (error) {
      this.error('Health check error:', error);
      return false;
    }
  }

  // ============================================================================
  // ENVIRONMENT CONFIGURATION
  // ============================================================================

  /**
   * Get current environment configuration
   */
  getEnvironment(): ServiceResult<EnvironmentConfig> {
    if (!this.environmentConfig) {
      return {
        success: false,
        error: new Error('Environment not loaded'),
      };
    }

    return { success: true, data: this.environmentConfig };
  }

  /**
   * Get environment variable
   */
  getEnv(key: string, defaultValue?: string): ServiceResult<string | undefined> {
    try {
      if (typeof import.meta === 'undefined' || !import.meta.env) {
        return { success: true, data: defaultValue };
      }

      const value = import.meta.env[key] || defaultValue;
      return { success: true, data: value };

    } catch (error) {
      this.error('Get env error:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Get env failed'),
      };
    }
  }

  /**
   * Check if running in development
   */
  isDevelopment(): boolean {
    return this.environmentConfig?.isDevelopment ?? false;
  }

  /**
   * Check if running in production
   */
  isProduction(): boolean {
    return this.environmentConfig?.isProduction ?? false;
  }

  // ============================================================================
  // FEATURE FLAGS
  // ============================================================================

  /**
   * Check if a feature is enabled
   */
  isFeatureEnabled(key: string, userId?: string): ServiceResult<boolean> {
    try {
      const flag = this.featureFlags.get(key);

      if (!flag) {
        // Feature not defined, default to false
        return { success: true, data: false };
      }

      // Check if globally disabled
      if (!flag.enabled) {
        return { success: true, data: false };
      }

      // Check user-specific enablement
      if (userId && flag.enabledForUsers?.includes(userId)) {
        return { success: true, data: true };
      }

      // Check rollout percentage
      if (flag.rolloutPercentage !== undefined) {
        const enabled = this.isInRollout(key, userId, flag.rolloutPercentage);
        return { success: true, data: enabled };
      }

      return { success: true, data: flag.enabled };

    } catch (error) {
      this.error('Is feature enabled error:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Check feature failed'),
      };
    }
  }

  /**
   * Set feature flag
   */
  setFeatureFlag(flag: FeatureFlag): ServiceResult<void> {
    try {
      const oldFlag = this.featureFlags.get(flag.key);
      this.featureFlags.set(flag.key, flag);

      // Emit change event
      this.emitChange({
        type: 'feature-flag',
        key: flag.key,
        oldValue: oldFlag,
        newValue: flag,
        timestamp: new Date(),
      });

      this.log('Feature flag set:', flag.key, flag.enabled);
      return { success: true, data: undefined };

    } catch (error) {
      this.error('Set feature flag error:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Set feature flag failed'),
      };
    }
  }

  /**
   * Get all feature flags
   */
  getAllFeatureFlags(): ServiceResult<FeatureFlag[]> {
    try {
      const flags = Array.from(this.featureFlags.values());
      return { success: true, data: flags };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Get feature flags failed'),
      };
    }
  }

  /**
   * Enable feature for specific users
   */
  enableFeatureForUsers(key: string, userIds: string[]): ServiceResult<void> {
    try {
      const flag = this.featureFlags.get(key);
      
      if (!flag) {
        return {
          success: false,
          error: new Error(`Feature flag '${key}' not found`),
        };
      }

      const updatedFlag: FeatureFlag = {
        ...flag,
        enabledForUsers: [...(flag.enabledForUsers || []), ...userIds],
      };

      return this.setFeatureFlag(updatedFlag);

    } catch (error) {
      this.error('Enable feature for users error:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Enable feature for users failed'),
      };
    }
  }

  // ============================================================================
  // THEME CONFIGURATION
  // ============================================================================

  /**
   * Get current theme configuration
   */
  getTheme(): ServiceResult<ThemeConfig> {
    if (!this.themeConfig) {
      return {
        success: false,
        error: new Error('Theme not loaded'),
      };
    }

    return { success: true, data: this.themeConfig };
  }

  /**
   * Set theme configuration
   */
  setTheme(theme: ThemeConfig): ServiceResult<void> {
    try {
      const oldTheme = this.themeConfig;
      this.themeConfig = theme;

      // Emit change event
      this.emitChange({
        type: 'theme',
        key: 'theme',
        oldValue: oldTheme,
        newValue: theme,
        timestamp: new Date(),
      });

      // Apply theme if in browser
      if (typeof window !== 'undefined') {
        this.applyTheme(theme);
      }

      this.log('Theme set:', theme.mode);
      return { success: true, data: undefined };

    } catch (error) {
      this.error('Set theme error:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Set theme failed'),
      };
    }
  }

  /**
   * Update theme property
   */
  updateTheme(updates: Partial<ThemeConfig>): ServiceResult<void> {
    try {
      if (!this.themeConfig) {
        return {
          success: false,
          error: new Error('Theme not initialized'),
        };
      }

      const newTheme = { ...this.themeConfig, ...updates };
      return this.setTheme(newTheme);

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Update theme failed'),
      };
    }
  }

  // ============================================================================
  // INTEGRATION CONFIGURATION
  // ============================================================================

  /**
   * Get integration configuration
   */
  getIntegration(name: string): ServiceResult<IntegrationConfig | null> {
    try {
      const integration = this.integrationsMap.get(name);
      return { success: true, data: integration || null };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Get integration failed'),
      };
    }
  }

  /**
   * Set integration configuration
   */
  setIntegration(integration: IntegrationConfig): ServiceResult<void> {
    try {
      const oldIntegration = this.integrationsMap.get(integration.name);
      this.integrationsMap.set(integration.name, integration);

      // Emit change event
      this.emitChange({
        type: 'integration',
        key: integration.name,
        oldValue: oldIntegration,
        newValue: integration,
        timestamp: new Date(),
      });

      this.log('Integration set:', integration.name);
      return { success: true, data: undefined };

    } catch (error) {
      this.error('Set integration error:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Set integration failed'),
      };
    }
  }

  /**
   * Get all integrations
   */
  getAllIntegrations(): ServiceResult<IntegrationConfig[]> {
    try {
      const integrations = Array.from(this.integrationsMap.values());
      return { success: true, data: integrations };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Get integrations failed'),
      };
    }
  }

  /**
   * Check if integration is enabled
   */
  isIntegrationEnabled(name: string): boolean {
    const integration = this.integrationsMap.get(name);
    return integration?.enabled ?? false;
  }

  // ============================================================================
  // A/B TESTING
  // ============================================================================

  /**
   * Get A/B test variant for user
   */
  getABTestVariant(testId: string, userId?: string): ServiceResult<ABTestVariant | null> {
    try {
      const test = this.abTestsMap.get(testId);

      if (!test || !test.enabled) {
        return { success: true, data: null };
      }

      // Check if user is in target audience
      if (test.targetAudience) {
        const inAudience = this.isInTargetAudience(userId, test.targetAudience);
        if (!inAudience) {
          return { success: true, data: null };
        }
      }

      // Select variant based on user ID
      const variant = this.selectVariant(test.variants, userId || 'anonymous');
      return { success: true, data: variant };

    } catch (error) {
      this.error('Get AB test variant error:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Get AB test variant failed'),
      };
    }
  }

  /**
   * Set A/B test configuration
   */
  setABTest(test: ABTestConfig): ServiceResult<void> {
    try {
      this.abTestsMap.set(test.testId, test);
      this.log('A/B test set:', test.testId);
      return { success: true, data: undefined };

    } catch (error) {
      this.error('Set AB test error:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Set AB test failed'),
      };
    }
  }

  // ============================================================================
  // USER PREFERENCES
  // ============================================================================

  /**
   * Get user preferences
   */
  getPreferences(): ServiceResult<UserPreferences | null> {
    return { success: true, data: this.userPreferences };
  }

  /**
   * Set user preferences
   */
  setPreferences(preferences: UserPreferences): ServiceResult<void> {
    try {
      const oldPreferences = this.userPreferences;
      this.userPreferences = preferences;

      // Persist to storage
      if (this.persistPreferences && typeof window !== 'undefined') {
        localStorage.setItem(
          `${this.storagePrefix}preferences`,
          JSON.stringify(preferences),
        );
      }

      // Emit change event
      this.emitChange({
        type: 'preferences',
        key: 'preferences',
        oldValue: oldPreferences,
        newValue: preferences,
        timestamp: new Date(),
      });

      this.log('User preferences set');
      return { success: true, data: undefined };

    } catch (error) {
      this.error('Set preferences error:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Set preferences failed'),
      };
    }
  }

  /**
   * Update user preferences
   */
  updatePreferences(updates: Partial<UserPreferences>): ServiceResult<void> {
    try {
      const current = this.userPreferences || this.getDefaultPreferences();
      const newPreferences = { ...current, ...updates };
      return this.setPreferences(newPreferences);

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Update preferences failed'),
      };
    }
  }

  // ============================================================================
  // CHANGE LISTENERS
  // ============================================================================

  /**
   * Listen to configuration changes
   */
  onChange(listener: (event: ConfigChangeEvent) => void): () => void {
    this.changeListeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.changeListeners.indexOf(listener);
      if (index > -1) {
        this.changeListeners.splice(index, 1);
      }
    };
  }

  // ============================================================================
  // SPECIALIZED APIs
  // ============================================================================

  /**
   * Environment API
   */
  readonly env = {
    get: this.getEnvironment.bind(this),
    getVar: this.getEnv.bind(this),
    isDev: this.isDevelopment.bind(this),
    isProd: this.isProduction.bind(this),
  };

  /**
   * Feature Flags API
   */
  readonly flags = {
    isEnabled: this.isFeatureEnabled.bind(this),
    set: this.setFeatureFlag.bind(this),
    getAll: this.getAllFeatureFlags.bind(this),
    enableForUsers: this.enableFeatureForUsers.bind(this),
  };

  /**
   * Theme API
   */
  readonly theme = {
    get: this.getTheme.bind(this),
    set: this.setTheme.bind(this),
    update: this.updateTheme.bind(this),
  };

  /**
   * Integrations API
   */
  readonly integrations = {
    get: this.getIntegration.bind(this),
    set: this.setIntegration.bind(this),
    getAll: this.getAllIntegrations.bind(this),
    isEnabled: this.isIntegrationEnabled.bind(this),
  };

  /**
   * A/B Testing API
   */
  readonly abTests = {
    getVariant: this.getABTestVariant.bind(this),
    set: this.setABTest.bind(this),
  };

  /**
   * Preferences API
   */
  readonly preferences = {
    get: this.getPreferences.bind(this),
    set: this.setPreferences.bind(this),
    update: this.updatePreferences.bind(this),
  };

  // ============================================================================
  // PRIVATE HELPERS
  // ============================================================================

  private loadEnvironmentConfig(): void {
    try {
      const env = (import.meta.env.MODE || 'development') as Environment;
      
      this.environmentConfig = {
        environment: env,
        apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
        cdnUrl: import.meta.env.VITE_CDN_URL || '',
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
        supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
        isDevelopment: env === 'development',
        isStaging: env === 'staging',
        isProduction: env === 'production',
        isTest: env === 'test',
        debug: import.meta.env.DEV || false,
      };

      this.log('Environment loaded:', env);
    } catch (error) {
      this.error('Failed to load environment:', error);
    }
  }

  private loadDefaultFeatureFlags(): void {
    const defaultFlags: FeatureFlag[] = [
      {
        key: 'useJsonTemplates',
        enabled: import.meta.env.VITE_USE_JSON_TEMPLATES === 'true',
        description: 'Use JSON templates instead of TypeScript',
      },
      {
        key: 'enablePrefetch',
        enabled: import.meta.env.VITE_ENABLE_PREFETCH !== 'false',
        description: 'Enable resource prefetching',
      },
      {
        key: 'enableAnalytics',
        enabled: import.meta.env.VITE_ENABLE_ANALYTICS !== 'false',
        description: 'Enable analytics tracking',
      },
    ];

    defaultFlags.forEach(flag => this.featureFlags.set(flag.key, flag));
    this.log(`Loaded ${defaultFlags.length} default feature flags`);
  }

  private loadDefaultTheme(): void {
    this.themeConfig = {
      mode: 'auto',
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
      accentColor: '#F59E0B',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: 16,
      borderRadius: 8,
      spacing: 16,
    };

    this.log('Default theme loaded');
  }

  private loadUserPreferences(): void {
    try {
      if (typeof window === 'undefined') return;

      const stored = localStorage.getItem(`${this.storagePrefix}preferences`);
      if (stored) {
        this.userPreferences = JSON.parse(stored);
        this.log('User preferences loaded from storage');
      } else {
        this.userPreferences = this.getDefaultPreferences();
      }
    } catch (error) {
      this.error('Failed to load user preferences:', error);
      this.userPreferences = this.getDefaultPreferences();
    }
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      language: 'pt-BR',
      timezone: 'America/Sao_Paulo',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
      privacy: {
        analytics: true,
        marketing: false,
      },
      accessibility: {
        highContrast: false,
        fontSize: 'medium',
        reducedMotion: false,
      },
    };
  }

  private isInRollout(key: string, userId: string | undefined, percentage: number): boolean {
    if (percentage === 0) return false;
    if (percentage === 100) return true;

    const id = userId || this.getSessionId();
    const hash = this.simpleHash(`${key}:${id}`);
    return (hash % 100) < percentage;
  }

  private isInTargetAudience(userId: string | undefined, audience: ABTestConfig['targetAudience']): boolean {
    if (!audience) return true;

    if (userId && audience.userIds?.includes(userId)) {
      return true;
    }

    if (audience.percentage !== undefined) {
      const hash = this.simpleHash(userId || this.getSessionId());
      return (hash % 100) < audience.percentage;
    }

    return true;
  }

  private selectVariant(variants: ABTestVariant[], userId: string): ABTestVariant | null {
    if (variants.length === 0) return null;

    const hash = this.simpleHash(userId);
    const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);
    const target = hash % totalWeight;

    let cumulative = 0;
    for (const variant of variants) {
      cumulative += variant.weight;
      if (target < cumulative) {
        return variant;
      }
    }

    return variants[0];
  }

  private getSessionId(): string {
    if (typeof sessionStorage === 'undefined') {
      return `anonymous-${Date.now()}`;
    }

    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('sessionId', sessionId);
    }

    return sessionId;
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  private applyTheme(theme: ThemeConfig): void {
    const root = document.documentElement;
    
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--secondary-color', theme.secondaryColor);
    root.style.setProperty('--accent-color', theme.accentColor);
    root.style.setProperty('--font-family', theme.fontFamily);
    root.style.setProperty('--font-size', `${theme.fontSize}px`);
    root.style.setProperty('--border-radius', `${theme.borderRadius}px`);
    root.style.setProperty('--spacing', `${theme.spacing}px`);

    if (theme.mode !== 'auto') {
      root.setAttribute('data-theme', theme.mode);
    }

    if (theme.customCSS) {
      let styleEl = document.getElementById('custom-theme-css');
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'custom-theme-css';
        document.head.appendChild(styleEl);
      }
      styleEl.textContent = theme.customCSS;
    }
  }

  private emitChange(event: ConfigChangeEvent): void {
    this.changeListeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        this.error('Error in change listener:', error);
      }
    });
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default ConfigService;
