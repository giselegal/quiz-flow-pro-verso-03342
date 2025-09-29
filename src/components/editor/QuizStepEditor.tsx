/**
 * 🎯 QUIZ STEP EDITOR - Editor de Etapas Individuais
 * 
 * Componente especializado para edição detalhada de etapas individuais do quiz.
 * Funcionalidades:
 * - ✅ Edição de conteúdo (título, pergunta, opções)
 * - ✅ Configuração de opções de resposta
 * - ✅ Personalização de estilos
 * - ✅ Validação de conteúdo
 * - ✅ Preview em tempo real
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Eye, 
  Save, 
  Settings,
  Image,
  Type,
  Palette,
  AlertCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface QuizOption {
  id: string;
  text: string;
  value: string;
  image?: string;
  score?: number;
  category?: string;
}

interface QuizStepContent {
  title: string;
  subtitle?: string;
  question: string;
  description?: string;
  options: QuizOption[];
  buttonText?: string;
  image?: string;
}

interface QuizStepSettings {
  required: boolean;
  multipleSelection: boolean;
  showProgress: boolean;
  randomizeOptions: boolean;
  allowSkip: boolean;
  timeLimit?: number;
  showHint: boolean;
  hintText?: string;
}

interface QuizStepStyles {
  backgroundColor?: string;
  textColor?: string;
  buttonColor?: string;
  fontFamily?: string;
  fontSize?: string;
  borderRadius?: string;
  padding?: string;
}

interface QuizStepEditorProps {
  stepId: string;
  initialContent?: QuizStepContent;
  initialSettings?: QuizStepSettings;
  initialStyles?: QuizStepStyles;
  onSave?: (content: QuizStepContent, settings: QuizStepSettings, styles: QuizStepStyles) => void;
  onPreview?: (content: QuizStepContent) => void;
  className?: string;
}

export default function QuizStepEditor({
  stepId,
  initialContent,
  initialSettings,
  initialStyles,
  onSave,
  onPreview,
  className = ''
}: QuizStepEditorProps) {
  const [content, setContent] = useState<QuizStepContent>(
    initialContent || {
      title: '',
      question: '',
      options: [],
      buttonText: 'Continuar'
    }
  );

  const [settings, setSettings] = useState<QuizStepSettings>(
    initialSettings || {
      required: true,
      multipleSelection: false,
      showProgress: true,
      randomizeOptions: false,
      allowSkip: false,
      showHint: false
    }
  );

  const [styles, setStyles] = useState<QuizStepStyles>(
    initialStyles || {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      buttonColor: '#3b82f6',
      fontFamily: 'Inter',
      fontSize: '16px',
      borderRadius: '8px',
      padding: '24px'
    }
  );

  const [hasChanges, setHasChanges] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Detectar mudanças
  useEffect(() => {
    setHasChanges(true);
  }, [content, settings, styles]);

  const handleContentChange = (field: keyof QuizStepContent, value: any) => {
    setContent(prev => ({ ...prev, [field]: value }));
  };

  const handleSettingsChange = (field: keyof QuizStepSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleStylesChange = (field: keyof QuizStepStyles, value: any) => {
    setStyles(prev => ({ ...prev, [field]: value }));
  };

  const handleAddOption = () => {
    const newOption: QuizOption = {
      id: `opt-${Date.now()}`,
      text: 'Nova opção',
      value: 'new-option',
      score: 0,
      category: 'default'
    };

    setContent(prev => ({
      ...prev,
      options: [...prev.options, newOption]
    }));
  };

  const handleUpdateOption = (optionId: string, field: keyof QuizOption, value: any) => {
    setContent(prev => ({
      ...prev,
      options: prev.options.map(opt =>
        opt.id === optionId ? { ...opt, [field]: value } : opt
      )
    }));
  };

  const handleDeleteOption = (optionId: string) => {
    setContent(prev => ({
      ...prev,
      options: prev.options.filter(opt => opt.id !== optionId)
    }));
  };

  const handleDuplicateOption = (optionId: string) => {
    const optionToDuplicate = content.options.find(opt => opt.id === optionId);
    if (!optionToDuplicate) return;

    const duplicatedOption: QuizOption = {
      ...optionToDuplicate,
      id: `opt-${Date.now()}`,
      text: `${optionToDuplicate.text} (Cópia)`
    };

    setContent(prev => ({
      ...prev,
      options: [...prev.options, duplicatedOption]
    }));
  };

  const handleMoveOption = (optionId: string, direction: 'up' | 'down') => {
    const currentIndex = content.options.findIndex(opt => opt.id === optionId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= content.options.length) return;

    const newOptions = [...content.options];
    [newOptions[currentIndex], newOptions[newIndex]] = [newOptions[newIndex], newOptions[currentIndex]];

    setContent(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const handleSave = () => {
    const errors = validateContent();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    onSave?.(content, settings, styles);
    setHasChanges(false);
    setValidationErrors([]);
  };

  const validateContent = (): string[] => {
    const errors: string[] = [];

    if (!content.title.trim()) {
      errors.push('O título é obrigatório');
    }

    if (!content.question.trim()) {
      errors.push('A pergunta é obrigatória');
    }

    if (content.options.length < 2) {
      errors.push('Deve haver pelo menos 2 opções de resposta');
    }

    const hasEmptyOptions = content.options.some(opt => !opt.text.trim());
    if (hasEmptyOptions) {
      errors.push('Todas as opções devem ter texto');
    }

    return errors;
  };

  const handlePreview = () => {
    onPreview?.(content);
  };

  return (
    <div className={`quiz-step-editor ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h2 className="text-lg font-semibold">Editor de Etapa</h2>
          <p className="text-sm text-gray-600">Etapa: {stepId}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          {hasChanges && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              Alterações não salvas
            </Badge>
          )}
          
          <Button variant="outline" size="sm" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          
          <Button size="sm" onClick={handleSave} disabled={!hasChanges}>
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      {/* Erros de validação */}
      {validationErrors.length > 0 && (
        <Alert variant="destructive" className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="content" className="h-full">
        <div className="flex h-[calc(100vh-200px)]">
          {/* Sidebar */}
          <div className="w-80 border-r border-gray-200 p-4">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="content" className="flex items-center gap-2">
                <Type className="w-4 h-4" />
                Conteúdo
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Config
              </TabsTrigger>
              <TabsTrigger value="styles" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Estilo
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Conteúdo da Etapa</CardTitle>
                  <CardDescription>
                    Edite o texto e opções da etapa
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={content.title}
                      onChange={(e) => handleContentChange('title', e.target.value)}
                      placeholder="Título da etapa"
                    />
                  </div>

                  <div>
                    <Label htmlFor="question">Pergunta</Label>
                    <Textarea
                      id="question"
                      value={content.question}
                      onChange={(e) => handleContentChange('question', e.target.value)}
                      placeholder="Pergunta do quiz"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="buttonText">Texto do Botão</Label>
                    <Input
                      id="buttonText"
                      value={content.buttonText || ''}
                      onChange={(e) => handleContentChange('buttonText', e.target.value)}
                      placeholder="Continuar"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Opções de Resposta</CardTitle>
                  <CardDescription>
                    {content.options.length} opções configuradas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button size="sm" onClick={handleAddOption} className="w-full mb-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Opção
                  </Button>

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {content.options.map((option, index) => (
                      <Card key={option.id} className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            Opção {index + 1}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleMoveOption(option.id, 'up')}
                              disabled={index === 0}
                            >
                              <ArrowUp className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleMoveOption(option.id, 'down')}
                              disabled={index === content.options.length - 1}
                            >
                              <ArrowDown className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDuplicateOption(option.id)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteOption(option.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Input
                            value={option.text}
                            onChange={(e) => handleUpdateOption(option.id, 'text', e.target.value)}
                            placeholder="Texto da opção"
                            className="h-8 text-sm"
                          />
                          <Input
                            value={option.value}
                            onChange={(e) => handleUpdateOption(option.id, 'value', e.target.value)}
                            placeholder="Valor da opção"
                            className="h-8 text-sm"
                          />
                          <div className="flex space-x-2">
                          <Input
                            value={option.score || 0}
                            onChange={(e) => handleUpdateOption(option.id, 'score', parseInt(e.target.value) || 0)}
                            placeholder="Pontuação"
                            type="number"
                            className="w-1/2 h-8 text-sm"
                          />
                            <Input
                              value={option.category || ''}
                              onChange={(e) => handleUpdateOption(option.id, 'category', e.target.value)}
                              placeholder="Categoria"
                              className="w-1/2 h-8 text-sm"
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Configurações</CardTitle>
                  <CardDescription>
                    Configure o comportamento da etapa
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="required">Obrigatória</Label>
                    <Switch
                      id="required"
                      checked={settings.required}
                      onCheckedChange={(checked) => handleSettingsChange('required', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="multipleSelection">Seleção múltipla</Label>
                    <Switch
                      id="multipleSelection"
                      checked={settings.multipleSelection}
                      onCheckedChange={(checked) => handleSettingsChange('multipleSelection', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="showProgress">Mostrar progresso</Label>
                    <Switch
                      id="showProgress"
                      checked={settings.showProgress}
                      onCheckedChange={(checked) => handleSettingsChange('showProgress', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="randomizeOptions">Randomizar opções</Label>
                    <Switch
                      id="randomizeOptions"
                      checked={settings.randomizeOptions}
                      onCheckedChange={(checked) => handleSettingsChange('randomizeOptions', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="allowSkip">Permitir pular</Label>
                    <Switch
                      id="allowSkip"
                      checked={settings.allowSkip}
                      onCheckedChange={(checked) => handleSettingsChange('allowSkip', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="showHint">Mostrar dica</Label>
                    <Switch
                      id="showHint"
                      checked={settings.showHint}
                      onCheckedChange={(checked) => handleSettingsChange('showHint', checked)}
                    />
                  </div>

                  {settings.showHint && (
                    <div>
                      <Label htmlFor="hintText">Texto da dica</Label>
                      <Textarea
                        id="hintText"
                        value={settings.hintText || ''}
                        onChange={(e) => handleSettingsChange('hintText', e.target.value)}
                        placeholder="Texto da dica"
                        rows={2}
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="timeLimit">Limite de tempo (segundos)</Label>
                    <Input
                      id="timeLimit"
                      type="number"
                      value={settings.timeLimit || ''}
                      onChange={(e) => handleSettingsChange('timeLimit', parseInt(e.target.value) || undefined)}
                      placeholder="Sem limite"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="styles" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Estilos Visuais</CardTitle>
                  <CardDescription>
                    Personalize a aparência da etapa
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="backgroundColor">Cor de fundo</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="backgroundColor"
                        type="color"
                        value={styles.backgroundColor}
                        onChange={(e) => handleStylesChange('backgroundColor', e.target.value)}
                        className="w-12 h-8"
                      />
                      <Input
                        value={styles.backgroundColor}
                        onChange={(e) => handleStylesChange('backgroundColor', e.target.value)}
                        placeholder="#ffffff"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="textColor">Cor do texto</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="textColor"
                        type="color"
                        value={styles.textColor}
                        onChange={(e) => handleStylesChange('textColor', e.target.value)}
                        className="w-12 h-8"
                      />
                      <Input
                        value={styles.textColor}
                        onChange={(e) => handleStylesChange('textColor', e.target.value)}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="buttonColor">Cor do botão</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="buttonColor"
                        type="color"
                        value={styles.buttonColor}
                        onChange={(e) => handleStylesChange('buttonColor', e.target.value)}
                        className="w-12 h-8"
                      />
                      <Input
                        value={styles.buttonColor}
                        onChange={(e) => handleStylesChange('buttonColor', e.target.value)}
                        placeholder="#3b82f6"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="fontFamily">Fonte</Label>
                    <select
                      id="fontFamily"
                      value={styles.fontFamily}
                      onChange={(e) => handleStylesChange('fontFamily', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="Inter">Inter</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Open Sans">Open Sans</option>
                      <option value="Lato">Lato</option>
                      <option value="Poppins">Poppins</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="fontSize">Tamanho da fonte</Label>
                    <Input
                      id="fontSize"
                      value={styles.fontSize}
                      onChange={(e) => handleStylesChange('fontSize', e.target.value)}
                      placeholder="16px"
                    />
                  </div>

                  <div>
                    <Label htmlFor="borderRadius">Borda arredondada</Label>
                    <Input
                      id="borderRadius"
                      value={styles.borderRadius}
                      onChange={(e) => handleStylesChange('borderRadius', e.target.value)}
                      placeholder="8px"
                    />
                  </div>

                  <div>
                    <Label htmlFor="padding">Espaçamento interno</Label>
                    <Input
                      id="padding"
                      value={styles.padding}
                      onChange={(e) => handleStylesChange('padding', e.target.value)}
                      placeholder="24px"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>

          {/* Preview */}
          <div className="flex-1 p-4">
            <div className="h-full border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-medium">Preview da Etapa</h3>
              </div>
              
              <div 
                className="p-6 h-full overflow-y-auto"
                style={{
                  backgroundColor: styles.backgroundColor,
                  color: styles.textColor,
                  fontFamily: styles.fontFamily,
                  fontSize: styles.fontSize,
                  borderRadius: styles.borderRadius,
                  padding: styles.padding
                }}
              >
                <h2 className="text-2xl font-bold mb-4">{content.title}</h2>
                
                {content.question && (
                  <p className="text-lg mb-6">{content.question}</p>
                )}

                {content.options.length > 0 && (
                  <div className="space-y-3">
                    {content.options.map((option, index) => (
                      <div
                        key={option.id}
                        className="p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                        style={{ borderRadius: styles.borderRadius }}
                      >
                        <div className="flex items-center">
                          <div className="w-4 h-4 border border-gray-400 rounded mr-3"></div>
                          <span>{option.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6">
                  <Button
                    style={{
                      backgroundColor: styles.buttonColor,
                      borderRadius: styles.borderRadius
                    }}
                    className="w-full"
                  >
                    {content.buttonText || 'Continuar'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
