import { Router } from 'express';
import { toTemplateDraft, applyDraftDelta, safeToTemplateDraft } from './adapter';
import { getAdapterMetrics } from './metrics';

export const quizStyleRouter = Router();

// GET /api/quiz-style/:slug/as-draft
quizStyleRouter.get('/:slug/as-draft', async (req, res) => {
  // feature flag simples
  if (process.env.USE_QUIZ_STYLE_ADAPTER === 'false') {
    return res.status(404).json({ error: 'Adapter disabled' });
  }
  const { slug } = req.params;
  try {
    if (process.env.LEGACY_ADAPTER_FALLBACK === 'true') {
      const result = await safeToTemplateDraft({ slug, name: 'Quiz Estilo Legacy' });
      if (result.fallback) {
        return res.status(200).json({ fallback: true, ...result.fallback });
      }
      return res.json(result.draft);
    } else {
      const draft = await toTemplateDraft({ slug, name: 'Quiz Estilo Legacy' });
      res.json(draft);
    }
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default quizStyleRouter;

// POST /api/quiz-style/:slug/apply-delta  (fase inicial: no-op)
quizStyleRouter.post('/:slug/apply-delta', async (req, res) => {
  if (process.env.USE_QUIZ_STYLE_ADAPTER === 'false') {
    return res.status(404).json({ error: 'Adapter disabled' });
  }
  const { slug } = req.params;
  try {
    const result = await applyDraftDelta(slug, req.body || {});
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/quiz-style/_metrics
quizStyleRouter.get('/_internal/metrics', (req, res) => {
  if (process.env.USE_QUIZ_STYLE_ADAPTER === 'false') {
    return res.status(404).json({ error: 'Adapter disabled' });
  }
  try {
    res.json(getAdapterMetrics());
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});
