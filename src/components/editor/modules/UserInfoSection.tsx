import React from 'react';
import { useEditor } from '@craftjs/core';
import { cn } from '@/lib/utils';
import { BaseModuleProps, themeColors, withCraftjsComponent } from './types';

export interface UserInfoSectionProps extends BaseModuleProps {
    // Configurações do usuário
    userName?: string;
    showUserName?: boolean;
    userNamePrefix?: string; // ex: "Olá, ", "Parabéns, "

    // Configurações do badge
    badgeText?: string;
    badgeColor?: string;
    badgeBackgroundColor?: string;
    showBadge?: boolean;

    // Configurações do avatar
    avatarUrl?: string;
    avatarSize?: 'sm' | 'md' | 'lg';
    showAvatar?: boolean;
    avatarShape?: 'circle' | 'square' | 'rounded';

    // Layout e posicionamento
    layout?: 'horizontal' | 'vertical' | 'badge-only' | 'name-only';
    alignment?: 'left' | 'center' | 'right';

    // Estilo visual
    textColor?: string;
    backgroundColor?: string;
    emphasis?: boolean; // destaque especial

    // Responsividade
    hiddenOnMobile?: boolean;

    // Espaçamento
    padding?: 'sm' | 'md' | 'lg';
    marginBottom?: 'sm' | 'md' | 'lg';
}

const UserInfoSectionComponent: React.FC<UserInfoSectionProps> = ({
    // User props
    userName = '',
    showUserName = true,
    userNamePrefix = 'Olá, ',

    // Badge props
    badgeText = '✨ Exclusivo',
    badgeColor = 'white',
    badgeBackgroundColor = themeColors.primary,
    showBadge = true,

    // Avatar props
    avatarUrl = '',
    avatarSize = 'md',
    showAvatar = false,
    avatarShape = 'circle',

    // Layout props
    layout = 'horizontal',
    alignment = 'center',

    // Visual props
    textColor = themeColors.brown,
    backgroundColor = 'transparent',
    emphasis = false,

    // Responsive props
    hiddenOnMobile = false,

    // Spacing props
    padding = 'md',
    marginBottom = 'md',

    // System props
    className = '',
    isSelected = false,
}) => {
    const { enabled } = useEditor((state) => ({
        enabled: state.options.enabled
    }));

    // Early return se não há conteúdo para mostrar
    const hasContent = (showUserName && userName) || showBadge || (showAvatar && avatarUrl);
    if (!hasContent) {
        return enabled ? (
            <div className="p-4 border-2 border-dashed border-gray-300 text-gray-500 text-center">
                Configure as informações do usuário
            </div>
        ) : null;
    }

    // Classes para avatar
    const avatarSizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16'
    };

    const avatarShapeClasses = {
        circle: 'rounded-full',
        square: 'rounded-none',
        rounded: 'rounded-lg'
    };

    // Classes para alinhamento
    const alignmentClasses = {
        left: 'text-left justify-start items-start',
        center: 'text-center justify-center items-center',
        right: 'text-right justify-end items-end'
    };

    // Classes para padding
    const paddingClasses = {
        sm: 'p-2',
        md: 'p-4',
        lg: 'p-6'
    };

    // Classes para margin bottom
    const marginBottomClasses = {
        sm: 'mb-2',
        md: 'mb-4',
        lg: 'mb-6'
    };

    // Layout específico
    const getLayoutClasses = () => {
        switch (layout) {
            case 'horizontal':
                return 'flex flex-row gap-3 items-center';
            case 'vertical':
                return 'flex flex-col gap-2';
            case 'badge-only':
                return 'flex justify-center';
            case 'name-only':
                return 'flex flex-col gap-1';
            default:
                return 'flex flex-row gap-3 items-center';
        }
    };

    return (
        <div
            className={cn(
                'w-full transition-all duration-200',
                paddingClasses[padding],
                marginBottomClasses[marginBottom],
                alignmentClasses[alignment],
                getLayoutClasses(),
                // Responsividade
                hiddenOnMobile && 'hidden sm:flex',
                // Estados do editor
                enabled && isSelected && 'ring-2 ring-[#B89B7A] ring-offset-2 bg-[#B89B7A]/5',
                enabled && !isSelected && 'hover:ring-1 hover:ring-[#B89B7A]/50 hover:bg-[#B89B7A]/5',
                // Ênfase especial
                emphasis && 'bg-gradient-to-r from-[#B89B7A]/10 to-[#aa6b5d]/10 rounded-2xl p-4',
                className
            )}
            style={{
                backgroundColor: backgroundColor !== 'transparent' ? backgroundColor : undefined,
                color: textColor
            }}
        >
            {/* Avatar Section */}
            {showAvatar && avatarUrl && layout !== 'badge-only' && layout !== 'name-only' && (
                <div className="flex-shrink-0">
                    <img
                        src={avatarUrl}
                        alt="Avatar do usuário"
                        className={cn(
                            avatarSizeClasses[avatarSize],
                            avatarShapeClasses[avatarShape],
                            'object-cover border-2 border-white shadow-md'
                        )}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                        }}
                    />
                </div>
            )}

            {/* User Name Section */}
            {showUserName && userName && layout !== 'badge-only' && (
                <div className={cn('flex-grow', emphasis && 'font-semibold')}>
                    <p
                        className={cn(
                            'text-lg',
                            emphasis ? 'text-xl font-bold' : 'font-medium'
                        )}
                        style={{ color: textColor }}
                    >
                        {userNamePrefix}
                        <span className={cn(emphasis && 'text-[#B89B7A]')}>
                            {userName}
                        </span>
                        {emphasis && ' ✨'}
                    </p>
                </div>
            )}

            {/* Badge Section */}
            {showBadge && layout !== 'name-only' && (
                <div className="flex-shrink-0">
                    <span
                        className={cn(
                            'inline-flex items-center px-3 py-1 text-sm font-medium rounded-full shadow-sm',
                            'transform hover:scale-105 transition-all duration-200',
                            emphasis ? 'px-4 py-2 text-base rotate-12' : 'rotate-6'
                        )}
                        style={{
                            backgroundColor: badgeBackgroundColor,
                            color: badgeColor
                        }}
                    >
                        {badgeText}
                    </span>
                </div>
            )}

            {/* Editor overlay quando selecionado */}
            {enabled && isSelected && (
                <div className="absolute -top-1 -right-1 bg-[#B89B7A] text-white text-xs px-2 py-1 rounded shadow-lg">
                    User Info
                </div>
            )}
        </div>
    );
};

