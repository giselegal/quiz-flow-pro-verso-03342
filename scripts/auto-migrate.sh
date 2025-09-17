#!/bin/bash

# 🤖 MIGRAÇÃO AUTOMÁTICA - CI/CD INTEGRATION
# 
# FASE 5: Script para execução automatizada de migrações:
# ✅ Integração com pipelines de CI/CD
# ✅ Validação automática antes do deploy
# ✅ Rollback automático em caso de falha
# ✅ Notificações e logging detalhado
# ✅ Verificação de pré-requisitos

set -euo pipefail

# === CONFIGURAÇÕES ===
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOG_DIR="$PROJECT_ROOT/migration-logs"
BACKUP_DIR="$PROJECT_ROOT/backups"
MIGRATION_LOG="$LOG_DIR/migration-$(date +%Y%m%d_%H%M%S).log"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# === LOGGING FUNCTIONS ===

log() {
    echo -e "${CYAN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$MIGRATION_LOG"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$MIGRATION_LOG"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$MIGRATION_LOG"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$MIGRATION_LOG"
}

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$MIGRATION_LOG"
}

# === UTILITY FUNCTIONS ===

check_prerequisites() {
    log "🔍 Verificando pré-requisitos..."
    
    # Verifica Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js não encontrado"
        exit 1
    fi
    
    # Verifica npm
    if ! command -v npm &> /dev/null; then
        log_error "npm não encontrado"
        exit 1
    fi
    
    # Verifica se é um projeto Node.js
    if [[ ! -f "$PROJECT_ROOT/package.json" ]]; then
        log_error "package.json não encontrado em $PROJECT_ROOT"
        exit 1
    fi
    
    # Verifica se os arquivos de migração existem
    if [[ ! -f "$PROJECT_ROOT/src/migration/MigrationSystem.ts" ]]; then
        log_error "Sistema de migração não encontrado"
        exit 1
    fi
    
    log_success "Pré-requisitos verificados"
}

create_backup() {
    log "💾 Criando backup do projeto..."
    
    local backup_name="backup-$(date +%Y%m%d_%H%M%S)"
    local backup_path="$BACKUP_DIR/$backup_name"
    
    mkdir -p "$backup_path"
    
    # Backup do código fonte
    cp -r "$PROJECT_ROOT/src" "$backup_path/" 2>/dev/null || true
    cp "$PROJECT_ROOT/package.json" "$backup_path/" 2>/dev/null || true
    cp "$PROJECT_ROOT/tsconfig.json" "$backup_path/" 2>/dev/null || true
    
    # Cria arquivo de metadados
    cat > "$backup_path/metadata.json" << EOF
{
  "created": "$(date -u +%Y-%m-%dT%H:%M:%S.000Z)",
  "branch": "$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'unknown')",
  "commit": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
  "user": "$(whoami)",
  "environment": "${CI:-local}",
  "backup_type": "pre-migration"
}
EOF
    
    log_success "Backup criado: $backup_name"
    echo "$backup_path" > "$LOG_DIR/last_backup.txt"
}

run_pre_migration_tests() {
    log "🧪 Executando testes pré-migração..."
    
    cd "$PROJECT_ROOT"
    
    # Instala dependências se necessário
    if [[ ! -d "node_modules" ]] || [[ "package.json" -nt "node_modules" ]]; then
        log_info "Instalando dependências..."
        npm ci --silent || {
            log_error "Falha na instalação de dependências"
            return 1
        }
    fi
    
    # Executa testes de build
    log_info "Verificando build..."
    if command -v npm run build &> /dev/null; then
        npm run build --silent || {
            log_error "Falha no build"
            return 1
        }
    fi
    
    # Executa testes se existirem
    if grep -q '"test"' package.json; then
        log_info "Executando testes..."
        npm test -- --silent || {
            log_error "Testes falharam"
            return 1
        }
    fi
    
    log_success "Testes pré-migração passaram"
}

