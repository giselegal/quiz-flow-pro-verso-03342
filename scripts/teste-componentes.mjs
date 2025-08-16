// Teste simples para verificar se o sistema está funcionando
console.log("🧪 TESTE: Iniciando verificação do sistema");

// Verificar se todos os componentes estão registrados
import { ENHANCED_BLOCK_REGISTRY, getBlockComponent } from "./src/config/enhancedBlockRegistry.ts";

const tiposStep01 = [
  "quiz-intro-header",
  "decorative-bar-inline",
  "text-inline",
  "image-display-inline",
  "form-input",
  "button-inline",
  "legal-notice-inline",
];

console.log("📋 Verificando componentes da Step01:");

tiposStep01.forEach(tipo => {
  const component = getBlockComponent(tipo);
  const status = component ? "✅" : "❌";
  console.log(`${status} ${tipo}`);
});

console.log("\n📦 Registry completo:");
console.log(Object.keys(ENHANCED_BLOCK_REGISTRY));
