/**
 * 📝 WelcomeFormSection - Formulário de boas-vindas com coleta de nome
 * 
 * Seção modular para capturar informações do usuário no início do quiz
 */

import React, { useState } from 'react';
import { SectionContainer } from '../shared/SectionContainer';
import { AnimatedTransition } from '../shared/AnimatedTransition';
import { DesignTokens } from '@/styles/design-tokens';
import { useResponsive } from '@/hooks/useResponsive';
import type { BaseSectionProps } from '@/types/section-types';

export interface WelcomeFormContent {
    questionText?: string;
    nameLabel?: string;
    namePlaceholder?: string;
    emailLabel?: string;
    emailPlaceholder?: string;
    submitText: string;
    loadingText?: string;
    successText?: string;
    showNameField?: boolean;
    showEmailField?: boolean;
    requiredFields?: 'name' | 'email' | 'both';
    validationMessage?: string;
}

export interface WelcomeFormSectionProps extends BaseSectionProps {
    content: WelcomeFormContent;
    onSubmit: (data: { name?: string; email?: string }) => void;
    onAnalytics?: (event: string, data?: any) => void;
}

export const WelcomeFormSection: React.FC<WelcomeFormSectionProps> = ({
    id,
    content,
    style: customStyle,
    animation,
    onSubmit,
    onAnalytics,
}) => {
    const { isMobile } = useResponsive();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const {
        questionText,
        nameLabel = 'Como posso te chamar?',
        namePlaceholder = 'Digite seu primeiro nome aqui...',
        emailLabel = 'Qual seu melhor e-mail?',
        emailPlaceholder = 'seu@email.com',
        submitText = 'Começar',
        loadingText = 'Processando...',
        successText = 'Perfeito! Vamos lá!',
        showNameField = true,
        showEmailField = false,
        requiredFields = 'name',
        validationMessage = 'Por favor, preencha todos os campos obrigatórios',
    } = content;

    const handleSubmit = () => {
        setError('');

        // Validação
        const nameRequired = requiredFields === 'name' || requiredFields === 'both';
        const emailRequired = requiredFields === 'email' || requiredFields === 'both';

        if (nameRequired && showNameField && !name.trim()) {
            setError(validationMessage);
            onAnalytics?.('validation_error', { field: 'name', sectionId: id });
            return;
        }

        if (emailRequired && showEmailField && !email.trim()) {
            setError(validationMessage);
            onAnalytics?.('validation_error', { field: 'email', sectionId: id });
            return;
        }

        // Email validation básica
        if (showEmailField && email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Por favor, insira um e-mail válido');
            onAnalytics?.('validation_error', { field: 'email', sectionId: id });
            return;
        }

        setIsSubmitting(true);
        onAnalytics?.('form_submit', {
            sectionId: id,
            hasName: !!name,
            hasEmail: !!email,
        });

        // Simular delay e chamar onSubmit
        setTimeout(() => {
            onSubmit({
                name: name.trim() || undefined,
                email: email.trim() || undefined,
            });
            setIsSubmitting(false);
        }, 500);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    const isButtonDisabled = () => {
        if (isSubmitting) return true;
        const nameRequired = requiredFields === 'name' || requiredFields === 'both';
        const emailRequired = requiredFields === 'email' || requiredFields === 'both';

        if (nameRequired && showNameField && !name.trim()) return true;
        if (emailRequired && showEmailField && !email.trim()) return true;

        return false;
    };

    const containerStyles: React.CSSProperties = {
        backgroundColor: customStyle?.backgroundColor || 'transparent',
        ...customStyle,
    };

    const inputStyles: React.CSSProperties = {
        width: '100%',
        maxWidth: 500,
        padding: DesignTokens.spacing.md,
        fontSize: DesignTokens.fontSizes.base,
        fontFamily: DesignTokens.fonts.body,
        color: DesignTokens.colors.textPrimary,
        backgroundColor: DesignTokens.colors.backgroundWhite,
        border: `2px solid ${DesignTokens.colors.border}`,
        borderRadius: DesignTokens.borderRadius.md,
        outline: 'none',
        transition: DesignTokens.transitions.base,
        margin: '0 auto',
        display: 'block',
    };

    const buttonStyles: React.CSSProperties = {
        width: '100%',
        maxWidth: 500,
        padding: `${DesignTokens.spacing.md}px ${DesignTokens.spacing.lg}px`,
        fontSize: DesignTokens.fontSizes.lg,
        fontWeight: DesignTokens.fontWeights.semibold,
        fontFamily: DesignTokens.fonts.body,
        color: DesignTokens.colors.backgroundWhite,
        backgroundColor: isButtonDisabled()
            ? DesignTokens.colors.disabled
            : DesignTokens.colors.primary,
        border: 'none',
        borderRadius: DesignTokens.borderRadius.lg,
        cursor: isButtonDisabled() ? 'not-allowed' : 'pointer',
        transition: DesignTokens.transitions.base,
        boxShadow: isButtonDisabled() ? 'none' : DesignTokens.shadows.md,
        margin: '0 auto',
        display: 'block',
    };

    return (
        <SectionContainer
            id={id}
            maxWidth="tablet"
            padding="lg"
            animation={animation}
            style={containerStyles}
        >
            <AnimatedTransition type="slideUp" duration={400} delay={200}>
                <div style={{ textAlign: 'center' }}>
                    {/* Question Text */}
                    {questionText && (
                        <p
                            style={{
                                fontSize: isMobile ? DesignTokens.fontSizes.lg : DesignTokens.fontSizes.xl,
                                fontWeight: DesignTokens.fontWeights.semibold,
                                color: DesignTokens.colors.textPrimary,
                                marginBottom: DesignTokens.spacing.lg,
                            }}
                        >
                            {questionText}
                        </p>
                    )}

                    {/* Name Field */}
                    {showNameField && (
                        <div style={{ marginBottom: DesignTokens.spacing.md }}>
                            <label
                                htmlFor={`${id}-name-input`}
                                style={{
                                    display: 'block',
                                    fontSize: DesignTokens.fontSizes.sm,
                                    fontWeight: DesignTokens.fontWeights.medium,
                                    color: DesignTokens.colors.textSecondary,
                                    marginBottom: DesignTokens.spacing.xs,
                                    textAlign: 'left',
                                    maxWidth: 500,
                                    margin: `0 auto ${DesignTokens.spacing.xs}px`,
                                }}
                            >
                                {nameLabel}
                            </label>
                            <input
                                id={`${id}-name-input`}
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setError('');
                                }}
                                onKeyPress={handleKeyPress}
                                placeholder={namePlaceholder}
                                style={inputStyles}
                                onFocus={(e) => {
                                    e.target.style.borderColor = DesignTokens.colors.primary;
                                    onAnalytics?.('field_focus', { field: 'name', sectionId: id });
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = DesignTokens.colors.border;
                                }}
                            />
                        </div>
                    )}

                    {/* Email Field */}
                    {showEmailField && (
                        <div style={{ marginBottom: DesignTokens.spacing.md }}>
                            <label
                                htmlFor={`${id}-email-input`}
                                style={{
                                    display: 'block',
                                    fontSize: DesignTokens.fontSizes.sm,
                                    fontWeight: DesignTokens.fontWeights.medium,
                                    color: DesignTokens.colors.textSecondary,
                                    marginBottom: DesignTokens.spacing.xs,
                                    textAlign: 'left',
                                    maxWidth: 500,
                                    margin: `0 auto ${DesignTokens.spacing.xs}px`,
                                }}
                            >
                                {emailLabel}
                            </label>
                            <input
                                id={`${id}-email-input`}
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError('');
                                }}
                                onKeyPress={handleKeyPress}
                                placeholder={emailPlaceholder}
                                style={inputStyles}
                                onFocus={(e) => {
                                    e.target.style.borderColor = DesignTokens.colors.primary;
                                    onAnalytics?.('field_focus', { field: 'email', sectionId: id });
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = DesignTokens.colors.border;
                                }}
                            />
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <p
                            style={{
                                color: DesignTokens.colors.error,
                                fontSize: DesignTokens.fontSizes.sm,
                                marginBottom: DesignTokens.spacing.md,
                            }}
                        >
                            {error}
                        </p>
                    )}

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={isButtonDisabled()}
                        style={buttonStyles}
                        onMouseEnter={(e) => {
                            if (!isButtonDisabled()) {
                                e.currentTarget.style.backgroundColor = DesignTokens.colors.primaryHover;
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isButtonDisabled()) {
                                e.currentTarget.style.backgroundColor = DesignTokens.colors.primary;
                                e.currentTarget.style.transform = 'translateY(0)';
                            }
                        }}
                    >
                        {isSubmitting ? loadingText : submitText}
                    </button>
                </div>
            </AnimatedTransition>
        </SectionContainer>
    );
};
