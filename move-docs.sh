#!/bin/bash

# Mover documentos de ANÁLISE para docs/analysis/
mv ANALISE_*.md ANÁLISE_*.md docs/analysis/ 2>/dev/null

# Mover documentos de ARQUITETURA para docs/architecture/
mv ARQUITETURA_*.md docs/architecture/ 2>/dev/null

# Mover documentos de PLANO para docs/plans/
mv PLANO_*.md docs/plans/ 2>/dev/null

# Mover documentos de RELATORIO para docs/reports/
mv RELATORIO_*.md RELATÓRIO_*.md docs/reports/ 2>/dev/null

# Mover documentos de STATUS, SUCCESS, REPORT para docs/reports/
mv *_STATUS*.md *_SUCCESS*.md *_REPORT*.md *_FINAL*.md docs/reports/ 2>/dev/null

# Mover documentos de GUIA para docs/guides/
mv GUIA_*.md docs/guides/ 2>/dev/null

# Mover documentos de WORKFLOW para docs/workflows/
mv WORKFLOW_*.md docs/workflows/ 2>/dev/null

# Mover documentos de CHECKLIST, TICKET para docs/plans/
mv CHECKLIST_*.md TICKET_*.md docs/plans/ 2>/dev/null

# Mover documentos específicos para architecture
mv DOCUMENTACAO_*.md DOC_*.md ESTRUTURA_*.md SISTEMA_*.md docs/architecture/ 2>/dev/null

# Mover documentos de CORRECAO, CORREÇÃO para docs/reports/
mv CORRECAO_*.md CORREÇÃO_*.md CORRECOES_*.md CORREÇÕES_*.md docs/reports/ 2>/dev/null

# Mover documentos de IMPLEMENTACAO para docs/reports/
mv IMPLEMENTACAO_*.md docs/reports/ 2>/dev/null

# Mover documentos de FASE para docs/plans/
mv FASE_*.md PHASE_*.md docs/plans/ 2>/dev/null

# Mover documentos de DIAGNOSTICO para docs/analysis/
mv DIAGNOSTICO_*.md docs/analysis/ 2>/dev/null

# Mover documentos de MIGRATION para docs/guides/
mv MIGRATION_*.md docs/guides/ 2>/dev/null

# Mover READMEs específicos para guides
mv README_*.md docs/guides/ 2>/dev/null

echo "✅ Documentação organizada com sucesso!"
