import React from 'react';

interface DeprecatedNoticeProps {
    title?: string;
    replacement?: string;
    docsLink?: string;
    extra?: React.ReactNode;
}

/**
 * Exibe um aviso padronizado de depreciação.
 */
export const DeprecatedNotice: React.FC<DeprecatedNoticeProps> = ({
    title = 'Componente Depreciado',
    replacement,
    docsLink,
    extra
}) => {
    return (
        <div style={{
            padding: 16,
            border: '1px solid #e0b4b4',
            background: '#fff6f6',
            borderRadius: 8,
            fontFamily: 'system-ui, sans-serif',
            fontSize: 14,
            lineHeight: 1.4,
            color: '#912d2b'
        }}>
            <strong style={{ display: 'block', marginBottom: 8 }}>⚠️ {title}</strong>
            <p style={{ margin: '4px 0 8px' }}>
                Este componente permanece apenas para compatibilidade temporária.
                {replacement && (
                    <>
                        {' '}Use <code>{replacement}</code> como substituto.
                    </>
                )}
            </p>
            {docsLink && (
                <p style={{ margin: '4px 0 8px' }}>
                    Documentação: <a href={docsLink} style={{ color: '#6435c9' }}>{docsLink}</a>
                </p>
            )}
            {extra && <div style={{ marginTop: 8 }}>{extra}</div>}
        </div>
    );
};

export default DeprecatedNotice;
