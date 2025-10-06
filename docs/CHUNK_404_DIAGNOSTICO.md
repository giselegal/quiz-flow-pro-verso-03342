# Diagnóstico 404 de Chunks (Carregamento Dinâmico)

## 1. Sintoma
Erros no console (preview Lovable):
```
Failed to load resource: the server responded with a status of 404 ()
.../assets/OfferStep-<hash>.js
.../assets/QuizEstiloPessoalPage-<hash>.js
.../assets/UnifiedCRUDService-<hash>.js
```
Cada hash não corresponde aos gerados no build atual local.

## 2. Causa Raiz Provável
| Categoria | Descrição | Evidência |
|-----------|----------|-----------|
| HTML desatualizado | Index antigo referenciando hashes antigos | Build local gera nomes diferentes (ex: OfferStep-HXmOrgej.js) |
| Cache agressivo (SW/CDN) | Clients servidos com index antigo mesmo após novo deploy | Index atual remove SW e limpa caches, mas ambiente preview pode ter outra camada |
| Deploy parcial | Assets novos não totalmente propagados antes de index ser servido | 404 apenas em alguns chunks, não todos |
| Reload tardio | Usuário mantém aba aberta e recebe nova versão parcial | Falta mecanismo de version check antes desta entrega |

## 3. Mitigações Implementadas
1. `index.html`:
   - Script de recuperação (`ChunkRecovery`): intercepta `error` em `<script>` dinâmico e tenta até 2 recarregamentos com query `_r=<timestamp>`.
2. `public/build-meta.json` + `checkBuildVersion.ts`:
   - Verificação periódica (3 min) de nova versão → reload automático.
3. Unificação de componentes duplicados reduz variação não determinística no grafo (menos risco de reordenação de chunks).
4. Remoção/limpeza de Service Workers existentes (já presente no index principal).

## 4. Plano Recomendado (Completo)
| Prioridade | Ação | Status | Observação |
|------------|------|--------|-----------|
| Alta | Headers corretos: `Cache-Control: no-cache` para `index.html` | Pendente | Ajustar infra (Nginx/Vercel) |
| Média | `build-meta.json` incluir commit real via CI | Pendente | Substituir placeholders `${COMMIT_HASH}` |
| Média | Monitorar métrica de tentativas de recovery | Pendente | Enviar evento analytics `chunk_recovery_attempt` |
| Baixa | Prefetch dos 2 primeiros steps pós-intro | Pendente | `<link rel="prefetch" href="/assets/QuestionStep-*.js">` |
| Baixa | Bundle Analyzer (confirmar estabilidade) | Pendente | `vite-bundle-visualizer` opcional |

## 5. Possíveis Melhorias Futuras
- Introduzir `import.meta.env.VITE_APP_BUILD_ID` injetado em tempo de build para log consistente.
- Usar SRI (Subresource Integrity) + fallback caso integridade falhe.
- Implementar módulo de *graceful degradation*: se chunk crítico falhar 2x → exibir mensagem com botão "Forçar Atualização" (limpando localStorage build-meta + recarregando).

## 6. Diagnóstico Local (Snapshot)
Último build list (exemplo):
```
OfferStep-HXmOrgej.js
QuizEstiloPessoalPage-B9q0t8vc.js
UnifiedCRUDService-CwrPQRF7.js
```
Hashes diferentes dos relatados nos 404 → confirma mismatch de versão.

## 7. Como Validar em Produção
1. Abrir DevTools → aba Network → desabilitar cache.
2. Recarregar página.
3. Verificar se erros 404 cessam.
4. Alterar artificialmente nome de um chunk em index para simular falha e observar recovery.
5. Observar console: `[ChunkRecovery]` logs.

## 8. Rollback Simples
Se recovery causar loops indesejados:
- Remover bloco `<script>` de recovery do `index.html`.
- Desativar `startPeriodicVersionCheck` no `main.tsx`.

## 9. Checklist de Publicação
- [ ] Substituir placeholders em `build-meta.json` via pipeline.
- [ ] Garantir que index não esteja servindo de cache local/outro CDN (usar `curl -I`).
- [ ] Validar que build meta é diferente após novo deploy.

## 10. Conclusão
Os 404 estão ligados a inconsistência temporal entre HTML e assets. Mitigações implementadas reduzem impacto para usuários ativos e melhoram autossincronização. Próximos passos envolvem ajustes de infraestrutura e telemetria.

---
Documento gerado automaticamente (base inicial) — pode ser expandido conforme métricas reais.
