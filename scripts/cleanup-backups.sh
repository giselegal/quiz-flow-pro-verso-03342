#!/usr/bin/env bash
set -euo pipefail

# Limpeza segura de diretórios de backup/arquivados
# Uso:
#   scripts/cleanup-backups.sh           # modo dry-run (somente lista e tamanho)
#   scripts/cleanup-backups.sh --apply   # remove de fato (solicita confirmação)

ROOT_DIR="$(cd "$(dirname "$0")"/.. && pwd)"
APPLY=false
if [[ "${1:-}" == "--apply" ]]; then
  APPLY=true
fi

# Lista de padrões/diretórios suspeitos de serem backups/arquivos mortos
CANDIDATES=(
  "archived/"
  "archived-legacy-editors/"
  "archived-examples/"
  "archived/dead-code/"
  "archived/dead-code-obvious/"
  "system-backup/"
  "backup_*/"
  "templates-backup*/"
  "**/backup/**"
)

human_size() {
  local path="$1"
  du -sh "$path" 2>/dev/null | awk '{print $1}'
}

list_matches() {
  local pattern="$1"
  # Usamos find para expandir padrões e evitar globbing do shell
  find "$ROOT_DIR" -path "$ROOT_DIR/.git" -prune -o -type d -name "${pattern%%/*}" -print 2>/dev/null
}

echo "🔎 Varredura de diretórios de backup/arquivados em: $ROOT_DIR"
FOUND=()
for pat in "${CANDIDATES[@]}"; do
  # Trate padrões com **/ separadamente usando find -path
  if [[ "$pat" == **/* ]]; then
    while IFS= read -r p; do
      [[ -d "$p" ]] && FOUND+=("$p")
    done < <(find "$ROOT_DIR" -type d -path "*$pat" 2>/dev/null)
  else
    # Remova barras finais e curingas para match por nome
    base_pat="${pat%%/*}"
    while IFS= read -r p; do
      [[ -d "$p" ]] && FOUND+=("$p")
    done < <(find "$ROOT_DIR" -path "$ROOT_DIR/.git" -prune -o -type d -name "$base_pat" -print 2>/dev/null)
  fi
done

# Remover duplicatas
IFS=$'\n' read -r -d '' -a FOUND < <(printf '%s\n' "${FOUND[@]}" | sort -u && printf '\0') || true

if [[ ${#FOUND[@]} -eq 0 ]]; then
  echo "✅ Nenhum diretório de backup/arquivado encontrado."
  exit 0
fi

echo "\n📁 Candidatos encontrados (dry-run):"
TOTAL_BYTES=0
INDEX=1
for d in "${FOUND[@]}"; do
  size=$(du -sb "$d" 2>/dev/null | awk '{print $1}')
  hsize=$(numfmt --to=iec --suffix=B "$size" 2>/dev/null || echo "$(human_size "$d")")
  TOTAL_BYTES=$((TOTAL_BYTES + size))
  rel=".${d#"$ROOT_DIR"}"
  printf '  %2d) %s  (%s)\n' "$INDEX" "$rel" "$hsize"
  INDEX=$((INDEX+1))
done
h_total=$(numfmt --to=iec --suffix=B "$TOTAL_BYTES" 2>/dev/null || echo "$TOTAL_BYTES B")
echo "\n📦 Tamanho total potencial a recuperar: $h_total"

if ! $APPLY; then
  echo "\nℹ️  Execução em modo dry-run. Use --apply para remover."
  exit 0
fi

echo "\n⚠️ Confirma remover TODOS os diretórios listados acima? [y/N]"
read -r confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "Operação cancelada."
  exit 0
fi

for d in "${FOUND[@]}"; do
  rel=".${d#"$ROOT_DIR"}"
  echo "🧹 Removendo $rel"
  rm -rf "$d"
done

echo "\n✅ Limpeza concluída. Considere rodar: git status"
