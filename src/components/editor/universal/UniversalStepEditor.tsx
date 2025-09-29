/**
 * Arquivo legacy substituído por stub.
 * Mantido apenas para evitar que imports quebrados interrompam a build.
 * Utilize `ModernUnifiedEditor` em `src/pages/editor/ModernUnifiedEditor.tsx` como editor principal.
 */
import React from 'react';

/**
 * UniversalStepEditor (LEGACY STUB)
 * --------------------------------------------------------------
 * Componente legacy removido. Mantido apenas como stub para evitar
 * que imports antigos quebrem durante a limpeza gradual.
 * Editor principal atual: ModernUnifiedEditor (src/pages/editor/ModernUnifiedEditor.tsx)
 */

export interface UniversalStepEditorProps {
    stepId?: string;
    stepNumber?: number;
    funnelId?: string;
}

const UniversalStepEditor: React.FC<UniversalStepEditorProps> = () => {
    if (process.env.NODE_ENV !== 'production') {
        return (
            <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif', fontSize: 14 }}>
                <strong>UniversalStepEditor (stub legacy)</strong>
                <p>Este editor foi removido. Use <code>ModernUnifiedEditor</code>.</p>
            </div>
        );
    }
    return null;
};

export default UniversalStepEditor;
export { UniversalStepEditor };

export interface UniversalStepEditorProps {
    stepId?: string;
    stepNumber?: number;
    funnelId?: string;
}

const UniversalStepEditor: React.FC<UniversalStepEditorProps> = () => {
    if (process.env.NODE_ENV !== 'production') {
        return (
            <div style={{ padding: 24, fontFamily: 'sans-serif', fontSize: 14 }}>
                <strong>UniversalStepEditor (stub legacy)</strong>
                <p>Este componente foi descontinuado. Use ModernUnifiedEditor.</p>
            </div>
        );
    }
    return null;
};

export default UniversalStepEditor;
export { UniversalStepEditor };

