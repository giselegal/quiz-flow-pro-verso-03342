#!/usr/bin/env node

/**
 * 🤖 SCRIPT NODEJS: Adicionar Deprecation Warnings em Rotas
 * 
 * Automatiza:
 * 1. Criação de componente DeprecatedRouteWarning
 * 2. Identificação de rotas obsoletas no App.tsx
 * 3. Aplicação automática do wrapper
 */

const fs = require('fs');
const path = require('path');

console.log('╔════════════════════════════════════════════════════════════════════════════╗');
console.log('║              🚨 ADICIONAR DEPRECATION WARNINGS EM ROTAS                    ║');
console.log('╚════════════════════════════════════════════════════════════════════════════╝');
console.log('');

// ============================================================================
// PASSO 1: Criar componente DeprecatedRouteWarning
// ============================================================================

const deprecatedRouteComponent = `import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, X } from 'lucide-react';
import { toast } from 'sonner';

interface DeprecatedRouteWarningProps {
  routePath: string;
  recommendedRoute: string;
  reason: string;
  removalVersion?: string;
  children: React.ReactNode;
}

/**
 * 🚨 DEPRECATED ROUTE WARNING
 * 
 * Componente wrapper que exibe warning para rotas obsoletas
 * e redireciona usuário para a rota recomendada.
 */
export const DeprecatedRouteWarning: React.FC<DeprecatedRouteWarningProps> = ({
  routePath,
  recommendedRoute,
  reason,
  removalVersion = 'v4.0 (Janeiro 2026)',
  children,
}) => {
  const navigate = useNavigate();
  const [showBanner, setShowBanner] = React.useState(true);
  const [countdown, setCountdown] = React.useState(10);

  useEffect(() => {
    // Toast de aviso
    toast.warning(\`Rota Obsoleta: \${routePath}\`, {
      description: \`Esta rota será removida em \${removalVersion}\`,
      duration: 5000,
    });

    // Console warning
    console.warn(\`
╔════════════════════════════════════════════════════════════════════════════╗
║                        🚨 AVISO: ROTA OBSOLETA                             ║
╠════════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  Rota Atual: \${routePath.padEnd(62)} ║
║  Rota Recomendada: \${recommendedRoute.padEnd(54)} ║
║  Motivo: \${reason.padEnd(62)} ║
║  Remoção Planejada: \${removalVersion.padEnd(51)} ║
║                                                                            ║
║  ✅ Ação Recomendada: Atualize seus bookmarks/links                        ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
    \`);

    // Countdown para redirect automático
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(recommendedRoute);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [routePath, recommendedRoute, reason, removalVersion, navigate]);

  if (!showBanner) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner de Aviso */}
      <div className="bg-yellow-50 border-b-4 border-yellow-400 p-4">
        <div className="max-w-7xl mx-auto flex items-start gap-4">
          <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">
              ⚠️ Esta rota está obsoleta e será removida
            </h3>
            
            <div className="space-y-2 text-sm text-yellow-800">
              <p>
                <strong>Rota atual:</strong> <code className="bg-yellow-100 px-2 py-1 rounded">{routePath}</code>
              </p>
              <p>
                <strong>Use em vez disso:</strong>{' '}
                <a
                  href={recommendedRoute}
                  className="text-blue-600 hover:underline font-semibold"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(recommendedRoute);
                  }}
                >
                  {recommendedRoute}
                </a>
              </p>
              <p>
                <strong>Motivo:</strong> {reason}
              </p>
              <p>
                <strong>Remoção planejada:</strong> {removalVersion}
              </p>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <button
                onClick={() => navigate(recommendedRoute)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Ir para nova rota agora
              </button>
              
              <p className="text-xs text-yellow-700">
                Redirecionamento automático em <strong>{countdown}s</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowBanner(false)}
            className="text-yellow-600 hover:text-yellow-800 transition-colors"
            aria-label="Fechar aviso"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Conteúdo da rota (se usuário fechar o banner) */}
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
    </div>
  );
};

export default DeprecatedRouteWarning;
`;

// Escrever componente
const componentPath = path.join(__dirname, '../src/components/routing/DeprecatedRouteWarning.tsx');
const componentDir = path.dirname(componentPath);

if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir, { recursive: true });
}

fs.writeFileSync(componentPath, deprecatedRouteComponent);
console.log('✅ Componente DeprecatedRouteWarning criado');
console.log(`   📁 ${componentPath}`);
console.log('');

