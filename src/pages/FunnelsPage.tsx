import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

const FunnelsPage: React.FC = () => {
  const [, setLocation] = useLocation();

  return (
    <div style={{ backgroundColor: "#FAF9F7" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 style={{ color: "#432818" }}>Funis</h1>
          <Button onClick={() => setLocation("/editor-fixed")}>Criar Novo Funil</Button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center py-12">
            <h2 style={{ color: "#6B4F43" }}>Nenhum funil encontrado</h2>
            <p style={{ color: "#6B4F43" }}>Comece criando seu primeiro funil de conversão</p>
            <Button onClick={() => setLocation("/editor-fixed")}>Criar Primeiro Funil</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunnelsPage;
