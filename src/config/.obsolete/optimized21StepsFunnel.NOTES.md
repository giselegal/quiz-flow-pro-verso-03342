# Notas sobre optimized21StepsFunnel.json

Este arquivo agrega as 21 etapas em uma estrutura otimizada para uso em runtime/editor. Ele pode conter id de steps repetidos dependendo da estratégia de composição.

- Se as duplicatas de `stepIds` forem intencionais (ex.: para manter compatibilidade com consumidores legados ou por variações de bloco), mantenha-as e documente aqui o motivo.
- Se as duplicatas não forem necessárias, execute:
  - Dry-run: `node scripts/audit/dedupe-optimized21.mjs`
  - Aplicar: `node scripts/audit/dedupe-optimized21.mjs --apply`

Depois de ajustar, rode a auditoria para validar:
- `npm run audit:jsons`
