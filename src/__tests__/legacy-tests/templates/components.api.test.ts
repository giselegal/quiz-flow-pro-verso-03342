// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express from 'express';
import { AddressInfo } from 'net';
import { componentsRouter } from '@/../server/templates/components.controller';

// Usa servidor real efêmero e fetch global
describe('components API', () => {
    let baseUrl: string;
    let server: any;
    beforeAll(async () => {
        const app = express();
        app.use(express.json());
        app.use('/api/components', componentsRouter);
        server = await new Promise(resolve => {
            const s = app.listen(0, () => resolve(s));
        });
        const { port } = server.address() as AddressInfo;
        baseUrl = `http://127.0.0.1:${port}`;
    });
    afterAll(async () => {
        if (server) await new Promise(r => server.close(r));
    });

    async function json(method: string, path: string, body?: any) {
        const res = await fetch(baseUrl + path, { method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
        const data = await res.json().catch(() => null);
        return { status: res.status, json: data };
    }

    it('cria, lista e recupera', async () => {
        const create = await json('POST', '/api/components', { kind: 'Header', props: { title: 'A' } });
        expect(create.status).toBe(201);
        const list = await json('GET', '/api/components');
        expect(list.json.count).toBeGreaterThanOrEqual(1);
        const firstId = list.json.items[0].id;
        const get = await json('GET', `/api/components/${firstId}`);
        expect(get.json.id).toBe(firstId);
    });

    it('patch atualiza props', async () => {
        const created = await json('POST', '/api/components', { kind: 'Navigation', props: { showNext: true, showPrevious: false, nextButtonText: 'Avançar' } });
        const id = created.json.id;
        const patched = await json('PATCH', `/api/components/${id}`, { props: { nextButtonText: 'Ir' } });
        expect(patched.json.props.nextButtonText).toBe('Ir');
    });

    it('delete remove componente', async () => {
        const created = await json('POST', '/api/components', { kind: 'Transition', props: { message: 'Hi' } });
        const id = created.json.id;
        const del = await json('DELETE', `/api/components/${id}`);
        expect(del.json.ok).toBe(true);
        const get = await json('GET', `/api/components/${id}`);
        expect(get.status).toBe(404);
    });
});
