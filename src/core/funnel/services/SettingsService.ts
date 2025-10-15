/**
 * Settings Service Stub - Legacy compatibility
 */

export interface DefaultSettingsOptions {
    [key: string]: any;
}

export interface SettingsValidationResult {
    valid: boolean;
    errors: string[];
}

export class SettingsService {
    loadSettings(): Record<string, any> { 
        return {}; 
    }
}

export const settingsService = new SettingsService();
