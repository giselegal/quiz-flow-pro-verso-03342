/**
 * 🎯 INTEGRATION GUIDE - Guia de Integração dos Contextos Sincronizados
 * 
 * Este arquivo demonstra como integrar os novos contextos sincronizados
 * nos componentes existentes do editor
 */

import React from 'react';
import {
    useEditorSync,
    useFunnelSync,
    useUserSync,
    EditorSyncProvider,
    FunnelSyncProvider,
    UserSyncProvider
} from '../storage/SyncedContexts';

/**
 * EXEMPLO 1: Configuração do Provider Principal (App.tsx)
 */
export const AppWithProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <UserSyncProvider>
            <EditorSyncProvider>
                <FunnelSyncProvider>
                    {children}
                </FunnelSyncProvider>
            </EditorSyncProvider>
        </UserSyncProvider>
    );
};

/**
 * EXEMPLO 2: Editor Component Refatorado
 */
export const EditorComponent: React.FC = () => {
    const {
        editorState,
        setEditorConfig,
        addBlock,
        updateBlock,
        deleteBlock,
        setSelectedBlock,
        saveState,
        isLoading
    } = useEditorSync();

    // Exemplo de uso com lazy loading
    React.useEffect(() => {
        // O estado já carrega automaticamente via context
        console.log('Editor state loaded:', editorState);
    }, [editorState]);

    const handleAddTextBlock = async () => {
        const newBlock = {
            id: `block-${Date.now()}`,
            type: 'text' as const,
            properties: {
                text: 'Novo bloco de texto',
                fontSize: '16px',
                color: '#000000'
            },
            position: { x: 100, y: 100 }
        };

        await addBlock(newBlock);
    };

    const handleSaveEditor = async () => {
        await saveState();
        console.log('Estado salvo!');
    };

    if (isLoading) {
        return <div>Carregando editor...</div>;
    }

    return (
        <div className="editor-container">
            <div className="editor-toolbar">
                <button onClick={handleAddTextBlock}>
                    Adicionar Texto
                </button>
                <button onClick={handleSaveEditor}>
                    Salvar
                </button>
                <span>Blocos: {editorState.blocks.length}</span>
            </div>

            <div className="editor-canvas">
                {editorState.blocks.map(block => (
                    <BlockComponent
                        key={block.id}
                        block={block}
                        onUpdate={(updates) => updateBlock(block.id, updates)}
                        onDelete={() => deleteBlock(block.id)}
                        onSelect={() => setSelectedBlock(block.id)}
                        isSelected={editorState.selectedBlockId === block.id}
                    />
                ))}
            </div>
        </div>
    );
};

/**
 * EXEMPLO 3: Componente de Bloco Individual
 */
interface BlockComponentProps {
    block: any;
    onUpdate: (updates: any) => void;
    onDelete: () => void;
    onSelect: () => void;
    isSelected: boolean;
}

const BlockComponent: React.FC<BlockComponentProps> = ({
    block,
    onUpdate,
    onDelete,
    onSelect,
    isSelected
}) => {
    const [isEditing, setIsEditing] = React.useState(false);

    const handleTextChange = (newText: string) => {
        onUpdate({
            properties: {
                ...block.properties,
                text: newText
            }
        });
    };

    return (
        <div
            className={`block ${isSelected ? 'selected' : ''}`}
            style={{
                position: 'absolute',
                left: block.position.x,
                top: block.position.y,
                border: isSelected ? '2px solid blue' : '1px solid gray'
            }}
            onClick={onSelect}
        >
            {isEditing ? (
                <input
                    value={block.properties.text}
                    onChange={(e) => handleTextChange(e.target.value)}
                    onBlur={() => setIsEditing(false)}
                    onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
                    autoFocus
                />
            ) : (
                <div onDoubleClick={() => setIsEditing(true)}>
                    {block.properties.text}
                </div>
            )}

            {isSelected && (
                <button
                    className="delete-btn"
                    onClick={onDelete}
                    style={{ position: 'absolute', top: -10, right: -10 }}
                >
                    ×
                </button>
            )}
        </div>
    );
};

/**
 * EXEMPLO 4: Settings Modal Refatorado
 */
