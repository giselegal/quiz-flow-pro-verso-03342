import React from 'react';
import { useEditor } from '@craftjs/core';
import { cn } from '@/lib/utils';
import { BaseModuleProps, themeColors, withCraftjsComponent } from './types';

export interface HeaderSectionProps extends BaseModuleProps {
    logoUrl?: string;
    logoAlt?: string;
    title?: string;
    subtitle?: string;
    showLogo?: boolean;
    showTitle?: boolean;
}

const HeaderSectionComponent: React.FC<HeaderSectionProps> = ({
    logoUrl = '/logo.png',
    logoAlt = 'Logo',
    title = 'Título',
    subtitle = 'Subtítulo',
    showLogo = true,
    showTitle = true,
    className = '',
}) => {
    const { connectors: { connect } } = useEditor();

    return (
        <div
            ref={connect}
            className={cn('header-section flex items-center justify-center p-4', className)}
        >
            {showLogo && (
                <img src={logoUrl} alt={logoAlt} className="w-12 h-12 mr-4" />
            )}
            {showTitle && (
                <div>
                    <h1 className="text-xl font-bold">{title}</h1>
                    <h2 className="text-sm opacity-80">{subtitle}</h2>
                </div>
            )}
        </div>
    );
};

export const HeaderSection = withCraftjsComponent(HeaderSectionComponent);
export default HeaderSection;