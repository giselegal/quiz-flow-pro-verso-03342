/**
 * 🎯 EDITOR ROUTE CONFIGURATION
 * 
 * Configuração das rotas do editor visual unificado usando wouter
 */

import React from 'react';
import ModernUnifiedEditor from './ModernUnifiedEditor';
import UnifiedCRUDProvider from '@/context/UnifiedCRUDProvider';

export const EditorRoutes: React.FC = () => {
    return (
        <UnifiedCRUDProvider autoLoad={true} debug={false}>
            <ModernUnifiedEditor />
        </UnifiedCRUDProvider>
    );
};

export default EditorRoutes;