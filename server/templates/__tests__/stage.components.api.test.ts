import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express from 'express';
import bodyParser from 'body-parser';
import { templatesRouter } from '../controller';

function createServer() {
    const app = express();
    app.use(bodyParser.json());
    app.use('/api/templates', templatesRouter);
    return app;
}

let server: any;
let baseUrl: string;

async function json(method: string, path: string, body?: any) {
    const res = await fetch(baseUrl + path, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined
    });
    return { status: res.status, json: await res.json() };
}

describe('Stage Components API', () => {
    beforeAll(async () => {
        const app = createServer();
        server = app.listen(0);
        const addr = server.address();
        const port = typeof addr === 'string' ? 80 : addr.port;
        baseUrl = `http://127.0.0.1:${port}`;
    });

    afterAll(async () => {
        server?.close();
    });

    it('should add, reorder and remove components inside a stage', async () => {
        // create template
        const tpl = await json('POST', '/api/templates', { name: 'StageComp', slug: 'stage-comp' });
        expect(tpl.status).toBe(201);
        const templateId = tpl.json.id;

        // fetch draft
        const draftRes = await json('GET', `/api/templates/${templateId}`);
        expect(draftRes.status).toBe(200);
        const questionStage = draftRes.json.stages.find((s: any) => s.type === 'question');
        expect(questionStage).toBeTruthy();

        // add new component (creation)
        const add1 = await json('POST', `/api/templates/${templateId}/stages/${questionStage.id}/components`, { component: { type: 'Header', props: { text: 'Hello' } } });
        expect(add1.status).toBe(201);
        expect(add1.json.component.id).toBeDefined();
        const compA = add1.json.component.id;

        // add second component at position 0 (should shift previous)
        const add2 = await json('POST', `/api/templates/${templateId}/stages/${questionStage.id}/components`, { component: { type: 'Navigation', props: {} }, position: 0 });
        expect(add2.status).toBe(201);
        const orderAfterAdd2 = add2.json.componentIds;
        expect(orderAfterAdd2[0]).not.toBe(compA);
        const compB = add2.json.component.id;

        // reorder explicitly (swap back)
        const reorder = await json('POST', `/api/templates/${templateId}/stages/${questionStage.id}/components/reorder`, { orderedIds: [compA, compB] });
        expect(reorder.status).toBe(200);
        expect(reorder.json.componentIds).toEqual([compA, compB]);

        // remove first component
        const rem = await json('DELETE', `/api/templates/${templateId}/stages/${questionStage.id}/components/${compA}`);
        expect(rem.status).toBe(200);
        expect(rem.json.removed).toBe(compA);
        expect(rem.json.deleted).toBe(true); // no other references

        // attempt reorder with missing id should fail
        const badReorder = await json('POST', `/api/templates/${templateId}/stages/${questionStage.id}/components/reorder`, { orderedIds: [compA] });
        expect(badReorder.status).toBe(400);
    });

    it('should not allow duplicate insertion of existing component', async () => {
        const tpl = await json('POST', '/api/templates', { name: 'DupTest', slug: 'dup-test' });
        const templateId = tpl.json.id;
        const draft = await json('GET', `/api/templates/${templateId}`);
        const qStage = draft.json.stages.find((s: any) => s.type === 'question');
        const add = await json('POST', `/api/templates/${templateId}/stages/${qStage.id}/components`, { component: { type: 'Header', props: {} } });
        const compId = add.json.component.id;
        // attach existing
        const attach = await json('POST', `/api/templates/${templateId}/stages/${qStage.id}/components`, { componentId: compId });
        expect(attach.status).toBe(400); // already present
    });
});
