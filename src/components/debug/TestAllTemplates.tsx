import { getStep18Template } from "@/components/steps/Step18Template";
import { getStep19Template } from "@/components/steps/Step19Template";
import React from "react";

const TestAllTemplates: React.FC = () => {
  // Testar se as funções estão definidas
  const step18 = getStep18Template();
  const step19 = getStep19Template();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Teste de Todos os Templates Corrigidos</h1>

      <div className="space-y-4">
        <div style={{ backgroundColor: "#FAF9F7" }}>
          <h2 className="font-bold">Step18 Template:</h2>
          <p>Status: {step18 ? "✅ OK" : "❌ ERRO"}</p>
          <p>Blocos: {step18?.length || 0}</p>
          {step18?.[0] && <p>Primeiro bloco ID: {step18[0].id}</p>}
        </div>

        <div style={{ backgroundColor: "#FAF9F7" }}>
          <h2 className="font-bold">Step19 Template:</h2>
          <p>Status: {step19 ? "✅ OK" : "❌ ERRO"}</p>
          <p>Blocos: {step19?.length || 0}</p>
          {step19?.[0] && <p>Primeiro bloco ID: {step19[0].id}</p>}
        </div>

        <div style={{ backgroundColor: "#FAF9F7" }}>
          <h2 className="font-bold">Teste JavaScript Console:</h2>
          <button
            onClick={() => {
              try {
                console.log("Step18 template:", getStep18Template());
                console.log("Step19 template:", getStep19Template());
                alert("✅ Templates carregaram sem erro! Verifique o console.");
              } catch (error) {
                console.error("Erro ao carregar templates:", error);
                alert("❌ Erro: " + (error instanceof Error ? error.message : String(error)));
              }
            }}
            style={{ backgroundColor: "#B89B7A" }}
          >
            Testar no Console
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestAllTemplates;
