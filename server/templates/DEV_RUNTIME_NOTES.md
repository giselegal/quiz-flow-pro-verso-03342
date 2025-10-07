# Execução do Template Engine em Desenvolvimento

Para evitar erros de resposta HTML (fallback SPA) ao consumir `/api/templates`, garanta que o backend Express (porta 3001) esteja ativo enquanto o Vite (porta 8080) serve o frontend.

## Opções

### 1. Rodar tudo com um comando

```
npm run dev:full
```
Inicia em paralelo:
- `vite` (frontend em http://localhost:8080)
- `server/index.ts` (backend em http://localhost:3001)

### 2. Rodar em dois terminais

Terminal A:
```
npm run dev:server
```
Terminal B:
```
npm run dev
```

### 3. Rodar backend em background (Linux/macOS)
```
npm run dev:server &>/tmp/backend.log &
```
Verificar porta:
```
ss -ltnp | grep 3001
```

## Testes rápidos
```
curl -s http://localhost:3001/health
curl -s http://localhost:3001/api/templates
curl -s http://localhost:8080/api/templates  # via proxy
```

## Sintoma de backend ausente
Erro no console:
```
Unexpected non-JSON response (possible SPA fallback or proxy issue)
```
Ou erro de parse `Unexpected token '<'` antes da melhoria do client.

## Como o client agora reage
O cliente HTTP (`src/api/templates/client.ts`) valida `Content-Type` e inclui o snippet inicial do body para diagnosticar fallback.

## Próximos passos sugeridos
- Adicionar health check automático antes da primeira mutação.
- Exibir banner visual se backend offline.
