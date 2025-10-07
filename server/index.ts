import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import path, { dirname } from 'path';
import { templatesRouter } from './templates/controller';
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

// Templates (novo Template Engine)
app.use('/api/templates', templatesRouter);

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
