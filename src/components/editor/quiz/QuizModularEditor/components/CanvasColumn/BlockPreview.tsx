// Deprecated placeholder: Canvas agora usa o BlockTypeRenderer canônico.
// Este arquivo é mantido apenas para evitar importações quebradas enquanto o código legado é limpo.
import React from 'react';
import { appLogger } from '@/lib/utils/appLogger';

export type BlockPreviewProps = {
    // Mantido por compatibilidade, não é mais usado
    block?: any;
    onQuickInsert?: (blockId: string) => void;
};

export default function BlockPreview(_props: BlockPreviewProps) {
    if (process.env.NODE_ENV !== 'production') {
        // Evita ruído em produção
        appLogger.debug('[BlockPreview] Componente legado não utilizado. Use BlockTypeRenderer.');
    }
    return null;
}
