import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  Save,
  Trash2,
  Copy,
  Monitor,
  Smartphone,
  Tablet,
  ChevronUp,
  ChevronDown,
  Type,
  Image as ImageIcon,
  MousePointer,
  Layout,
  GripVertical,
  Eye,
  Plus,
  ArrowLeft,
  ArrowRight,
  Play,
  Download,
  Upload,
  Video,
  Star,
  DollarSign,
  Clock,
  Shield,
  Gift,
  HelpCircle,
  Users,
  Settings,
  TrendingUp,
} from "lucide-react";

// Interfaces para o sistema moderno
interface QuizComponent {
  id: string;
  type: "title" | "subtitle" | "text" | "image" | "button" | "input" | "options" | "spacer" | "video" | "testimonial" | "price" | "countdown" | "guarantee" | "bonus" | "faq" | "social-proof" | "progress" | "logo";
  data: {
    text?: string;
    src?: string;
    alt?: string;
    height?: number;
    label?: string;
    placeholder?: string;
    required?: boolean;
    options?: QuizOption[];
    multiSelect?: boolean;
    hasImages?: boolean;
    progressValue?: number;
    videoUrl?: string;
    price?: string;
    originalPrice?: string;
    installments?: string;
    currency?: string;
    endDate?: string;
    title?: string;
    name?: string;
    role?: string;
    avatar?: string;
    testimonialAuthor?: string;
    testimonialRole?: string;
    testimonialImage?: string;
    guaranteeDays?: number;
    bonuses?: BonusItem[];
    faqs?: FaqItem[];
    customerCount?: string;
    rating?: string;
    reviewCount?: string;
    socialProofCount?: number;
    socialProofText?: string;
  };
  style: {
    fontSize?: string;
    fontWeight?: string;
    textAlign?: "left" | "center" | "right";
    color?: string;
    backgroundColor?: string;
    padding?: string;
    margin?: string;
    borderRadius?: string;
  };
}

interface QuizOption {
  id: string;
  text: string;
  image?: string;
  value: string;
  category?: string;
}

