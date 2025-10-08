// Mock simples de fetch para endpoints /api/templates durante testes que não sobem backend
const g: any = globalThis;

if (!g.__TEMPLATES_API_MOCK_INSTALLED__) {
  const originalFetch = g.fetch || (() => Promise.reject(new Error('fetch not available')));

  interface DraftTemplate {
    id: string;
    slug: string;
    stages: any[];
    components: Record<string, any>;
  }

  const db: { templates: DraftTemplate[] } = { templates: [] };

  function jsonResponse(body: any, init: ResponseInit = {}) {
    return new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' }, ...init });
  }

  g.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString();

    if (url.startsWith('/api/templates')) {
      const method = (init?.method || 'GET').toUpperCase();
      const parts = url.split('/').filter(Boolean); // ['api','templates',':id','components',':cid']

      // POST /api/templates -> cria template base
      if (method === 'POST' && parts.length === 2) {
        const id = 'tpl_' + Date.now();
        const tpl: DraftTemplate = { id, slug: id, stages: [], components: {} };
        db.templates.push(tpl);
        return jsonResponse({ draft: { id: tpl.id, slug: tpl.slug, stages: [], components: {} } });
      }

      // /api/templates/:id
      if (parts.length >= 3) {
        const templateId = parts[2];
        const tpl = db.templates.find(t => t.id === templateId);
        if (!tpl) return jsonResponse({ error: 'not found' }, { status: 404 });

        // GET /api/templates/:id/components
        if (parts.length === 4 && parts[3] === 'components' && method === 'GET') {
          return jsonResponse({ items: Object.values(tpl.components) });
        }

        // POST /api/templates/:id/components
        if (parts.length === 4 && parts[3] === 'components' && method === 'POST') {
          const body = init?.body ? JSON.parse(init.body as string) : {};
            const id = 'cmp_' + Date.now();
            const comp = { id, type: body.type || 'generic', props: body.props || {} };
            tpl.components[id] = comp;
            return jsonResponse(comp, { status: 201 });
        }

        // PATCH /api/templates/:id/components/:cid
        if (parts.length === 5 && parts[3] === 'components' && method === 'PATCH') {
          const cid = parts[4];
          const comp = tpl.components[cid];
          if (!comp) return jsonResponse({ error: 'component not found' }, { status: 404 });
          const body = init?.body ? JSON.parse(init.body as string) : {};
          Object.assign(comp.props, body.props || {});
          return jsonResponse(comp);
        }

        // DELETE /api/templates/:id/components/:cid
        if (parts.length === 5 && parts[3] === 'components' && method === 'DELETE') {
          const cid = parts[4];
          delete tpl.components[cid];
          return new Response(null, { status: 204 });
        }

        // GET /api/templates/:id/validate
        if (parts.length === 4 && parts[3] === 'validate' && method === 'GET') {
          return jsonResponse({ valid: true, issues: [] });
        }
      }
      return jsonResponse({ unsupported: true }, { status: 400 });
    }

    return originalFetch(input as any, init);
  };

  g.__TEMPLATES_API_MOCK_INSTALLED__ = true;
}
