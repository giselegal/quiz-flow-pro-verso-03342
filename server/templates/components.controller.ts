import { Router } from 'express';
import { listComponents, getComponent, saveComponent, deleteComponent } from './components.repo';
import { scanComponents, getComponentDecompositionMetrics } from './components.metrics';
import { createHeader, createNavigation, createQuestionSingle, createQuestionMulti, createTransition, createResultPlaceholder, createRawLegacyBundle, ComponentKind } from './components';

export const componentsRouter = Router();

// Helper para criar componente a partir de kind + props
function buildComponent(kind: ComponentKind, props: any) {
    switch (kind) {
        case ComponentKind.Header: return createHeader(props);
        case ComponentKind.Navigation: return createNavigation(props);
        case ComponentKind.QuestionSingle: return createQuestionSingle(props);
        case ComponentKind.QuestionMulti: return createQuestionMulti(props);
        case ComponentKind.Transition: return createTransition(props);
        case ComponentKind.ResultPlaceholder: return createResultPlaceholder(props);
        case ComponentKind.RawLegacyBundle: return createRawLegacyBundle(props);
        default: throw new Error(`Kind desconhecido: ${kind}`);
    }
}

componentsRouter.get('/', (req, res) => {
    const kindsParam = (req.query.kinds as string) || '';
    const kinds = kindsParam ? kindsParam.split(',') : undefined;
    const items = listComponents({ kinds });
    scanComponents(items as any);
    res.json({ items, count: items.length });
});

componentsRouter.get('/:id', (req, res) => {
    const c = getComponent(req.params.id);
    if (!c) return res.status(404).json({ error: 'Not found' });
    res.json(c);
});

componentsRouter.post('/', (req, res) => {
    const { kind, props } = req.body || {};
    if (!kind || !props) return res.status(400).json({ error: 'kind e props obrigatórios' });
    try {
        const c = buildComponent(kind as ComponentKind, props);
        saveComponent(c);
        scanComponents(listComponents());
        res.status(201).json(c);
    } catch (e: any) {
        res.status(400).json({ error: e.message });
    }
});

componentsRouter.patch('/:id', (req, res) => {
    const existing = getComponent(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Not found' });
    const { props } = req.body || {};
    if (!props || typeof props !== 'object') return res.status(400).json({ error: 'props inválidos' });
    const next = { ...existing, props: { ...existing.props, ...props }, updatedAt: new Date().toISOString() };
    saveComponent(next as any);
    scanComponents(listComponents());
    res.json(next);
});

componentsRouter.delete('/:id', (req, res) => {
    const ok = deleteComponent(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Not found' });
    scanComponents(listComponents());
    res.json({ ok: true });
});

componentsRouter.get('/__metrics/decomposition', (_req, res) => {
    res.json(getComponentDecompositionMetrics());
});
