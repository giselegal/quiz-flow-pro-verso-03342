import { Router } from 'express';
import { toTemplateDraft } from './adapter';

export const quizStyleRouter = Router();

// GET /api/quiz-style/:slug/as-draft
quizStyleRouter.get('/:slug/as-draft', async (req, res) => {
  // feature flag simples
  if (process.env.USE_QUIZ_STYLE_ADAPTER === 'false') {
    return res.status(404).json({ error: 'Adapter disabled' });
  }
  const { slug } = req.params;
  try {
    const draft = await toTemplateDraft({ slug, name: 'Quiz Estilo Legacy' });
    res.json(draft);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default quizStyleRouter;
