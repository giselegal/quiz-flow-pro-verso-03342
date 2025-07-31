#!/bin/bash

# Script para sincronizar as ramificações do repositório Quiz Quest Challenge Verse
# Criado em: 03/07/2025

echo "🔄 Iniciando sincronização das ramificações..."

# Certifique-se de que temos todas as referências remotas atualizadas
echo "📥 Atualizando referências remotas..."
git fetch --all

# Verificar em qual branch estamos e salvar para voltar depois
CURRENT_BRANCH=$(git symbolic-ref --short HEAD)
echo "📌 Branch atual: $CURRENT_BRANCH"

# Função para resetar uma branch para o estado de outra
resetar_branch() {
  BRANCH=$1
  RESET_TO=$2
  
  echo "⚠️ Resetando $BRANCH para o estado de $RESET_TO..."
  
  # Verificar se as branches existem
  if ! git rev-parse --verify $BRANCH &> /dev/null; then
    echo "❌ Branch $BRANCH não existe!"
    return 1
  fi
  
  if ! git rev-parse --verify $RESET_TO &> /dev/null; then
    echo "❌ Branch $RESET_TO não existe!"
    return 1
  fi
  
  # Checkout na branch que será resetada
  git checkout $BRANCH
  
  # Resetar para o estado da outra branch
  git reset --hard $RESET_TO
  
  echo "✅ $BRANCH foi resetada para o estado de $RESET_TO!"
  return 0
}

# Função para sincronizar duas branches
sincronizar_branches() {
  SOURCE=$1
  TARGET=$2
  
  echo "🔄 Sincronizando $TARGET com $SOURCE..."
  
  # Verificar se a branch de origem existe
  if ! git rev-parse --verify $SOURCE &> /dev/null; then
    echo "❌ Branch $SOURCE não existe!"
    return 1
  fi
  
  # Verificar se a branch de destino existe
  if ! git rev-parse --verify $TARGET &> /dev/null; then
    echo "❌ Branch $TARGET não existe!"
    return 1
  fi
  
  # Checkout na branch de destino
  git checkout $TARGET
  
  # Mesclar a branch de origem na de destino
  git merge $SOURCE -m "Sincronizando $TARGET com $SOURCE"
  
  # Verificar se houve erro no merge
  if [ $? -ne 0 ]; then
    echo "❌ Erro ao mesclar $SOURCE em $TARGET. Resolvendo conflitos..."
    echo "⚠️ Por favor, resolva os conflitos manualmente e execute 'git merge --continue'"
    return 1
  else
    echo "✅ $TARGET sincronizada com $SOURCE com sucesso!"
  fi
  
  return 0
}

# Resetar replit-agent para o estado da branch main (ignorando alterações específicas)
resetar_branch "origin/replit-agent" "origin/main"

# Sincronizar replit com main (agora que replit-agent está igual a main)
sincronizar_branches "origin/main" "origin/replit"

# Voltar para a branch original
git checkout $CURRENT_BRANCH

echo "✅ Processo de sincronização concluído!"
echo "🔍 Verifique se há conflitos não resolvidos e envie as alterações para o repositório remoto."
echo "📤 Para enviar as alterações para o repositório remoto, execute:"
echo "    git push -f origin replit-agent"
echo "    git push origin main replit"