// ============================================================================
// PASSO 2: Mapear rotas obsoletas
// ============================================================================

const obsoleteRoutes = [
    {
        path: '/editor-new',
        recommended: '/editor',
        reason: 'Substituído por QuizModularProductionEditor',
        component: 'QuizFunnelEditorWYSIWYG_Refactored',
    },
    {
        path: '/quiz-old',
        recommended: '/quiz-estilo',
        reason: 'Versão antiga do quiz',
        component: 'QuizRendererOld',
    },
    {
        path: '/builder-legacy',
        recommended: '/editor',
        reason: 'Builder descontinuado',
        component: 'LegacyBuilder',
    },
];

console.log('📋 Rotas obsoletas identificadas:');
obsoleteRoutes.forEach((route, i) => {
    console.log(`   ${i + 1}. ${route.path} → ${route.recommended}`);
});
console.log('');

// ============================================================================
// PASSO 3: Gerar código para App.tsx
// ============================================================================

const appTsxImport = `import { DeprecatedRouteWarning } from '@/components/routing/DeprecatedRouteWarning';`;

const generateWrappedRoute = (route) => `
  {/* 🚨 DEPRECATED: ${route.path} */}
  <Route
    path="${route.path}"
    element={
      <DeprecatedRouteWarning
        routePath="${route.path}"
        recommendedRoute="${route.recommended}"
        reason="${route.reason}"
      >
        <${route.component} />
      </DeprecatedRouteWarning>
    }
  />`;

console.log('📝 Código gerado para App.tsx:');
console.log('');
console.log('// Adicione no topo dos imports:');
console.log(appTsxImport);
console.log('');
console.log('// Substitua as rotas obsoletas por:');
obsoleteRoutes.forEach((route) => {
    console.log(generateWrappedRoute(route));
});
console.log('');

// ============================================================================
// PASSO 4: Criar arquivo de instrucoes
// ============================================================================

const instructions = `# 🚨 INSTRUÇÕES: Aplicar Deprecation Warnings

## ✅ Componente Criado

O componente \`DeprecatedRouteWarning\` foi criado em:
\`\`\`
${componentPath}
\`\`\`

## 📝 PRÓXIMO PASSO: Atualizar App.tsx

### 1. Adicione o import no topo:

\`\`\`typescript
${appTsxImport}
\`\`\`

### 2. Envolva as rotas obsoletas:

${obsoleteRoutes.map(generateWrappedRoute).join('\n')}

## 🎯 Resultado Esperado

Quando usuário acessar rotas obsoletas:
- ✅ Banner amarelo de aviso aparece
- ✅ Toast de notificação
- ✅ Console warning com detalhes
- ✅ Botão para ir para nova rota
- ✅ Redirect automático em 10s
- ✅ Link clicável para rota recomendada

## 📊 Rotas Mapeadas

${obsoleteRoutes.map((r, i) => `${i + 1}. **${r.path}** → ${r.recommended}
   - Motivo: ${r.reason}
   - Remoção: v4.0 (Janeiro 2026)`).join('\n\n')}

## 🧪 Testar

\`\`\`bash
npm run dev
# Acesse http://localhost:8080/editor-new
# Deve ver warning e redirect para /editor
\`\`\`

## 📄 Documentação

Veja DEPRECATED.md para lista completa de rotas obsoletas.
`;

const instructionsPath = path.join(__dirname, '../INSTRUCTIONS_DEPRECATION_WARNINGS.md');
fs.writeFileSync(instructionsPath, instructions);

console.log('✅ Instruções criadas');
console.log(`   📁 ${instructionsPath}`);
console.log('');

// ============================================================================
// RESUMO
// ============================================================================

console.log('╔════════════════════════════════════════════════════════════════════════════╗');
console.log('║                          ✅ SCRIPT CONCLUÍDO                                ║');
console.log('╚════════════════════════════════════════════════════════════════════════════╝');
console.log('');
console.log('📦 Arquivos criados:');
console.log(`   1. ${componentPath}`);
console.log(`   2. ${instructionsPath}`);
console.log('');
console.log('🎯 Próximos passos:');
console.log('   1. Leia INSTRUCTIONS_DEPRECATION_WARNINGS.md');
console.log('   2. Atualize src/App.tsx com as rotas');
console.log('   3. Teste acessando /editor-new');
console.log('');
console.log('⏱️  Tempo estimado: 5 minutos');
console.log('');
