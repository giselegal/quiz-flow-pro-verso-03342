import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Sparkles, Wand2, Check } from 'lucide-react';
import { type FunnelTemplate } from '@/services/FunnelAIAgent';

interface TemplatesIASidebarProps {
  onSelectTemplate: (template: FunnelTemplate) => void;
  onClose: () => void;
}

// Template da Consultora de Estilo com IA
const STYLE_CONSULTANT_TEMPLATE: FunnelTemplate = {
  meta: {
    name: 'Com que Roupa eu Vou? - Consultora de Estilo IA',
    description: 'Funil completo para consultoria de estilo personalizada com inteligência artificial. Gera looks, imagens e ofertas diretas.',
    version: '2.0.0',
    author: 'giselegal',
  },
  design: {
    primaryColor: '#9333EA',
    secondaryColor: '#EC4899',
    accentColor: '#A855F7',
    backgroundColor: 'linear-gradient(to bottom right, #F3E8FF, #FCE7F3)',
    fontFamily: "'Inter', 'Poppins', sans-serif",
    button: {
      background: 'linear-gradient(90deg, #9333EA, #EC4899)',
      textColor: '#fff',
      borderRadius: '12px',
      shadow: '0 8px 20px rgba(147, 51, 234, 0.25)',
    },
    card: {
      background: '#fff',
      borderRadius: '16px',
      shadow: '0 8px 32px rgba(147, 51, 234, 0.12)',
    },
    progressBar: {
      color: '#9333EA',
      background: '#F3E8FF',
      height: '8px',
    },
    animations: {
      formTransition: 'slide-up, fade',
      buttonHover: 'scale-105, glow',
      resultAppear: 'fade-in-up',
    },
  },
  steps: [
    {
      type: 'intro',
      title: 'Com que Roupa eu Vou?',
      description: 'Sua consultora de estilo pessoal com IA! Descubra o look perfeito para qualquer ocasião.',
      imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop',
      cta: 'Começar Consulta de Estilo',
    },
    {
      type: 'form',
      title: 'Conte-me sobre seu compromisso',
      fields: [
        {
          id: 'compromisso',
          type: 'text',
          label: 'Compromisso',
          placeholder: 'Ex: Reunião de trabalho, Jantar com amigos, Festa de aniversário',
          required: true,
        },
        {
          id: 'horario',
          type: 'select',
          label: 'Horário',
          options: [
            { value: 'Manhã', label: 'Manhã (até 12h)' },
            { value: 'Tarde', label: 'Tarde (12h às 18h)' },
            { value: 'Noite', label: 'Noite (após 18h)' },
          ],
          required: true,
        },
        {
          id: 'clima',
          type: 'select',
          label: 'Clima',
          options: [
            { value: 'Sol', label: 'Ensolarado' },
            { value: 'Chuva', label: 'Chuvoso' },
            { value: 'Frio', label: 'Frio' },
            { value: 'Quente', label: 'Quente' },
            { value: 'Nublado', label: 'Nublado' },
          ],
          required: true,
        }
      ],
    }
  ],
  logic: {
    selection: {
      form: 'Todos os campos obrigatórios devem ser preenchidos',
      processing: 'IA processa os dados do formulário',
    },
    calculation: {
      method: 'Geração dinâmica com API de IA',
      resultado: 'Look personalizado baseado nas preferências',
    },
    transitions: {
      betweenSteps: 'Animações suaves slide-up e fade',
    },
  },
  integrations: {
    ai: {
      textGeneration: {
        provider: 'gemini',
        model: 'gemini-2.0-flash',
        prompt: "Sugira um look completo para {{compromisso}} na {{horario}} com clima {{clima}}",
      },
    },
  },
  config: {
    localStorageKeys: ['style_consultation_data'],
    features: {
      aiGeneration: true,
      imageProcessing: true,
      emailCapture: true,
      socialSharing: true,
      responsive: true,
    },
  },
};

