/**
 * 🧹 PLANO DE LIMPEZA - Migração para SinglePropertiesPanel
 * 
 * Esta análise mostra quais arquivos podem ser removidos e quais precisam ser atualizados.
 */

// ===== ARQUIVOS QUE PODEM SER REMOVIDOS (APÓS MIGRAÇÃO) =====

const ARQUIVOS_PARA_REMOVER = {
    // Painéis de propriedades redundantes
    paineis: [
        'src/components/universal/EnhancedUniversalPropertiesPanel.tsx', // 616 linhas
        'src/components/editor/OptimizedPropertiesPanel.tsx', // 800+ linhas
        'src/components/editor/properties/editors/HeaderPropertyEditor.tsx', // 650+ linhas
        'src/components/editor/properties/EnhancedPropertiesPanel.tsx', // 500+ linhas
        'src/components/editor/properties/EnhancedNoCodePropertiesPanel.tsx', // 800+ linhas
        'src/components/editor/properties/ModernPropertiesPanel.tsx', // 400+ linhas
        'src/components/enhanced-editor/properties/PropertiesPanel.tsx', // 123 linhas
        'src/components/quiz-builder/PropertiesPanel.tsx', // 200+ linhas
    ],

    // Editores específicos (funcionalidade movida para SinglePropertiesPanel)
    editores: [
        'src/components/editor/properties/editors/QuestionPropertyEditor.tsx',
        'src/components/editor/properties/editors/StepNavigationPropertyEditor.tsx',
        'src/components/editor/properties/editors/CanvasContainerPropertyEditor.tsx',
    ],

    // Painéis específicos de quiz (funcionalidade no SinglePropertiesPanel)
    paineis_quiz: [
        'src/components/editor/quiz/OptionsGridPropertiesPanel.tsx',
        'src/components/editor/quiz/QuizConfigurationPanel.tsx',
        'src/components/editor/quiz/QuizHeaderPropertiesPanel.tsx',
    ],

    // Testes dos componentes removidos
    testes: [
        'src/components/editor/__tests__/OptimizedPropertiesPanel.test.tsx',
    ],

    // Backup e arquivos temporários
    backup: [
        'backup/properties-panels/', // Pasta inteira
        'src/components/universal/EnhancedUniversalPropertiesPanel.simple.tsx',
    ]
};

// ===== ARQUIVOS QUE PRECISAM SER ATUALIZADOS =====

const ARQUIVOS_PARA_ATUALIZAR = {
    // Editor principal - substituir PropertiesPanel por SinglePropertiesPanel
    editor_principal: [
        {
            arquivo: 'src/components/editor/properties/PropertiesColumn.tsx',
            mudanca: 'Importar e usar SinglePropertiesPanel ao invés de PropertiesPanel',
            linhas: [5, 50, 72], // Linhas onde PropertiesPanel é usado
        }
    ],

    // Editor responsivo - atualizar para usar SinglePropertiesPanel
    editor_responsivo: [
        {
            arquivo: 'src/components/editor/SchemaDrivenEditorResponsive.tsx',
            mudanca: 'Substituir RegistryPropertiesPanel por SinglePropertiesPanel',
            linhas: [1, 187], // Import e uso
        }
    ],

    // Componentes de layout que passam painéis
    layouts: [
        {
            arquivo: 'src/components/editor/layout/FourColumnLayout.tsx',
            mudanca: 'Manter como está - apenas recebe propertiesPanel como prop',
            status: 'ok'
        }
    ],

    // Componentes lazy loading
    lazy_loading: [
        {
            arquivo: 'src/components/lazy/PerformanceOptimizedComponents.tsx',
            mudanca: 'Remover lazy loading dos painéis antigos, adicionar para SinglePropertiesPanel',
            linhas: [33, 34, 121, 123]
        }
    ],

    // Exportações principais
    exports: [
        {
            arquivo: 'src/components/editor/properties/index.ts',
            mudanca: 'Remover exports antigos, adicionar SinglePropertiesPanel',
        }
    ]
};

// ===== ESTATÍSTICAS DA LIMPEZA =====

const ESTATISTICAS_LIMPEZA = {
    linhas_removidas: 5000, // Aproximadamente
    arquivos_removidos: 15,
    arquivos_atualizados: 6,
    reducao_complexidade: '85%',
    resolucao_ids_duplicados: '100%'
};

// ===== ORDEM DE EXECUÇÃO =====

const ORDEM_MIGRACAO = [
    '1. Atualizar PropertiesColumn.tsx para usar SinglePropertiesPanel',
    '2. Atualizar SchemaDrivenEditorResponsive.tsx',
    '3. Testar editor para garantir que funciona',
    '4. Remover arquivos antigos um por vez',
    '5. Atualizar imports e exports',
    '6. Executar testes para validar',
    '7. Commit final da limpeza'
];

export {
    ARQUIVOS_PARA_REMOVER,
    ARQUIVOS_PARA_ATUALIZAR,
    ESTATISTICAS_LIMPEZA,
    ORDEM_MIGRACAO
};