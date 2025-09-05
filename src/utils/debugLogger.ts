type Level = 'debug' | 'info' | 'warn' | 'error';

function isEnabled(): boolean {
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_DEBUG_LOG === 'true') return true;
    if (typeof window !== 'undefined') return window.localStorage.getItem('debug:editor') === '1';
  } catch {}
  return false;
}

export const logger = {
  log(level: Level, ...args: any[]) {
    if (!isEnabled() && level === 'debug') return;
    // eslint-disable-next-line no-console
    console[level === 'debug' ? 'log' : level](...args);
  },
  debug: (...args: any[]) => logger.log('debug', ...args),
  info: (...args: any[]) => logger.log('info', ...args),
  warn: (...args: any[]) => logger.log('warn', ...args),
  error: (...args: any[]) => logger.log('error', ...args),
};

export default logger;