// Template de Quiz de Fitness
const FITNESS_TEMPLATE: FunnelTemplate = {
  meta: {
    name: 'Personal Trainer IA - Quiz Fitness',
    description: 'Quiz inteligente para planos de treino personalizados com IA',
    version: '1.0.0',
    author: 'giselegal',
  },
  design: {
    primaryColor: '#059669',
    secondaryColor: '#10B981',
    accentColor: '#34D399',
    backgroundColor: 'linear-gradient(to bottom right, #ECFDF5, #D1FAE5)',
    fontFamily: "'Inter', sans-serif",
    button: {
      background: 'linear-gradient(90deg, #059669, #10B981)',
      textColor: '#fff',
      borderRadius: '8px',
      shadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
    },
    card: {
      background: '#fff',
      borderRadius: '12px',
      shadow: '0 4px 16px rgba(5, 150, 105, 0.1)',
    },
    progressBar: {
      color: '#059669',
      background: '#D1FAE5',
      height: '6px',
    },
    animations: {
      formTransition: 'slide-up',
      buttonHover: 'scale-105',
      resultAppear: 'fade-in',
    },
  },
  steps: [
    {
      type: 'intro',
      title: 'Personal Trainer IA',
      description: 'Descubra o plano de treino perfeito para seus objetivos!',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
      cta: 'Começar Avaliação Fitness',
    },
    {
      type: 'form',
      title: 'Conte sobre seus objetivos',
      fields: [
        {
          id: 'objetivo',
          type: 'select',
          label: 'Seu objetivo principal',
          options: [
            { value: 'Perder peso', label: 'Perder peso' },
            { value: 'Ganhar massa', label: 'Ganhar massa muscular' },
            { value: 'Definir', label: 'Definir músculos' },
            { value: 'Condicionamento', label: 'Melhorar condicionamento' },
          ],
          required: true,
        },
      ],
    }
  ],
  logic: { selection: {}, calculation: {}, transitions: {} },
  integrations: {
    ai: {
      textGeneration: {
        provider: 'gemini',
        model: 'gemini-2.0-flash',
        prompt: "Crie um plano de treino para objetivo: {{objetivo}}",
      },
    },
  },
  config: {
    localStorageKeys: ['fitness_assessment'],
    features: { aiGeneration: true, responsive: true },
  },
};

const AVAILABLE_TEMPLATES = [STYLE_CONSULTANT_TEMPLATE, FITNESS_TEMPLATE];

export function TemplatesIASidebar({ onSelectTemplate, onClose }: TemplatesIASidebarProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectTemplate = async (template: FunnelTemplate) => {
    try {
      setIsLoading(true);
      setSelectedTemplate(template.meta.name);
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSelectTemplate(template);
      console.log('Template selecionado:', template.meta.name);
    } catch (error) {
      console.error('Erro ao selecionar template:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTemplateIcon = (templateName: string) => {
    if (templateName.includes('Estilo') || templateName.includes('Roupa')) return Sparkles;
    if (templateName.includes('Fitness') || templateName.includes('Trainer')) return Wand2;
    return Bot;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold">Templates IA Avançados</h2>
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                <Sparkles className="w-3 h-3 mr-1" />
                Powered by Gemini 2.0
              </Badge>
            </div>
            <Button variant="ghost" onClick={onClose}>✕</Button>
          </div>
          <p className="text-gray-600 mt-2">
            Escolha um template inteligente com IA integrada para criar funis personalizados
          </p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AVAILABLE_TEMPLATES.map((template) => {
              const Icon = getTemplateIcon(template.meta.name);
              const isSelected = selectedTemplate === template.meta.name;
              
              return (
                <Card
                  key={template.meta.name}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    isSelected ? 'ring-2 ring-purple-500 bg-purple-50' : ''
                  }`}
                  onClick={() => handleSelectTemplate(template)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5 text-purple-600" />
                        <CardTitle className="text-sm">{template.meta.name}</CardTitle>
                      </div>
                      {isSelected && <Check className="w-5 h-5 text-green-600" />}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 mb-3">{template.meta.description}</p>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{template.steps.length} Steps</Badge>
                        <Badge variant="outline" className="text-xs">v{template.meta.version}</Badge>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span className="text-xs text-amber-700">IA Gemini 2.0 Flash</span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      Recursos: {Object.entries(template.config.features)
                        .filter(([, enabled]) => enabled)
                        .map(([feature]) => feature)
                        .join(', ')}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <Wand2 className="w-4 h-4 inline mr-1" />
              Templates com IA integrada para resultados personalizados
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>Cancelar</Button>
              {isLoading && (
                <Button disabled>
                  <Bot className="w-4 h-4 mr-2 animate-spin" />
                  Carregando...
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}