/**
 * 🧪 TESTES: AuthStorageProvider
 * 
 * Testa provider consolidado Auth + Storage
 * - Autenticação (login, logout, signup)
 * - Storage (localStorage/sessionStorage abstraction)
 * - Métodos integrados (persistUserData, getUserData)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthStorageProvider, useAuthStorage, useAuth, useStorage } from '../AuthStorageProvider';
import type { User } from '@supabase/supabase-js';

// Mock Supabase
const mockSignInWithPassword = vi.fn();
const mockSignUp = vi.fn();
const mockSignOut = vi.fn();
const mockGetUser = vi.fn();
const mockUpdateUser = vi.fn();
const mockRefreshSession = vi.fn();

vi.mock('@/lib/supabase', () => ({
    supabase: {
        auth: {
            signInWithPassword: (...args: unknown[]) => mockSignInWithPassword(...args),
            signUp: (...args: unknown[]) => mockSignUp(...args),
            signOut: (...args: unknown[]) => mockSignOut(...args),
            getUser: (...args: unknown[]) => mockGetUser(...args),
            updateUser: (...args: unknown[]) => mockUpdateUser(...args),
            refreshSession: (...args: unknown[]) => mockRefreshSession(...args),
            onAuthStateChange: vi.fn(() => ({
                data: { subscription: { unsubscribe: vi.fn() } },
            })),
        },
    },
}));

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value; },
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { store = {}; },
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthStorageProvider>{children}</AuthStorageProvider>
);

describe('AuthStorageProvider', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorageMock.clear();
        mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
    });

    describe('Auth: Login', () => {
        it('deve fazer login com credenciais válidas', async () => {
            const mockUser: Partial<User> = {
                id: 'user-123',
                email: 'test@example.com',
            };

            mockSignInWithPassword.mockResolvedValue({
                data: { user: mockUser, session: { access_token: 'token-123' } },
                error: null,
            });

            const { result } = renderHook(() => useAuthStorage(), { wrapper });

            await act(async () => {
                await result.current.login('test@example.com', 'password123');
            });

            expect(mockSignInWithPassword).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            });

            await waitFor(() => {
                expect(result.current.user).toEqual(mockUser);
                expect(result.current.isAuthenticated).toBe(true);
            });
        });

        it('deve retornar erro ao falhar login', async () => {
            mockSignInWithPassword.mockResolvedValue({
                data: { user: null, session: null },
                error: { message: 'Invalid credentials' },
            });

            const { result } = renderHook(() => useAuthStorage(), { wrapper });

            await act(async () => {
                await result.current.login('test@example.com', 'wrongpass');
            });

            expect(result.current.user).toBeNull();
            expect(result.current.isAuthenticated).toBe(false);
        });
    });

    describe('Auth: Logout', () => {
        it('deve fazer logout e limpar estado', async () => {
            mockSignOut.mockResolvedValue({ error: null });

            const { result } = renderHook(() => useAuthStorage(), { wrapper });

            // Set initial user
            await act(async () => {
                const mockUser: Partial<User> = { id: 'user-123', email: 'test@example.com' };
                mockSignInWithPassword.mockResolvedValue({
                    data: { user: mockUser, session: { access_token: 'token-123' } },
                    error: null,
                });
                await result.current.login('test@example.com', 'password123');
            });

            await act(async () => {
                await result.current.logout();
            });

            expect(mockSignOut).toHaveBeenCalled();
            expect(result.current.user).toBeNull();
            expect(result.current.isAuthenticated).toBe(false);
        });
    });

    describe('Auth: SignUp', () => {
        it('deve criar conta com dados válidos', async () => {
            const mockUser: Partial<User> = {
                id: 'user-456',
                email: 'newuser@example.com',
            };

            mockSignUp.mockResolvedValue({
                data: { user: mockUser, session: { access_token: 'token-456' } },
                error: null,
            });

            const { result } = renderHook(() => useAuthStorage(), { wrapper });

            await act(async () => {
                await result.current.signUp('newuser@example.com', 'password123');
            });

            expect(mockSignUp).toHaveBeenCalledWith({
                email: 'newuser@example.com',
                password: 'password123',
            });

            await waitFor(() => {
                expect(result.current.user).toEqual(mockUser);
            });
        });
    });

    describe('Storage: localStorage abstraction', () => {
        it('deve salvar e recuperar valores do storage', async () => {
            const { result } = renderHook(() => useAuthStorage(), { wrapper });

            await act(async () => {
                result.current.set('test-key', { name: 'Test User', age: 25 });
            });

            const retrieved = result.current.get<{ name: string; age: number }>('test-key');
            expect(retrieved).toEqual({ name: 'Test User', age: 25 });
        });

        it('deve remover valores do storage', async () => {
            const { result } = renderHook(() => useAuthStorage(), { wrapper });

            await act(async () => {
                result.current.set('test-key', 'value');
                result.current.remove('test-key');
            });

            expect(result.current.get('test-key')).toBeNull();
        });

        it('deve limpar todo o storage', async () => {
            const { result } = renderHook(() => useAuthStorage(), { wrapper });

            await act(async () => {
                result.current.set('key1', 'value1');
                result.current.set('key2', 'value2');
                result.current.clear();
            });

            expect(result.current.get('key1')).toBeNull();
            expect(result.current.get('key2')).toBeNull();
        });

        it('deve verificar se chave existe', async () => {
            const { result } = renderHook(() => useAuthStorage(), { wrapper });

            await act(async () => {
                result.current.set('existing-key', 'value');
            });

            expect(result.current.has('existing-key')).toBe(true);
            expect(result.current.has('non-existing-key')).toBe(false);
        });

        it('deve listar todas as chaves', async () => {
            const { result } = renderHook(() => useAuthStorage(), { wrapper });

            await act(async () => {
                result.current.set('key1', 'value1');
                result.current.set('key2', 'value2');
            });

            const keys = result.current.keys();
            expect(keys).toContain('key1');
            expect(keys).toContain('key2');
        });
    });

    describe('Storage: TTL (Time To Live)', () => {
        it('deve respeitar TTL e expirar valores', async () => {
            vi.useFakeTimers();
            const { result } = renderHook(() => useAuthStorage(), { wrapper });

            await act(async () => {
                result.current.set('temp-key', 'temp-value', { ttl: 1000 }); // 1 segundo
            });

            expect(result.current.get('temp-key')).toBe('temp-value');

            // Avançar tempo 2 segundos
            await act(async () => {
                vi.advanceTimersByTime(2000);
            });

            expect(result.current.get('temp-key')).toBeNull();

            vi.useRealTimers();
        });
    });

    describe('Integração: Auth + Storage', () => {
        it('deve persistir dados do usuário após login', async () => {
            const mockUser: Partial<User> = {
                id: 'user-789',
                email: 'integrated@example.com',
                user_metadata: { name: 'Integrated User' },
            };

            mockSignInWithPassword.mockResolvedValue({
                data: { user: mockUser, session: { access_token: 'token-789' } },
                error: null,
            });

            const { result } = renderHook(() => useAuthStorage(), { wrapper });

            await act(async () => {
                await result.current.login('integrated@example.com', 'password123');
            });

            await act(async () => {
                await result.current.persistUserData({ id: 'user-789', email: 'integrated@example.com' });
            });

            const userData = result.current.getUserData();
            expect(userData?.id).toBe('user-789');
            expect(userData?.email).toBe('integrated@example.com');
        });

        it('deve limpar dados do usuário após logout', async () => {
            mockSignOut.mockResolvedValue({ error: null });

            const { result } = renderHook(() => useAuthStorage(), { wrapper });

            // Login e persistir
            await act(async () => {
                const mockUser: Partial<User> = { id: 'user-999', email: 'clear@example.com' };
                mockSignInWithPassword.mockResolvedValue({
                    data: { user: mockUser, session: { access_token: 'token-999' } },
                    error: null,
                });
                await result.current.login('clear@example.com', 'password123');
                await result.current.persistUserData({ id: 'user-999', email: 'clear@example.com' });
            });

            expect(result.current.getUserData()).not.toBeNull();

            // Logout
            await act(async () => {
                await result.current.logout();
            });

            expect(result.current.getUserData()).toBeNull();
        });
    });

    describe('Aliases: useAuth e useStorage', () => {
        it('useAuth deve retornar mesma interface que useAuthStorage', () => {
            const { result: authResult } = renderHook(() => useAuth(), { wrapper });
            const { result: authStorageResult } = renderHook(() => useAuthStorage(), { wrapper });

            expect(authResult.current).toBeDefined();
            expect(authResult.current.login).toBeDefined();
            expect(authResult.current.logout).toBeDefined();
            // Verifica que é o mesmo provider
            expect(typeof authResult.current.login).toBe(typeof authStorageResult.current.login);
        });

        it('useStorage deve retornar mesma interface que useAuthStorage', () => {
            const { result: storageResult } = renderHook(() => useStorage(), { wrapper });
            const { result: authStorageResult } = renderHook(() => useAuthStorage(), { wrapper });

            expect(storageResult.current).toBeDefined();
            expect(storageResult.current.set).toBeDefined();
            expect(storageResult.current.get).toBeDefined();
            expect(typeof storageResult.current.set).toBe(typeof authStorageResult.current.set);
        });
    });
});
