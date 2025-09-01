// Global editor/debug flags used across the editor/diagnostic runtime
// Keeping them loose avoids cascading type friction in dev-only instrumentation

export {};

declare global {
  interface Window {
    __quizCurrentStep?: number | string;
    __EDITOR_CONTEXT__?: any;
    __EDITOR_CONTEXT_ERROR__?: any;
    __EDITOR_INVALID_STEPS__?: any[];
    __EDITOR_FAILED_BLOCK_LOOKUPS__?: any[];
    __EDITOR_STEP_ANALYSIS__?: any;
    __EDITOR_INVALID_NAVIGATION__?: any[];
    __EDITOR_DIAGNOSTICS__?: any;
  __EDITOR_DIAGNOSTIC_RESULTS__?: any;
    __EDITOR_RACE_CONDITIONS__?: any[];
    __DISABLE_AUTO_SCROLL?: boolean;
    __DISABLE_SCROLL_SYNC?: boolean;
  }
}
