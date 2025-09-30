type Level = 'debug' | 'info' | 'warn' | 'error';
type DebugArea = 'sync' | 'quiz' | 'performance' | 'dnd' | 'analytics';

interface DebugConfig {
    enabled: boolean;
    areas: Partial<Record<DebugArea, boolean>>;
}

function baseEnabled(): boolean {
    try {
        if (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_DEBUG_LOG === 'true') return true;
        if (typeof window !== 'undefined') return window.localStorage.getItem('debug:editor') === '1';
    } catch { /* ignore */ }
    return false;
}

const defaultConfig: DebugConfig = {
    enabled: baseEnabled(),
    areas: { sync: true, quiz: true, performance: false, dnd: false, analytics: false }
};

class Logger {
    private cfg: DebugConfig = defaultConfig;
    configure(partial: Partial<DebugConfig>) {
        this.cfg = { ...this.cfg, ...partial, areas: { ...this.cfg.areas, ...(partial.areas || {}) } };
    }
    private should(level: Level, area?: DebugArea) {
        if (level !== 'debug') return true; // sempre loga info/warn/error
        if (!this.cfg.enabled) return false;
        if (area && this.cfg.areas[area] === false) return false;
        return true;
    }
    log(level: Level, ...args: any[]) {
        if (!this.should(level)) return;
        // eslint-disable-next-line no-console
        console[level === 'debug' ? 'log' : level](...args);
    }
    area(area: DebugArea, level: Level, ...args: any[]) {
        if (!this.should(level, area)) return;
        // eslint-disable-next-line no-console
        console[level === 'debug' ? 'log' : level](`[${area}]`, ...args);
    }
    debug(...args: any[]) { this.log('debug', ...args); }
    info(...args: any[]) { this.log('info', ...args); }
    warn(...args: any[]) { this.log('warn', ...args); }
    error(...args: any[]) { this.log('error', ...args); }
}

export const logger = new Logger();
export default logger;
