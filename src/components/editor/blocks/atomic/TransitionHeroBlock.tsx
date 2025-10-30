import React, { useEffect } from 'react';
import { AtomicBlockProps } from '@/types/blockProps';

export default function TransitionHeroBlock({ block, contextData }: AtomicBlockProps) {
    const title = block.content?.title || '⏳ Aguarde...';
    const subtitle = block.content?.subtitle || '';
    const message = block.content?.message || '';
    const description = block.content?.description || '';
    const autoAdvanceDelay = block.content?.autoAdvanceDelay || 0;

    const backgroundColor = block.properties?.backgroundColor || '#FAF9F7';
    const textColor = block.properties?.textColor || '#432818';
    const padding = block.properties?.padding || 32;

    useEffect(() => {
        // Auto-advance se configurado e há contextData.goToNext
        if (autoAdvanceDelay > 0 && contextData?.goToNext) {
            const timer = setTimeout(() => {
                contextData.goToNext();
            }, autoAdvanceDelay);

            return () => clearTimeout(timer);
        }
    }, [autoAdvanceDelay, contextData]);

    return (
        <div
            style={{
                backgroundColor,
                color: textColor,
                padding: `${padding}px`,
                minHeight: '60vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
            }}
        >
            {/* Loading Spinner */}
            {autoAdvanceDelay > 0 && (
                <div
                    style={{
                        width: 64,
                        height: 64,
                        border: '4px solid #e5e7eb',
                        borderTop: '4px solid #B89B7A',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        marginBottom: '2rem',
                    }}
                />
            )}

            {/* Title */}
            <h2
                style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    marginBottom: subtitle ? '1rem' : '1.5rem',
                    lineHeight: 1.2,
                }}
            >
                {title}
            </h2>

            {/* Subtitle */}
            {subtitle && (
                <p
                    style={{
                        fontSize: '1.25rem',
                        fontWeight: 500,
                        marginBottom: message || description ? '1rem' : 0,
                        lineHeight: 1.4,
                        opacity: 0.9,
                    }}
                >
                    {subtitle}
                </p>
            )}

            {/* Message */}
            {message && (
                <p
                    style={{
                        fontSize: '1rem',
                        opacity: 0.8,
                        maxWidth: 500,
                        margin: '0 auto',
                        lineHeight: 1.6,
                        marginBottom: description ? '1rem' : 0,
                    }}
                >
                    {message}
                </p>
            )}

            {/* Description (adicional) */}
            {description && (
                <p
                    style={{
                        fontSize: '0.95rem',
                        opacity: 0.7,
                        maxWidth: 600,
                        margin: '1rem auto 0',
                        lineHeight: 1.6,
                    }}
                >
                    {description}
                </p>
            )}

            {/* CSS Animation for Spinner */}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