{/* Content Settings */ }
                        <div className="space-y-3">
                            <h5 className="text-sm font-medium text-gray-700 border-l-2 border-blue-500 pl-2">Conteúdo</h5>

    const UniversalStepEditor: React.FC<UniversalStepEditorProps> = () => {
        if (process.env.NODE_ENV !== 'production') {
            return (
                <div style={{ padding: 24, fontFamily: 'sans-serif', fontSize: 14 }}>
                    <strong>UniversalStepEditor (stub legacy)</strong>
                    <p>Este componente foi descontinuado. Utilize <code>ModernUnifiedEditor</code>.</p>
                </div>
            );
        }
        return null;
    };
                                <input
                                    type="checkbox"
                                    checked={content?.showLogo || properties?.showLogo || false}
                                    onChange={(e) => updateBlockProperty(blockData.id, 'content.showLogo', e.target.checked)}
                                    className="w-4 h-4 text-blue-600"
                                />
                                <label className="text-sm text-gray-700">Mostrar Logo</label>
                            </div>

                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    checked={content?.showProgress || properties?.enableProgressBar || false}
                                    onChange={(e) => updateBlockProperty(blockData.id, 'properties.enableProgressBar', e.target.checked)}
                                const UniversalStepEditor: React.FC<UniversalStepEditorProps> = () => {
                                    if (process.env.NODE_ENV !== 'production') {
                                        return (
                                            <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif', fontSize: 14 }}>
                                                <strong>UniversalStepEditor (stub legacy)</strong>
                                                <p>Este editor foi removido. Use <code>ModernUnifiedEditor</code>.</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                };
                                />
                                <label className="text-sm text-gray-700">Mostrar Barra de Progresso</label>
                            </div>

                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    checked={content?.showNavigation || properties?.showBackButton || false}
                                    onChange={(e) => updateBlockProperty(blockData.id, 'properties.showBackButton', e.target.checked)}
                                    className="w-4 h-4 text-blue-600"
                                />
                                <label className="text-sm text-gray-700">Mostrar Navegação</label>
                            </div>
                        </div >

    {/* Logo Settings */ }
{
    (content?.showLogo || properties?.showLogo) && (
        <div className="space-y-3">
            <h5 className="text-sm font-medium text-gray-700 border-l-2 border-green-500 pl-2">Logo</h5>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL do Logo</label>
                <input
                    type="url"
                    value={properties?.logoUrl || ''}
                    onChange={(e) => updateBlockProperty(blockData.id, 'properties.logoUrl', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="https://exemplo.com/logo.png"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alt do Logo</label>
                <input
                    type="text"
                    value={properties?.logoAlt || ''}
                    onChange={(e) => updateBlockProperty(blockData.id, 'properties.logoAlt', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="Descrição da logo"
                />
            </div>
        </div>
    )
}

{/* Progress Settings */ }
{
    (content?.showProgress || properties?.enableProgressBar) && (
        <div className="space-y-3">
            <h5 className="text-sm font-medium text-gray-700 border-l-2 border-yellow-500 pl-2">Barra de Progresso</h5>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valor do Progresso (%)</label>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={properties?.progressValue || 0}
                    onChange={(e) => updateBlockProperty(blockData.id, 'properties.progressValue', parseInt(e.target.value))}
                    className="w-full"
                />
                <div className="text-xs text-gray-500 text-center mt-1">
                    {properties?.progressValue || 0}%
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Máximo</label>
                <input
                    type="number"
                    value={properties?.progressMax || 100}
                    onChange={(e) => updateBlockProperty(blockData.id, 'properties.progressMax', parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Altura da Barra (px)</label>
                <input
                    type="number"
                    value={properties?.progressHeight || 8}
                    onChange={(e) => updateBlockProperty(blockData.id, 'properties.progressHeight', parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
            </div>
        </div>
    )
}

{/* Background & Style */ }
<div className="space-y-3">
    <h5 className="text-sm font-medium text-gray-700 border-l-2 border-purple-500 pl-2">Estilo</h5>

    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Cor de Fundo</label>
        <div className="flex space-x-2">
            <input
                type="color"
                value={properties?.backgroundColor || '#F8F9FA'}
                onChange={(e) => updateBlockProperty(blockData.id, 'properties.backgroundColor', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded"
            />
            <input
                type="text"
                value={properties?.backgroundColor || '#F8F9FA'}
                onChange={(e) => updateBlockProperty(blockData.id, 'properties.backgroundColor', e.target.value)}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
        </div>
    </div>

    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Alinhamento</label>
        <select
            value={properties?.textAlign || 'center'}
            onChange={(e) => updateBlockProperty(blockData.id, 'properties.textAlign', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
            <option value="left">Esquerda</option>
            <option value="center">Centro</option>
            <option value="right">Direita</option>
        </select>
    </div>

    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Sombra</label>
        <select
            value={properties?.boxShadow || 'sm'}
            onChange={(e) => updateBlockProperty(blockData.id, 'properties.boxShadow', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
            <option value="none">Nenhuma</option>
            <option value="sm">Pequena</option>
            <option value="md">Média</option>
            <option value="lg">Grande</option>
            <option value="xl">Extra Grande</option>
        </select>
    </div>
</div>

{/* Layout */ }
<div className="space-y-3">
    <h5 className="text-sm font-medium text-gray-700 border-l-2 border-orange-500 pl-2">Layout</h5>

    <div className="grid grid-cols-2 gap-3">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Padding</label>
            <input
                type="text"
                value={properties?.padding || '24px'}
                onChange={(e) => updateBlockProperty(blockData.id, 'properties.padding', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Border Radius</label>
            <input
                type="text"
                value={properties?.borderRadius || '8px'}
                onChange={(e) => updateBlockProperty(blockData.id, 'properties.borderRadius', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
        </div>
    </div>

    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Largura Máxima do Conteúdo (px)</label>
        <input
            type="number"
            value={properties?.contentMaxWidth || 640}
            onChange={(e) => updateBlockProperty(blockData.id, 'properties.contentMaxWidth', parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
    </div>

    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Margem Inferior</label>
        <input
            type="text"
            value={properties?.marginBottom || '16px'}
            onChange={(e) => updateBlockProperty(blockData.id, 'properties.marginBottom', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
    </div>
</div>

{/* Animation */ }
<div className="space-y-3">
    <h5 className="text-sm font-medium text-gray-700 border-l-2 border-red-500 pl-2">Animação</h5>

    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Animação</label>
        <select
            value={properties?.animation || 'fadeIn'}
            onChange={(e) => updateBlockProperty(blockData.id, 'properties.animation', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
            <option value="none">Nenhuma</option>
            <option value="fadeIn">Fade In</option>
            <option value="slideUp">Slide Up</option>
            <option value="slideDown">Slide Down</option>
            <option value="zoomIn">Zoom In</option>
        </select>
    </div>

    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Duração</label>
        <input
            type="text"
            value={properties?.animationDuration || '0.8s'}
            onChange={(e) => updateBlockProperty(blockData.id, 'properties.animationDuration', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="0.8s, 500ms, etc."
        />
    </div>
</div>
                    </div >
                );

            case 'form-container':
return (
    <div className="space-y-4">
        <h4 className="font-medium text-gray-800 pb-2 border-b">Configurações do Container de Formulário</h4>

        {/* Content */}
        <div className="space-y-3">
            <h5 className="text-sm font-medium text-gray-700 border-l-2 border-blue-500 pl-2">Conteúdo</h5>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título do Campo</label>
                <input
                    type="text"
                    value={content?.title || ''}
                    onChange={(e) => updateBlockProperty(blockData.id, 'content.title', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="Como posso te chamar?"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Texto do Botão</label>
                <input
                    type="text"
                    value={content?.buttonText || ''}
                    onChange={(e) => updateBlockProperty(blockData.id, 'content.buttonText', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="Quero Descobrir meu Estilo Agora!"
                />
            </div>
        </div>

        {/* Supabase Integration */}
        <div className="space-y-3">
            <h5 className="text-sm font-medium text-gray-700 border-l-2 border-red-500 pl-2">Integração Supabase</h5>

            <div className="flex items-center space-x-3">
                <input
                    type="checkbox"
                    checked={content?.saveToSupabase || false}
                    onChange={(e) => updateBlockProperty(blockData.id, 'content.saveToSupabase', e.target.checked)}
                    className="w-4 h-4 text-blue-600"
                />
                <label className="text-sm text-gray-700">Salvar no Supabase</label>
            </div>

            {content?.saveToSupabase && (
                <>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tabela</label>
                        <input
                            type="text"
                            value={content?.supabaseTable || 'quiz_users'}
                            onChange={(e) => updateBlockProperty(blockData.id, 'content.supabaseTable', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Coluna</label>
                        <input
                            type="text"
                            value={content?.supabaseColumn || 'name'}
                            onChange={(e) => updateBlockProperty(blockData.id, 'content.supabaseColumn', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        />
                    </div>
                </>
            )}
        </div>
    </div>
);

            case 'legal-notice':
return (
    <div className="space-y-4">
        <h4 className="font-medium text-gray-800 pb-2 border-b">Configurações do Aviso Legal</h4>

        {/* Content */}
        <div className="space-y-3">
            <h5 className="text-sm font-medium text-gray-700 border-l-2 border-blue-500 pl-2">Conteúdo</h5>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Texto de Copyright</label>
                <textarea
                    value={properties?.copyrightText || ''}
                    onChange={(e) => updateBlockProperty(blockData.id, 'properties.copyrightText', e.target.value)}
                    rows={2}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="© 2025 Gisele Galvão - Todos os direitos reservados..."
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Texto Privacidade</label>
                    <input
                        type="text"
                        value={properties?.privacyText || 'Política de Privacidade'}
                        onChange={(e) => updateBlockProperty(blockData.id, 'properties.privacyText', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Texto Termos</label>
                    <input
                        type="text"
                        value={properties?.termsText || 'Termos de Uso'}
                        onChange={(e) => updateBlockProperty(blockData.id, 'properties.termsText', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">URL Privacidade</label>
                    <input
                        type="url"
                        value={properties?.privacyLinkUrl || '/privacy'}
                        onChange={(e) => updateBlockProperty(blockData.id, 'properties.privacyLinkUrl', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">URL Termos</label>
                    <input
                        type="url"
                        value={properties?.termsLinkUrl || '/terms'}
                        onChange={(e) => updateBlockProperty(blockData.id, 'properties.termsLinkUrl', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        checked={properties?.showPrivacyLink || true}
                        onChange={(e) => updateBlockProperty(blockData.id, 'properties.showPrivacyLink', e.target.checked)}
                        className="w-4 h-4 text-blue-600"
                    />
                    <label className="text-sm text-gray-700">Mostrar Link de Privacidade</label>
                </div>
                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        checked={properties?.showTermsLink || true}
                        onChange={(e) => updateBlockProperty(blockData.id, 'properties.showTermsLink', e.target.checked)}
                        className="w-4 h-4 text-blue-600"
                    />
                    <label className="text-sm text-gray-700">Mostrar Link de Termos</label>
                </div>
            </div>
        </div>

        {/* Styling */}
        <div className="space-y-3">
            <h5 className="text-sm font-medium text-gray-700 border-l-2 border-purple-500 pl-2">Estilo</h5>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tamanho da Fonte</label>
                <select
                    value={properties?.fontSize || 'text-xs'}
                    onChange={(e) => updateBlockProperty(blockData.id, 'properties.fontSize', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                    <option value="text-xs">Extra Pequeno</option>
                    <option value="text-sm">Pequeno</option>
                    <option value="text-base">Normal</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alinhamento</label>
                <select
                    value={properties?.textAlign || 'center'}
                    onChange={(e) => updateBlockProperty(blockData.id, 'properties.textAlign', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                    <option value="left">Esquerda</option>
                    <option value="center">Centro</option>
                    <option value="right">Direita</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cor do Texto</label>
                <div className="flex space-x-2">
                    <input
                        type="color"
                        value={properties?.textColor || '#9CA3AF'}
                        onChange={(e) => updateBlockProperty(blockData.id, 'properties.textColor', e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded"
                    />
                    <input
                        type="text"
                        value={properties?.textColor || '#9CA3AF'}
                        onChange={(e) => updateBlockProperty(blockData.id, 'properties.textColor', e.target.value)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cor dos Links</label>
                <div className="flex space-x-2">
                    <input
                        type="color"
                        value={properties?.linkColor || '#B89B7A'}
                        onChange={(e) => updateBlockProperty(blockData.id, 'properties.linkColor', e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded"
                    />
                    <input
                        type="text"
                        value={properties?.linkColor || '#B89B7A'}
                        onChange={(e) => updateBlockProperty(blockData.id, 'properties.linkColor', e.target.value)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Margem Superior</label>
                    <input
                        type="number"
                        value={properties?.marginTop || 32}
                        onChange={(e) => updateBlockProperty(blockData.id, 'properties.marginTop', parseInt(e.target.value))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Margem Inferior</label>
                    <input
                        type="number"
                        value={properties?.marginBottom || 8}
                        onChange={(e) => updateBlockProperty(blockData.id, 'properties.marginBottom', parseInt(e.target.value))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                </div>
            </div>
        </div>
    </div>
);

            case 'text':
return (
    <div className="space-y-4">
        <h4 className="font-medium text-gray-800 pb-2 border-b">Configurações do Texto</h4>

        {/* Conteúdo */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Texto</label>
            <textarea
                value={content?.text || ''}
                onChange={(e) => updateBlockProperty(blockData.id, 'content.text', e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                placeholder="Digite o texto aqui..."
            />
            <div className="text-xs text-gray-500 mt-1">
                Suporte HTML: &lt;span&gt;, &lt;strong&gt;, &lt;em&gt;, etc.
            </div>
        </div>

        {/* Tipografia */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tamanho da Fonte</label>
            <select
                value={properties?.fontSize || 'text-base'}
                onChange={(e) => updateBlockProperty(blockData.id, 'properties.fontSize', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
                <option value="text-xs">Extra Pequeno</option>
                <option value="text-sm">Pequeno</option>
                <option value="text-base">Normal</option>
                <option value="text-lg">Grande</option>
                <option value="text-xl">Extra Grande</option>
                <option value="text-2xl">2XL</option>
                <option value="text-3xl">3XL</option>
                <option value="text-4xl">4XL</option>
                <option value="text-3xl md:text-4xl">Responsivo (3XL/4XL)</option>
            </select>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Peso da Fonte</label>
            <select
                value={properties?.fontWeight || 'font-normal'}
                onChange={(e) => updateBlockProperty(blockData.id, 'properties.fontWeight', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
                <option value="font-light">Leve</option>
                <option value="font-normal">Normal</option>
                <option value="font-medium">Médio</option>
                <option value="font-semibold">Semi-negrito</option>
                <option value="font-bold">Negrito</option>
            </select>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alinhamento</label>
            <select
                value={properties?.textAlign || 'text-left'}
                onChange={(e) => updateBlockProperty(blockData.id, 'properties.textAlign', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
                <option value="text-left">Esquerda</option>
                <option value="text-center">Centro</option>
                <option value="text-right">Direita</option>
                <option value="text-justify">Justificado</option>
            </select>
        </div>

        {/* Cor */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cor do Texto</label>
            <div className="flex space-x-2">
                <input
                    type="color"
                    value={properties?.color || '#000000'}
                    onChange={(e) => updateBlockProperty(blockData.id, 'properties.color', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded"
                />
                <input
                    type="text"
                    value={properties?.color || '#000000'}
                    onChange={(e) => updateBlockProperty(blockData.id, 'properties.color', e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
            </div>
        </div>

        {/* Espaçamento */}
        <div className="grid grid-cols-2 gap-3">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Margem Superior</label>
                <input
                    type="number"
                    value={properties?.marginTop || 0}
                    onChange={(e) => updateBlockProperty(blockData.id, 'properties.marginTop', parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Margem Inferior</label>
                <input
                    type="number"
                    value={properties?.marginBottom || 0}
                    onChange={(e) => updateBlockProperty(blockData.id, 'properties.marginBottom', parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Largura Máxima</label>
            <input
                type="text"
                value={properties?.maxWidth || '100%'}
                onChange={(e) => updateBlockProperty(blockData.id, 'properties.maxWidth', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                placeholder="640px, 100%, auto"
            />
        </div>
    </div>
);

            case 'image':
return (
    <div className="space-y-4">
        <h4 className="font-medium text-gray-800 pb-2 border-b">Configurações da Imagem</h4>

        {/* Imagem */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL da Imagem</label>
            <input
                type="url"
                value={properties?.src || ''}
                onChange={(e) => updateBlockProperty(blockData.id, 'properties.src', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                placeholder="https://exemplo.com/imagem.jpg"
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Texto Alternativo</label>
            <input
                type="text"
                value={properties?.alt || ''}
                onChange={(e) => updateBlockProperty(blockData.id, 'properties.alt', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                placeholder="Descrição da imagem"
            />
        </div>

        {/* Dimensões */}
        <div className="grid grid-cols-2 gap-3">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Largura</label>
                <input
                    type="text"
                    value={properties?.width || 'auto'}
                    onChange={(e) => updateBlockProperty(blockData.id, 'properties.width', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="auto, 300px, 100%"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Altura</label>
                <input
                    type="text"
                    value={properties?.height || 'auto'}
                    onChange={(e) => updateBlockProperty(blockData.id, 'properties.height', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="auto, 200px, 100%"
                />
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Largura Máxima</label>
            <select
                value={properties?.maxWidth || 'md'}
                onChange={(e) => updateBlockProperty(blockData.id, 'properties.maxWidth', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
                <option value="sm">Pequeno (max-w-sm)</option>
                <option value="md">Médio (max-w-md)</option>
                <option value="lg">Grande (max-w-lg)</option>
                <option value="xl">Extra Grande (max-w-xl)</option>
                <option value="2xl">2XL (max-w-2xl)</option>
                <option value="full">Completa (max-w-full)</option>
            </select>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alinhamento</label>
            <select
                value={properties?.alignment || 'center'}
                onChange={(e) => updateBlockProperty(blockData.id, 'properties.alignment', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
                <option value="left">Esquerda</option>
                <option value="center">Centro</option>
                <option value="right">Direita</option>
            </select>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Border Radius</label>
            <select
                value={properties?.borderRadius || 'large'}
                onChange={(e) => updateBlockProperty(blockData.id, 'properties.borderRadius', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
                <option value="none">Nenhum</option>
                <option value="small">Pequeno</option>
                <option value="medium">Médio</option>
                <option value="large">Grande</option>
                <option value="full">Circular</option>
            </select>
        </div>

        {/* Espaçamento */}
        <div className="grid grid-cols-2 gap-3">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Margem Superior</label>
                <input
                    type="number"
                    value={properties?.marginTop || 8}
                    onChange={(e) => updateBlockProperty(blockData.id, 'properties.marginTop', parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Margem Inferior</label>
                <input
                    type="number"
                    value={properties?.marginBottom || 12}
                    onChange={(e) => updateBlockProperty(blockData.id, 'properties.marginBottom', parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
            </div>
        </div>
    </div>
);

            case 'button':
return (
    <div className="space-y-4">
        <h4 className="font-medium text-gray-800 pb-2 border-b">Configurações do Botão</h4>

        {/* Texto do Botão */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Texto do Botão</label>
            <input
                type="text"
                value={content?.text || properties?.text || ''}
                onChange={(e) => updateBlockProperty(blockData.id, 'content.text', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                placeholder="Clique aqui"
            />
        </div>

        {/* Tipo do Botão */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <select
                value={properties?.variant || 'primary'}
                onChange={(e) => updateBlockProperty(blockData.id, 'properties.variant', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
                <option value="primary">Primário</option>
                <option value="secondary">Secundário</option>
                <option value="outline">Contorno</option>
                <option value="ghost">Fantasma</option>
                <option value="destructive">Destrutivo</option>
            </select>
        </div>

        {/* Ação */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ação</label>
            <select
                value={properties?.action || 'next'}
                onChange={(e) => updateBlockProperty(blockData.id, 'properties.action', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
                <option value="next">Próximo Step</option>
                <option value="submit">Enviar Formulário</option>
                <option value="back">Voltar</option>
            </select>
        </div>
    </div>
);

            case 'input':
            case 'form-input':
return (
    <div className="space-y-4">
        <h4 className="font-medium text-gray-800 pb-2 border-b">Configurações do Input</h4>

        {/* Label */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Label</label>
            <input
                type="text"
                value={properties?.label || content?.label || ''}
                onChange={(e) => updateBlockProperty(blockData.id, 'properties.label', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                placeholder="Nome do campo"
            />
        </div>

        {/* Tipo */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo do Input</label>
            <select
                value={properties?.type || 'text'}
                onChange={(e) => updateBlockProperty(blockData.id, 'properties.type', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
                <option value="text">Texto</option>
                <option value="email">E-mail</option>
                <option value="password">Senha</option>
                <option value="number">Número</option>
            </select>
        </div>

        {/* Nome do Campo */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Campo</label>
            <input
                type="text"
                value={properties?.name || ''}
                onChange={(e) => updateBlockProperty(blockData.id, 'properties.name', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                placeholder="campo_nome"
            />
        </div>

        {/* Validações */}
        <div className="flex items-center space-x-3">
            <input
                type="checkbox"
                checked={properties?.required || false}
                onChange={(e) => updateBlockProperty(blockData.id, 'properties.required', e.target.checked)}
                className="w-4 h-4 text-blue-600"
            />
            <label className="text-sm text-gray-700">Campo Obrigatório</label>
        </div>
    </div>
);

            case 'quiz-question':
return (
    <div className="space-y-4">
        <h4 className="font-medium text-gray-800 pb-2 border-b">Configurações da Pergunta</h4>

        {/* Pergunta */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pergunta</label>
            <textarea
                value={content?.question || content?.text || ''}
                onChange={(e) => updateBlockProperty(blockData.id, 'content.question', e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                placeholder="Digite a pergunta aqui..."
            />
        </div>

        {/* Tipo da Pergunta */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo da Pergunta</label>
            <select
                value={properties?.questionType || 'multiple-choice'}
                onChange={(e) => updateBlockProperty(blockData.id, 'properties.questionType', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
                <option value="multiple-choice">Múltipla Escolha</option>
                <option value="single-choice">Escolha Única</option>
                <option value="yes-no">Sim/Não</option>
                <option value="rating">Avaliação</option>
            </select>
        </div>

        {/* Opções (para múltipla escolha) */}
        {(properties?.questionType === 'multiple-choice' || properties?.questionType === 'single-choice') && content?.options && (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Opções de Resposta</label>
                <div className="space-y-2">
                    {content.options.map((option: any, index: number) => (
                        <div key={index} className="flex space-x-2">
                            <input
                                type="text"
                                value={option.text || ''}
                                onChange={(e) => {
                                    const newOptions = [...content.options];
                                    newOptions[index] = { ...option, text: e.target.value };
                                    updateBlockProperty(blockData.id, 'content.options', newOptions);
                                }}
                                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                                placeholder={`Opção ${index + 1}`}
                            />
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Configurações */}
        <div className="flex items-center space-x-3">
            <input
                type="checkbox"
                checked={properties?.required || false}
                onChange={(e) => updateBlockProperty(blockData.id, 'properties.required', e.target.checked)}
                className="w-4 h-4 text-blue-600"
            />
            <label className="text-sm text-gray-700">Resposta Obrigatória</label>
        </div>
    </div>
);

            default:
return (
    <div className="space-y-4">
        <h4 className="font-medium text-gray-800 pb-2 border-b">Configurações Gerais</h4>
        <div className="text-sm text-gray-600">
            Propriedades específicas para o tipo "{type}" ainda não foram implementadas.
        </div>
    </div>
);
        }
    };

// Auto-save das mudanças
React.useEffect(() => {
    if (!hasUnsavedChanges) return;

    const autoSaveTimer = setTimeout(() => {
        handleSave();
        setHasUnsavedChanges(false);
        console.log('💾 Auto-save executado');
    }, 2000); // Auto-save após 2 segundos de inatividade

    return () => clearTimeout(autoSaveTimer);
}, [hasUnsavedChanges, currentStepData]);

// Renderizar componente visual baseado no tipo
const renderComponent = (component: any, index: number) => {
    const { type, content, properties } = component;
    const isSelected = selectedBlockId === component.id;

    const handleBlockClick = () => {
        setSelectedBlockId(component.id);
        setSelectedBlockData(component);
        console.log('🎯 Bloco selecionado:', component);
    };

    const blockWrapper = (children: React.ReactNode) => (
        <div
            key={index}
            className={`cursor-pointer transition-all duration-200 ${isSelected
                ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg'
                : 'hover:shadow-md hover:ring-1 hover:ring-gray-300'
                }`}
            onClick={handleBlockClick}
        >
            {children}
            {isSelected && (
                <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Selecionado
                </div>
            )}
        </div>
    );

    switch (type) {
        case 'quiz-intro-header':
            return blockWrapper(
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4 relative">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">📋 Quiz Header</h3>
                        <span className="text-xs text-gray-500">{type}</span>
                    </div>
                    <div className="space-y-4">
                        {properties?.logoUrl && (
                            <div className="text-center">
                                <img
                                    src={properties.logoUrl}
                                    alt={properties.logoAlt || 'Logo'}
                                    className="h-12 mx-auto"
                                />
                            </div>
                        )}
                        {properties?.enableProgressBar && (
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${properties.progressValue || 0}%` }}
                                ></div>
                            </div>
                        )}
                    </div>
                </div>
            );

        case 'decorative-bar':
            return (
                <div className="space-y-4">
                    <h4 className="font-medium text-gray-800 pb-2 border-b">Configurações da Barra Decorativa</h4>

                    {/* Dimensions */}
                    <div className="space-y-3">
                        <h5 className="text-sm font-medium text-gray-700 border-l-2 border-blue-500 pl-2">Dimensões</h5>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Largura</label>
                            <input
                                type="text"
                                value={properties?.width || 'min(640px, 100%)'}
                                onChange={(e) => updateBlockProperty(component.id, 'properties.width', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                placeholder="min(640px, 100%), 300px, 50%"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Altura (px)</label>
                            <input
                                type="number"
                                value={properties?.height || 4}
                                onChange={(e) => updateBlockProperty(component.id, 'properties.height', parseInt(e.target.value))}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            />
                        </div>
                    </div>

                    {/* Colors */}
                    <div className="space-y-3">
                        <h5 className="text-sm font-medium text-gray-700 border-l-2 border-green-500 pl-2">Cores</h5>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cor Principal</label>
                            <div className="flex space-x-2">
                                <input
                                    type="color"
                                    value={properties?.color || properties?.backgroundColor || '#B89B7A'}
                                    onChange={(e) => updateBlockProperty(component.id, 'properties.color', e.target.value)}
                                    className="w-12 h-10 border border-gray-300 rounded"
                                />
                                <input
                                    type="text"
                                    value={properties?.color || properties?.backgroundColor || '#B89B7A'}
                                    onChange={(e) => updateBlockProperty(component.id, 'properties.color', e.target.value)}
                                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                                />
                            </div>
                        </div>

                        {/* Gradient Colors */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cores do Gradiente (opcional)</label>
                            <div className="space-y-2">
                                {(properties?.gradientColors || ['#B89B7A', '#D4C2A8', '#B89B7A']).map((color: string, index: number) => (
                                    <div key={index} className="flex space-x-2 items-center">
                                        <span className="text-xs text-gray-500 w-8">{index + 1}:</span>
                                        <input
                                            type="color"
                                            value={color}
                                            onChange={(e) => {
                                                const newColors = [...(properties?.gradientColors || ['#B89B7A', '#D4C2A8', '#B89B7A'])];
                                                newColors[index] = e.target.value;
                                                updateBlockProperty(component.id, 'properties.gradientColors', newColors);
                                            }}
                                            className="w-10 h-8 border border-gray-300 rounded"
                                        />
                                        <input
                                            type="text"
                                            value={color}
                                            onChange={(e) => {
                                                const newColors = [...(properties?.gradientColors || ['#B89B7A', '#D4C2A8', '#B89B7A'])];
                                                newColors[index] = e.target.value;
                                                updateBlockProperty(component.id, 'properties.gradientColors', newColors);
                                            }}
                                            className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Style */}
                    <div className="space-y-3">
                        <h5 className="text-sm font-medium text-gray-700 border-l-2 border-purple-500 pl-2">Estilo</h5>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Border Radius (px)</label>
                            <input
                                type="number"
                                value={properties?.borderRadius || 3}
                                onChange={(e) => updateBlockProperty(component.id, 'properties.borderRadius', parseInt(e.target.value))}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            />
                        </div>

                        <div className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                checked={properties?.showShadow || false}
                                onChange={(e) => updateBlockProperty(component.id, 'properties.showShadow', e.target.checked)}
                                className="w-4 h-4 text-blue-600"
                            />
                            <label className="text-sm text-gray-700">Mostrar Sombra</label>
                        </div>
                    </div>

                    {/* Spacing */}
                    <div className="space-y-3">
                        <h5 className="text-sm font-medium text-gray-700 border-l-2 border-orange-500 pl-2">Espaçamento</h5>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Margem Superior</label>
                                <input
                                    type="number"
                                    value={properties?.marginTop || 12}
                                    onChange={(e) => updateBlockProperty(component.id, 'properties.marginTop', parseInt(e.target.value))}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Margem Inferior</label>
                                <input
                                    type="number"
                                    value={properties?.marginBottom || 24}
                                    onChange={(e) => updateBlockProperty(component.id, 'properties.marginBottom', parseInt(e.target.value))}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            );
            return blockWrapper(
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4 relative">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">📝 Texto</h3>
                        <span className="text-xs text-gray-500">{type}</span>
                    </div>
                    <div
                        className={`${properties?.fontSize || 'text-base'} ${properties?.fontWeight || 'font-normal'} ${properties?.textAlign || 'text-left'}`}
                        style={{ color: properties?.color || '#000000' }}
                        dangerouslySetInnerHTML={{ __html: content?.text || 'Texto não definido' }}
                    />
                </div>
            );

        case 'form-container':
            return blockWrapper(
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4 relative">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">📝 Formulário</h3>
                        <span className="text-xs text-gray-500">{type}</span>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {content?.title || 'Campo de formulário'}
                            </label>
                            <input
                                type="text"
                                placeholder={content?.placeholder || 'Digite aqui...'}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                style={{
                                    backgroundColor: content?.backgroundColor || '#FFFFFF',
                                    borderColor: content?.borderColor || '#B89B7A',
                                    color: content?.textColor || '#432818'
                                }}
                            />
                        </div>
                        <button
                            className="w-full py-3 px-4 rounded-md font-medium transition-colors"
                            style={{
                                backgroundColor: content?.buttonBackgroundColor || '#B89B7A',
                                color: content?.buttonTextColor || '#FFFFFF'
                            }}
                        >
                            {content?.buttonText || 'Enviar'}
                        </button>
                    </div>
                </div>
            );

        case 'legal-notice':
            return (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">⚖️ Aviso Legal</h3>
                        <span className="text-xs text-gray-500">{type}</span>
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-xs text-gray-500">
                            {properties?.copyrightText || '© 2025 - Todos os direitos reservados'}
                        </p>
                        <div className="space-x-4">
                            {properties?.showPrivacyLink && (
                                <a href={properties.privacyLinkUrl || '#'} className="text-xs text-blue-600 hover:underline">
                                    {properties.privacyText || 'Política de Privacidade'}
                                </a>
                            )}
                            {properties?.showTermsLink && (
                                <a href={properties.termsLinkUrl || '#'} className="text-xs text-blue-600 hover:underline">
                                    {properties.termsText || 'Termos de Uso'}
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            );

        case 'HeaderSection':
            return (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">📋 Header</h3>
                        <span className="text-xs text-gray-500">HeaderSection</span>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                            <h2 className="text-2xl font-bold text-gray-900">{properties?.title || 'Título do Step'}</h2>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Subtítulo</label>
                            <p className="text-gray-600">{properties?.subtitle || 'Subtítulo do step'}</p>
                        </div>
                    </div>
                </div>
            );

        case 'UserInfoSection':
            return (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">👤 Informações do Usuário</h3>
                        <span className="text-xs text-gray-500">UserInfoSection</span>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold">👤</span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Nome do Usuário</p>
                                <p className="text-sm text-gray-500">Informações personalizadas</p>
                            </div>
                        </div>
                    </div>
                </div>
            );

        case 'ProgressSection':
            return (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">📊 Progresso</h3>
                        <span className="text-xs text-gray-500">ProgressSection</span>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Step {stepNumber} de 21</span>
                            <span className="text-sm font-medium text-gray-900">{Math.round((stepNumber / 21) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(stepNumber / 21) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            );

        case 'MainImageSection':
            return (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">🖼️ Imagem Principal</h3>
                        <span className="text-xs text-gray-500">MainImageSection</span>
                    </div>
                    <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-4xl mb-2">🖼️</div>
                            <p className="text-gray-500">Imagem do Step {stepNumber}</p>
                        </div>
                    </div>
                </div>
            );

        case 'QuestionSection':
            return (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">❓ Pergunta</h3>
                        <span className="text-xs text-gray-500">QuestionSection</span>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-lg font-medium text-gray-900 mb-3">
                                {properties?.question || `Pergunta do Step ${stepNumber}?`}
                            </h4>
                            <div className="space-y-2">
                                {(properties?.options || ['Opção A', 'Opção B', 'Opção C']).map((option: string, optIndex: number) => (
                                    <label key={optIndex} className="flex items-center space-x-3">
                                        <input
                                            type="radio"
                                            name={`question-${index}`}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <span className="text-gray-700">{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            );

        default:
            return (
                <div key={index} className="bg-gray-50 rounded-lg border border-gray-200 p-6 mb-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-700">🧩 {type || 'Componente'}</h3>
                        <span className="text-xs text-gray-500">{type}</span>
                    </div>
                    {content?.text && (
                        <div dangerouslySetInnerHTML={{ __html: content.text }} />
                    )}
                    {properties && Object.keys(properties).length > 0 && (
                        <pre className="text-xs text-gray-500 mt-2 bg-gray-100 p-2 rounded overflow-auto">
                            {JSON.stringify(properties, null, 2)}
                        </pre>
                    )}
                </div>
            );
    }
};

if (isLoading) {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando Step {stepNumber}...</p>
            </div>
        </div>
    );
}

return (
    <div className="h-screen flex flex-col bg-gray-100">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div>
                <h1 className="text-xl font-semibold text-gray-900">
                    {currentStepData?.name || `Step ${stepNumber}`}
                </h1>
                <p className="text-sm text-gray-500">
                    {currentStepData?.description || `Conteúdo do step ${stepNumber}`}
                </p>
            </div>

            <div className="flex items-center space-x-3">
                <button
                    onClick={() => {
                        handleSave();
                        setHasUnsavedChanges(false);
                    }}
                    className={`px-4 py-2 rounded-md transition-colors flex items-center space-x-2 ${hasUnsavedChanges
                        ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                >
                    <span>💾</span>
                    <span>{hasUnsavedChanges ? 'Salvar Alterações' : 'Salvar'}</span>
                    {hasUnsavedChanges && (
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    )}
                </button>
            </div>
        </div>

        {/* Layout de 4 Colunas */}
        <div className="flex-1 flex">
            {/* Coluna 1: Navegação / Estrutura */}
            <div className="w-64 bg-white border-r border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🗂️ Estrutura</h3>

                <div className="space-y-2">
                    {Array.from({ length: 21 }, (_, i) => i + 1).map((num) => (
                        <button
                            key={num}
                            onClick={() => onStepChange?.(`step-${num}`)}
                            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${num === stepNumber
                                ? 'bg-blue-100 text-blue-800 font-medium'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Step {num}
                        </button>
                    ))}
                </div>
            </div>

            {/* Coluna 2: Componentes Disponíveis */}
            <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🧩 Componentes</h3>

                <div className="space-y-3">
                    <div
                        className="bg-white rounded-lg p-3 border border-gray-200 cursor-grab hover:bg-gray-50 hover:shadow-md transition-all"
                        draggable
                        onDragStart={(e) => {
                            e.dataTransfer.setData('text/plain', JSON.stringify({
                                type: 'HeaderSection',
                                id: `new-header-${Date.now()}`,
                                content: { title: 'Novo Título', subtitle: 'Novo Subtítulo' },
                                properties: { fontSize: 'text-2xl', fontWeight: 'font-bold' }
                            }));
                        }}
                    >
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl">📋</span>
                            <div>
                                <p className="font-medium text-gray-900">Header</p>
                                <p className="text-xs text-gray-500">Título e subtítulo</p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="bg-white rounded-lg p-3 border border-gray-200 cursor-grab hover:bg-gray-50 hover:shadow-md transition-all"
                        draggable
                        onDragStart={(e) => {
                            e.dataTransfer.setData('text/plain', JSON.stringify({
                                type: 'text',
                                id: `new-text-${Date.now()}`,
                                content: { text: 'Novo texto aqui...' },
                                properties: { fontSize: 'text-base', textAlign: 'left' }
                            }));
                        }}
                    >
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl">�</span>
                            <div>
                                <p className="font-medium text-gray-900">Texto</p>
                                <p className="text-xs text-gray-500">Parágrafo de texto</p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="bg-white rounded-lg p-3 border border-gray-200 cursor-grab hover:bg-gray-50 hover:shadow-md transition-all"
                        draggable
                        onDragStart={(e) => {
                            e.dataTransfer.setData('text/plain', JSON.stringify({
                                type: 'UserInfoSection',
                                id: `new-userinfo-${Date.now()}`,
                                content: {},
                                properties: {}
                            }));
                        }}
                    >
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl">�</span>
                            <div>
                                <p className="font-medium text-gray-900">User Info</p>
                                <p className="text-xs text-gray-500">Informações do usuário</p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="bg-white rounded-lg p-3 border border-gray-200 cursor-grab hover:bg-gray-50 hover:shadow-md transition-all"
                        draggable
                        onDragStart={(e) => {
                            e.dataTransfer.setData('text/plain', JSON.stringify({
                                type: 'image',
                                id: `new-image-${Date.now()}`,
                                content: {},
                                properties: {
                                    src: 'https://via.placeholder.com/400x300',
                                    alt: 'Nova imagem',
                                    maxWidth: 'md'
                                }
                            }));
                        }}
                    >
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl">🖼️</span>
                            <div>
                                <p className="font-medium text-gray-900">Image</p>
                                <p className="text-xs text-gray-500">Imagem principal</p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="bg-white rounded-lg p-3 border border-gray-200 cursor-grab hover:bg-gray-50 hover:shadow-md transition-all"
                        draggable
                        onDragStart={(e) => {
                            e.dataTransfer.setData('text/plain', JSON.stringify({
                                type: 'form-container',
                                id: `new-form-${Date.now()}`,
                                content: {
                                    title: 'Nova Pergunta',
                                    placeholder: 'Digite sua resposta...',
                                    buttonText: 'Enviar',
                                    backgroundColor: '#FFFFFF',
                                    borderColor: '#B89B7A',
                                    buttonBackgroundColor: '#B89B7A',
                                    buttonTextColor: '#FFFFFF'
                                },
                                properties: {}
                            }));
                        }}
                    >
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl">❓</span>
                            <div>
                                <p className="font-medium text-gray-900">Question</p>
                                <p className="text-xs text-gray-500">Pergunta com opções</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Coluna 3: Editor Visual Principal */}
            <div className="flex-1 p-6 overflow-y-auto">
                <div
                    className="bg-white rounded-lg border border-gray-200 p-6 min-h-full"
                    onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.add('ring-2', 'ring-blue-300', 'bg-blue-50');
                    }}
                    onDragLeave={(e) => {
                        e.currentTarget.classList.remove('ring-2', 'ring-blue-300', 'bg-blue-50');
                    }}
                    onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('ring-2', 'ring-blue-300', 'bg-blue-50');

                        try {
                            const componentData = JSON.parse(e.dataTransfer.getData('text/plain'));
                            console.log('🎯 Componente solto:', componentData);

                            // Adicionar o novo componente à lista de blocos
                            const newBlock = {
                                ...componentData,
                                order: currentStepData?.blocks?.length || 0
                            };

                            setCurrentStepData((prev: any) => ({
                                ...prev,
                                blocks: [...(prev?.blocks || []), newBlock]
                            }));

                            setHasUnsavedChanges(true);
                            console.log('✅ Novo componente adicionado:', newBlock);
                        } catch (error) {
                            console.error('❌ Erro ao processar drop:', error);
                        }
                    }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                🎯 Preview - Step {stepNumber}
                            </h2>

                            {/* Indicador de Schema */}
                            <div className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm font-medium ${schemaValidation.isValid
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                                }`}>
                                <span>{schemaValidation.isValid ? '✅' : '❌'}</span>
                                <span>{schemaValidation.isValid ? 'Schema OK' : 'Schema Inválido'}</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">ID:</span>
                            <span className="text-sm font-mono text-gray-700">{stepId}</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {currentStepData?.blocks && currentStepData.blocks.length > 0 ? (
                            currentStepData.blocks.map((block: any, index: number) => (
                                renderComponent(block, index)
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🎯</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Step {stepNumber}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {currentStepData?.description || 'Arrastar componentes para começar a editar'}
                                </p>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-500">
                                        Funil: {funnelId} | ID: {stepId}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Botões de Navegação abaixo dos blocos */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={handlePrevious}
                                    disabled={stepNumber <= 1}
                                    className="flex items-center space-x-2 px-4 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <span>←</span>
                                    <span>Step Anterior</span>
                                </button>

                                <div className="flex items-center space-x-3">
                                    <span className="text-sm text-gray-500">Step {stepNumber} de 21</span>
                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${(stepNumber / 21) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">
                                        {Math.round((stepNumber / 21) * 100)}%
                                    </span>
                                </div>

                                <button
                                    onClick={handleNext}
                                    disabled={stepNumber >= 21}
                                    className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <span>Próximo Step</span>
                                    <span>→</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Coluna 4: Propriedades */}
            <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">⚙️ Propriedades</h3>

                {selectedBlockData ? (
                    <div className="space-y-6">
                        {/* Propriedades dinâmicas baseadas no tipo */}
                        {renderPropertiesFields(selectedBlockData)}

                        <div className="pt-4 border-t border-gray-200">
                            <button
                                className="w-full bg-red-600 text-white py-2 px-3 rounded-md hover:bg-red-700 transition-colors text-sm"
                                onClick={() => {
                                    setSelectedBlockId(null);
                                    setSelectedBlockData(null);
                                }}
                            >
                                Desselecionar Bloco
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="text-center py-8 text-gray-500">
                            <div className="text-4xl mb-2">👆</div>
                            <p className="text-sm">Clique em um componente para editá-lo</p>
                        </div>

                        {/* Propriedades gerais do step */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nome do Step
                            </label>
                            <input
                                type="text"
                                defaultValue={currentStepData?.name || `Step ${stepNumber}`}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                readOnly={readOnly}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descrição
                            </label>
                            <textarea
                                defaultValue={currentStepData?.description || `Conteúdo do step ${stepNumber}`}
                                rows={3}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                readOnly={readOnly}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tipo do Step
                            </label>
                            <select
                                defaultValue="quiz-question"
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                disabled={readOnly}
                            >
                                <option value="intro">Introdução</option>
                                <option value="quiz-question">Pergunta Quiz</option>
                                <option value="strategic-question">Pergunta Estratégica</option>
                                <option value="result">Resultado</option>
                            </select>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Estatísticas</h4>
                            <div className="bg-gray-50 rounded-md p-3 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Componentes:</span>
                                    <span className="text-sm font-medium">{currentStepData?.blocks?.length || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Progresso:</span>
                                    <span className="text-sm font-medium">{Math.round((stepNumber / 21) * 100)}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Step:</span>
                                    <span className="text-sm font-medium">{stepNumber}/21</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Navigation Footer */}
        {showNavigation && (
            <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                <button
                    onClick={handlePrevious}
                    disabled={stepNumber <= 1}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                    <span>←</span>
                    <span>Step {stepNumber - 1}</span>
                </button>

                <div className="text-center">
                    <span className="text-sm text-gray-500">Step {stepNumber} de 21</span>
                    <div className="w-32 bg-gray-200 rounded-full h-1 mt-1">
                        <div
                            className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${(stepNumber / 21) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <button
                    onClick={handleNext}
                    disabled={stepNumber >= 21}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                    <span>Step {stepNumber + 1}</span>
                    <span>→</span>
                </button>
            </div>
        )}
    </div>
);
};

export { UniversalStepEditor };
export default UniversalStepEditor;