export const FunnelSettingsModal: React.FC<{ funnelId: string; onClose: () => void }> = ({
    funnelId,
    onClose
}) => {
    const {
        funnelSettings,
        updateFunnelSettings,
        saveFunnelSettings
    } = useFunnelSync(funnelId);

    const [localSettings, setLocalSettings] = React.useState(funnelSettings);

    // Sincronizar com mudanças externas
    React.useEffect(() => {
        setLocalSettings(funnelSettings);
    }, [funnelSettings]);

    const handleSave = async () => {
        await updateFunnelSettings(localSettings);
        await saveFunnelSettings();
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Configurações do Funil</h2>

                <div className="form-group">
                    <label>Nome do Funil:</label>
                    <input
                        value={localSettings.name || ''}
                        onChange={(e) => setLocalSettings({
                            ...localSettings,
                            name: e.target.value
                        })}
                    />
                </div>

                <div className="form-group">
                    <label>Descrição:</label>
                    <textarea
                        value={localSettings.description || ''}
                        onChange={(e) => setLocalSettings({
                            ...localSettings,
                            description: e.target.value
                        })}
                    />
                </div>

                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={localSettings.isActive || false}
                            onChange={(e) => setLocalSettings({
                                ...localSettings,
                                isActive: e.target.checked
                            })}
                        />
                        Ativo
                    </label>
                </div>

                <div className="modal-actions">
                    <button onClick={onClose}>Cancelar</button>
                    <button onClick={handleSave}>Salvar</button>
                </div>
            </div>
        </div>
    );
};

/**
 * EXEMPLO 5: Dashboard com Múltiplos Contexts
 */
export const Dashboard: React.FC = () => {
    const { editorState } = useEditorSync();
    const { userPreferences, updateUserPreferences } = useUserSync();
    const { getAllFunnelSettings } = useFunnelSync();

    const [funnels, setFunnels] = React.useState<any[]>([]);

    React.useEffect(() => {
        // Carregar todos os funis
        const loadFunnels = async () => {
            const allFunnels = await getAllFunnelSettings();
            setFunnels(Object.entries(allFunnels).map(([id, settings]) => ({
                id,
                ...settings
            })));
        };

        loadFunnels();
    }, [getAllFunnelSettings]);

    const toggleTheme = async () => {
        const newTheme = userPreferences.theme === 'dark' ? 'light' : 'dark';
        await updateUserPreferences({
            ...userPreferences,
            theme: newTheme
        });
    };

    return (
        <div className={`dashboard theme-${userPreferences.theme}`}>
            <header className="dashboard-header">
                <h1>Quiz Quest Dashboard</h1>
                <button onClick={toggleTheme}>
                    Tema: {userPreferences.theme}
                </button>
            </header>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <h3>Editor</h3>
                    <p>{editorState.blocks.length} blocos</p>
                </div>

                <div className="stat-card">
                    <h3>Funis</h3>
                    <p>{funnels.length} funis criados</p>
                </div>

                <div className="stat-card">
                    <h3>Funis Ativos</h3>
                    <p>{funnels.filter(f => f.isActive).length} ativos</p>
                </div>
            </div>

            <div className="recent-funnels">
                <h2>Funis Recentes</h2>
                {funnels.slice(0, 5).map(funnel => (
                    <div key={funnel.id} className="funnel-item">
                        <span>{funnel.name}</span>
                        <span className={funnel.isActive ? 'active' : 'inactive'}>
                            {funnel.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

/**
 * EXEMPLO 6: Hook Personalizado para Persistência Automática
 */
export const useAutoSave = (data: any, namespace: string, key: string, delay = 2000) => {
    const [isSaving, setIsSaving] = React.useState(false);
    const timeoutRef = React.useRef<NodeJS.Timeout>();

    React.useEffect(() => {
        // Limpar timeout anterior
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Configurar novo timeout
        timeoutRef.current = setTimeout(async () => {
            setIsSaving(true);
            try {
                await import('../storage/AdvancedStorageSystem').then(({ advancedStorage }) =>
                    advancedStorage.setItem(key, data, { namespace })
                );
            } catch (error) {
                console.error('Erro no auto-save:', error);
            } finally {
                setIsSaving(false);
            }
        }, delay);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [data, namespace, key, delay]);

    return { isSaving };
};

/**
 * EXEMPLO 7: Integração com Componente Legacy
 */
export const LegacyComponentAdapter: React.FC = () => {
    const { editorState, updateBlock } = useEditorSync();

    // Converter para formato legacy
    const legacyData = React.useMemo(() => ({
        blocks: editorState.blocks.map(block => ({
            ...block,
            // Conversões necessárias para formato antigo
        }))
    }), [editorState.blocks]);

    // Converter mudanças do formato legacy para novo
    const handleLegacyUpdate = (legacyBlock: any) => {
        const modernBlock = {
            ...legacyBlock,
            // Conversões necessárias para formato novo
        };
        updateBlock(modernBlock.id, modernBlock);
    };

    return (
        <div>
            {/* Componente legacy que usa dados convertidos */}
            {/* <LegacyEditorComponent 
        data={legacyData} 
        onChange={handleLegacyUpdate}
      /> */}
        </div>
    );
};

/**
 * EXEMPLO DE USO COMPLETO
 */
export const CompleteExample: React.FC = () => {
    return (
        <AppWithProviders>
            <div className="app">
                <Dashboard />
                <EditorComponent />
                {/* Outros componentes */}
            </div>
        </AppWithProviders>
    );
};
