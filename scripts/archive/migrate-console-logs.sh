#!/bin/bash
# migrate-console-logs.sh
# Script para auxiliar na migração de console.log para o sistema de logging centralizado

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SRC_DIR="$PROJECT_ROOT/src"
BACKUP_DIR="$PROJECT_ROOT/migration-backup-$(date +%Y%m%d_%H%M%S)"

echo "🚀 Iniciando migração do sistema de logging..."
echo "📁 Diretório do projeto: $PROJECT_ROOT"
echo "📁 Diretório de origem: $SRC_DIR"
echo "💾 Backup será salvo em: $BACKUP_DIR"

# Função para mostrar estatísticas
show_stats() {
    local dir="$1"
    echo "📊 Estatísticas de console.* no diretório $dir:"
    
    local total_files=$(find "$dir" -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | wc -l)
    local files_with_console=$(find "$dir" -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs grep -l "console\." 2>/dev/null | wc -l)
    local total_console_calls=$(find "$dir" -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs grep -c "console\." 2>/dev/null | awk -F: '{sum += $2} END {print sum}')
    
    echo "   Total de arquivos: $total_files"
    echo "   Arquivos com console.*: $files_with_console"
    echo "   Total de chamadas console.*: $total_console_calls"
    echo ""
}

# Função para criar backup
create_backup() {
    echo "💾 Criando backup dos arquivos..."
    mkdir -p "$BACKUP_DIR"
    cp -r "$SRC_DIR" "$BACKUP_DIR/"
    echo "✅ Backup criado em: $BACKUP_DIR"
    echo ""
}

# Função para adicionar import do logger
add_logger_import() {
    local file="$1"
    
    # Verificar se já tem o import
    if grep -q "import.*getLogger.*from.*utils/logging" "$file"; then
        return 0
    fi
    
    # Adicionar import após os imports existentes
    local temp_file=$(mktemp)
    
    # Encontrar a linha onde inserir o import
    local insert_line=$(grep -n "^import" "$file" | tail -1 | cut -d: -f1)
    
    if [ -n "$insert_line" ]; then
        # Inserir após o último import
        sed "${insert_line}a\\
import { getLogger } from '@/utils/logging';" "$file" > "$temp_file"
    else
        # Se não há imports, adicionar no início
        echo "import { getLogger } from '@/utils/logging';" > "$temp_file"
        cat "$file" >> "$temp_file"
    fi
    
    mv "$temp_file" "$file"
}

# Função para adicionar logger hook em componentes React
add_logger_hook() {
    local file="$1"
    
    # Verificar se é um componente funcional React e já não tem useLogger
    if grep -q "const.*=.*React\.FC\|function.*{" "$file" && \
       ! grep -q "useLogger\|getLogger" "$file"; then
        
        # Adicionar const logger = getLogger(); depois da declaração da função
        local temp_file=$(mktemp)
        sed '/const.*=.*React\.FC\|function.*{/a\  const logger = getLogger();' "$file" > "$temp_file"
        mv "$temp_file" "$file"
    fi
}

