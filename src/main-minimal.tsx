import { createRoot } from 'react-dom/client';
import App from './App';
import ClientLayout from './components/ClientLayout';
import './index.css';
import './styles/design-system.css';

// ❌ COMENTADOS: Possíveis imports problemáticos
// import { initBrowserCleanup } from './utils/browserCleanup';
// import { cleanupConsoleWarnings } from './utils/development';
// import './utils/blockLovableInDev';
// import './utils/canvasPerformanceControl';
// import { activateFunnelAI } from './utils/funnelAIActivator';

console.log('🔧 TESTE MAIN: main-minimal.tsx carregando...');

// ❌ COMENTADO: Limpeza de console que pode estar causando erro
// if (import.meta.env.DEV) {
//   cleanupConsoleWarnings();
//   if (typeof window !== 'undefined') {
//     initBrowserCleanup();
//   }
// }

// ❌ COMENTADO: Interceptação de fetch que pode estar causando problemas
// if ((import.meta.env.DEV || typeof window !== 'undefined') && typeof window !== 'undefined') {
//   // ... fetch interception code ...
// }

// ❌ COMENTADOS: Diagnósticos que podem ter imports problemáticos
// import runTemplateDiagnostic from './utils/templateDiagnostic';
// import { getTemplateStatus } from './utils/hybridIntegration';

// const diagnosticResult = runTemplateDiagnostic();
// console.log('🔬 [MAIN] Template diagnostic:', diagnosticResult);

// getTemplateStatus().then(status => {
//   console.log('🔬 [MAIN] Hybrid integration status:', status);
// }).catch(error => {
//   console.error('❌ [MAIN] Hybrid integration error:', error);
// });

console.log('🔧 TESTE MAIN: Criando root do React...');
createRoot(document.getElementById('root')!).render(
    <ClientLayout>
        <App />
    </ClientLayout>
);
console.log('✅ TESTE MAIN: App renderizado com sucesso');