import { Button } from "@/components/ui/button";

export const ResultConfigPage: React.FC = () => {
  return (
    <div style={{ backgroundColor: "#FAF9F7" }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 style={{ color: "#432818" }}>Configuração de Resultados</h1>
          <Button>Adicionar Resultado</Button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center py-12">
            <h2 style={{ color: "#6B4F43" }}>Nenhum resultado configurado</h2>
            <p style={{ color: "#6B4F43" }}>
              Configure os resultados que serão exibidos após completar o quiz
            </p>
            <Button>Configurar Primeiro Resultado</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