analyze_project() {
    log "📊 Analisando projeto para migração..."
    
    cd "$PROJECT_ROOT"
    
    # Executa análise
    npm run migrate:analyze --json > "$LOG_DIR/analysis.json" 2>/dev/null || {
        log_error "Falha na análise do projeto"
        return 1
    }
    
    # Verifica se há arquivos para migrar
    local file_count=$(jq length "$LOG_DIR/analysis.json" 2>/dev/null || echo "0")
    
    if [[ "$file_count" -eq 0 ]]; then
        log_info "Nenhum arquivo necessita migração"
        return 2  # Status especial para "nada para fazer"
    fi
    
    log_info "Encontrados $file_count arquivo(s) para migração"
    
    # Log detalhado dos arquivos
    jq -r '.[] | "\(.filePath) (\(.estimatedComplexity))"' "$LOG_DIR/analysis.json" | while read -r line; do
        log_info "  - $line"
    done
    
    return 0
}

run_migration() {
    local dry_run=${1:-false}
    local mode_desc=""
    
    if [[ "$dry_run" == "true" ]]; then
        mode_desc=" (dry-run)"
        log "🎭 Executando migração em modo preview${mode_desc}..."
    else
        log "🚀 Executando migração${mode_desc}..."
    fi
    
    cd "$PROJECT_ROOT"
    
    local migration_cmd="npm run migrate:run"
    if [[ "$dry_run" == "true" ]]; then
        migration_cmd="$migration_cmd --dry-run"
    fi
    
    # Executa migração com timeout de 10 minutos
    timeout 600 $migration_cmd --yes > "$LOG_DIR/migration_output.json" 2>&1 || {
        local exit_code=$?
        if [[ $exit_code -eq 124 ]]; then
            log_error "Migração excedeu tempo limite de 10 minutos"
        else
            log_error "Migração falhou com código $exit_code"
        fi
        return $exit_code
    }
    
    # Parse do resultado
    if [[ -f "$LOG_DIR/migration_output.json" ]]; then
        local migrated=$(grep -o '"migratedFiles":[0-9]*' "$LOG_DIR/migration_output.json" | cut -d: -f2 || echo "0")
        local failed=$(grep -o '"failedFiles":[0-9]*' "$LOG_DIR/migration_output.json" | cut -d: -f2 || echo "0")
        
        log_info "Arquivos migrados: $migrated"
        log_info "Arquivos com falha: $failed"
        
        if [[ "$failed" -gt 0 ]]; then
            log_warning "Algumas migrações falharam - verifique os logs detalhados"
            return 1
        fi
    fi
    
    if [[ "$dry_run" == "false" ]]; then
        log_success "Migração executada com sucesso"
    else
        log_success "Preview da migração concluído - nenhuma alteração foi feita"
    fi
}

run_post_migration_tests() {
    log "🧪 Executando testes pós-migração..."
    
    cd "$PROJECT_ROOT"
    
    # Verifica build após migração
    log_info "Verificando build pós-migração..."
    npm run build --silent || {
        log_error "Build falhou após migração"
        return 1
    }
    
    # Executa testes se existirem
    if grep -q '"test"' package.json; then
        log_info "Executando testes pós-migração..."
        npm test -- --silent || {
            log_error "Testes falharam após migração"
            return 1
        }
    fi
    
    # Validação específica da migração
    log_info "Validando integridade da migração..."
    npm run migrate:validate --silent || {
        log_error "Validação da migração falhou"
        return 1
    }
    
    log_success "Testes pós-migração passaram"
}

