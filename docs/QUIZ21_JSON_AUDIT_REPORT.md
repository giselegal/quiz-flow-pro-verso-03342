# Auditoria `resource=quiz21StepsComplete`

## 1. Análise Técnica
- **JSONs v3.2**: master e steps estavam com versões divergentes (`templateVersion` 3.2, `metadata.version` 3.0.0) e sem `totalSteps`, dificultando validação automática. Estrutura segue formato de manifesto (`master.v3.json` + steps individuais) usado em templates SaaS modernos, mas não havia schema formal.
- **Painel de Propriedades**: o `QuizPropertiesPanelModular` não importava `appLogger`, quebrando handlers de duplicação/remoção em runtime e impedindo rastreabilidade de ações no painel.
- **Validação com Zod**: `stepMetadataSchema` e `stepV31Schema` eram "strip" e descartavam campos adicionais (scoring, version, flags), gerando perda de dados após validação. Não havia schema para manifestos nem para arquivos de step v3.2, e a verificação de consistência entre `templateVersion` e `metadata.version` não existia.
- **Estrutura de Schemas**: faltava cobertura para `master.v3.json` (steps em array + metadata) e para os arquivos `steps/step-XX.json`. Validação tratava apenas templates em formato "record", o que não condizia com o formato ativo do quiz.

## 2. Problemas Identificados
- **Confiabilidade**: divergência de versões e ausência de `totalSteps` no manifesto impediam detectar entregas incompletas ou arquivos faltantes.
- **Perda de dados**: schemas "strip" removiam campos críticos (scoring, version, templateId) ao validar steps, prejudicando exportação e round-trip de dados.
- **Cobertura de validação insuficiente**: inexistência de schemas para manifesto/steps v3.2 deixava o pipeline sem garantia contra regressões ou arquivos quebrados.
- **Observabilidade do painel**: falta de import do logger gerava exceção ao usar ações de blocos no painel de propriedades e ocultava telemetria.

## 3. Plano de Ação (priorizado)
1) **Correção imediata (D0)**
   - Sincronizar versões dos JSONs (3.2.0) e registrar `totalSteps` no manifesto.
   - Garantir que cada step carregue `templateId` e versão alinhada com `templateVersion`.
2) **Validação estruturada (D0-D1)**
   - Introduzir schemas Zod para manifesto e steps v3.2.
   - Tornar schemas existentes _passthrough_ para evitar perda de campos e adicionar validação cruzada de versões.
   - Criar teste automatizado que varre `master.v3.json` + todos os steps.
3) **Observabilidade do painel (D0)**
   - Restaurar logging no painel de propriedades para rastrear ações e evitar exceções silenciosas.

## 4. Implementação
- Normalização dos JSONs do template (`master.v3.json` e 21 steps) com `metadata.version: 3.2.0`, inclusão de `templateId` e `metadata.totalSteps`.
- Novos schemas Zod para manifesto e steps v3.2, com checagem de consistência entre versões e retenção de campos adicionais.
- Teste dedicado `quiz21StepsComplete.schema.test.ts` garantindo que manifesto e steps passam na validação e que contagem/ordenação de steps está correta.
- Correção do painel de propriedades adicionando `appLogger` para evitar exceções e registrar ações de edição.

## 5. Validação
- Teste automatizado (Vitest) para manifesto/steps do `quiz21StepsComplete`.
- Consistência das versões verificada: `templateVersion` == prefixo de `metadata.version`; `totalSteps` == 21.
- Painel de propriedades recompilado sem erros de import e pronto para logar ações.

## Métricas de Sucesso
- 100% dos arquivos em `public/templates/funnels/quiz21StepsComplete/` válidos segundo novos schemas.
- `metadata.totalSteps` refletindo exatamente 21 steps no manifesto.
- Zero warnings de versão ao validar steps/manifesto.
- Painel de propriedades sem exceções de import e com logs emitidos ao duplicar/remover blocos.
