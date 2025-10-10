# Coleta de URLs do Cloudinary (Admin API)

Este guia explica como coletar todas as URLs (image, video, raw) do Cloudinary via API Admin, salvar os resultados em arquivos e consolidar a lista para uso no projeto.

## Requisitos

- Node.js e npm instalados
- Variáveis de ambiente definidas (no seu `.env.local` ou exportadas no shell):
  - `VITE_CLOUDINARY_CLOUD_NAME` (ex.: dqljyf76t)
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
- Dependências do projeto instaladas: `npm install`

Observação: Para uso do widget no frontend, há também `VITE_CLOUDINARY_UPLOAD_PRESET` (unsigned preset), mas para a coleta via Admin API não é necessário.

## Scripts disponíveis

- `npm run cloudinary:all` — Executa `scripts/get-all-cloudinary-urls.js` (coleta com paginação até o fim)
- `npm run cloudinary:today` — Exemplo/diagnóstico: busca uploads do dia (requer API)
- `npm run cloudinary:analyze` — Fallback local: varre o código e extrai URLs que já estão referenciadas no repo (não usa API)

## Parâmetros suportados

O coletor aceita flags opcionais:

- `--type image|video|raw` — Tipo de recurso a coletar (padrão: `image`)
- `--prefix <pasta>` — Filtra por prefix de `public_id`/pasta
- `--max <n>` — Limita o total de itens coletados (0 = sem limite)

Exemplos:

- `npm run cloudinary:all -- --type image`  
- `npm run cloudinary:all -- --type video`  
- `npm run cloudinary:all -- --type raw`  
- `npm run cloudinary:all -- --type image --prefix quiz-assets/`  
- `npm run cloudinary:all -- --type image --max 500`  

## Saída gerada

A cada execução, o coletor salva dois arquivos (sobrescrevendo os anteriores):

- `scripts/cloudinary-urls-list.txt` — Lista de URLs (uma por linha)
- `scripts/cloudinary-all-resources.json` — JSON completo com metadados (public_id, formato, dimensões, bytes, created_at, secure_url, etc.)

Para manter históricos separados por tipo, salve cópias com sufixo após cada execução:

- Imagens:
  - `scripts/cloudinary-urls-image.txt`
  - `scripts/cloudinary-all-resources-image.json`
- Vídeos:
  - `scripts/cloudinary-urls-video.txt`
  - `scripts/cloudinary-all-resources-video.json`
- Raw:
  - `scripts/cloudinary-urls-raw.txt`
  - `scripts/cloudinary-all-resources-raw.json`

Consolidação de todas as URLs (sem duplicatas):

```bash
cat scripts/cloudinary-urls-image.txt \
    scripts/cloudinary-urls-video.txt \
    scripts/cloudinary-urls-raw.txt \
  2>/dev/null | sort -u > scripts/cloudinary-urls-all.txt
```

## Execução típica (passo a passo)

1. Defina suas credenciais (exemplo usando export no shell):

```bash
export VITE_CLOUDINARY_CLOUD_NAME=dqljyf76t
export CLOUDINARY_API_KEY=SEU_API_KEY
export CLOUDINARY_API_SECRET=SEU_API_SECRET
```

2. Rode a coleta por tipo e guarde cópias específicas:

```bash
# Imagens
npm run cloudinary:all -- --type image
cp scripts/cloudinary-urls-list.txt scripts/cloudinary-urls-image.txt
cp scripts/cloudinary-all-resources.json scripts/cloudinary-all-resources-image.json

# Vídeos
npm run cloudinary:all -- --type video
cp scripts/cloudinary-urls-list.txt scripts/cloudinary-urls-video.txt
cp scripts/cloudinary-all-resources.json scripts/cloudinary-all-resources-video.json

# Raw
npm run cloudinary:all -- --type raw
cp scripts/cloudinary-urls-list.txt scripts/cloudinary-urls-raw.txt
cp scripts/cloudinary-all-resources.json scripts/cloudinary-all-resources-raw.json
```

3. Consolide tudo em um único arquivo:

```bash
cat scripts/cloudinary-urls-image.txt \
    scripts/cloudinary-urls-video.txt \
    scripts/cloudinary-urls-raw.txt \
  2>/dev/null | sort -u > scripts/cloudinary-urls-all.txt
```

## Detalhes técnicos

- O coletor usa a API Admin do Cloudinary com autenticação Basic (Authorization header).  
- Endpoint base: `https://api.cloudinary.com/v1_1/${VITE_CLOUDINARY_CLOUD_NAME}/resources/{type}`
- Paginação: coleta páginas sucessivas usando `next_cursor` até esgotar os recursos ou até atingir `--max`.
- Bibliotecas: `node-fetch` para HTTP, `dotenv` para variáveis de ambiente.

## Troubleshooting

- Erro de "embedded credentials" na URL:
  - Já corrigido no script usando `Authorization: Basic` (sem credenciais na URL).
- HTTP 401/403:
  - Verifique `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` e `VITE_CLOUDINARY_CLOUD_NAME`.
  - Confirme que sua conta/role tem acesso à API Admin.
- Resultados vazios para `raw` ou `video`:
  - Pode ser normal se não houver recursos desses tipos no cloud.
- Sem credenciais, mas quer apenas um inventário do que o código usa:
  - Rode `npm run cloudinary:analyze` para gerar `scripts/cloudinary-analysis-report.json` a partir das URLs presentes no repo.

## Segurança

- Não comite suas credenciais no repositório. Prefira `.env.local` (gitignored) ou variáveis em ambiente/CI.
- Restrinja o acesso ao arquivo `scripts/cloudinary-all-resources.json` se ele contiver metadados sensíveis.

---

Última atualização: 2025-10-09
