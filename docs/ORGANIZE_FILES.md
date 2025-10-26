# 🗂️ Script de Organização de Arquivos

## Problema Identificado

Atualmente existem **441 arquivos na raiz do projeto**, incluindo muitos documentos .md, .html e .js que deveriam estar organizados em pastas apropriadas.

## Estrutura Criada

```
docs/
├── analysis/     # Análises técnicas e auditorias
├── reports/      # Relatórios de testes e implementações  
├── archived/     # Correções aplicadas e histórico
└── ORGANIZE_FILES.md (este arquivo)
```

## Scripts de Organização

### Para Linux/Mac:

```bash
#!/bin/bash
# organize-docs.sh

# Criar estrutura se não existir
mkdir -p docs/{analysis,reports,archived}

# Mover análises
mv ANALISE_*.md docs/analysis/ 2>/dev/null
mv MAPEAMENTO_*.md docs/analysis/ 2>/dev/null
mv AUDIT_*.md docs/analysis/ 2>/dev/null
mv DIAGNOSTICO_*.md docs/analysis/ 2>/dev/null
mv ARQUITETURA_*.md docs/analysis/ 2>/dev/null

# Mover relatórios
mv RELATORIO_*.* docs/reports/ 2>/dev/null
mv RESUMO_*.md docs/reports/ 2>/dev/null
mv STATUS_*.md docs/reports/ 2>/dev/null
mv RESULTADO_*.md docs/reports/ 2>/dev/null
mv PROGRESSO_*.md docs/reports/ 2>/dev/null

# Mover arquivados
mv CORRECAO_*.md docs/archived/ 2>/dev/null
mv FIX_*.md docs/archived/ 2>/dev/null
mv IMPLEMENTACAO_*.md docs/archived/ 2>/dev/null
mv PROBLEMA_*.md docs/archived/ 2>/dev/null

echo "✅ Arquivos organizados com sucesso!"
```

### Para Windows (PowerShell):

```powershell
# organize-docs.ps1

# Criar estrutura
New-Item -ItemType Directory -Force -Path docs\analysis
New-Item -ItemType Directory -Force -Path docs\reports
New-Item -ItemType Directory -Force -Path docs\archived

# Mover análises
Move-Item -Path ANALISE_*.md -Destination docs\analysis\ -ErrorAction SilentlyContinue
Move-Item -Path MAPEAMENTO_*.md -Destination docs\analysis\ -ErrorAction SilentlyContinue
Move-Item -Path AUDIT_*.md -Destination docs\analysis\ -ErrorAction SilentlyContinue
Move-Item -Path DIAGNOSTICO_*.md -Destination docs\analysis\ -ErrorAction SilentlyContinue
Move-Item -Path ARQUITETURA_*.md -Destination docs\analysis\ -ErrorAction SilentlyContinue

# Mover relatórios
Move-Item -Path RELATORIO_*.* -Destination docs\reports\ -ErrorAction SilentlyContinue
Move-Item -Path RESUMO_*.md -Destination docs\reports\ -ErrorAction SilentlyContinue
Move-Item -Path STATUS_*.md -Destination docs\reports\ -ErrorAction SilentlyContinue
Move-Item -Path RESULTADO_*.md -Destination docs\reports\ -ErrorAction SilentlyContinue
Move-Item -Path PROGRESSO_*.md -Destination docs\reports\ -ErrorAction SilentlyContinue

# Mover arquivados
Move-Item -Path CORRECAO_*.md -Destination docs\archived\ -ErrorAction SilentlyContinue
Move-Item -Path FIX_*.md -Destination docs\archived\ -ErrorAction SilentlyContinue
Move-Item -Path IMPLEMENTACAO_*.md -Destination docs\archived\ -ErrorAction SilentlyContinue
Move-Item -Path PROBLEMA_*.md -Destination docs\archived\ -ErrorAction SilentlyContinue

Write-Host "✅ Arquivos organizados com sucesso!" -ForegroundColor Green
```

## Como Executar

### Linux/Mac:
```bash
chmod +x organize-docs.sh
./organize-docs.sh
```

### Windows:
```powershell
.\organize-docs.ps1
```

## Próximos Passos

1. Execute o script apropriado para seu sistema operacional
2. Revise os arquivos movidos
3. Remova arquivos duplicados ou obsoletos
4. Atualize o .gitignore se necessário

## Benefícios

- ✅ Raiz do projeto limpa e organizada
- ✅ Documentação fácil de encontrar
- ✅ Melhor manutenibilidade
- ✅ Redução de 441 arquivos na raiz para ~50
