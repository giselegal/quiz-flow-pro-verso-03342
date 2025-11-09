#!/bin/bash

# Mover documentos de AUDITORIA para docs/analysis/
mv AUDITORIA_*.md docs/analysis/ 2>/dev/null

# Mover documentos de CHANGELOG para docs/reports/
mv CHANGELOG_*.md docs/reports/ 2>/dev/null

# Mover documentos de COMMITS para docs/reports/
mv COMMITS_*.md docs/reports/ 2>/dev/null

# Mover documentos de CHECKAGEM para docs/analysis/
mv CHECKAGEM_*.md docs/analysis/ 2>/dev/null

# Mover documentos de COMPARATIVO para docs/analysis/
mv COMPARATIVO_*.md docs/analysis/ 2>/dev/null

# Mover documentos de COMPONENTES para docs/architecture/
mv COMPONENTES_*.md docs/architecture/ 2>/dev/null

# Mover documentos de BIBLIOTECAS para docs/architecture/
mv BIBLIOTECAS_*.md docs/architecture/ 2>/dev/null

# Mover documentos de CONFIGURACAO, CONFIGURACOES para docs/guides/
mv CONFIGURACAO_*.md CONFIGURACOES_*.md docs/guides/ 2>/dev/null

# Mover documentos de CANVAS para docs/architecture/
mv CANVAS_*.md docs/architecture/ 2>/dev/null

# Mover documentos de CONEXAO para docs/guides/
mv CONEXAO_*.md docs/guides/ 2>/dev/null

# Mover COMO_FUNCIONAM para docs/guides/
mv COMO_FUNCIONAM_*.md docs/guides/ 2>/dev/null

# Mover documentos de BARRAS para docs/reports/
mv BARRAS_*.md docs/reports/ 2>/dev/null

echo "✅ Documentação restante organizada!"
