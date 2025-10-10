#!/bin/bash

# CONSOLIDACAO -> reports
mv CONSOLIDACAO_*.md CONSOLIDACOES_*.md docs/reports/ 2>/dev/null

# DASHBOARD -> architecture
mv DASHBOARD_*.md docs/architecture/ 2>/dev/null

# DECISAO, ESTRATEGIA -> plans
mv DECISAO_*.md ESTRATEGIA_*.md docs/plans/ 2>/dev/null

# DIAGRAMA, FLUXOGRAMA -> architecture
mv DIAGRAMA_*.md FLUXOGRAMA_*.md docs/architecture/ 2>/dev/null

# DOMINIO -> analysis
mv DOMINIO_*.md docs/analysis/ 2>/dev/null

# EDITOR_* -> architecture
mv EDITOR_*.md docs/architecture/ 2>/dev/null

# ENTREGA, ESTABILIZACAO, ESTADO -> reports
mv ENTREGA_*.md ESTABILIZACAO_*.md ESTADO_*.md docs/reports/ 2>/dev/null

# ERROS -> reports
mv ERROS_*.md docs/reports/ 2>/dev/null

# ETAPA -> reports
mv ETAPA_*.md docs/reports/ 2>/dev/null

# EXEMPLO, EXPLICACAO -> guides
mv EXEMPLO_*.md EXPLICACAO_*.md docs/guides/ 2>/dev/null

# CURSOR -> reports
mv CURSOR_*.md docs/reports/ 2>/dev/null

echo "✅ Batch final movido!"
