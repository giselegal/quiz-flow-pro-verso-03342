/**
 * Template Engine Hook Stub - Legacy compatibility
 */

export function useTemplateEngine(templateSlug?: string) {
    return {
        template: null,
        isLoading: false,
        isSaving: false,
        loadTemplate: async () => {},
        saveTemplate: async () => {},
        createTemplate: async () => null,
        setTemplate: () => {}
    };
}
