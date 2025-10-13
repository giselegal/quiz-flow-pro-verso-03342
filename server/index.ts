import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
// imports auxiliares removidos; usaremos dynamic import para 'archiver' dentro do handler
import path, { dirname } from 'path';
import { templatesRouter } from './templates/controller';
import { seedTemplates } from './templates/seed';
import { componentsRouter } from './templates/components.controller';
import { quizStyleRouter } from './quiz-style/controller';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);

app.use(cors());
// Aumentar limite para payloads de funis maiores
app.use(express.json({ limit: '4mb' }));

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
// Alias via namespace /api para facilitar verificação pelo frontend (proxy já cobre /api)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), alias: true });
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
// Components CRUD (in-memory por enquanto)
app.use('/api/components', componentsRouter);
// Legacy quiz-style adapter (read-only draft view) controlado por flag USE_QUIZ_STYLE_ADAPTER (default: on)
if (process.env.USE_QUIZ_STYLE_ADAPTER !== 'false') {
  app.use('/api/quiz-style', quizStyleRouter);
  console.log('[quiz-style-adapter] endpoint /api/quiz-style/:slug/as-draft habilitado');
} else {
  console.log('[quiz-style-adapter] desabilitado por USE_QUIZ_STYLE_ADAPTER=false');
}

// Seed inicial (executa apenas se não houver templates)
seedTemplates();

// Generic error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// ==================================================================================
// Packaging endpoint: gera um .zip com manifest.json e snapshot HTML básico
// ==================================================================================
app.post('/api/package-funnel', async (req, res) => {
  try {
    // Validação leve com Zod
    const { z } = await import('zod');
    const StepSchema = z.object({
      id: z.string().min(1),
      order: z.number().int().positive().optional(),
      type: z.string().optional(),
      blocks: z.array(z.any()).optional(),
      nextStep: z.string().optional(),
    }).passthrough();
    const FunnelSchema = z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      steps: z.array(StepSchema),
      runtime: z.any().optional(),
      results: z.any().optional(),
      ui: z.any().optional(),
      settings: z.any().optional(),
    });

    const { default: archiver } = await import('archiver');
    const parsed = FunnelSchema.safeParse(req.body || {});
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Payload inválido',
        details: parsed.error.flatten(),
      });
    }
    const { id = `draft-${Date.now()}`, name = 'Funnel', steps = [], runtime, results, ui, settings } = parsed.data;
    const manifest = {
      id,
      name,
      createdAt: new Date().toISOString(),
      stepsCount: Array.isArray(steps) ? steps.length : 0,
      runtime,
      results,
      ui,
      settings,
    };

    // Snapshot HTML simples com container para renderização futura
    const snapshotHtml = `<!doctype html>
<html lang="pt-br">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${name} - Snapshot</title>
  </head>
  <body>
    <div id="app">
      <h1>${name}</h1>
      <p>Snapshot gerado em ${new Date().toISOString()}</p>
      <pre id="steps" style="white-space: pre-wrap; font-family: monospace; font-size: 12px;">${JSON.stringify(steps, null, 2)}</pre>
    </div>
  </body>
</html>`;

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${id}-package.zip"`);

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.on('error', (err: unknown) => { throw err; });
    archive.pipe(res);

    archive.append(JSON.stringify(manifest, null, 2), { name: 'manifest.json' });
    archive.append(snapshotHtml, { name: 'snapshot.html' });

    // Incluir um README com instruções mínimas
    archive.append(`# Pacote de Funil: ${name}

Este pacote contém:
- manifest.json: metadados e configurações
- snapshot.html: pré-visualização estática do funil

Como usar:
- Importe os arquivos no seu ambiente de publicação ou abra snapshot.html para uma visualização estática.
`, { name: 'README.md' });

    await archive.finalize();
  } catch (e: any) {
    console.error('Erro ao empacotar funil:', e);
    res.status(500).json({ error: String(e?.message || e) });
  }
});

// ==================================================================================
// WebSocket: Live preview broadcast por funnelId
// ==================================================================================
type WSClient = import('ws').WebSocket & { funnelId?: string };
const channels = new Map<string, Set<WSClient>>();

function broadcastToFunnel(funnelId: string, message: any) {
  const set = channels.get(funnelId);
  if (!set || set.size === 0) return;
  const payload = JSON.stringify(message);
  for (const ws of set) {
    try { ws.send(payload); } catch { /* ignore */ }
  }
}

const wss = new WebSocketServer({ server });
wss.on('connection', (ws: WSClient, req) => {
  try {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const funnelId = url.searchParams.get('funnelId') || 'production';
    ws.funnelId = funnelId;
    if (!channels.has(funnelId)) channels.set(funnelId, new Set());
    channels.get(funnelId)!.add(ws);
    ws.send(JSON.stringify({ type: 'welcome', funnelId }));

    ws.on('message', (data) => {
      try {
        const msg = JSON.parse(String(data));
        if (msg && msg.type === 'steps' && msg.steps) {
          broadcastToFunnel(funnelId, { type: 'steps', steps: msg.steps, ts: Date.now() });
        }
      } catch { /* ignore */ }
    });

    ws.on('close', () => {
      const set = channels.get(funnelId);
      if (set) {
        set.delete(ws);
        if (set.size === 0) channels.delete(funnelId);
      }
    });
  } catch {
    // conexão inválida
    ws.close();
  }
});

// Endpoint REST para broadcast (fallback quando não usar WS no cliente)
app.post('/api/live-update', (req, res) => {
  const { funnelId = 'production', steps } = req.body || {};
  if (!funnelId || !steps) {
    return res.status(400).json({ error: 'funnelId e steps são obrigatórios' });
  }
  broadcastToFunnel(funnelId, { type: 'steps', steps, ts: Date.now() });
  res.json({ ok: true, delivered: channels.get(funnelId)?.size || 0 });
});

// SPA Fallback - CRÍTICO: deve ser o último middleware
// Qualquer rota que NÃO seja API e NÃO pareça um asset serve o index.html
app.get('*', (req, res, next) => {
  const url = req.url || '';
  // Não interceptar APIs
  if (url.startsWith('/api')) return next();
  // Não interceptar arquivos estáticos ou com extensão (ex: .js, .css, .png)
  if (/\.[a-zA-Z0-9]{2,8}(\?.*)?$/.test(url)) return next();
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
