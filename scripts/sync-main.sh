#!/usr/bin/env bash
set -euo pipefail

echo "🔄 Atualizando refs remotas (origin)..."
git fetch origin --prune

echo "🔁 Trocando para 'main'..."
git checkout main

echo "⬇️  Fast-forward main <- origin/main..."
git pull --ff-only origin main

echo "✅ main está alinhada com origin/main"
