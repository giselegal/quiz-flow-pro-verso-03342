import { useState } from 'react';
import { Bot, Sparkles, Palette, BarChart3, TestTube, Calculator, Settings, ChevronLeft, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ModularEditorPro from '@/components/editor/EditorPro/components/ModularEditorPro';
import { SimpleBuilderProvider } from '@/components/editor/SimpleBuilderProviderFixed';
import { TemplatesIASidebar } from '@/components/editor/sidebars/TemplatesIASidebar';
import { BrandKitSidebar } from '@/components/editor/sidebars/BrandKitSidebar';
import { AIStepGenerator } from '@/components/editor/AIStepGenerator';
import { type FunnelTemplate } from '@/services/FunnelAIAgent';
import { useLocation } from 'wouter';

export function EditorProPageSimple() {
  const [, setLocation] = useLocation();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Handlers para funcionalidades IA
  const handleSelectTemplate = (template: FunnelTemplate) => {
    console.log('✨ Template IA aplicado:', template.meta.name);

    // Aplicar configuração de design
    if (template.design) {
      document.documentElement.style.setProperty('--primary-color', template.design.primaryColor);
      document.documentElement.style.setProperty('--secondary-color', template.design.secondaryColor);
    }

    // Fechar modal
    setActiveModal(null);

    // Tracking de uso
    localStorage.setItem('selected-template', JSON.stringify({
      name: template.meta.name,
      timestamp: Date.now(),
      steps: template.steps.length
    }));
  };

  const handleStepsGenerated = (steps: any[]) => {
    console.log('🤖 Steps IA gerados:', steps);

    // Aplicar steps ao editor
    localStorage.setItem('ai-generated-steps', JSON.stringify({
      steps,
      timestamp: Date.now(),
      count: steps.length
    }));

    // Fechar modal
    setActiveModal(null);

    // Notification
    alert(`✅ ${steps.length} steps foram gerados com IA e aplicados ao editor!`);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header Pro */}
      <div className="bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/editor')}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar ao Editor Básico
            </Button>

            <div className="h-6 border-l border-gray-300" />

            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-purple-600" />
              <h1 className="text-lg font-semibold">Editor IA Pro</h1>
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <Sparkles className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Gemini 2.0 Flash
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
          </div>
        </div>
      </div>

      {/* Toolbar Pro com Funcionalidades IA */}
      <div className="bg-white border-b">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Gerador IA */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveModal('ai-generator')}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200"
              >
                <Zap className="w-4 h-4 text-blue-600" />
                Gerar Steps IA
                <Badge className="bg-blue-600 text-white text-xs ml-1">New</Badge>
              </Button>

              {/* Templates IA */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveModal('templates')}
                className="flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Templates IA
              </Button>

              {/* Brand Kit */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveModal('brandkit')}
                className="flex items-center gap-2"
              >
                <Palette className="w-4 h-4" />
                Brand Kit
              </Button>

              {/* Analytics */}
              <Button
                variant="outline"
                size="sm"
                disabled
                className="flex items-center gap-2 opacity-60"
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
                <Badge variant="secondary" className="text-xs ml-1">Em breve</Badge>
              </Button>

              {/* A/B Testing */}
              <Button
                variant="outline"
                size="sm"
                disabled
                className="flex items-center gap-2 opacity-60"
              >
                <TestTube className="w-4 h-4" />
                A/B Testing
                <Badge variant="secondary" className="text-xs ml-1">Em breve</Badge>
              </Button>

              {/* Calculation Engine */}
              <Button
                variant="outline"
                size="sm"
                disabled
                className="flex items-center gap-2 opacity-60"
              >
                <Calculator className="w-4 h-4" />
                Cálculos IA
                <Badge variant="secondary" className="text-xs ml-1">Em breve</Badge>
              </Button>
            </div>

            <div className="text-sm text-gray-500">
              🚀 Sistema Pro ativo com IA integrada
            </div>
          </div>
        </div>
      </div>

      {/* Editor Principal */}
      <div className="flex-1 overflow-hidden">
        <SimpleBuilderProvider>
          <ModularEditorPro
            showProFeatures={true}
          />
        </SimpleBuilderProvider>
      </div>

      {/* Modals dos Sidebars */}
      {activeModal === 'ai-generator' && (
        <AIStepGenerator
          onStepsGenerated={handleStepsGenerated}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'templates' && (
        <TemplatesIASidebar
          onSelectTemplate={handleSelectTemplate}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'brandkit' && (
        <BrandKitSidebar
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}