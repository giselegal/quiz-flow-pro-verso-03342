/**
 * Feature flags para evolução incremental do editor.
 * EDITOR_CORE_V2: Ativa cadeia de providers consolidada e novo EditorCoreProvider.
 */
export function isEditorCoreV2Enabled(): boolean {
    if (typeof window === 'undefined') return false;
    return (window as any).EDITOR_CORE_V2 === true;
}

export function enableEditorCoreV2() {
    if (typeof window !== 'undefined') {
        (window as any).EDITOR_CORE_V2 = true;
    }
}

export function disableEditorCoreV2() {
    if (typeof window !== 'undefined') {
        delete (window as any).EDITOR_CORE_V2;
    }
}
