// Temporary global shims to unblock incremental type-checking.
// These should be replaced by precise declarations or real modules (WAVE2/3).

declare module '*';

// Helpful narrow shims for commonly missing internal modules (optional overrides)
// REMOVED: versioningService module declaration - now has proper TypeScript implementation

declare module './LegacyLoadingAdapters' {
    export function checkLegacyLoadingUsage(...args: any[]): any;
    const LegacyLoadingAdapters: any;
    export default LegacyLoadingAdapters;
}

declare module '../utils/funnelAIActivator' {
    export function activateFunnelAI(...args: any[]): any;
    export function checkFunnelAIStatus(...args: any[]): any;
}