interface BonusItem {
  id: string;
  title: string;
  value: string;
  description?: string;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface QuizStep {
  id: string;
  title: string;
  type: "intro" | "question" | "loading" | "result" | "offer" | "transition" | "sales" | "checkout" | "upsell" | "thankyou";
  progress: number;
  showHeader: boolean;
  showProgress: boolean;
  components: QuizComponent[];
}

interface QuizVariant {
  id: string;
  name: string;
  description: string;
  steps: QuizStep[];
  trafficPercent: number;
  isActive: boolean;
  createdAt?: string;
}

interface QuizFunnel {
  id: string;
  name: string;
  steps: QuizStep[];
  variants?: QuizVariant[];
  updatedAt?: string;
  createdAt?: string;
}

// Componentes disponíveis organizados por categoria
const COMPONENT_CATEGORIES = {
  basic: [
    { type: "title", name: "Título", icon: Type },
    { type: "subtitle", name: "Subtítulo", icon: Type },
    { type: "text", name: "Texto", icon: Type },
    { type: "image", name: "Imagem", icon: ImageIcon },
    { type: "button", name: "Botão", icon: MousePointer },
    { type: "spacer", name: "Espaço", icon: Layout },
  ],
  interactive: [
    { type: "input", name: "Campo", icon: Type },
    { type: "options", name: "Opções", icon: Layout },
    { type: "progress", name: "Progresso", icon: Layout },
  ],
  sales: [
    { type: "video", name: "Vídeo", icon: Video },
    { type: "testimonial", name: "Depoimento", icon: Star },
    { type: "price", name: "Preço", icon: DollarSign },
    { type: "countdown", name: "Countdown", icon: Clock },
    { type: "guarantee", name: "Garantia", icon: Shield },
    { type: "bonus", name: "Bônus", icon: Gift },
    { type: "faq", name: "FAQ", icon: HelpCircle },
    { type: "social-proof", name: "Prova Social", icon: Users },
  ]
};

const ModernQuizEditor: React.FC = () => {
  const { toast } = useToast();

  // Estados principais
  const [currentFunnel, setCurrentFunnel] = useState<QuizFunnel>({
    id: "modern-quiz-funnel",
    name: "Quiz de Estilo Moderno",
    steps: [
      {
        id: "intro-step",
        title: "Página Inicial",
        type: "intro",
        progress: 0,
        showHeader: true,
        showProgress: false,
        components: [
          {
            id: "title-1",
            type: "title",
            data: { text: "Descubra Seu Estilo Pessoal" },
            style: {
              fontSize: "2.5rem",
              fontWeight: "700",
              textAlign: "center",
              color: "#432818",
            },
          },
          {
            id: "subtitle-1", 
            type: "subtitle",
            data: { text: "Um quiz personalizado para descobrir o que combina com você" },
            style: {
              fontSize: "1.25rem",
              textAlign: "center",
              color: "#6B4F43",
            },
          },
          {
            id: "button-1",
            type: "button",
            data: { text: "Começar Quiz" },
            style: {},
          }
        ]
      }
    ]
  });

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [deviceView, setDeviceView] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Estados para A/B Testing
  const [isAbTestMode, setIsAbTestMode] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  // Steps atuais baseados na variante selecionada
  const currentSteps = useMemo(() => {
    if (isAbTestMode && selectedVariant) {
      const variant = currentFunnel.variants?.find(v => v.id === selectedVariant);
      return variant?.steps || currentFunnel.steps;
    }
    return currentFunnel.steps;
  }, [currentFunnel, isAbTestMode, selectedVariant]);

  const currentStep = currentSteps[currentStepIndex];

  // Funções para A/B Testing
  const toggleAbTestMode = () => {
    setIsAbTestMode(!isAbTestMode);
    if (!isAbTestMode && currentFunnel.variants && currentFunnel.variants.length > 0) {
      setSelectedVariant(currentFunnel.variants[0].id);
    } else {
      setSelectedVariant(null);
    }
    setCurrentStepIndex(0);
  };

  const createNewVariant = () => {
    const variantName = prompt("Nome da nova variante:");
    if (!variantName) return;

    const newVariant: QuizVariant = {
      id: `variant-${Date.now()}`,
      name: variantName,
      description: `Variante ${variantName}`,
      steps: [...currentFunnel.steps],
      trafficPercent: 50,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    setCurrentFunnel(prev => ({
      ...prev,
      variants: [...(prev.variants || []), newVariant]
    }));

    setSelectedVariant(newVariant.id);
    setIsAbTestMode(true);
    setCurrentStepIndex(0);

    toast({
      title: "✅ Variante criada!",
      description: `A variante "${variantName}" foi criada com sucesso.`,
    });
  };

  const deleteVariant = (variantId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta variante?")) return;

    setCurrentFunnel(prev => ({
      ...prev,
      variants: prev.variants?.filter(v => v.id !== variantId) || []
    }));

    if (selectedVariant === variantId) {
      setSelectedVariant(null);
      setIsAbTestMode(false);
    }

    toast({
      title: "✅ Variante excluída!",
      description: "A variante foi removida com sucesso.",
    });
  };

  // Função para adicionar componente
  const addComponent = (type: QuizComponent["type"]) => {
    const newComponent: QuizComponent = {
      id: `component-${Date.now()}`,
      type,
      data: getDefaultComponentData(type),
      style: getDefaultComponentStyle(type),
    };

    const updatedSteps = [...currentSteps];
    updatedSteps[currentStepIndex] = {
      ...currentStep,
      components: [...currentStep.components, newComponent]
    };

    updateCurrentSteps(updatedSteps);
  };

  // Função para atualizar steps
  const updateCurrentSteps = (newSteps: QuizStep[]) => {
    if (isAbTestMode && selectedVariant) {
      setCurrentFunnel(prev => ({
        ...prev,
        variants: prev.variants?.map(v => 
          v.id === selectedVariant 
            ? { ...v, steps: newSteps }
            : v
        )
      }));
    } else {
      setCurrentFunnel(prev => ({
        ...prev,
        steps: newSteps
      }));
    }
  };

  // Dados padrão para componentes
  const getDefaultComponentData = (type: QuizComponent["type"]) => {
    switch (type) {
      case "title":
        return { text: "Título Principal" };
      case "subtitle":
        return { text: "Subtítulo explicativo" };
      case "text":
        return { text: "Texto explicativo aqui..." };
      case "button":
        return { text: "Clique aqui" };
      case "image":
        return { src: "https://via.placeholder.com/400x300", alt: "Imagem" };
      case "input":
        return { label: "Campo de entrada", placeholder: "Digite aqui..." };
      case "options":
        return { 
          options: [
            { id: "opt1", text: "Opção 1", value: "1" },
            { id: "opt2", text: "Opção 2", value: "2" }
          ]
        };
      default:
        return {};
    }
  };

  const getDefaultComponentStyle = (type: QuizComponent["type"]) => {
    switch (type) {
      case "title":
        return {
          fontSize: "2rem",
          fontWeight: "700",
          textAlign: "center" as const,
          color: "#432818",
        };
      case "subtitle":
        return {
          fontSize: "1.25rem",
          fontWeight: "500",
          textAlign: "center" as const,
          color: "#6B4F43",
        };
      default:
        return {};
    }
  };

  // Renderizar componente no canvas
  const renderComponent = (component: QuizComponent) => {
    const isSelected = selectedComponent === component.id;
    
    return (
      <div
        key={component.id}
        className={`component-wrapper ${isSelected ? 'selected' : ''}`}
        onClick={() => setSelectedComponent(component.id)}
        style={{
          border: isSelected ? "2px solid #3b82f6" : "2px solid transparent",
          borderRadius: "4px",
          padding: "8px",
          margin: "4px 0",
          cursor: "pointer"
        }}
      >
        {renderComponentContent(component)}
      </div>
    );
  };

  const renderComponentContent = (component: QuizComponent) => {
    const { type, data, style } = component;

    switch (type) {
      case "title":
        return (
          <h1 style={style}>
            {data.text || "Título"}
          </h1>
        );
      case "subtitle":
        return (
          <h2 style={style}>
            {data.text || "Subtítulo"}
          </h2>
        );
      case "text":
        return (
          <p style={style}>
            {data.text || "Texto"}
          </p>
        );
      case "button":
        return (
          <button 
            className="bg-[#432818] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#5a3723] transition-colors"
            style={style}
          >
            {data.text || "Botão"}
          </button>
        );
      case "image":
        return (
          <img 
            src={data.src || "https://via.placeholder.com/400x300"} 
            alt={data.alt || "Imagem"}
            style={{ maxWidth: "100%", height: "auto", ...style }}
          />
        );
      case "input":
        return (
          <div style={style}>
            {data.label && <label className="block text-sm font-medium mb-2">{data.label}</label>}
            <input 
              type="text"
              placeholder={data.placeholder || "Digite aqui..."}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        );
      case "options":
        return (
          <div style={style}>
            <div className="space-y-2">
              {data.options?.map((option) => (
                <label key={option.id} className="flex items-center space-x-2">
                  <input type="radio" name={`options-${component.id}`} value={option.value} />
                  <span>{option.text}</span>
                </label>
              ))}
            </div>
          </div>
        );
      default:
        return <div>Componente {type}</div>;
    }
  };

  // Renderizar canvas com preview responsivo
  const renderCanvas = () => {
    const getCanvasWidth = () => {
      switch (deviceView) {
        case "mobile": return "375px";
        case "tablet": return "672px"; // max-w-2xl = 672px
        case "desktop": return "896px"; // max-w-4xl = 896px
        default: return "896px";
      }
    };

    return (
      <div className="canvas-container flex justify-center p-6 bg-gray-50">
        <div 
          className="canvas-frame bg-white rounded-lg shadow-lg overflow-hidden"
          style={{ 
            width: getCanvasWidth(),
            maxWidth: "100%",
            minHeight: "600px",
            border: deviceView !== "desktop" ? "1px solid #e5e7eb" : "none"
          }}
        >
          <div className="canvas-content p-6">
            {currentStep?.components.map(renderComponent)}
          </div>
        </div>
      </div>
    );
  };

  // Renderizar propriedades do componente
  const renderPropertiesPanel = () => {
    if (!selectedComponent) return null;

    const component = currentStep?.components.find(c => c.id === selectedComponent);
    if (!component) return null;

    return (
      <div className="space-y-4">
        <h3 className="font-semibold">Propriedades - {component.type}</h3>
        
        {/* Propriedades específicas do componente */}
        {component.type === "title" || component.type === "subtitle" || component.type === "text" ? (
          <div>
            <Label>Texto</Label>
            <Textarea
              value={component.data.text || ""}
              onChange={(e) => updateComponentData(component.id, { text: e.target.value })}
            />
          </div>
        ) : null}

        {component.type === "button" ? (
          <div>
            <Label>Texto do Botão</Label>
            <Input
              value={component.data.text || ""}
              onChange={(e) => updateComponentData(component.id, { text: e.target.value })}
            />
          </div>
        ) : null}

        {component.type === "image" ? (
          <>
            <div>
              <Label>URL da Imagem</Label>
              <Input
                value={component.data.src || ""}
                onChange={(e) => updateComponentData(component.id, { src: e.target.value })}
              />
            </div>
            <div>
              <Label>Texto Alternativo</Label>
              <Input
                value={component.data.alt || ""}
                onChange={(e) => updateComponentData(component.id, { alt: e.target.value })}
              />
            </div>
          </>
        ) : null}

        <Separator />

        {/* Propriedades de estilo */}
        <h4 className="font-medium">Estilo</h4>
        
        <div>
          <Label>Alinhamento</Label>
          <Select
            value={component.style.textAlign || "left"}
            onValueChange={(value) => updateComponentStyle(component.id, { textAlign: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Esquerda</SelectItem>
              <SelectItem value="center">Centro</SelectItem>
              <SelectItem value="right">Direita</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Cor do Texto</Label>
          <Input
            type="color"
            value={component.style.color || "#000000"}
            onChange={(e) => updateComponentStyle(component.id, { color: e.target.value })}
          />
        </div>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => deleteComponent(component.id)}
          className="w-full"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Excluir Componente
        </Button>
      </div>
    );
  };

  // Funções auxiliares
  const updateComponentData = (componentId: string, newData: Partial<QuizComponent["data"]>) => {
    const updatedSteps = [...currentSteps];
    const stepIndex = currentStepIndex;
    const componentIndex = updatedSteps[stepIndex].components.findIndex(c => c.id === componentId);
    
    if (componentIndex !== -1) {
      updatedSteps[stepIndex].components[componentIndex] = {
        ...updatedSteps[stepIndex].components[componentIndex],
        data: { ...updatedSteps[stepIndex].components[componentIndex].data, ...newData }
      };
      updateCurrentSteps(updatedSteps);
    }
  };

  const updateComponentStyle = (componentId: string, newStyle: Partial<QuizComponent["style"]>) => {
    const updatedSteps = [...currentSteps];
    const stepIndex = currentStepIndex;
    const componentIndex = updatedSteps[stepIndex].components.findIndex(c => c.id === componentId);
    
    if (componentIndex !== -1) {
      updatedSteps[stepIndex].components[componentIndex] = {
        ...updatedSteps[stepIndex].components[componentIndex],
        style: { ...updatedSteps[stepIndex].components[componentIndex].style, ...newStyle }
      };
      updateCurrentSteps(updatedSteps);
    }
  };

  const deleteComponent = (componentId: string) => {
    if (!confirm("Tem certeza que deseja excluir este componente?")) return;
    
    const updatedSteps = [...currentSteps];
    updatedSteps[currentStepIndex] = {
      ...currentStep,
      components: currentStep.components.filter(c => c.id !== componentId)
    };
    updateCurrentSteps(updatedSteps);
    setSelectedComponent(null);
  };

  const saveFunnel = () => {
    localStorage.setItem("modern_quiz_funnel", JSON.stringify(currentFunnel));
    toast({
      title: "✅ Funil salvo!",
      description: "Suas alterações foram salvas com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header moderno */}
      <div className="border-b bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-[#432818]">Editor Visual</h1>
            <Badge variant="secondary">{currentFunnel.name}</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {/* A/B Test Controls */}
            <div className="flex items-center gap-2 border rounded-lg p-2">
              <Button
                variant={isAbTestMode ? "default" : "outline"}
                size="sm"
                onClick={toggleAbTestMode}
                className="h-8"
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                Teste A/B
              </Button>
              
              {isAbTestMode && (
                <>
                  <Select value={selectedVariant || ""} onValueChange={setSelectedVariant}>
                    <SelectTrigger className="w-40 h-8">
                      <SelectValue placeholder="Selecionar variante" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentFunnel.variants?.map((variant) => (
                        <SelectItem key={variant.id} value={variant.id}>
                          {variant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={createNewVariant}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Controles de visualização */}
            <div className="flex gap-1 border rounded-lg p-1">
              <Button
                variant={deviceView === "desktop" ? "default" : "ghost"}
                size="sm"
                onClick={() => setDeviceView("desktop")}
                className="h-8 w-8 p-0"
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={deviceView === "tablet" ? "default" : "ghost"}
                size="sm"
                onClick={() => setDeviceView("tablet")}
                className="h-8 w-8 p-0"
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={deviceView === "mobile" ? "default" : "ghost"}
                size="sm"
                onClick={() => setDeviceView("mobile")}
                className="h-8 w-8 p-0"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            <Button
              variant={isPreviewMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {isPreviewMode ? "Editar" : "Preview"}
            </Button>

            <Button variant="outline" size="sm" onClick={saveFunnel}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
      </div>

      {/* Layout principal - 3 colunas */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar esquerda - Steps */}
        {!isPreviewMode && (
          <div className="w-80 border-r bg-white">
            <Tabs defaultValue="steps" className="h-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="steps">Etapas</TabsTrigger>
                <TabsTrigger value="components">Componentes</TabsTrigger>
                <TabsTrigger value="abtest">A/B Test</TabsTrigger>
              </TabsList>

              {/* Aba de Etapas */}
              <TabsContent value="steps" className="p-4 space-y-4 h-full">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Estrutura do Quiz</h3>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Etapa
                  </Button>
                </div>

                <ScrollArea className="h-[calc(100vh-180px)]">
                  <div className="space-y-2">
                    {currentSteps.map((step, index) => (
                      <Card 
                        key={step.id} 
                        className={`cursor-pointer transition-colors ${
                          index === currentStepIndex ? "ring-2 ring-blue-500" : ""
                        }`}
                        onClick={() => setCurrentStepIndex(index)}
                      >
                        <CardHeader className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-medium flex items-center justify-center">
                                {index + 1}
                              </div>
                              <div>
                                <Badge variant="outline" className="text-xs mb-1">
                                  {step.type}
                                </Badge>
                                <p className="font-medium text-sm">{step.title}</p>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {step.components.length} comp.
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Aba de Componentes */}
              <TabsContent value="components" className="p-4 space-y-4 h-full">
                <h3 className="font-semibold">Adicionar Componentes</h3>
                
                <ScrollArea className="h-[calc(100vh-180px)]">
                  <div className="space-y-4">
                    {Object.entries(COMPONENT_CATEGORIES).map(([category, components]) => (
                      <div key={category}>
                        <h4 className="text-sm font-medium mb-2 text-muted-foreground capitalize">
                          {category === "basic" ? "Básicos" : 
                           category === "interactive" ? "Interativos" : "Vendas"}
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {components.map((comp) => (
                            <Card
                              key={comp.type}
                              className="cursor-pointer hover:bg-gray-50 transition-colors"
                              onClick={() => addComponent(comp.type as QuizComponent["type"])}
                            >
                              <CardContent className="p-3 text-center">
                                <comp.icon className="h-4 w-4 mx-auto mb-1 text-[#8F7A6A]" />
                                <div className="text-xs font-medium">{comp.name}</div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Aba de A/B Test */}
              <TabsContent value="abtest" className="p-4 space-y-4 h-full">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Testes A/B</h3>
                  <Button variant="outline" size="sm" onClick={createNewVariant}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Variante
                  </Button>
                </div>

                <ScrollArea className="h-[calc(100vh-180px)]">
                  <div className="space-y-3">
                    {currentFunnel.variants?.map((variant) => (
                      <Card 
                        key={variant.id} 
                        className={`cursor-pointer transition-colors ${
                          selectedVariant === variant.id ? "ring-2 ring-blue-500" : ""
                        }`}
                        onClick={() => {
                          setSelectedVariant(variant.id);
                          setIsAbTestMode(true);
                          setCurrentStepIndex(0);
                        }}
                      >
                        <CardHeader className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={variant.isActive ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {variant.isActive ? "Ativo" : "Inativo"}
                              </Badge>
                              <span className="font-medium text-sm">{variant.name}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteVariant(variant.id);
                              }}
                              className="h-6 w-6 p-0"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {variant.description}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">
                              {variant.steps.length} etapa(s)
                            </span>
                            <span className="text-xs font-medium">
                              {variant.trafficPercent}% do tráfego
                            </span>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                    
                    {(!currentFunnel.variants || currentFunnel.variants.length === 0) && (
                      <div className="text-center py-8 text-gray-500">
                        <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-sm font-medium mb-2">Nenhuma variante criada</p>
                        <p className="text-xs">Crie variantes para testar diferentes versões</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Canvas central */}
        <div className="flex-1">
          {/* Navegação de etapas */}
          {!isPreviewMode && (
            <div className="border-b bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
                    disabled={currentStepIndex === 0}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Anterior
                  </Button>

                  <Badge variant="outline" className="px-3 py-1">
                    Etapa {currentStepIndex + 1} de {currentSteps.length}
                  </Badge>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentStepIndex(Math.min(currentSteps.length - 1, currentStepIndex + 1))}
                    disabled={currentStepIndex === currentSteps.length - 1}
                  >
                    Próxima
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{currentStep?.type}</Badge>
                  <span className="font-medium">{currentStep?.title}</span>
                  {isAbTestMode && selectedVariant && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {currentFunnel.variants?.find(v => v.id === selectedVariant)?.name}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Canvas */}
          <div className="h-full overflow-auto">
            {renderCanvas()}
          </div>
        </div>

        {/* Sidebar direita - Propriedades */}
        {!isPreviewMode && (
          <div className="w-80 border-l bg-white">
            <div className="p-4 h-full">
              <ScrollArea className="h-full">
                {selectedComponent ? (
                  renderPropertiesPanel()
                ) : (
                  <div className="text-center text-muted-foreground mt-8">
                    <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">
                      Clique em um componente para editá-lo
                    </p>
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        )}
      </div>
      
      <Toaster />
    </div>
  );
};

export default ModernQuizEditor;