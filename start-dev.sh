#!/bin/bash

# Script para limpar processos e iniciar o ambiente de desenvolvimento
# Criado em: 20 de outubro de 2025

echo "🚀 Iniciando ambiente de desenvolvimento Quiz Flow Pro..."

# 1. Verifica processos na porta 5173 e 3001
echo "🔍 Verificando processos em portas usadas..."
PORTA_5173=$(lsof -ti:5173)
PORTA_3001=$(lsof -ti:3001)

# 2. Finaliza processos existentes
if [ ! -z "$PORTA_5173" ]; then
  echo "🛑 Finalizando processo na porta 5173: $PORTA_5173"
  kill -9 $PORTA_5173
fi

if [ ! -z "$PORTA_3001" ]; then
  echo "🛑 Finalizando processo na porta 3001: $PORTA_3001"
  kill -9 $PORTA_3001
fi

# 3. Limpa cache do npm
echo "🧹 Limpando cache temporário..."
npm cache verify

# 4. Inicia o servidor de desenvolvimento
echo "🌐 Iniciando servidor de desenvolvimento..."
npm run dev:stack

echo "✅ Ambiente de desenvolvimento inicializado!"