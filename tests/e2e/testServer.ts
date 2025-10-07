// Inicializa o servidor Express para testes E2E Playwright sem depender de processo externo
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import templatesRouter from '../../server/templates/controller';
import quizStyleRouter from '../../server/quiz-style/controller';

export async function startTestServer(port = 3101) {
    process.env.USE_QUIZ_STYLE_ADAPTER = process.env.USE_QUIZ_STYLE_ADAPTER ?? 'true';
    const app = express();
    app.use(cors());
    app.use(bodyParser.json({ limit: '2mb' }));
    app.use('/api/templates', templatesRouter);
    if (process.env.USE_QUIZ_STYLE_ADAPTER !== 'false') {
        app.use('/api/quiz-style', quizStyleRouter);
    }
    app.get('/health', (req, res) => res.json({ ok: true }));
    // Fallback simples
    app.get('*', (req, res) => {
        res.status(200).send('<html><body><div id="root">test server</div></body></html>');
    });
    const server = http.createServer(app);
    await new Promise<void>(resolve => server.listen(port, '127.0.0.1', () => resolve()));
    return { server, url: `http://127.0.0.1:${port}` };
}

export async function stopTestServer(server: http.Server) {
    await new Promise<void>((resolve, reject) => server.close(err => err ? reject(err) : resolve()));
}
