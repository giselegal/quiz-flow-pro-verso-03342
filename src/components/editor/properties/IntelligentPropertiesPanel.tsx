import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Eye, RotateCcw, Settings, X } from "lucide-react";

// Importar os painéis específicos por tipo de etapa
import IntroStepProperties from "./step-types/IntroStepProperties";
import QuestionStepProperties from "./step-types/QuestionStepProperties";
import ResultStepProperties from "./step-types/ResultStepProperties";
import TransitionStepProperties from "./step-types/TransitionStepProperties";

interface IntelligentPropertiesPanelProps {
  selectedBlock?: {
    id: string;
    type: string;
    properties?: Record<string, any>;
    content?: Record<string, any>;
  } | null;
  stepType?:
    | "intro"
    | "question"
    | "transition"
    | "strategic"
    | "processing"
    | "result"
    | "lead"
    | "offer";
  stepNumber?: number;
  onUpdate: (blockId: string, updates: Record<string, any>) => void;
  onClose?: () => void;
  onPreview?: () => void;
  onReset?: () => void;
}

/**
 * Painel Inteligente de Propriedades - Adapta-se automaticamente ao tipo de etapa/bloco
 *
 * Funcionalidades:
 * - Detecta automaticamente o tipo de etapa
 * - Carrega o painel específico apropriado
 * - Agrupa propriedades por categoria lógica
 * - Oferece controles visuais avançados
 * - Integração com sistema de templates JSON
 */
export const IntelligentPropertiesPanel: React.FC<IntelligentPropertiesPanelProps> = ({
  selectedBlock,
  stepType,
  stepNumber,
  onUpdate,
  onClose,
  onPreview,
  onReset,
}) => {
  // Se não há bloco selecionado, mostrar estado vazio
  if (!selectedBlock) {
    return (
      <Card className="h-full">
        <CardContent className="h-full flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Nenhum Bloco Selecionado</h3>
            <p className="text-sm">Selecione um bloco no canvas para editar suas propriedades</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mesclar properties e content para ter todas as propriedades disponíveis
  const allProperties = {
    ...selectedBlock.properties,
    ...selectedBlock.content,
  };

  // Função para atualizar propriedades
  const handleUpdate = (key: string, value: any) => {
    if (selectedBlock) {
      onUpdate(selectedBlock.id, { [key]: value });
    }
  };

  // Determinar tipo de etapa baseado no stepType ou tipo do bloco
  const determineStepType = ():
    | "intro"
    | "question"
    | "transition"
    | "result"
    | "offer"
    | "lead" => {
    if (stepType) return stepType as any;

    // Inferir do tipo do bloco ou número da etapa
    if (stepNumber === 1) return "intro";
    if (stepNumber && stepNumber >= 2 && stepNumber <= 14) return "question";
    if (stepNumber === 15 || stepNumber === 19) return "transition";
    if (stepNumber && stepNumber >= 17 && stepNumber <= 18) return "result";
    if (stepNumber === 20) return "lead";
    if (stepNumber === 21) return "offer";

    // Inferir do tipo do bloco
    if (selectedBlock.type.includes("intro") || selectedBlock.type.includes("start"))
      return "intro";
    if (selectedBlock.type.includes("question") || selectedBlock.type.includes("quiz"))
      return "question";
    if (selectedBlock.type.includes("transition") || selectedBlock.type.includes("processing"))
      return "transition";
    if (selectedBlock.type.includes("result")) return "result";
    if (selectedBlock.type.includes("lead")) return "lead";
    if (selectedBlock.type.includes("offer")) return "offer";

    return "question"; // Default fallback
  };

  const currentStepType = determineStepType();

  // Renderizar o painel específico baseado no tipo
  const renderSpecificPanel = () => {
    switch (currentStepType) {
      case "intro":
        return <IntroStepProperties properties={allProperties} onUpdate={handleUpdate} />;

      case "question":
        return <QuestionStepProperties properties={allProperties} onUpdate={handleUpdate} />;

      case "transition":
        return <TransitionStepProperties properties={allProperties} onUpdate={handleUpdate} />;

      case "result":
        return <ResultStepProperties properties={allProperties} onUpdate={handleUpdate} />;

      case "lead":
        return <IntroStepProperties properties={allProperties} onUpdate={handleUpdate} />;

      case "offer":
        return <ResultStepProperties properties={allProperties} onUpdate={handleUpdate} />;

      default:
        return <QuestionStepProperties properties={allProperties} onUpdate={handleUpdate} />;
    }
  };

  // Mapear nomes amigáveis para tipos de etapa
  const getStepTypeName = (type: string) => {
    const names = {
      intro: "Introdução",
      question: "Pergunta do Quiz",
      strategic: "Pergunta Estratégica",
      transition: "Transição",
      processing: "Processamento",
      result: "Resultado",
      lead: "Captura de Lead",
      offer: "Oferta",
    };
    return names[type as keyof typeof names] || type;
  };

  const getBadgeVariant = (type: string) => {
    const variants = {
      intro: "default",
      question: "secondary",
      strategic: "outline",
      transition: "default",
      processing: "secondary",
      result: "default",
      lead: "secondary",
      offer: "destructive",
    };
    return variants[type as keyof typeof variants] || "default";
  };

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-lg">Propriedades</CardTitle>
            <Badge variant={getBadgeVariant(currentStepType) as any}>
              {getStepTypeName(currentStepType)}
            </Badge>
            {stepNumber && <Badge variant="outline">Etapa {stepNumber}</Badge>}
          </div>

          <div className="flex items-center space-x-1">
            {onPreview && (
              <Button size="sm" variant="ghost" onClick={onPreview} title="Visualizar alterações">
                <Eye className="w-4 h-4" />
              </Button>
            )}

            {onReset && (
              <Button size="sm" variant="ghost" onClick={onReset} title="Restaurar padrões">
                <RotateCcw className="w-4 h-4" />
              </Button>
            )}

            {onClose && (
              <Button size="sm" variant="ghost" onClick={onClose} title="Fechar painel">
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>Bloco:</span>
          <code className="bg-muted px-1 py-0.5 rounded text-xs">{selectedBlock.type}</code>
          <span className="text-xs">•</span>
          <span className="text-xs">ID: {selectedBlock.id}</span>
        </div>
      </CardHeader>

      <Separator />

      {/* Conteúdo Principal - Painel Específico */}
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6">{renderSpecificPanel()}</div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default IntelligentPropertiesPanel;
