import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Router } from 'wouter';
import AppCore from '../../App';
import * as AuthProvider from '@/contexts/consolidated/AuthStorageProvider';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock do signInWithGoogle para simular sucesso e redirecionamento
const mockSignInWithGoogle = vi.fn(async () => {
    window.location.assign('/admin');
});

const defaultMockAuth = {
    login: vi.fn(),
    signUp: vi.fn(),
    resetPassword: vi.fn(),
    signInWithGoogle: mockSignInWithGoogle,
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    logout: vi.fn(),
    signOut: vi.fn(),
    updateUser: vi.fn(),
    refreshSession: vi.fn(),
    clearError: vi.fn(),
    set: vi.fn(),
    get: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
    has: vi.fn(),
    keys: vi.fn(),
    size: vi.fn(),
    persistUserData: vi.fn(),
    getUserData: vi.fn(),
    clearUserData: vi.fn(),
};

const authenticatedMockAuth = {
    ...defaultMockAuth,
    user: { id: '123', email: 'test@user.com' },
    isAuthenticated: true,
};

beforeEach(() => {
    vi.spyOn(AuthProvider, 'useAuthStorage').mockReturnValue(defaultMockAuth);
});


describe('Google OAuth Redirect', () => {
    it('redireciona para /admin após login Google', async () => {
        window.history.pushState({}, '', '/auth');
        render(
            <Router>
                <AppCore />
            </Router>
        );

        // Simula clique no botão Google
        const googleBtn = await screen.findByText(/Continuar com Google/i);
        googleBtn.click();

        await waitFor(() => {
            expect(window.location.pathname).toBe('/admin');
        });
    });

    it('renderiza página /admin se autenticado', async () => {
        vi.spyOn(AuthProvider, 'useAuthStorage').mockReturnValue(authenticatedMockAuth);
        window.history.pushState({}, '', '/admin');
        render(
            <Router>
                <AppCore />
            </Router>
        );
        // Espera pelo dashboard
        expect(await screen.findByTestId('modern-admin-dashboard-page')).toBeInTheDocument();
    });
});
