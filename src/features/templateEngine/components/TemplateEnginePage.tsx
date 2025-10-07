import React, { useState, useEffect } from 'react';
import { TemplateEngineList } from './TemplateEngineList';
import { TemplateEngineEditor } from './TemplateEngineEditor';
import { LegacyTemplateViewer } from './LegacyTemplateViewer';

// Helper para ler query param simples sem dependências adicionais
function useQueryParam(name: string): string | null {
    const [value, setValue] = useState<string | null>(null);
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const v = params.get(name);
        setValue(v);
    }, [name]);
    return value;
}

export const TemplateEnginePage: React.FC = () => {
    const [openId, setOpenId] = useState<string | null>(null);
    const legacySlug = useQueryParam('legacySlug');
    const allowLegacy = (import.meta as any).env?.VITE_QUIZ_STYLE_ADAPTER !== 'false';
    return <div className="max-w-5xl mx-auto p-6 space-y-6">
        {!openId && (!legacySlug || !allowLegacy) && <TemplateEngineList onOpen={setOpenId} />}
        {openId && (!legacySlug || !allowLegacy) && <TemplateEngineEditor id={openId} onBack={() => setOpenId(null)} />}
        {legacySlug && allowLegacy && <LegacyTemplateViewer slug={legacySlug} onBack={() => { const url = new URL(window.location.href); url.searchParams.delete('legacySlug'); window.history.replaceState({}, '', url.toString()); }} />}
        {legacySlug && !allowLegacy && <div className="text-sm text-red-600">Adapter legacy desabilitado pela flag VITE_QUIZ_STYLE_ADAPTER.</div>}
    </div>;
};

// Wrapper usado pela rota direta /template-engine/:templateId
export const TemplateEnginePageWrapperOpen: React.FC<{ id: string }> = ({ id }) => {
    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <TemplateEngineEditor id={id} onBack={() => { window.location.href = '/template-engine'; }} />
        </div>
    );
};
