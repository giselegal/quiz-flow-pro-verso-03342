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
        render(<AuthPage />);

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/senha/i);
        const submitButton = screen.getByRole('button', { name: /entrar/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: '123456' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('test@example.com', '123456');
        });
    });

    it('permite criar conta e chama signUp()', async () => {
        render(<AuthPage />);

        const toggleButton = screen.getByRole('button', { name: /criar nova conta/i });
        fireEvent.click(toggleButton);

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/senha/i);
        const submitButton = screen.getByRole('button', { name: /criar conta/i });

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
        render(<AuthPage />);
        const submitButton = screen.getByRole('button', { name: /entrar/i });
        fireEvent.click(submitButton);
        // Deve exibir toast de erro; como toast é externo, validamos que login não foi chamado
        await waitFor(() => {
            expect(mockLogin).not.toHaveBeenCalled();
        });
    });
});
