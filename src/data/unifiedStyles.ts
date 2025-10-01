// Utilidades unificadas para trabalhar com estilos do quiz
// Fornece uma camada estável evitando que componentes manipulem somente string literals
// e permitindo evolução futura (ex: adicionar campos dinâmicos) sem quebrar chamadas existentes.

import { StyleResult, StyleType } from '@/types/quiz';
import { styleMapping } from './styles';

export type UnifiedStyle = StyleResult; // Alias semântico

export const getStyle = (id: StyleType): UnifiedStyle | undefined => {
    return styleMapping[id];
};

export const listStyles = (): UnifiedStyle[] => Object.values(styleMapping);

export const isUnifiedStyle = (value: unknown): value is UnifiedStyle => {
    return !!value && typeof value === 'object' && 'id' in (value as any) && 'name' in (value as any);
};

// Aceita string literal de estilo ou objeto completo e retorna o objeto normalizado
export const resolveStyle = (value: StyleType | UnifiedStyle | undefined | null): UnifiedStyle | undefined => {
    if (!value) return undefined;
    if (typeof value === 'string') return getStyle(value as StyleType);
    return value as UnifiedStyle;
};

// Retorna um mapa id -> UnifiedStyle (imutável) para fácil memoização
export const getStyleMap = (): Readonly<Record<StyleType, UnifiedStyle>> => styleMapping as any;
