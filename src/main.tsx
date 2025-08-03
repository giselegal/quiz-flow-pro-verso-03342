import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import ClientLayout from "./components/ClientLayout";
import {
  initializeResourcePreloading,
  setupRouteChangePreloading,
} from "./utils/preloadResources";
import { fixMainRoutes } from "./utils/fixMainRoutes";
import { checkMainRoutes } from "./utils/routeChecker";
// 🚀 SUPABASE: Inicialização do serviço de dados
import { saveUserSession } from "./services/quizSupabaseService";
// import "./utils/hotmartWebhookSimulator"; // Carregar simulador de webhook - temporariamente desabilitado

// 🚀 SUPABASE: Configuração inicial do serviço
console.log('🚀 Inicializando serviços Supabase...');
console.log('🔧 DEBUG: main.tsx carregado');
// O serviço é inicializado automaticamente na importação

console.log('🔧 DEBUG: Criando root do React...');
createRoot(document.getElementById("root")!).render(
  <ClientLayout>
    <App />
  </ClientLayout>
);
console.log('✅ DEBUG: App renderizado com sucesso');