# Função para substituir console.log por logger equivalente
replace_console_calls() {
    local file="$1"
    local temp_file=$(mktemp)
    
    # Mapeamento de console methods para logger equivalentes
    sed -E '
        # console.log -> logger.info (com contexto genérico)
        s/console\.log\(/logger.info('\''ui'\'', /g
        
        # console.info -> logger.info
        s/console\.info\(/logger.info('\''info'\'', /g
        
        # console.warn -> logger.warn
        s/console\.warn\(/logger.warn('\''warning'\'', /g
        
        # console.error -> logger.error
        s/console\.error\(/logger.error('\''error'\'', /g
        
        # console.debug -> logger.debug
        s/console\.debug\(/logger.debug('\''debug'\'', /g
    ' "$file" > "$temp_file"
    
    mv "$temp_file" "$file"
}

# Função para processar um arquivo
process_file() {
    local file="$1"
    local relative_path=${file#$SRC_DIR/}
    
    echo "🔄 Processando: $relative_path"
    
    # Verificar se o arquivo tem console.*
    if ! grep -q "console\." "$file"; then
        return 0
    fi
    
    # 1. Adicionar import do logger
    add_logger_import "$file"
    
    # 2. Adicionar hook/instância do logger se necessário
    add_logger_hook "$file"
    
    # 3. Substituir console.* por logger.*
    replace_console_calls "$file"
    
    echo "   ✅ Migrado: $relative_path"
}

# Função principal de migração
migrate_files() {
    echo "🔄 Migrando arquivos TypeScript/JavaScript..."
    
    # Encontrar todos os arquivos relevantes
    find "$SRC_DIR" -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | while read -r file; do
        process_file "$file"
    done
    
    echo ""
}

# Função para gerar relatório pós-migração
generate_report() {
    echo "📋 Gerando relatório de migração..."
    local report_file="$PROJECT_ROOT/migration-report-$(date +%Y%m%d_%H%M%S).md"
    
    cat > "$report_file" << EOF
# Relatório de Migração do Sistema de Logging

## Data: $(date)

## Resumo da Migração

### Antes da Migração
EOF
    
    if [ -d "$BACKUP_DIR" ]; then
        show_stats "$BACKUP_DIR/src" >> "$report_file"
    fi
    
    cat >> "$report_file" << EOF

### Depois da Migração
EOF
    show_stats "$SRC_DIR" >> "$report_file"
    
    cat >> "$report_file" << EOF

## Arquivos Modificados

### Arquivos com imports adicionados:
EOF
    
    find "$SRC_DIR" -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | \
        xargs grep -l "getLogger.*from.*utils/logging" 2>/dev/null | \
        sed "s|$SRC_DIR/||" >> "$report_file"
    
    cat >> "$report_file" << EOF

### Arquivos que ainda precisam de ajustes manuais:
EOF
    
    find "$SRC_DIR" -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | \
        xargs grep -l "console\." 2>/dev/null | \
        sed "s|$SRC_DIR/||" >> "$report_file"
    
    cat >> "$report_file" << EOF

## Próximos Passos

1. **Revisar contextos**: Substitua 'ui', 'info', 'warning', 'error', 'debug' por contextos mais específicos
2. **Estruturar dados**: Converta argumentos simples em objetos estruturados
3. **Testar logging**: Verifique se os logs aparecem corretamente em diferentes ambientes
4. **Configurar transports**: Configure endpoints remotos e filtros conforme necessário

## Contextos Sugeridos por Área

- **Componentes UI**: 'ui', 'user-interaction', 'component-lifecycle'
- **API/Network**: 'api', 'network', 'http'
- **Storage**: 'storage', 'localStorage', 'sessionStorage'
- **Autenticação**: 'auth', 'login', 'permissions'
- **Performance**: 'performance', 'metrics', 'timing'
- **Errors**: 'error', 'exception', 'crash'
- **Business Logic**: Use nomes específicos como 'quiz-editor', 'funnel-creation', etc.

EOF
    
    echo "📄 Relatório salvo em: $report_file"
}

# Função para validar o ambiente
validate_environment() {
    echo "🔍 Validando ambiente..."
    
    # Verificar se o diretório src existe
    if [ ! -d "$SRC_DIR" ]; then
        echo "❌ Diretório src não encontrado: $SRC_DIR"
        exit 1
    fi
    
    # Verificar se o sistema de logging existe
    if [ ! -f "$SRC_DIR/utils/logging/index.ts" ]; then
        echo "❌ Sistema de logging não encontrado em: $SRC_DIR/utils/logging/"
        echo "   Execute primeiro a criação do sistema de logging"
        exit 1
    fi
    
    echo "✅ Ambiente validado"
    echo ""
}

# Função para limpeza
cleanup() {
    echo "🧹 Limpeza concluída"
}

# Função principal
main() {
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║              MIGRAÇÃO DE SISTEMA DE LOGGING               ║"
    echo "║                                                            ║"
    echo "║ Este script migra console.* para o sistema centralizado   ║"
    echo "║ ATENÇÃO: Sempre faça backup antes de executar!            ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    
    # Verificar se foi fornecido --help
    if [[ "$1" == "--help" || "$1" == "-h" ]]; then
        cat << EOF
Uso: $0 [opções]

Opções:
  --help, -h          Mostrar esta ajuda
  --dry-run          Apenas mostrar o que seria feito (não modifica arquivos)
  --backup-only      Apenas criar backup, sem migrar
  --stats-only       Apenas mostrar estatísticas

Exemplos:
  $0                 # Executar migração completa
  $0 --dry-run       # Visualizar alterações sem aplicar
  $0 --stats-only    # Ver estatísticas atuais
  $0 --backup-only   # Apenas criar backup

EOF
        exit 0
    fi
    
    # Parse de argumentos
    local dry_run=false
    local backup_only=false
    local stats_only=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --dry-run)
                dry_run=true
                shift
                ;;
            --backup-only)
                backup_only=true
                shift
                ;;
            --stats-only)
                stats_only=true
                shift
                ;;
            *)
                echo "❌ Argumento desconhecido: $1"
                echo "Use --help para ver as opções disponíveis"
                exit 1
                ;;
        esac
    done
    
    validate_environment
    
    if [ "$stats_only" = true ]; then
        show_stats "$SRC_DIR"
        exit 0
    fi
    
    show_stats "$SRC_DIR"
    
    if [ "$backup_only" = true ]; then
        create_backup
        exit 0
    fi
    
    if [ "$dry_run" = false ]; then
        echo "⚠️  Esta operação modificará os arquivos do projeto!"
        echo "   Certifique-se de que você tem um backup ou está usando controle de versão."
        echo ""
        read -p "Deseja continuar? (y/N): " -n 1 -r
        echo ""
        
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "❌ Migração cancelada pelo usuário"
            exit 0
        fi
        
        create_backup
        migrate_files
        generate_report
    else
        echo "🔍 MODO DRY-RUN: Mostrando apenas o que seria feito..."
        echo ""
        echo "Arquivos que seriam modificados:"
        find "$SRC_DIR" -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | \
            xargs grep -l "console\." 2>/dev/null | \
            sed "s|$SRC_DIR/|   |"
        echo ""
        echo "Para executar a migração real, execute: $0"
    fi
    
    cleanup
    
    echo ""
    echo "✅ Processo concluído!"
    
    if [ "$dry_run" = false ] && [ "$backup_only" = false ] && [ "$stats_only" = false ]; then
        echo ""
        echo "📋 PRÓXIMOS PASSOS MANUAIS:"
        echo "1. Revisar os contextos gerados (substitua contextos genéricos por específicos)"
        echo "2. Estruturar os dados de log (converter strings em objetos)"
        echo "3. Testar o sistema em desenvolvimento"
        echo "4. Configurar variáveis de ambiente para produção"
        echo "5. Validar que não há erros de TypeScript"
        echo ""
        echo "💡 TIP: Use 'npm run type-check' ou 'tsc --noEmit' para verificar tipos"
    fi
}

# Executar função principal com todos os argumentos
main "$@"
