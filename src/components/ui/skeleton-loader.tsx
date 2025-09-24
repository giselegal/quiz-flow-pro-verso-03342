import React from 'react';
import './skeleton-loader.css';

/**
 * 💀 SKELETON LOADER - ESTADOS DE CARREGAMENTO OTIMIZADOS
 * 
 * Componente skeleton para melhor UX durante carregamentos
 */

interface SkeletonLoaderProps {
    /** Tipo de skeleton a ser renderizado */
    variant?: 'text' | 'card' | 'avatar' | 'rectangle' | 'funnel' | 'editor' | 'list' | 'dashboard';

    /** Largura customizada */
    width?: string | number;

    /** Altura customizada */
    height?: string | number;

    /** Número de linhas (para variant 'text') */
    lines?: number;

    /** Número de itens (para variant 'list') */
    count?: number;

    /** Classes CSS adicionais */
    className?: string;

    /** Animação pulsante ou shimmer */
    animation?: 'pulse' | 'shimmer' | 'wave' | 'none';

    /** Cor de fundo personalizada */
    backgroundColor?: string;

    /** Cor do highlight da animação */
    highlightColor?: string;

    /** Se deve mostrar bordas arredondadas */
    rounded?: boolean;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
    variant = 'text',
    width,
    height,
    lines = 3,
    count = 1,
    className = '',
    animation = 'shimmer',
    backgroundColor = '#e2e8f0',
    highlightColor = '#f1f5f9',
    rounded = false
}) => {

    const getSkeletonStyle = (customWidth?: string | number, customHeight?: string | number) => ({
        width: customWidth || width,
        height: customHeight || height,
        backgroundColor,
        '--highlight-color': highlightColor,
    } as React.CSSProperties);

    const baseClasses = `
    skeleton-loader 
    ${animation !== 'none' ? `skeleton-${animation}` : ''} 
    ${rounded ? 'skeleton-rounded' : ''} 
    ${className}
  `.trim();

    // 📝 Skeleton de texto
    const renderTextSkeleton = () => (
        <div className="skeleton-text-container">
            {Array.from({ length: lines }, (_, index) => (
                <div
                    key={index}
                    className={`${baseClasses} skeleton-text-line`}
                    style={getSkeletonStyle(
                        index === lines - 1 ? '60%' : '100%', // Última linha mais curta
                        '1em'
                    )}
                />
            ))}
        </div>
    );

    // 🃏 Skeleton de card
    const renderCardSkeleton = () => (
        <div className={`${baseClasses} skeleton-card`} style={getSkeletonStyle('100%', '200px')}>
            <div className="skeleton-card-header">
                <div
                    className={`${baseClasses} skeleton-avatar`}
                    style={getSkeletonStyle('48px', '48px')}
                />
                <div className="skeleton-card-meta">
                    <div
                        className={`${baseClasses} skeleton-text-line`}
                        style={getSkeletonStyle('120px', '16px')}
                    />
                    <div
                        className={`${baseClasses} skeleton-text-line`}
                        style={getSkeletonStyle('80px', '14px')}
                    />
                </div>
            </div>
            <div className="skeleton-card-body">
                {Array.from({ length: 3 }, (_, index) => (
                    <div
                        key={index}
                        className={`${baseClasses} skeleton-text-line`}
                        style={getSkeletonStyle(
                            index === 2 ? '70%' : '100%',
                            '14px'
                        )}
                    />
                ))}
            </div>
        </div>
    );

    // 👤 Skeleton de avatar
    const renderAvatarSkeleton = () => (
        <div
            className={`${baseClasses} skeleton-avatar`}
            style={getSkeletonStyle(width || '48px', height || '48px')}
        />
    );

    // 📐 Skeleton de retângulo
    const renderRectangleSkeleton = () => (
        <div
            className={`${baseClasses} skeleton-rectangle`}
            style={getSkeletonStyle(width || '100%', height || '100px')}
        />
    );

    // 🎯 Skeleton de funil
    const renderFunnelSkeleton = () => (
        <div className="skeleton-funnel-container">
            {/* Header do funil */}
            <div className="skeleton-funnel-header">
                <div
                    className={`${baseClasses} skeleton-text-line`}
                    style={getSkeletonStyle('200px', '24px')}
                />
                <div
                    className={`${baseClasses} skeleton-text-line`}
                    style={getSkeletonStyle('300px', '16px')}
                />
            </div>

            {/* Steps do funil */}
            <div className="skeleton-funnel-steps">
                {Array.from({ length: 5 }, (_, index) => (
                    <div key={index} className="skeleton-funnel-step">
                        <div
                            className={`${baseClasses} skeleton-step-number`}
                            style={getSkeletonStyle('32px', '32px')}
                        />
                        <div className="skeleton-step-content">
                            <div
                                className={`${baseClasses} skeleton-text-line`}
                                style={getSkeletonStyle('150px', '18px')}
                            />
                            <div
                                className={`${baseClasses} skeleton-text-line`}
                                style={getSkeletonStyle('250px', '14px')}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // ✏️ Skeleton do editor
    const renderEditorSkeleton = () => (
        <div className="skeleton-editor-container">
            {/* Toolbar */}
            <div className="skeleton-editor-toolbar">
                {Array.from({ length: 8 }, (_, index) => (
                    <div
                        key={index}
                        className={`${baseClasses} skeleton-tool-button`}
                        style={getSkeletonStyle('36px', '36px')}
                    />
                ))}
            </div>

            {/* Canvas */}
            <div className="skeleton-editor-canvas">
                <div
                    className={`${baseClasses} skeleton-canvas`}
                    style={getSkeletonStyle('100%', '400px')}
                />
            </div>

            {/* Properties Panel */}
            <div className="skeleton-editor-properties">
                <div
                    className={`${baseClasses} skeleton-text-line`}
                    style={getSkeletonStyle('120px', '20px')}
                />
                {Array.from({ length: 4 }, (_, index) => (
                    <div key={index} className="skeleton-property-row">
                        <div
                            className={`${baseClasses} skeleton-text-line`}
                            style={getSkeletonStyle('80px', '16px')}
                        />
                        <div
                            className={`${baseClasses} skeleton-input`}
                            style={getSkeletonStyle('150px', '32px')}
                        />
                    </div>
                ))}
            </div>
        </div>
    );

    // 📋 Skeleton de lista
    const renderListSkeleton = () => (
        <div className="skeleton-list-container">
            {Array.from({ length: count }, (_, index) => (
                <div key={index} className="skeleton-list-item">
                    <div
                        className={`${baseClasses} skeleton-avatar`}
                        style={getSkeletonStyle('40px', '40px')}
                    />
                    <div className="skeleton-list-content">
                        <div
                            className={`${baseClasses} skeleton-text-line`}
                            style={getSkeletonStyle('200px', '16px')}
                        />
                        <div
                            className={`${baseClasses} skeleton-text-line`}
                            style={getSkeletonStyle('150px', '14px')}
                        />
                    </div>
                    <div
                        className={`${baseClasses} skeleton-action`}
                        style={getSkeletonStyle('24px', '24px')}
                    />
                </div>
            ))}
        </div>
    );

    // 📊 Skeleton do dashboard
    const renderDashboardSkeleton = () => (
        <div className="skeleton-dashboard-container">
            {/* Header com estatísticas */}
            <div className="skeleton-dashboard-stats">
                {Array.from({ length: 4 }, (_, index) => (
                    <div key={index} className="skeleton-stat-card">
                        <div
                            className={`${baseClasses} skeleton-text-line`}
                            style={getSkeletonStyle('60px', '14px')}
                        />
                        <div
                            className={`${baseClasses} skeleton-text-line`}
                            style={getSkeletonStyle('40px', '24px')}
                        />
                    </div>
                ))}
            </div>

            {/* Gráficos */}
            <div className="skeleton-dashboard-charts">
                <div
                    className={`${baseClasses} skeleton-chart`}
                    style={getSkeletonStyle('100%', '300px')}
                />
                <div
                    className={`${baseClasses} skeleton-chart`}
                    style={getSkeletonStyle('100%', '200px')}
                />
            </div>
        </div>
    );

    // Renderização baseada no variant
    const renderSkeleton = () => {
        switch (variant) {
            case 'text':
                return renderTextSkeleton();
            case 'card':
                return renderCardSkeleton();
            case 'avatar':
                return renderAvatarSkeleton();
            case 'rectangle':
                return renderRectangleSkeleton();
            case 'funnel':
                return renderFunnelSkeleton();
            case 'editor':
                return renderEditorSkeleton();
            case 'list':
                return renderListSkeleton();
            case 'dashboard':
                return renderDashboardSkeleton();
            default:
                return renderTextSkeleton();
        }
    };

    return <>{renderSkeleton()}</>;
};

// 🎨 Componentes especializados para casos comuns
export const TextSkeleton: React.FC<Pick<SkeletonLoaderProps, 'lines' | 'width'>> = (props) => (
    <SkeletonLoader variant="text" {...props} />
);

export const CardSkeleton: React.FC<Pick<SkeletonLoaderProps, 'width' | 'height'>> = (props) => (
    <SkeletonLoader variant="card" {...props} />
);

export const AvatarSkeleton: React.FC<Pick<SkeletonLoaderProps, 'width' | 'height'>> = (props) => (
    <SkeletonLoader variant="avatar" rounded {...props} />
);

export const FunnelSkeleton: React.FC = () => (
    <SkeletonLoader variant="funnel" />
);

export const EditorSkeleton: React.FC = () => (
    <SkeletonLoader variant="editor" />
);

export const ListSkeleton: React.FC<Pick<SkeletonLoaderProps, 'count'>> = (props) => (
    <SkeletonLoader variant="list" {...props} />
);

export const DashboardSkeleton: React.FC = () => (
    <SkeletonLoader variant="dashboard" />
);

export default SkeletonLoader;