// Configurações do Craft.js para o UserInfoSection
export const UserInfoSection = withCraftjsComponent(UserInfoSectionComponent, {
    props: {
        // User props
        userName: { type: 'text', label: 'Nome do Usuário' },
        showUserName: { type: 'checkbox', label: 'Mostrar Nome' },
        userNamePrefix: { type: 'text', label: 'Prefixo do Nome' },

        // Badge props
        badgeText: { type: 'text', label: 'Texto do Badge' },
        badgeColor: { type: 'color', label: 'Cor do Texto do Badge' },
        badgeBackgroundColor: { type: 'color', label: 'Cor de Fundo do Badge' },
        showBadge: { type: 'checkbox', label: 'Mostrar Badge' },

        // Avatar props
        avatarUrl: { type: 'text', label: 'URL do Avatar' },
        avatarSize: {
            type: 'select',
            label: 'Tamanho do Avatar',
            options: [
                { value: 'sm', label: 'Pequeno' },
                { value: 'md', label: 'Médio' },
                { value: 'lg', label: 'Grande' }
            ]
        },
        showAvatar: { type: 'checkbox', label: 'Mostrar Avatar' },
        avatarShape: {
            type: 'select',
            label: 'Formato do Avatar',
            options: [
                { value: 'circle', label: 'Circular' },
                { value: 'square', label: 'Quadrado' },
                { value: 'rounded', label: 'Arredondado' }
            ]
        },

        // Layout props
        layout: {
            type: 'select',
            label: 'Layout',
            options: [
                { value: 'horizontal', label: 'Horizontal' },
                { value: 'vertical', label: 'Vertical' },
                { value: 'badge-only', label: 'Apenas Badge' },
                { value: 'name-only', label: 'Apenas Nome' }
            ]
        },
        alignment: {
            type: 'select',
            label: 'Alinhamento',
            options: [
                { value: 'left', label: 'Esquerda' },
                { value: 'center', label: 'Centro' },
                { value: 'right', label: 'Direita' }
            ]
        },

        // Visual props
        textColor: { type: 'color', label: 'Cor do Texto' },
        backgroundColor: { type: 'color', label: 'Cor de Fundo' },
        emphasis: { type: 'checkbox', label: 'Destaque Especial' },

        // Responsive props
        hiddenOnMobile: { type: 'checkbox', label: 'Ocultar no Mobile' },

        // Spacing props
        padding: {
            type: 'select',
            label: 'Espaçamento Interno',
            options: [
                { value: 'sm', label: 'Pequeno' },
                { value: 'md', label: 'Médio' },
                { value: 'lg', label: 'Grande' }
            ]
        },
        marginBottom: {
            type: 'select',
            label: 'Margem Inferior',
            options: [
                { value: 'sm', label: 'Pequena' },
                { value: 'md', label: 'Média' },
                { value: 'lg', label: 'Grande' }
            ]
        }
    },
    related: {
        // Toolbar será implementada posteriormente
    }
});