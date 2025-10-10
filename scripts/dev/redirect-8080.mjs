#!/usr/bin/env node
import http from 'node:http';

const LEGACY_PORT = Number(process.env.LEGACY_PORT || 8080);
const TARGET_HOST = process.env.TARGET_HOST || 'localhost';
const TARGET_PORT = Number(process.env.TARGET_PORT || 5173);

const server = http.createServer((req, res) => {
    const target = `http://${TARGET_HOST}:${TARGET_PORT}${req.url || '/'}`;
    // Redireciona mantendo path e query; usa 307 para preservar método
    res.statusCode = 307;
    res.setHeader('Location', target);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end(`➡️ Redirecionando para ${target}\n`);
});

server.listen(LEGACY_PORT, '0.0.0.0', () => {
    console.log(`🔁 Redirect 8080 -> ${TARGET_PORT} ativo em http://localhost:${LEGACY_PORT}`);
});

process.on('SIGINT', () => server.close(() => process.exit(0)));
process.on('SIGTERM', () => server.close(() => process.exit(0)));
