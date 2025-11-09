#!/bin/bash

echo "🧹 Limpando cache completo do projeto..."

# 1. Limpar cache do Vite
echo "📦 Limpando cache do Vite..."
rm -rf node_modules/.vite
echo "✅ Cache do Vite limpo"

# 2. Limpar dist
echo "📦 Limpando dist..."
rm -rf dist
echo "✅ dist limpo"

# 3. Matar processos Vite
echo "🔪 Matando processos Vite..."
pkill -f "vite --host" 2>/dev/null || true
echo "✅ Processos Vite finalizados"

# 4. Limpar localStorage (instruções)
echo "
⚠️  ATENÇÃO: Para completar a limpeza, você precisa:

1. Abrir o DevTools do navegador (F12)
2. Ir na aba 'Application' ou 'Armazenamento'
3. Clicar com botão direito em 'Local Storage' e selecionar 'Clear'
4. Clicar com botão direito em 'Session Storage' e selecionar 'Clear'
5. Clicar com botão direito em 'Cache Storage' e selecionar 'Delete'
6. Recarregar a página com CTRL+SHIFT+R (ou CMD+SHIFT+R no Mac)

OU simplesmente abrir em modo anônimo/privado primeiro para testar!
"

# 5. Iniciar servidor
echo "🚀 Iniciando servidor limpo..."
npm run dev

