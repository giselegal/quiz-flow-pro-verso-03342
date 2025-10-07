import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());

// ==================================================================================
// In-memory Configuration Storage (server-side) - dev/default backend
// ==================================================================================
type StoredConfiguration = {
  componentId: string;
  funnelId?: string;
  properties: Record<string, any>;
  version: number;
  lastModified: string;
  metadata?: Record<string, any>;
};

const configStore = new Map<string, StoredConfiguration>();
const configKey = (componentId: string, funnelId?: string) => (funnelId ? `${componentId}:${funnelId}` : componentId);

// Servir arquivos estáticos do build com tipos MIME corretos
app.use(express.static(path.join(__dirname, '../dist'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
    if (filePath.endsWith('.js') || filePath.endsWith('.mjs')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
    if (filePath.endsWith('.json')) {
      res.setHeader('Content-Type', 'application/json');
    }
  }
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ==================================================================================
// Template Engine MVP Routes
// ==================================================================================
import { templateService } from './templates/service.js';

const tplRouter = express.Router();

// Create base template
tplRouter.post('/', (req, res) => {
  const { name = 'Novo Template', slug = `tpl-${Date.now()}`, sourceTemplateId } = req.body || {};
  try {
    const tpl = sourceTemplateId
      ? templateService.clone(sourceTemplateId, name, slug)
      : templateService.createBase(name, slug);
    res.status(201).json(tpl);
  } catch (e: any) {
    if (e.message === 'SOURCE_NOT_FOUND') return res.status(404).json({ error: 'SOURCE_NOT_FOUND' });
    console.error(e); res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
});

// Get template
tplRouter.get('/:id', (req, res) => {
  try {
    const tpl = templateService.get(req.params.id);
    res.json(tpl);
  } catch (e: any) {
    if (e.message === 'NOT_FOUND') return res.status(404).json({ error: 'NOT_FOUND' });
    res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
});

// Add stage
tplRouter.post('/:id/stages', (req, res) => {
  const { type = 'question' } = req.body || {};
  try {
    const tpl = templateService.addStage(req.params.id, type);
    res.status(201).json(tpl.stages[tpl.stages.length - 1]);
  } catch (e: any) {
    if (e.message === 'NOT_FOUND') return res.status(404).json({ error: 'NOT_FOUND' });
    res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
});

// Add component
tplRouter.post('/:id/stages/:stageId/components', (req, res) => {
  const { type = 'Heading', props = {} } = req.body || {};
  try {
    const tpl = templateService.addComponent(req.params.id, req.params.stageId, type, props);
    res.status(201).json({ component: tpl.components[Object.keys(tpl.components).slice(-1)[0]] });
  } catch (e: any) {
    if (e.message === 'NOT_FOUND') return res.status(404).json({ error: 'NOT_FOUND' });
    if (e.message === 'STAGE_NOT_FOUND') return res.status(404).json({ error: 'STAGE_NOT_FOUND' });
    res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
});

// Update scoring
tplRouter.patch('/:id/logic/scoring', (req, res) => {
  try {
    const scoring = templateService.updateScoring(req.params.id, req.body || {});
    res.json(scoring);
  } catch (e: any) {
    if (e.message === 'NOT_FOUND') return res.status(404).json({ error: 'NOT_FOUND' });
    res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
});

// Add outcome
tplRouter.post('/:id/outcomes', (req, res) => {
  const { min = 0, max, template = 'Resultado' } = req.body || {};
  try {
    const outcomes = templateService.addOutcome(req.params.id, { scoreMin: min, scoreMax: max, template });
    res.status(201).json({ outcomes });
  } catch (e: any) {
    if (e.message === 'NOT_FOUND') return res.status(404).json({ error: 'NOT_FOUND' });
    res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
});

// Validate template
tplRouter.post('/:id/validate', (req, res) => {
  try {
    const result = templateService.validate(req.params.id);
    const statusCode = result.status === 'ok' ? 200 : 422;
    res.status(statusCode).json(result);
  } catch (e: any) {
    if (e.message === 'NOT_FOUND') return res.status(404).json({ error: 'NOT_FOUND' });
    res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
});

app.use('/api/templates', tplRouter);

// ==================================================================================
// Configuration API endpoints
// ==================================================================================

// GET current configuration
app.get('/api/components/:componentId/configuration', (req, res) => {
  const { componentId } = req.params as { componentId: string };
  const funnelId = (req.query?.funnelId as string | undefined) || undefined;
  const key = configKey(componentId, funnelId);
  const stored = configStore.get(key);
  res.json(stored?.properties ?? {});
});

// PUT update configuration (replace/merge properties)
app.put('/api/components/:componentId/configuration', (req, res) => {
  const { componentId } = req.params as { componentId: string };
  const { properties = {}, funnelId } = req.body || {};
  const key = configKey(componentId, funnelId);
  const existing = configStore.get(key);
  const next: StoredConfiguration = {
    componentId,
    funnelId,
    properties: { ...(existing?.properties || {}), ...(properties || {}) },
    version: (existing?.version || 0) + 1,
    lastModified: new Date().toISOString(),
    metadata: { ...(existing?.metadata || {}), source: 'api' }
  };
  configStore.set(key, next);
  res.json({ ok: true });
});

// POST update single property
app.post('/api/components/:componentId/properties/:propertyKey', (req, res) => {
  const { componentId, propertyKey } = req.params as { componentId: string; propertyKey: string };
  const { value, funnelId } = req.body || {};
  const key = configKey(componentId, funnelId);
  const existing = configStore.get(key);
  const nextProps = { ...(existing?.properties || {}), [propertyKey]: value };
  const next: StoredConfiguration = {
    componentId,
    funnelId,
    properties: nextProps,
    version: (existing?.version || 0) + 1,
    lastModified: new Date().toISOString(),
    metadata: { ...(existing?.metadata || {}), source: 'api' }
  };
  configStore.set(key, next);
  res.json({ ok: true });
});

// GET stats
app.get('/api/configurations/stats', (_req, res) => {
  const componentBreakdown: Record<string, number> = {};
  let lastModified: string | null = null;
  for (const entry of configStore.values()) {
    componentBreakdown[entry.componentId] = (componentBreakdown[entry.componentId] || 0) + 1;
    if (!lastModified || entry.lastModified > lastModified) lastModified = entry.lastModified;
  }
  res.json({ totalConfigurations: configStore.size, componentBreakdown, lastModified });
});

// GET export
app.get('/api/configurations/export', (_req, res) => {
  const payload = Array.from(configStore.entries()).map(([key, cfg]) => ({ key, ...cfg }));
  res.json(payload);
});

// POST import
app.post('/api/configurations/import', (req, res) => {
  const items = Array.isArray(req.body) ? req.body : [];
  for (const item of items) {
    const key = item?.key || configKey(item?.componentId, item?.funnelId);
    if (key) configStore.set(key, {
      componentId: item.componentId,
      funnelId: item.funnelId,
      properties: item.properties || {},
      version: Number(item.version || 1),
      lastModified: item.lastModified || new Date().toISOString(),
      metadata: item.metadata || {}
    });
  }
  res.json({ imported: items.length });
});

// POST reset to defaults (server just deletes; client falls back to defaults)
app.post('/api/components/:componentId/reset', (req, res) => {
  const { componentId } = req.params as { componentId: string };
  const { funnelId } = req.body || {};
  const key = configKey(componentId, funnelId);
  configStore.delete(key);
  res.json({ ok: true });
});

// Quiz endpoints
app.get('/api/quizzes', (req, res) => {
  // Mock data - replace with actual database queries
  res.json([]);
});

app.post('/api/quizzes', (req, res) => {
  // Mock creation - replace with actual database operations
  res.json({ id: Date.now().toString(), ...req.body });
});

app.get('/api/quizzes/:id', (req, res) => {
  // Mock data - replace with actual database queries
  res.json({ id: req.params.id, title: 'Mock Quiz' });
});

// Generic error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// SPA Fallback - CRÍTICO: deve ser o último middleware
// Qualquer rota que não seja API serve o index.html
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../dist/index.html');
  console.log(`🔄 SPA Fallback: ${req.url} → index.html`);
  res.sendFile(indexPath);
});

const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on ${HOST}:${PORT}`);
  console.log(`📁 Serving static files from: ${path.join(__dirname, '../dist')}`);
  console.log(`🔄 SPA fallback configured for client-side routing`);
});
