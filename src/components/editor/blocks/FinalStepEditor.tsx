import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { styleConfig } from "@/data/styleConfig";
import React, { useState } from "react";
import StyleResultsEditor from "./StyleResultsEditor";

interface FinalStepEditorProps {
  stepConfig: {
    stepNumber: number;
    title: string;
    subtitle?: string;
    styleResult?: {
      selectedStyle: string;
      showAllStyles: boolean;
      showGuideImage: boolean;
    };
  };
  onChange: (config: any) => void;
}

const FinalStepEditor: React.FC<FinalStepEditorProps> = ({ stepConfig, onChange }) => {
  const [activeTab, setActiveTab] = useState("general");

  // Valores padrão
  const {
    stepNumber = 21,
    title = "Seu Resultado",
    subtitle = "Descubra seu estilo predominante",
    styleResult = {
      selectedStyle: Object.keys(styleConfig)[0],
      showAllStyles: false,
      showGuideImage: true,
    },
  } = stepConfig;

  // Função para atualizar a configuração
  const updateConfig = (updates: Partial<FinalStepEditorProps["stepConfig"]>) => {
    onChange({
      ...stepConfig,
      ...updates,
    });
  };

  // Atualizar configuração de resultado de estilo
  const updateStyleResult = (updates: Partial<typeof styleResult>) => {
    updateConfig({
      styleResult: {
        ...styleResult,
        ...updates,
      },
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="general" className="flex-1">
            Geral
          </TabsTrigger>
          <TabsTrigger value="style-result" className="flex-1">
            Resultado de Estilo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="step-number">Número da Etapa</Label>
                <Input
                  id="step-number"
                  type="number"
                  value={stepNumber}
                  onChange={e => updateConfig({ stepNumber: Number(e.target.value) })}
                />
              </div>

              <div>
                <Label htmlFor="step-title">Título</Label>
                <Input
                  id="step-title"
                  value={title}
                  onChange={e => updateConfig({ title: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="step-subtitle">Subtítulo</Label>
                <Input
                  id="step-subtitle"
                  value={subtitle}
                  onChange={e => updateConfig({ subtitle: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="style-result" className="mt-4">
          <StyleResultsEditor
            selectedStyle={styleResult.selectedStyle}
            showAllStyles={styleResult.showAllStyles}
            showGuideImage={styleResult.showGuideImage}
            onChange={updateStyleResult}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinalStepEditor;
