/**
 * 🎯 EDITOR ROUTE CONFIGURATION
 * 
 * Configuração das rotas do editor visual unificado usando wouter
 */

import React from 'react';
import ModernUnifiedEditor from './ModernUnifiedEditor';
import UnifiedCRUDProvider from '@/context/UnifiedCRUDProvider';
import { FunnelContext } from '@/core/contexts/FunnelContext';

export const EditorRoutes: React.FC = () => {
    return (
        <UnifiedCRUDProvider autoLoad={true} debug={false} context={FunnelContext.EDITOR}>
            <ModernUnifiedEditor />
        </UnifiedCRUDProvider>
    );
};

export default EditorRoutes;