# Persistência SQLite do Template Engine

## 1. Ativando

Defina a variável de ambiente:

```
PERSIST_TEMPLATES=sqlite
```

Ao subir o servidor (`npm run dev:server` ou build), o log mostrará:
```
[templates] driver = sqlite
```

## 2. Estrutura

Arquivo: `server/persistence/sqlite/templates.db`
Tabela: `templates`

Campos:
- id (PRIMARY KEY)
- slug (UNIQUE)
- draft_json (payload completo do draft)
- published_json (snapshot publicado opcional)
- created_at / updated_at

## 3. Seed Opcional

Executar:
```
node server/templates/sqlite.seed.ts
```
Cria um draft base com slug `tpl-sqlite-seed`.

## 4. Migração do In-memory

In-memory → SQLite: basta definir a flag e recriar/seedar. Não há transferência automática entre modos (planejado: export/import futuro).

## 5. Rotina de Round-trip Test (Manual)

1. `PERSIST_TEMPLATES=sqlite`
2. Criar template via POST `/api/templates` (UI ou script)
3. Adicionar stage, componentes
4. Reiniciar servidor
5. GET `/api/templates/:id` → deve retornar o mesmo draftVersion/estrutura.

## 6. Próximos Passos (Planejados)

- Endpoint `/templates/:id/export` para backup
- Compactação parcial (futuro se tamanho crescer)
- Integração com op-log local-first (IndexedDB) para sync offline

## 7. Troubleshooting

| Sintoma | Causa provável | Ação |
|---------|----------------|------|
| `[templates] driver = memory` | Flag não aplicada no ambiente do servidor | Confirmar export ou .env carregado antes do start |
| Erro UNIQUE slug | Reaproveitando slug já existente | Usar novo slug ou remover registro manualmente |
| DB não cria | Permissão de escrita no diretório | Garantir permissões / path válido |

## 8. Segurança

SQLite é local ao processo. Para produção multi-instância considerar Postgres/Drizzle + migrações.
