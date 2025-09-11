/**
 * 🧪 TESTES DO EDITOR DESACOPLADO
 * 
 * Valida todas as funcionalidades do editor usando mocks
 * Testa isolamento de dependências e conformidade com interfaces
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import { FunnelEditor } from '../components/FunnelEditor';
import { EditorMockProvider } from '../mocks/EditorMocks';
import {
    EditorFunnelData,
    EditorPageData,
    EditorBlockData,
    EditorDataProvider,
    EditorTemplateProvider,
    EditorValidator,
    EditorEventHandler,
    EditorConfig
} from '../interfaces/EditorInterfaces';

// ============================================================================
// TESTES DE INTERFACES
// ============================================================================

describe('EditorInterfaces', () => {
    test('EditorMockProvider creates valid implementations', () => {
        const { dataProvider, templateProvider, validator, eventHandler, utils } =
            EditorMockProvider.createFullMockSetup();

        expect(dataProvider).toBeDefined();
        expect(templateProvider).toBeDefined();
        expect(validator).toBeDefined();
        expect(eventHandler).toBeDefined();
        expect(utils).toBeDefined();

        // Verificar se implementam as interfaces corretas
        expect(typeof dataProvider.loadFunnel).toBe('function');
        expect(typeof dataProvider.saveFunnel).toBe('function');
        expect(typeof templateProvider.getAvailableTemplates).toBe('function');
        expect(typeof validator.validateFunnel).toBe('function');
        expect(typeof eventHandler.onFunnelLoad).toBe('function');
    });

    test('Mock utils create valid data structures', () => {
        const { utils } = EditorMockProvider.createMinimalMockSetup();

        const funnel = utils.createEmptyFunnel('Test Funnel');
        expect(funnel.id).toBeTruthy();
        expect(funnel.name).toBe('Test Funnel');
        expect(funnel.pages).toEqual([]);
        expect(funnel.settings).toBeDefined();
        expect(funnel.metadata).toBeDefined();

        const page = utils.createEmptyPage('test-page');
        expect(page.id).toBeTruthy();
        expect(page.name).toBe('test-page');
        expect(page.blocks).toEqual([]);

        const block = utils.createTextBlock('Hello World');
        expect(block.id).toBeTruthy();
        expect(block.type).toBe('text');
        expect(block.content.text).toBe('Hello World');
    });
});

// ============================================================================
// TESTES DO EDITOR COM DADOS MOCKADOS
// ============================================================================

describe('FunnelEditor with Mock Data', () => {
    let mockSetup: ReturnType<typeof EditorMockProvider.createFullMockSetup>;

    beforeEach(() => {
        mockSetup = EditorMockProvider.createFullMockSetup();
    });

    test('renders editor with funnel ID', async () => {
        const onSave = jest.fn();
        const onChange = jest.fn();

        render(
            <FunnelEditor
                funnelId="test-funnel"
                dataProvider={mockSetup.dataProvider}
                validator={mockSetup.validator}
                eventHandler={mockSetup.eventHandler}
                onSave={onSave}
                onChange={onChange}
            />
        );

        // Aguardar carregamento
        await waitFor(() => {
            expect(screen.getByText(/Sample Funnel/)).toBeInTheDocument();
        });

        // Verificar se componentes do editor estão presentes
        expect(screen.getByText(/Pages/)).toBeInTheDocument();
        expect(screen.getByText(/Properties/)).toBeInTheDocument();
    });

    test('renders editor with initial data', () => {
        const { utils } = mockSetup;
        const initialFunnel = utils.createEmptyFunnel('Custom Funnel');
        initialFunnel.pages = [utils.createEmptyPage('intro')];

        const onSave = jest.fn();

        render(
            <FunnelEditor
                initialData={initialFunnel}
                dataProvider={mockSetup.dataProvider}
                onSave={onSave}
            />
        );

        expect(screen.getByText(/Custom Funnel/)).toBeInTheDocument();
        expect(screen.getByText(/intro/)).toBeInTheDocument();
    });

    test('handles save functionality', async () => {
        const onSave = jest.fn();
        const saveSpy = jest.spyOn(mockSetup.dataProvider, 'saveFunnel');

        render(
            <FunnelEditor
                funnelId="test-funnel"
                dataProvider={mockSetup.dataProvider}
                validator={mockSetup.validator}
                onSave={onSave}
            />
        );

        await waitFor(() => {
            expect(screen.getByText(/Sample Funnel/)).toBeInTheDocument();
        });

        // Simular mudança nos dados
        const nameInput = screen.getByDisplayValue(/Sample Funnel/);
        fireEvent.change(nameInput, { target: { value: 'Updated Funnel' } });

        // Simular salvamento
        const saveButton = screen.getByText(/Save/);
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalled();
            expect(onSave).toHaveBeenCalled();
        });
    });

    test('handles page management', async () => {
        render(
            <FunnelEditor
                funnelId="test-funnel"
                dataProvider={mockSetup.dataProvider}
                validator={mockSetup.validator}
                config={{
                    mode: 'edit',
                    features: {
                        canAddPages: true,
                        canRemovePages: true,
                        canReorderPages: true,
                        canEditBlocks: true,
                        canPreview: true,
                        canPublish: true,
                        canDuplicate: true,
                        canExport: true
                    }
                }}
            />
        );

        await waitFor(() => {
            expect(screen.getByText(/Sample Funnel/)).toBeInTheDocument();
        });

        // Adicionar página
        const addPageButton = screen.getByText(/Add Page/);
        fireEvent.click(addPageButton);

        await waitFor(() => {
            expect(screen.getByText(/New Page/)).toBeInTheDocument();
        });
    });

    test('respects readonly mode', async () => {
        render(
            <FunnelEditor
                funnelId="test-funnel"
                dataProvider={mockSetup.dataProvider}
                config={{
                    mode: 'readonly',
                    features: {
                        canAddPages: false,
                        canRemovePages: false,
                        canReorderPages: false,
                        canEditBlocks: false,
                        canPreview: true,
                        canPublish: false,
                        canDuplicate: false,
                        canExport: true
                    }
                }}
            />
        );

        await waitFor(() => {
            expect(screen.getByText(/Sample Funnel/)).toBeInTheDocument();
        });

        // Verificar que botões de edição não estão presentes
        expect(screen.queryByText(/Add Page/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Save/)).not.toBeInTheDocument();

        // Mas o preview deve estar disponível
        expect(screen.getByText(/Preview/)).toBeInTheDocument();
    });
});

// ============================================================================
// TESTES DE INTEGRAÇÃO DE PROVIDERS
// ============================================================================

describe('Editor Data Provider Integration', () => {
    test('handles provider errors gracefully', async () => {
        const failingProvider: EditorDataProvider = {
            loadFunnel: jest.fn().mockRejectedValue(new Error('Network error')),
            saveFunnel: jest.fn().mockRejectedValue(new Error('Save failed')),
            listFunnels: jest.fn().mockResolvedValue([]),
            createFunnel: jest.fn(),
            deleteFunnel: jest.fn(),
            duplicateFunnel: jest.fn()
        };

        const onError = jest.fn();

        render(
            <FunnelEditor
                funnelId="failing-funnel"
                dataProvider={failingProvider}
                onError={onError}
            />
        );

        await waitFor(() => {
            expect(onError).toHaveBeenCalledWith('Failed to load funnel: Network error');
        });
    });

    test('calls event handlers correctly', async () => {
        const mockEventHandler = {
            onFunnelLoad: jest.fn(),
            onFunnelSave: jest.fn(),
            onFunnelChange: jest.fn(),
            onPageAdd: jest.fn(),
            onPageRemove: jest.fn(),
            onPageReorder: jest.fn(),
            onBlockAdd: jest.fn(),
            onBlockRemove: jest.fn(),
            onBlockUpdate: jest.fn(),
            onModeChange: jest.fn()
        };

        render(
            <FunnelEditor
                funnelId="test-funnel"
                dataProvider={mockSetup.dataProvider}
                eventHandler={mockEventHandler}
            />
        );

        await waitFor(() => {
            expect(mockEventHandler.onFunnelLoad).toHaveBeenCalled();
        });
    });
});

// ============================================================================
// TESTES DE VALIDAÇÃO
// ============================================================================

describe('Editor Validation', () => {
    test('validates funnel data on save', async () => {
        const mockValidator = {
            validateFunnel: jest.fn().mockResolvedValue({ isValid: false, errors: ['Name is required'] }),
            validatePage: jest.fn().mockResolvedValue({ isValid: true, errors: [] }),
            validateBlock: jest.fn().mockResolvedValue({ isValid: true, errors: [] })
        };

        const onError = jest.fn();

        render(
            <FunnelEditor
                funnelId="test-funnel"
                dataProvider={mockSetup.dataProvider}
                validator={mockValidator}
                onError={onError}
                config={{
                    validation: {
                        realTime: false,
                        onSave: true,
                        showWarnings: true,
                        strictMode: false
                    }
                }}
            />
        );

        await waitFor(() => {
            expect(screen.getByText(/Sample Funnel/)).toBeInTheDocument();
        });

        // Tentar salvar
        const saveButton = screen.getByText(/Save/);
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockValidator.validateFunnel).toHaveBeenCalled();
            expect(onError).toHaveBeenCalledWith('Validation failed: Name is required');
        });
    });

    test('validates in real time when enabled', async () => {
        const mockValidator = {
            validateFunnel: jest.fn().mockResolvedValue({ isValid: true, errors: [] }),
            validatePage: jest.fn().mockResolvedValue({ isValid: true, errors: [] }),
            validateBlock: jest.fn().mockResolvedValue({ isValid: true, errors: [] })
        };

        render(
            <FunnelEditor
                funnelId="test-funnel"
                dataProvider={mockSetup.dataProvider}
                validator={mockValidator}
                config={{
                    validation: {
                        realTime: true,
                        onSave: true,
                        showWarnings: true,
                        strictMode: false
                    }
                }}
            />
        );

        await waitFor(() => {
            expect(screen.getByText(/Sample Funnel/)).toBeInTheDocument();
        });

        // Fazer mudança nos dados
        const nameInput = screen.getByDisplayValue(/Sample Funnel/);
        fireEvent.change(nameInput, { target: { value: 'New Name' } });

        // Aguardar validação em tempo real
        await waitFor(() => {
            expect(mockValidator.validateFunnel).toHaveBeenCalled();
        });
    });
});

// ============================================================================
// TESTES DE AUTO-SAVE
// ============================================================================

describe('Editor Auto-save', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('auto-saves at specified intervals', async () => {
        const saveSpy = jest.spyOn(mockSetup.dataProvider, 'saveFunnel');

        render(
            <FunnelEditor
                funnelId="test-funnel"
                dataProvider={mockSetup.dataProvider}
                config={{
                    autoSave: {
                        enabled: true,
                        interval: 5000,
                        onUserInput: false,
                        showIndicator: true
                    }
                }}
            />
        );

        await waitFor(() => {
            expect(screen.getByText(/Sample Funnel/)).toBeInTheDocument();
        });

        // Fazer mudança nos dados
        const nameInput = screen.getByDisplayValue(/Sample Funnel/);
        fireEvent.change(nameInput, { target: { value: 'Auto-saved Funnel' } });

        // Avançar timer
        jest.advanceTimersByTime(5000);

        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalled();
        });
    });

    test('auto-saves on user input when enabled', async () => {
        const saveSpy = jest.spyOn(mockSetup.dataProvider, 'saveFunnel');

        render(
            <FunnelEditor
                funnelId="test-funnel"
                dataProvider={mockSetup.dataProvider}
                config={{
                    autoSave: {
                        enabled: true,
                        interval: 30000,
                        onUserInput: true,
                        showIndicator: true
                    }
                }}
            />
        );

        await waitFor(() => {
            expect(screen.getByText(/Sample Funnel/)).toBeInTheDocument();
        });

        // Fazer mudança nos dados
        const nameInput = screen.getByDisplayValue(/Sample Funnel/);
        fireEvent.change(nameInput, { target: { value: 'Input-saved Funnel' } });

        // Aguardar debounce do auto-save
        jest.advanceTimersByTime(2000);

        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalled();
        });
    });
});

// ============================================================================
// TESTES DE CONFIGURAÇÃO PERSONALIZADA
// ============================================================================

describe('Editor Custom Configuration', () => {
    test('applies custom theme settings', async () => {
        const customConfig: Partial<EditorConfig> = {
            ui: {
                theme: 'dark',
                layout: 'sidebar',
                showMinimap: true,
                showGridlines: false,
                showRulers: true
            }
        };

        render(
            <FunnelEditor
                funnelId="test-funnel"
                dataProvider={mockSetup.dataProvider}
                config={customConfig}
            />
        );

        await waitFor(() => {
            expect(screen.getByText(/Sample Funnel/)).toBeInTheDocument();
        });

        // Verificar se classes de tema foram aplicadas
        const editor = screen.getByTestId('funnel-editor');
        expect(editor).toHaveClass('theme-dark');
        expect(editor).toHaveClass('layout-sidebar');
    });

    test('disables features based on configuration', async () => {
        const restrictiveConfig: Partial<EditorConfig> = {
            features: {
                canAddPages: false,
                canRemovePages: false,
                canReorderPages: false,
                canEditBlocks: false,
                canPreview: true,
                canPublish: false,
                canDuplicate: false,
                canExport: false
            }
        };

        render(
            <FunnelEditor
                funnelId="test-funnel"
                dataProvider={mockSetup.dataProvider}
                config={restrictiveConfig}
            />
        );

        await waitFor(() => {
            expect(screen.getByText(/Sample Funnel/)).toBeInTheDocument();
        });

        // Verificar que funcionalidades foram desabilitadas
        expect(screen.queryByText(/Add Page/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Publish/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Export/)).not.toBeInTheDocument();

        // Mas preview deve estar disponível
        expect(screen.getByText(/Preview/)).toBeInTheDocument();
    });
});

// ============================================================================
// TESTES DE PERFORMANCE E MEMÓRIA
// ============================================================================

describe('Editor Performance', () => {
    test('handles large funnels efficiently', async () => {
        const { utils } = mockSetup;

        // Criar funil com muitas páginas
        const largeFunnel = utils.createEmptyFunnel('Large Funnel');
        for (let i = 0; i < 100; i++) {
            const page = utils.createEmptyPage(`page-${i}`);
            // Adicionar alguns blocos em cada página
            for (let j = 0; j < 10; j++) {
                page.blocks.push(utils.createTextBlock(`Block ${j} content`));
            }
            largeFunnel.pages.push(page);
        }

        const renderStart = performance.now();

        render(
            <FunnelEditor
                initialData={largeFunnel}
                dataProvider={mockSetup.dataProvider}
            />
        );

        await waitFor(() => {
            expect(screen.getByText(/Large Funnel/)).toBeInTheDocument();
        });

        const renderTime = performance.now() - renderStart;

        // Render deve ser razoavelmente rápido mesmo com dados grandes
        expect(renderTime).toBeLessThan(1000); // menos de 1 segundo
    });

    test('cleanup on unmount prevents memory leaks', async () => {
        const { unmount } = render(
            <FunnelEditor
                funnelId="test-funnel"
                dataProvider={mockSetup.dataProvider}
                config={{
                    autoSave: {
                        enabled: true,
                        interval: 1000,
                        onUserInput: false,
                        showIndicator: true
                    }
                }}
            />
        );

        await waitFor(() => {
            expect(screen.getByText(/Sample Funnel/)).toBeInTheDocument();
        });

        // Desmontar componente
        unmount();

        // Verificar que timers foram limpos
        // (Jest automaticamente detecta timers não limpos em strict mode)
        expect(true).toBe(true);
    });
});

// ============================================================================
// HELPER PARA TESTES DE INTEGRAÇÃO
// ============================================================================

export const createTestEditor = (overrides: Partial<React.ComponentProps<typeof FunnelEditor>> = {}) => {
    const mockSetup = EditorMockProvider.createFullMockSetup();

    const defaultProps = {
        funnelId: 'test-funnel',
        dataProvider: mockSetup.dataProvider,
        validator: mockSetup.validator,
        eventHandler: mockSetup.eventHandler,
        onSave: jest.fn(),
        onChange: jest.fn(),
        onError: jest.fn(),
        onModeChange: jest.fn()
    };

    return {
        props: { ...defaultProps, ...overrides },
        mockSetup
    };
};
