#!/bin/bash

# 📦 SCRIPT DE REMOÇÃO DE DEPENDÊNCIAS NÃO UTILIZADAS
# Sprint 5: Dependency Audit
# Data: 2025-01-16

echo "🔍 Sprint 5: Dependency Audit - Fase 1"
echo "========================================"
echo ""

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ ERRO: Execute este script na raiz do projeto!"
    exit 1
fi

echo "📋 Dependências que serão removidas:"
echo ""
echo "  1. @craftjs/core"
echo "  2. @craftjs/layers"
echo "     Motivo: Deprecated, substituído por @dnd-kit"
echo "     Economia: ~80KB gzipped"
echo ""
echo "  3. uuid"
echo "  4. @types/uuid"
echo "  5. nanoid"
echo "     Motivo: Não utilizados no código (0 imports)"
echo "     Economia: ~20KB gzipped"
echo ""
echo "  6. @react-spring/web"
echo "  7. @use-gesture/react"
echo "     Motivo: Não utilizados (framer-motion já instalado)"
echo "     Economia: ~45KB gzipped"
echo ""
echo "  8. drizzle-orm"
echo "  9. drizzle-zod"
echo "     Motivo: Não utilizados (Supabase fornece ORM)"
echo "     Economia: ~35KB gzipped"
echo ""
echo "  Total economia estimada: ~180KB gzipped"
echo ""

# Confirmar com usuário
read -p "Continuar com a remoção? (s/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "❌ Operação cancelada pelo usuário"
    exit 1
fi

echo ""
echo "🗑️  Removendo dependências..."
echo ""

# Remover CraftJS
echo "🔧 Removendo @craftjs/core e @craftjs/layers..."
npm uninstall @craftjs/core @craftjs/layers

if [ $? -eq 0 ]; then
    echo "✅ CraftJS removido com sucesso"
else
    echo "❌ Erro ao remover CraftJS"
    exit 1
fi

# Remover utilitários de ID
echo ""
echo "🔧 Removendo uuid, @types/uuid e nanoid..."
npm uninstall uuid @types/uuid nanoid

if [ $? -eq 0 ]; then
    echo "✅ Utilitários de ID removidos com sucesso"
else
    echo "❌ Erro ao remover utilitários de ID"
    exit 1
fi

# Remover animations não utilizadas
echo ""
echo "🔧 Removendo @react-spring/web e @use-gesture/react..."
npm uninstall @react-spring/web @use-gesture/react

if [ $? -eq 0 ]; then
    echo "✅ Bibliotecas de animation removidas com sucesso"
else
    echo "❌ Erro ao remover bibliotecas de animation"
    exit 1
fi

# Remover Drizzle
echo ""
echo "🔧 Removendo drizzle-orm e drizzle-zod..."
npm uninstall drizzle-orm drizzle-zod

if [ $? -eq 0 ]; then
    echo "✅ Drizzle removido com sucesso"
else
    echo "❌ Erro ao remover Drizzle"
    exit 1
fi

echo ""
echo "✅ Todas as dependências foram removidas!"
echo ""
echo "📝 Próximos passos:"
echo "  1. Execute: npm install"
echo "  2. Execute: npm run build"
echo "  3. Teste a aplicação em dev e produção"
echo "  4. Verifique se não há imports quebrados"
echo ""
echo "🔍 Para verificar imports quebrados, execute:"
echo "  grep -r \"from '@craftjs\" src/"
echo "  grep -r \"from 'uuid'\" src/"
echo "  grep -r \"from 'nanoid'\" src/"
echo "  grep -r \"from '@react-spring\" src/"
echo "  grep -r \"from 'drizzle\" src/"
echo ""
echo "✅ Todos devem retornar 0 resultados!"
echo ""
