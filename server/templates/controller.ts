
import { Router } from 'express';
import { templateService } from './service';

export const templatesRouter = Router();

// List drafts (lightweight)
templatesRouter.get('/', (_req, res) => {
    const drafts = templateService.listDrafts().map(d => ({ id: d.id, slug: d.meta.slug, name: d.meta.name, updatedAt: d.updatedAt, draftVersion: d.draftVersion }));
    res.json(drafts);
});

// Create base template
templatesRouter.post('/', (req, res) => {
    const { name, slug } = req.body || {};
    if (!name || !slug) return res.status(400).json({ error: 'name and slug required' });
    const agg = templateService.createBase(name, slug);
    res.status(201).json({ id: agg.draft.id, slug: agg.draft.meta.slug });
});

// Get draft full
templatesRouter.get('/:id', (req, res) => {
    const draft = templateService.getDraft(req.params.id);
    if (!draft) return res.status(404).json({ error: 'Not found' });
    res.json(draft);
});

// Update meta
templatesRouter.patch('/:id/meta', (req, res) => {
    try {
        const meta = templateService.updateMeta(req.params.id, req.body || {});
        res.json(meta);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
});

// Add stage
templatesRouter.post('/:id/stages', (req, res) => {
    try {
        const stage = templateService.addStage(req.params.id, req.body || {});
        res.status(201).json(stage);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
});

// Reorder stages
templatesRouter.post('/:id/stages/reorder', (req, res) => {
    try {
        const { orderedIds } = req.body || {};
        const stages = templateService.reorderStages(req.params.id, orderedIds || []);
        res.json(stages);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
});

// Update single stage
templatesRouter.patch('/:id/stages/:stageId', (req, res) => {
    try {
        const st = templateService.updateStage(req.params.id, req.params.stageId, req.body || {});
        res.json(st);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
});

// Remove stage
templatesRouter.delete('/:id/stages/:stageId', (req, res) => {
    try {
        templateService.removeStage(req.params.id, req.params.stageId);
        res.json({ ok: true });
    } catch (e: any) { res.status(400).json({ error: e.message }); }
});

// --- Stage components operations ---
// Add (create or attach) component to stage
templatesRouter.post('/:id/stages/:stageId/components', (req, res) => {
    try {
        const result = templateService.addComponentToStage(req.params.id, req.params.stageId, req.body || {});
        res.status(201).json(result);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
});

// Reorder components inside stage
templatesRouter.post('/:id/stages/:stageId/components/reorder', (req, res) => {
    try {
        const { orderedIds } = req.body || {};
        const result = templateService.reorderStageComponents(req.params.id, req.params.stageId, orderedIds || []);
        res.json(result);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
});

// Remove component from stage
templatesRouter.delete('/:id/stages/:stageId/components/:componentId', (req, res) => {
    try {
        const result = templateService.removeComponentFromStage(req.params.id, req.params.stageId, req.params.componentId);
        res.json(result);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
});

// Set outcomes
templatesRouter.put('/:id/outcomes', (req, res) => {
    try {
        const outcomes = templateService.setOutcomes(req.params.id, req.body?.outcomes || []);
        res.json(outcomes);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
});

// Set scoring
templatesRouter.patch('/:id/scoring', (req, res) => {
    try {
        const scoring = templateService.setScoring(req.params.id, req.body || {});
        res.json(scoring);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
});

// Set branching
templatesRouter.put('/:id/branching', (req, res) => {
    try {
        const rules = templateService.setBranching(req.params.id, req.body?.rules || []);
        res.json(rules);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
});

// Validate draft
templatesRouter.post('/:id/validate', (req, res) => {
    try {
        const report = templateService.validateDraft(req.params.id);
        res.json(report);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
});

// Read-only validation report (idempotente)
templatesRouter.get('/:id/validation', (req, res) => {
    try {
        const report = templateService.validateDraft(req.params.id);
        res.json(report);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
});

// Publish
templatesRouter.post('/:id/publish', (req, res) => {
    try {
        const snap = templateService.publish(req.params.id);
        res.json({ id: snap.id, version: snap.version, publishedAt: snap.publishedAt });
    } catch (e: any) { res.status(400).json({ error: e.message }); }
});

// Runtime preview (draft)
templatesRouter.post('/:id/runtime/preview/start', (req, res) => {
    try {
        const start = templateService.startRuntimeDraft(req.params.id);
        res.json(start);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
});

// Runtime preview answer (draft)
templatesRouter.post('/:id/runtime/preview/answer', (req, res) => {
    try {
        const { sessionId, stageId, optionIds } = req.body || {};
        if (!sessionId || !stageId) return res.status(400).json({ error: 'sessionId and stageId required' });
        const result = templateService.answerRuntimeDraft(req.params.id, sessionId, stageId, optionIds || []);
        res.json(result);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
});

export default templatesRouter;
