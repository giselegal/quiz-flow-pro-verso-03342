import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthPage from '../AuthPage';
import * as AuthContext from '@/contexts/consolidated/AuthStorageProvider';

describe('AuthPage', () => {
    const mockLogin = vi.fn();
    const mockSignUp = vi.fn();

    beforeEach(() => {
        vi.resetAllMocks();

        vi.spyOn(AuthContext, 'useAuthStorage').mockReturnValue({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            login: mockLogin,
            logout: vi.fn(),
            signOut: vi.fn(),
            signUp: mockSignUp,
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
        } as unknown as AuthContext.AuthStorageContextValue);
    });

    it('permite login com email e senha e chama login()', async () => {
        const { container } = render(<AuthPage />);

        const emailInput = screen.getByPlaceholderText('seu@email.com');
        const passwordInput = screen.getByPlaceholderText('••••••••');
        const form = container.querySelector('form');
        const submitButton = form?.querySelector('button[type="submit"]') as HTMLElement;

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: '123456' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('test@example.com', '123456');
        });
    });

    it('permite criar conta e chama signUp()', async () => {
        const { container } = render(<AuthPage />);

        // Usar texto exato para evitar duplicações
        const toggleButton = screen.getByText('Criar nova conta');
        fireEvent.click(toggleButton);

        const emailInput = screen.getByPlaceholderText('seu@email.com');
        const passwordInput = screen.getByPlaceholderText('••••••••');
        const form = container.querySelector('form');
        const submitButton = form?.querySelector('button[type="submit"]') as HTMLElement;

        fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'abcdef' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockSignUp).toHaveBeenCalled();
            expect(mockSignUp.mock.calls[0][0]).toBe('new@example.com');
            expect(mockSignUp.mock.calls[0][1]).toBe('abcdef');
        });
    });

    it('valida campos obrigatórios', async () => {
        const { container } = render(<AuthPage />);
        const form = container.querySelector('form');
        const submitButton = form?.querySelector('button[type="submit"]') as HTMLElement;
        fireEvent.click(submitButton);
        // Deve exibir toast de erro; como toast é externo, validamos que login não foi chamado
        await waitFor(() => {
            expect(mockLogin).not.toHaveBeenCalled();
        });
    });
});
