# Flag do Layout Modular do Editor

Este projeto possui um layout modular (4 colunas) para o editor que pode ser ativado/desativado por uma feature flag simples via `localStorage`.

## Chave
- `editor:phase2:modular`
  - `"1"` → Ativado (usa layout modular)
  - `"0"` → Desativado (usa layout legado)

## Comportamento padrão
- DEV: habilitado por padrão se a chave não estiver definida.
- PROD: desabilitado por padrão se a chave não estiver definida.

## Como alternar

### Via DevTools (navegador)
```js
// Ativar
localStorage.setItem('editor:phase2:modular', '1');
location.reload();

// Desativar
localStorage.setItem('editor:phase2:modular', '0');
location.reload();
```

### Botão de toggle (apenas em DEV)
No topo direito do editor modular, há um botão "Modular: ON (desativar)" visível apenas em ambiente de desenvolvimento. Ele grava `editor:phase2:modular = "0"` e recarrega a página.

## Rota para teste
Acesse o editor com o template completo de 21 etapas:
```
/editor?template=quiz21StepsComplete
```

## Teste E2E de fumaça
Foi adicionado um teste básico com Playwright que garante que o layout modular renderiza e as quatro colunas estão presentes:
- Arquivo: `tests/e2e/editor-modular-smoke.spec.ts`
- Pré-condição: a flag é ativada via `localStorage` antes da navegação.

Para executar os testes E2E (com o redirect local ativo em 8080):
```bash
npm run dev:redirect-8080 &
npm run test:e2e
```

Dica: em outras sessões, você pode usar `npm run dev:stack` para subir servidor, app e redirect automaticamente.