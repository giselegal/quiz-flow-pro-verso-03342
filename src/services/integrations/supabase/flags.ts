// Centraliza lógica de habilitação/desabilitação do Supabase
// Precedência: DISABLE vence ENABLE. ENABLE default é true se não explicitado.

export function isSupabaseDisabled() {
    const env: any = (import.meta as any)?.env || {};
    return env.VITE_DISABLE_SUPABASE === 'true';
}

export function isSupabaseEnabled() {
    const env: any = (import.meta as any)?.env || {};
    if (isSupabaseDisabled()) return false;
    const enableVar = env.VITE_ENABLE_SUPABASE;
    // Se não definido, assume habilitado (para produção normal) e somente bloqueia se explicitamente false
    if (enableVar === undefined || enableVar === null || enableVar === '') return true;
    return enableVar !== 'false';
}

export function getSupabaseGatingInfo() {
    return {
        disabled: isSupabaseDisabled(),
        enabled: isSupabaseEnabled(),
    };
}
