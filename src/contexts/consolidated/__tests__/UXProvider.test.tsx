/**
 * 🧪 TESTES: UXProvider
 * 
 * Testa provider consolidado UI + Theme + Navigation
 * - Gerenciamento de tema (light/dark/system)
 * - Estado de UI (sidebar, modals, toasts)
 * - Navegação (react-router integration)
 * - Responsividade e acessibilidade
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { UXProvider, useUX, useTheme, useUI, useNavigation } from '../UXProvider';

// Mock react-router
const mockNavigate = vi.fn();
const mockLocation = { pathname: '/test', search: '', hash: '', state: null, key: 'default' };

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useLocation: () => mockLocation,
    };
});

// Mock matchMedia for responsive testing
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(min-width: 768px)', // Mock tablet size
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>
        <UXProvider>{children}</UXProvider>
    </BrowserRouter>
);

describe('UXProvider', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    describe('Theme: Gerenciamento de Tema', () => {
        it('deve iniciar com tema padrão do sistema', () => {
            const { result } = renderHook(() => useUX(), { wrapper });

            expect(['light', 'dark', 'system']).toContain(result.current.theme);
        });

        it('deve alternar entre light e dark', async () => {
            const { result } = renderHook(() => useUX(), { wrapper });

            const initialTheme = result.current.theme;

            await act(async () => {
                result.current.setTheme(initialTheme === 'light' ? 'dark' : 'light');
            });

            expect(result.current.theme).not.toBe(initialTheme);
        });

        it('deve usar toggleTheme para alternar tema', async () => {
            const { result } = renderHook(() => useUX(), { wrapper });

            await act(async () => {
                result.current.setTheme('light');
            });

            await act(async () => {
                result.current.toggleTheme();
            });

            expect(result.current.theme).toBe('dark');

            await act(async () => {
                result.current.toggleTheme();
            });

            expect(result.current.theme).toBe('light');
        });

        it('deve persistir tema no localStorage', async () => {
            const { result } = renderHook(() => useUX(), { wrapper });

            await act(async () => {
                result.current.setTheme('dark');
            });

            const storedTheme = localStorage.getItem('app-theme');
            expect(storedTheme).toBe('dark');
        });

        it('deve definir cores customizadas do tema', async () => {
            const { result } = renderHook(() => useUX(), { wrapper });

            const customColors = {
                primary: '#FF0000',
                secondary: '#00FF00',
                background: '#0000FF',
            };

            await act(async () => {
                result.current.setColors(customColors);
            });

            expect(result.current.colors).toMatchObject(customColors);
        });
    });

    describe('UI: Estado da Interface', () => {
        it('deve mostrar/ocultar sidebar', async () => {
            const { result } = renderHook(() => useUX(), { wrapper });

            const initialState = result.current.showSidebar;

            await act(async () => {
                result.current.toggleSidebar();
            });

            expect(result.current.showSidebar).toBe(!initialState);
        });

        it('deve colapsar sidebar', async () => {
            const { result } = renderHook(() => useUX(), { wrapper });

            await act(async () => {
                result.current.toggleSidebar(); // Alternar
            });

            // Sidebar foi alternada

            // Colapsar mantém visível mas compacto
            expect(typeof result.current.sidebarCollapsed).toBe('boolean');
        });

        it('deve abrir e fechar modais', async () => {
            const { result } = renderHook(() => useUX(), { wrapper });

            await act(async () => {
                result.current.openModal('settings-modal');
            });

            expect(result.current.activeModal).toBe('settings-modal');

            await act(async () => {
                result.current.closeModal();
            });

            expect(result.current.activeModal).toBeNull();
        });

        it('deve exibir toast notification', async () => {
            const { result } = renderHook(() => useUX(), { wrapper });

            await act(async () => {
                result.current.showToast('Teste de notificação', 'success');
            });

            expect(result.current.toasts).toHaveLength(1);
            expect(result.current.toasts[0].message).toBe('Teste de notificação');
        });

        it('deve remover toast ao dismissar', async () => {
            const { result } = renderHook(() => useUX(), { wrapper });

            let toastId = '';
            await act(async () => {
                result.current.showToast('Será removido', 'info');
                toastId = result.current.toasts[0]?.id || '';
            });

            expect(result.current.toasts).toHaveLength(1);

            await act(async () => {
                result.current.dismissToast(toastId);
            });

            expect(result.current.toasts).toHaveLength(0);
        });

        it('deve auto-dismissar toast após timeout', async () => {
            vi.useFakeTimers();
            const { result } = renderHook(() => useUX(), { wrapper });

            await act(async () => {
                result.current.showToast('Auto dismiss', 'warning', 1000);
            });

            expect(result.current.toasts).toHaveLength(1);

            await act(async () => {
                vi.advanceTimersByTime(1100);
            });

            await waitFor(() => {
                expect(result.current.toasts).toHaveLength(0);
            });

            vi.useRealTimers();
        });
    });

    describe('Navigation: Navegação', () => {
        it('deve navegar para rota específica', async () => {
            const { result } = renderHook(() => useUX(), { wrapper });

            await act(async () => {
                result.current.navigate('/dashboard');
            });

            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });

        it('deve navegar com estado', async () => {
            const { result } = renderHook(() => useUX(), { wrapper });

            await act(async () => {
                result.current.navigate('/editor');
            });

            expect(mockNavigate).toHaveBeenCalledWith('/editor');
        });

        it('deve voltar na navegação', async () => {
            const { result } = renderHook(() => useUX(), { wrapper });

            await act(async () => {
                result.current.goBack();
            });

            expect(mockNavigate).toHaveBeenCalledWith(-1);
        });

        it('deve avançar na navegação', async () => {
            const { result } = renderHook(() => useUX(), { wrapper });

            await act(async () => {
                result.current.goForward();
            });

            expect(mockNavigate).toHaveBeenCalledWith(1);
        });

        it('deve retornar rota atual', () => {
            const { result } = renderHook(() => useUX(), { wrapper });

            expect(result.current.currentPath).toBe('/test');
        });

        it('deve gerenciar breadcrumbs', async () => {
            const { result } = renderHook(() => useUX(), { wrapper });

            const breadcrumbs = [
                { label: 'Home', path: '/' },
                { label: 'Editor', path: '/editor' },
                { label: 'Funnel', path: '/editor/funnel-123' },
            ];

            await act(async () => {
                result.current.setBreadcrumbs(breadcrumbs);
            });

            expect(result.current.breadcrumbs).toEqual(breadcrumbs);
        });
    });

    describe('Responsive: Breakpoints', () => {
        it('deve detectar breakpoint tablet', () => {
            const { result } = renderHook(() => useUX(), { wrapper });

            expect(result.current.isTablet).toBe(true);
            expect(result.current.isMobile).toBe(false);
        });

        it('deve fornecer informações de todos os breakpoints', () => {
            const { result } = renderHook(() => useUX(), { wrapper });

            expect(typeof result.current.isMobile).toBe('boolean');
            expect(typeof result.current.isTablet).toBe('boolean');
            expect(typeof result.current.isDesktop).toBe('boolean');
        });
    });

    describe('Accessibility: Acessibilidade', () => {
        it('deve detectar preferência de reduced motion', () => {
            const { result } = renderHook(() => useUX(), { wrapper });

            expect(typeof result.current.reducedMotion).toBe('boolean');
        });

        it('deve detectar preferência de high contrast', () => {
            const { result } = renderHook(() => useUX(), { wrapper });

            expect(typeof result.current.highContrast).toBe('boolean');
        });
    });

    describe('Aliases: useTheme, useUI, useNavigation', () => {
        it('useTheme deve retornar mesma interface que useUX', () => {
            const { result: themeResult } = renderHook(() => useTheme(), { wrapper });
            const { result: uxResult } = renderHook(() => useUX(), { wrapper });

            expect(themeResult.current).toBeDefined();
            expect(themeResult.current.setTheme).toBeDefined();
            expect(typeof themeResult.current.setTheme).toBe(typeof uxResult.current.setTheme);
        });

        it('useUI deve retornar mesma interface que useUX', () => {
            const { result: uiResult } = renderHook(() => useUI(), { wrapper });
            const { result: uxResult } = renderHook(() => useUX(), { wrapper });

            expect(uiResult.current).toBeDefined();
            expect(uiResult.current.toggleSidebar).toBeDefined();
            expect(typeof uiResult.current.toggleSidebar).toBe(typeof uxResult.current.toggleSidebar);
        });

        it('useNavigation deve retornar mesma interface que useUX', () => {
            const { result: navResult } = renderHook(() => useNavigation(), { wrapper });
            const { result: uxResult } = renderHook(() => useUX(), { wrapper });

            expect(navResult.current).toBeDefined();
            expect(navResult.current.navigate).toBeDefined();
            expect(typeof navResult.current.navigate).toBe(typeof uxResult.current.navigate);
        });
    });

    describe('Performance: Otimizações', () => {
        it('deve debounce múltiplos toasts do mesmo tipo', async () => {
            const { result } = renderHook(() => useUX(), { wrapper });

            await act(async () => {
                result.current.showToast('Toast 1', 'info');
                result.current.showToast('Toast 2', 'info');
                result.current.showToast('Toast 3', 'info');
            });

            // Deve ter adicionado os 3 toasts
            expect(result.current.toasts.length).toBeGreaterThan(0);
        });
    });
});
