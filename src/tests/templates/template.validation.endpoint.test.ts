// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express from 'express';
import { templatesRouter } from '@/../server/templates/controller';
import { templateService } from '@/../server/templates/service';
import { AddressInfo } from 'net';

// Testa GET /api/templates/:id/validation

describe('template validation endpoint', () => {
    let baseUrl: string; let server: any; let templateId: string;
    beforeAll(() => {
        const agg = templateService.createBase('Teste Validação', 'teste-validacao');
        templateId = agg.draft.id;
        const app = express();
        app.use(express.json());
        app.use('/api/templates', templatesRouter);
        server = app.listen(0);
        const { port } = server.address() as AddressInfo;
        baseUrl = `http://127.0.0.1:${port}`;
    });
    afterAll(() => server && server.close());

    it('retorna relatório de validação', async () => {
        const res = await fetch(`${baseUrl}/api/templates/${templateId}/validation`);
        expect(res.status).toBe(200);
        const json = await res.json();
        expect(json).toHaveProperty('errors');
        expect(json).toHaveProperty('warnings');
        // Deve haver pelo menos 1 warning em draft base (ex: NO_RESULT_STAGE pode virar erro se não houver stage result)
        expect(Array.isArray(json.errors)).toBe(true);
        expect(Array.isArray(json.warnings)).toBe(true);
    });
});
