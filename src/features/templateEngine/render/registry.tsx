import React from 'react';
import { TemplateDraft } from '@/../server/templates/models';
import { ComponentKind } from '@/../server/templates/components';

// Tipagens locais para runtime de renderização
export interface RenderContext {
    draft: TemplateDraft;
    stageId?: string;
}

export interface RenderComponentProps<P = any> {
    component: any; // componente tipado ou legacy
    ctx: RenderContext;
}

// Componentes básicos (placeholder minimalista)
const HeaderView: React.FC<RenderComponentProps> = ({ component }) => {
    const p = component.props || {}; return <div className="p-2 border rounded bg-white">
        <h3 className="font-semibold text-sm">{p.title || 'Header'}</h3>
        {p.subtitle && <p className="text-xs text-gray-500">{p.subtitle}</p>}
        {p.description && <p className="text-xs mt-1">{p.description}</p>}
    </div>;
};

const NavigationView: React.FC<RenderComponentProps> = ({ component }) => {
    const p = component.props || {}; return <div className="flex gap-2 text-xs">
        {p.showPrevious && <button className="border px-2 py-1 rounded">Voltar</button>}
        {p.showNext && <button className="bg-blue-600 text-white px-2 py-1 rounded">{p.nextButtonText || 'Próximo'}</button>}
    </div>;
};

const QuestionSingleView: React.FC<RenderComponentProps> = ({ component }) => {
    const p = component.props || {}; return <div className="space-y-1 text-sm">
        <div className="font-medium">{p.title || 'Pergunta'}</div>
        <ul className="space-y-1">
            {(p.options || []).map((o: any) => <li key={o.id} className="flex items-center gap-2">
                <input type="radio" name={component.id} /> <span>{o.label}</span>
            </li>)}
        </ul>
    </div>;
};

const QuestionMultiView: React.FC<RenderComponentProps> = ({ component }) => {
    const p = component.props || {}; return <div className="space-y-1 text-sm">
        <div className="font-medium">{p.title || 'Pergunta (Multi)'}</div>
        <ul className="space-y-1">
            {(p.options || []).map((o: any) => <li key={o.id} className="flex items-center gap-2">
                <input type="checkbox" /> <span>{o.label}</span>
            </li>)}
        </ul>
    </div>;
};

const TransitionView: React.FC<RenderComponentProps> = ({ component }) => {
    const p = component.props || {}; return <div className="p-2 border-l-4 bg-gray-50 text-xs" style={{ borderColor: '#3b82f6' }}>
        <div>{p.message || 'Transição'}</div>
    </div>;
};

const ResultPlaceholderView: React.FC<RenderComponentProps> = ({ component }) => {
    const p = component.props || {}; return <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-sm">
        <strong>Resultado:</strong> <span>{p.template || 'Resultado placeholder'}</span>
    </div>;
};

const RawLegacyBundleView: React.FC<RenderComponentProps> = ({ component }) => {
    const blocks = component.props?.blocks || []; return <div className="text-[11px] bg-yellow-50 border border-yellow-200 rounded p-2">
        <div className="font-semibold mb-1">Legacy Bundle ({blocks.length} blocks)</div>
        <details className="cursor-pointer">
            <summary className="text-xs">Ver JSON</summary>
            <pre className="overflow-auto max-h-64 mt-1">{JSON.stringify(blocks, null, 2)}</pre>
        </details>
    </div>;
};

// Registry mapping
export const componentRegistry: Record<string, React.FC<RenderComponentProps>> = {
    [ComponentKind.Header]: HeaderView,
    [ComponentKind.Navigation]: NavigationView,
    [ComponentKind.QuestionSingle]: QuestionSingleView,
    [ComponentKind.QuestionMulti]: QuestionMultiView,
    [ComponentKind.Transition]: TransitionView,
    [ComponentKind.ResultPlaceholder]: ResultPlaceholderView,
    [ComponentKind.RawLegacyBundle]: RawLegacyBundleView
};

// Fallback para componentes legacy antigos (sem kind)
export const legacyTypeFallback: Record<string, React.FC<RenderComponentProps>> = {
    legacyBlocksBundle: RawLegacyBundleView
};

export function renderComponent(component: any, ctx: RenderContext): React.ReactElement {
    const kind = (component as any).kind;
    if (kind && componentRegistry[kind]) {
        const C = componentRegistry[kind];
        return <C component={component} ctx={ctx} />;
    }
    if (component.type && legacyTypeFallback[component.type]) {
        const C = legacyTypeFallback[component.type];
        return <C component={component} ctx={ctx} />;
    }
    return <div className="text-xs text-red-600">Componente não reconhecido: {kind || component.type}</div>;
}
