import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import {
    Plus,
    ArrowRight,
    Settings,
    Link as LinkIcon,
    CheckCircle,
    AlertCircle,
    Trash2,
    Edit,
    Save,
    Eye,
    Shuffle
} from 'lucide-react';

// Types para configuração de conexões
interface StepConnection {
    id: string;
    fromStep: number;
    toStep: number | 'conditional' | 'end';
    condition?: {
        type: 'answer' | 'score' | 'always';
        operator?: '=' | '>' | '<' | '>=' | '<=';
        value?: string | number;
        questionId?: string;
    };
    label: string;
    isActive: boolean;
}

interface StepFlowConfig {
    totalSteps: number;
    connections: StepConnection[];
    defaultFlow: 'linear' | 'custom';
    hasConditionalLogic: boolean;
}

interface StepNoCodeConnectionsProps {
    onClose?: () => void;
}

const StepNoCodeConnections: React.FC<StepNoCodeConnectionsProps> = ({ onClose }) => {
    const { toast } = useToast();

    // Estado para configuração do fluxo
    const [flowConfig, setFlowConfig] = useState<StepFlowConfig>({
        totalSteps: 21,
        connections: [],
        defaultFlow: 'linear',
        hasConditionalLogic: false
    });

    const [newConnection, setNewConnection] = useState<Partial<StepConnection>>({
        fromStep: 1,
        toStep: 2,
        condition: { type: 'always' },
        label: '',
        isActive: true
    });

    // Carregar configuração salva
    useEffect(() => {
        const savedConfig = localStorage.getItem('quiz-step-connections');
        if (savedConfig) {
            try {
                const parsed = JSON.parse(savedConfig);
                setFlowConfig(parsed);
            } catch (error) {
                console.warn('Erro ao carregar configuração de conexões:', error);
            }
        } else {
            // Criar fluxo linear padrão
            initializeDefaultFlow();
        }
    }, []);

    const initializeDefaultFlow = () => {
        const defaultConnections: StepConnection[] = [];
        for (let i = 1; i < flowConfig.totalSteps; i++) {
            defaultConnections.push({
                id: `step-${i}-to-${i + 1}`,
                fromStep: i,
                toStep: i + 1,
                condition: { type: 'always' },
                label: `Etapa ${i} → Etapa ${i + 1}`,
                isActive: true
            });
        }

        // Conexão final para página de resultado
        defaultConnections.push({
            id: `step-${flowConfig.totalSteps}-to-end`,
            fromStep: flowConfig.totalSteps,
            toStep: 'end',
            condition: { type: 'always' },
            label: `Etapa ${flowConfig.totalSteps} → Resultado`,
            isActive: true
        });

        setFlowConfig(prev => ({
            ...prev,
            connections: defaultConnections
        }));
    };

    const addConnection = () => {
        if (!newConnection.fromStep || !newConnection.toStep || !newConnection.label) {
            toast({
                title: "Campos obrigatórios",
                description: "Preencha todos os campos para criar a conexão.",
                variant: "destructive"
            });
            return;
        }

        const connection: StepConnection = {
            id: `conn-${Date.now()}`,
            fromStep: newConnection.fromStep as number,
            toStep: newConnection.toStep as number | 'conditional' | 'end',
            condition: newConnection.condition || { type: 'always' },
            label: newConnection.label as string,
            isActive: true
        };

        setFlowConfig(prev => ({
            ...prev,
            connections: [...prev.connections, connection],
            hasConditionalLogic: prev.hasConditionalLogic || connection.condition?.type !== 'always'
        }));

        // Reset form
        setNewConnection({
            fromStep: 1,
            toStep: 2,
            condition: { type: 'always' },
            label: '',
            isActive: true
        });

        toast({
            title: "Conexão criada!",
            description: `Conexão "${connection.label}" adicionada com sucesso.`
        });
    };

    const updateConnection = (id: string, updates: Partial<StepConnection>) => {
        setFlowConfig(prev => ({
            ...prev,
            connections: prev.connections.map(conn =>
                conn.id === id ? { ...conn, ...updates } : conn
            )
        }));
    };

    const deleteConnection = (id: string) => {
        setFlowConfig(prev => ({
            ...prev,
            connections: prev.connections.filter(conn => conn.id !== id)
        }));

        toast({
            title: "Conexão removida",
            description: "A conexão foi removida do fluxo."
        });
    };

    const saveConfiguration = () => {
        localStorage.setItem('quiz-step-connections', JSON.stringify(flowConfig));

        toast({
            title: "Configuração salva!",
            description: "As conexões entre etapas foram salvas com sucesso."
        });
    };

    const previewFlow = () => {
        // Abrir preview em nova janela
        const previewWindow = window.open('', '_blank', 'width=1200,height=800');
        if (previewWindow) {
            const flowHtml = generateFlowPreview();
            previewWindow.document.write(flowHtml);
            previewWindow.document.close();
        }
    };

    const generateFlowPreview = () => {
        const connections = flowConfig.connections;
        const steps = Array.from({ length: flowConfig.totalSteps }, (_, i) => i + 1);

        return `
      <html>
        <head>
          <title>Preview do Fluxo de Etapas</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
            .flow-container { max-width: 1200px; margin: 0 auto; }
            .flow-header { text-align: center; margin-bottom: 30px; }
            .flow-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
            .step-card { 
              background: white; 
              border-radius: 8px; 
              padding: 20px; 
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              position: relative;
            }
            .step-header { font-weight: bold; margin-bottom: 10px; color: #333; }
            .connection { 
              background: #e3f2fd; 
              border-left: 4px solid #2196f3; 
              padding: 8px 12px; 
              margin: 5px 0;
              border-radius: 4px;
            }
            .connection.conditional { border-left-color: #ff9800; background: #fff3e0; }
            .connection.end { border-left-color: #4caf50; background: #e8f5e8; }
            .stats { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="flow-container">
            <div class="flow-header">
              <h1>🔗 Fluxo de Etapas - Preview</h1>
              <p>Configuração atual das conexões entre etapas</p>
            </div>
            
            <div class="stats">
              <h3>📊 Estatísticas</h3>
              <p><strong>Total de Etapas:</strong> ${flowConfig.totalSteps}</p>
              <p><strong>Total de Conexões:</strong> ${connections.length}</p>
              <p><strong>Tipo de Fluxo:</strong> ${flowConfig.defaultFlow === 'linear' ? 'Linear' : 'Personalizado'}</p>
              <p><strong>Lógica Condicional:</strong> ${flowConfig.hasConditionalLogic ? 'Sim' : 'Não'}</p>
            </div>
            
            <div class="flow-grid">
              ${steps.map(step => {
            const stepConnections = connections.filter(conn => conn.fromStep === step);
            return `
                  <div class="step-card">
                    <div class="step-header">📄 Etapa ${step}</div>
                    <div>
                      <strong>Conexões de saída:</strong>
                      ${stepConnections.map(conn => `
                        <div class="connection ${conn.toStep === 'end' ? 'end' : conn.condition?.type !== 'always' ? 'conditional' : ''}">
                          ${conn.label}
                          ${conn.condition?.type !== 'always' ? `<br><small>Condição: ${conn.condition?.type}</small>` : ''}
                        </div>
                      `).join('')}
                      ${stepConnections.length === 0 ? '<div style="color: #666; font-style: italic;">Nenhuma conexão</div>' : ''}
                    </div>
                  </div>
                `;
        }).join('')}
              
              <div class="step-card">
                <div class="step-header">🎯 Página de Resultado</div>
                <div>
                  <strong>Conexões de entrada:</strong>
                  ${connections.filter(conn => conn.toStep === 'end').map(conn => `
                    <div class="connection end">
                      ${conn.label}
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-[#432818]">🔗 Conexões Entre Etapas</h2>
                    <p className="text-[#8F7A6A] mt-1">
                        Configure como as etapas se conectam e o fluxo de navegação do quiz
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={previewFlow}
                        variant="outline"
                        className="border-[#B89B7A] text-[#B89B7A]"
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                    </Button>
                    <Button
                        onClick={saveConfiguration}
                        className="bg-[#B89B7A] hover:bg-[#A0895B] text-white"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Salvar
                    </Button>
                    {onClose && (
                        <Button onClick={onClose} variant="outline">
                            Fechar
                        </Button>
                    )}
                </div>
            </div>

            {/* Configuração Global */}
            <Card className="border-0" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 20px rgba(184, 155, 122, 0.1)' }}>
                <CardHeader>
                    <CardTitle className="text-[#432818] flex items-center gap-2">
                        <Settings className="w-5 h-5" style={{ color: '#B89B7A' }} />
                        Configuração Global
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="total-steps">Total de Etapas</Label>
                            <Input
                                id="total-steps"
                                type="number"
                                min={1}
                                max={50}
                                value={flowConfig.totalSteps}
                                onChange={(e) => setFlowConfig(prev => ({
                                    ...prev,
                                    totalSteps: parseInt(e.target.value) || 21
                                }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="default-flow">Tipo de Fluxo</Label>
                            <Select
                                value={flowConfig.defaultFlow}
                                onValueChange={(value: 'linear' | 'custom') =>
                                    setFlowConfig(prev => ({ ...prev, defaultFlow: value }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="linear">Linear (1→2→3...)</SelectItem>
                                    <SelectItem value="custom">Personalizado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center space-x-2 pt-6">
                            <Switch
                                checked={flowConfig.hasConditionalLogic}
                                onCheckedChange={(checked) =>
                                    setFlowConfig(prev => ({ ...prev, hasConditionalLogic: checked }))
                                }
                            />
                            <Label>Lógica Condicional</Label>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={initializeDefaultFlow}
                            variant="outline"
                            className="border-[#B89B7A] text-[#B89B7A]"
                        >
                            <Shuffle className="w-4 h-4 mr-2" />
                            Gerar Fluxo Linear
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="connections" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="connections">Gerenciar Conexões</TabsTrigger>
                    <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                </TabsList>

                {/* Aba de Conexões */}
                <TabsContent value="connections" className="space-y-4">
                    {/* Criar Nova Conexão */}
                    <Card className="border-0" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 20px rgba(184, 155, 122, 0.1)' }}>
                        <CardHeader>
                            <CardTitle className="text-[#432818] flex items-center gap-2">
                                <Plus className="w-5 h-5" style={{ color: '#B89B7A' }} />
                                Nova Conexão
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="from-step">De (Etapa)</Label>
                                    <Select
                                        value={newConnection.fromStep?.toString()}
                                        onValueChange={(value) =>
                                            setNewConnection(prev => ({ ...prev, fromStep: parseInt(value) }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from({ length: flowConfig.totalSteps }, (_, i) => (
                                                <SelectItem key={i + 1} value={(i + 1).toString()}>
                                                    Etapa {i + 1}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="to-step">Para</Label>
                                    <Select
                                        value={newConnection.toStep?.toString()}
                                        onValueChange={(value) =>
                                            setNewConnection(prev => ({
                                                ...prev,
                                                toStep: value === 'end' ? 'end' : parseInt(value)
                                            }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from({ length: flowConfig.totalSteps }, (_, i) => (
                                                <SelectItem key={i + 1} value={(i + 1).toString()}>
                                                    Etapa {i + 1}
                                                </SelectItem>
                                            ))}
                                            <SelectItem value="end">🎯 Página de Resultado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="condition-type">Condição</Label>
                                    <Select
                                        value={newConnection.condition?.type}
                                        onValueChange={(value: 'always' | 'answer' | 'score') =>
                                            setNewConnection(prev => ({
                                                ...prev,
                                                condition: { ...prev.condition, type: value }
                                            }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="always">Sempre</SelectItem>
                                            <SelectItem value="answer">Baseado em Resposta</SelectItem>
                                            <SelectItem value="score">Baseado em Pontuação</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="connection-label">Rótulo</Label>
                                    <Input
                                        id="connection-label"
                                        value={newConnection.label}
                                        onChange={(e) =>
                                            setNewConnection(prev => ({ ...prev, label: e.target.value }))
                                        }
                                        placeholder="Ex: Próxima etapa"
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={addConnection}
                                className="bg-[#B89B7A] hover:bg-[#A0895B] text-white"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Adicionar Conexão
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Lista de Conexões */}
                    <Card className="border-0" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 20px rgba(184, 155, 122, 0.1)' }}>
                        <CardHeader>
                            <CardTitle className="text-[#432818] flex items-center gap-2">
                                <LinkIcon className="w-5 h-5" style={{ color: '#B89B7A' }} />
                                Conexões Ativas ({flowConfig.connections.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {flowConfig.connections.map((connection) => (
                                    <div
                                        key={connection.id}
                                        className="flex items-center justify-between p-4 rounded-lg border"
                                        style={{ backgroundColor: '#F8F6F3', borderColor: '#E6DDD4' }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <Badge variant={connection.isActive ? "default" : "secondary"}>
                                                    Etapa {connection.fromStep}
                                                </Badge>
                                                <ArrowRight className="w-4 h-4 text-[#B89B7A]" />
                                                <Badge variant={connection.toStep === 'end' ? "destructive" : "outline"}>
                                                    {connection.toStep === 'end' ? 'Resultado' : `Etapa ${connection.toStep}`}
                                                </Badge>
                                            </div>

                                            <div>
                                                <span className="font-medium text-[#432818]">{connection.label}</span>
                                                <div className="text-sm text-[#8F7A6A]">
                                                    {connection.condition?.type === 'always' ? 'Sempre' :
                                                        connection.condition?.type === 'answer' ? 'Condição: Resposta' :
                                                            'Condição: Pontuação'}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={connection.isActive}
                                                onCheckedChange={(checked) =>
                                                    updateConnection(connection.id, { isActive: checked })
                                                }
                                            />
                                            <Button
                                                onClick={() => setNewConnection(connection)}
                                                size="sm"
                                                variant="outline"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                onClick={() => deleteConnection(connection.id)}
                                                size="sm"
                                                variant="destructive"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                {flowConfig.connections.length === 0 && (
                                    <div className="text-center py-8 text-[#8F7A6A]">
                                        <LinkIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>Nenhuma conexão configurada</p>
                                        <p className="text-sm">Adicione conexões para definir o fluxo entre etapas</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Aba de Visão Geral */}
                <TabsContent value="overview">
                    <Card className="border-0" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 20px rgba(184, 155, 122, 0.1)' }}>
                        <CardHeader>
                            <CardTitle className="text-[#432818] flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" style={{ color: '#B89B7A' }} />
                                Visão Geral do Fluxo
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#F3E8E6' }}>
                                    <div className="text-2xl font-bold text-[#432818]">
                                        {flowConfig.totalSteps}
                                    </div>
                                    <div className="text-sm text-[#8F7A6A]">Total de Etapas</div>
                                </div>

                                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#F3E8E6' }}>
                                    <div className="text-2xl font-bold text-[#432818]">
                                        {flowConfig.connections.length}
                                    </div>
                                    <div className="text-sm text-[#8F7A6A]">Conexões Configuradas</div>
                                </div>

                                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#F3E8E6' }}>
                                    <div className="text-2xl font-bold text-[#432818]">
                                        {flowConfig.connections.filter(c => c.isActive).length}
                                    </div>
                                    <div className="text-sm text-[#8F7A6A]">Conexões Ativas</div>
                                </div>
                            </div>

                            <div className="mt-6 p-4 rounded-lg border" style={{ backgroundColor: '#F8F6F3' }}>
                                <h4 className="font-medium text-[#432818] mb-2">🎯 Status da Configuração</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        {flowConfig.connections.length > 0 ? (
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <AlertCircle className="w-4 h-4 text-orange-500" />
                                        )}
                                        <span>
                                            {flowConfig.connections.length > 0 ?
                                                'Conexões configuradas' :
                                                'Nenhuma conexão configurada'
                                            }
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {flowConfig.defaultFlow === 'linear' ? (
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <AlertCircle className="w-4 h-4 text-blue-500" />
                                        )}
                                        <span>
                                            Fluxo {flowConfig.defaultFlow === 'linear' ? 'Linear' : 'Personalizado'}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {flowConfig.hasConditionalLogic ? (
                                            <CheckCircle className="w-4 h-4 text-blue-500" />
                                        ) : (
                                            <CheckCircle className="w-4 h-4 text-gray-500" />
                                        )}
                                        <span>
                                            Lógica condicional {flowConfig.hasConditionalLogic ? 'habilitada' : 'desabilitada'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default StepNoCodeConnections;
