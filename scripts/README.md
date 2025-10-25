# Scripts e Arquivamento

Este diretório concentra utilitários, verificadores e automações do projeto. Para reduzir ruído e evitar execuções acidentais, scripts pontuais/antigos foram movidos para `scripts/archive/` durante a limpeza.

## Estrutura

- `scripts/` — scripts ativos e mantidos
- `scripts/archive/` — scripts temporários, diagnósticos antigos, migrações já aplicadas, smoke-tests pontuais

## O que foi movido para `archive/`

Padrões arquivados (exemplos; confira o conteúdo do diretório para a lista completa):

- `analise-*.{sh,js,mjs,cjs}`
- `debug-*.{sh,js,mjs}`
- `teste-*.{sh,js,mjs}` e `test-*.{sh,js,mjs}` (ad-hoc)
- `verificar-*.{sh,js,mjs}` e `diagnostico-*.{sh,js,mjs}`
- Migrações já executadas: `implementar-fase*.sh`, `migrate-*.{sh,js,mjs}`, `fix-*.sh`, `apply-*.sh`
- Smoke-tests pontuais: `smoke-*.mjs`

- **`.sh`** - Shell scripts (necessitam chmod +x)

## Como executar scripts arquivados

1) Entrar no diretório:

```bash
cd scripts/archive
```

2) Executar shell scripts (garanta permissão de execução):

```bash
chmod +x ./meu-script.sh
./meu-script.sh
```

3) Executar arquivos Node (mjs/js):

```bash
node ./meu-script.mjs
```

Observação: scripts arquivados não têm garantia de compatibilidade com o estado atual do código.

## Boas práticas

- Adicionar novos utilitários em `scripts/` com nomes claros e documentação de uso.
- Ao concluir migrações/diagnósticos, mover para `scripts/archive/` se não houver reaproveitamento imediato.
- Evitar scripts que dependam de caminhos temporários ou arquivos removidos.

## Atualizações recentes

- `package.json` atualizado para usar `vitest.config.ts` e `playwright.config.ts` nos scripts de teste (configs antigas removidas).
- Scripts ad-hoc e migrações one-off foram arquivados em `scripts/archive/`.

## ✅ Checklist manual pendente (manter saudável)

- Revisar assets legados antes de remover definitivamente:
	- `attachment_assets/` (confirme se há referências em runtime/temas)
	- `data/` (verificar se contém fixtures ainda usados em testes)
	- `user-uploads:/` (apenas se existir no repo; preferir armazenamento externo)
- Verificar `netlify.toml` (se presente):
	- Redirects e headers atualizados (CSP, cache)
	- Porta: em desenvolvimento mantemos Vite em 5173 com redirecionamento opcional 8080 → 5173 via scripts `dev:redirect-8080`/`dev:stack`.
- Reexecutar validações rápidas após alterações:
	- `npm run -s type-check` (tsc sem testes)
	- `npm run -s test:fast` (subconjunto rápido de testes)
	- `npm run -s build:dev` (garantir bundle OK)

Observação: a porta 8080 é atendida por um redirecionador opcional em dev; manter Vite em 5173 evita conflito com backend local (3001) e simplifica HMR.

Se algum script arquivado precisar voltar ao fluxo ativo, mova-o para `scripts/` e valide seu funcionamento.

## 🔧 Dependências

Alguns scripts podem precisar de:

- Node.js
- npm packages específicos
- Permissões de execução para .sh

## 📝 Logs

Os scripts geram logs em:

- Console durante execução
- Arquivos temporários (quando aplicável)
- Relatórios em `/docs/reports/`
