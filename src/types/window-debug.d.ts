declare global {
    interface Window {
        __EDITOR_STEP_ANALYSIS__?: any;
        __EDITOR_INVALID_NAVIGATION__?: any[];
        __EDITOR_RACE_CONDITIONS__?: any[];
        __EDITOR_FAILED_BLOCK_LOOKUPS__?: any[];
        __EDITOR_CONTEXT_ERROR__?: any;
        __EDITOR_INVALID_STEPS__?: any[];
        __EDITOR_DIAGNOSTIC_RESULTS__?: any;
    }
}
export { };