rollback_migration() {
    log_error "🔙 Iniciando rollback..."
    
    local backup_path
    if [[ -f "$LOG_DIR/last_backup.txt" ]]; then
        backup_path=$(cat "$LOG_DIR/last_backup.txt")
    else
        log_error "Caminho do backup não encontrado"
        return 1
    fi
    
    if [[ ! -d "$backup_path" ]]; then
        log_error "Backup não encontrado: $backup_path"
        return 1
    fi
    
    # Restaura arquivos do backup
    log_info "Restaurando arquivos do backup..."
    cp -r "$backup_path/src"/* "$PROJECT_ROOT/src/" 2>/dev/null || true
    cp "$backup_path/package.json" "$PROJECT_ROOT/" 2>/dev/null || true
    
    log_success "Rollback concluído"
}

send_notification() {
    local status=$1
    local message=$2
    
    # Webhook para notificações (Slack, Teams, etc.)
    if [[ -n "${WEBHOOK_URL:-}" ]]; then
        curl -X POST "$WEBHOOK_URL" \
             -H 'Content-Type: application/json' \
             -d "{\"text\":\"🤖 Migration CI: $status - $message\"}" \
             &> /dev/null || log_warning "Falha ao enviar notificação"
    fi
    
    # Email se configurado
    if [[ -n "${NOTIFICATION_EMAIL:-}" ]] && command -v mail &> /dev/null; then
        echo "$message" | mail -s "Migration CI: $status" "$NOTIFICATION_EMAIL" || \
        log_warning "Falha ao enviar email"
    fi
}

# === MAIN EXECUTION ===

main() {
    local dry_run=${1:-false}
    local force=${2:-false}
    
    # Setup inicial
    mkdir -p "$LOG_DIR" "$BACKUP_DIR"
    
    log "🤖 INICIANDO MIGRAÇÃO AUTOMÁTICA - CI/CD"
    log "==============================================="
    log "Projeto: $PROJECT_ROOT"
    log "Modo: $(if [[ "$dry_run" == "true" ]]; then echo "DRY-RUN"; else echo "EXECUÇÃO"; fi)"
    log "Usuário: $(whoami)"
    log "Ambiente: ${CI:-local}"
    
    # Pipeline de migração
    if ! check_prerequisites; then
        send_notification "FAILURE" "Pré-requisitos não atendidos"
        exit 1
    fi
    
    if ! analyze_project; then
        local analysis_exit=$?
        if [[ $analysis_exit -eq 2 ]]; then
            log_success "🎉 Projeto já está migrado - nada para fazer"
            send_notification "SUCCESS" "Projeto já está migrado"
            exit 0
        else
            send_notification "FAILURE" "Falha na análise do projeto"
            exit 1
        fi
    fi
    
    if [[ "$dry_run" == "false" ]]; then
        create_backup
        
        if ! run_pre_migration_tests; then
            send_notification "FAILURE" "Testes pré-migração falharam"
            exit 1
        fi
    fi
    
    if ! run_migration "$dry_run"; then
        if [[ "$dry_run" == "false" ]]; then
            rollback_migration
            send_notification "FAILURE" "Migração falhou - rollback executado"
        else
            send_notification "FAILURE" "Preview da migração falhou"
        fi
        exit 1
    fi
    
    if [[ "$dry_run" == "false" ]]; then
        if ! run_post_migration_tests; then
            rollback_migration
            send_notification "FAILURE" "Testes pós-migração falharam - rollback executado"
            exit 1
        fi
        
        log_success "🎉 MIGRAÇÃO CONCLUÍDA COM SUCESSO!"
        send_notification "SUCCESS" "Migração executada com sucesso"
    else
        log_success "🎭 PREVIEW DA MIGRAÇÃO CONCLUÍDO!"
        send_notification "SUCCESS" "Preview da migração concluído"
    fi
    
    # Resumo final
    log "==============================================="
    log "Log completo: $MIGRATION_LOG"
    if [[ "$dry_run" == "false" ]] && [[ -f "$LOG_DIR/last_backup.txt" ]]; then
        log "Backup disponível: $(cat "$LOG_DIR/last_backup.txt")"
    fi
    log "Status: $(if [[ "$dry_run" == "true" ]]; then echo "PREVIEW CONCLUÍDO"; else echo "MIGRAÇÃO CONCLUÍDA"; fi)"
}

# === CLI INTERFACE ===

show_help() {
    cat << EOF
🤖 MIGRAÇÃO AUTOMÁTICA - CI/CD Integration

USO:
    $0 [OPÇÕES]

OPÇÕES:
    --dry-run       Executa em modo preview (não faz alterações)
    --force         Força execução mesmo com warnings
    --help          Mostra esta ajuda

VARIÁVEIS DE AMBIENTE:
    WEBHOOK_URL           URL para notificações via webhook
    NOTIFICATION_EMAIL    Email para notificações
    CI                   Indica execução em ambiente CI/CD

EXEMPLOS:
    $0                    # Migração completa
    $0 --dry-run          # Preview da migração
    $0 --force            # Força migração ignorando warnings

EOF
}

# Parse de argumentos
DRY_RUN=false
FORCE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --force)
            FORCE=true
            shift
            ;;
        --help|-h)
            show_help
            exit 0
            ;;
        *)
            log_error "Opção desconhecida: $1"
            show_help
            exit 1
            ;;
    esac
done

# Execução principal
main "$DRY_RUN" "$FORCE"