// @ts-nocheck
// Exemplo de Integração do Editor Melhorado
// Substitui ou complementa páginas existentes como FunnelPanelPage.tsx
import React, { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { ArrowLeft, Settings, Eye, Edit3, BarChart3, Users, Calendar, Globe } from "lucide-react";

// Importar o editor melhorado
import EnhancedEditor from "../../components/editor/EnhancedEditor";

// Componente de integração para a página de edição
const EditorPage: React.FC = () => {
  const [match, params] = useRoute("/admin/funis/:funnelId/editor");
  const funnelId = params?.funnelId;

  // Verificar se a rota está correta
  if (!match || !funnelId) {
    return (
      <div style={{ backgroundColor: "#FAF9F7" }}>
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center">Erro</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p style={{ color: "#6B4F43" }}>Funil não encontrado</p>
            <Button onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <EnhancedEditor funnelId={funnelId} />;
};

// Componente alternativo - Editor Embarcado (para dashboard)
const EmbeddedEditor: React.FC<{ funnelId: string; height?: string }> = ({
  funnelId,
  height = "600px",
}) => {
  return (
    <div className="border rounded-lg overflow-hidden" style={{ height }}>
      <EnhancedEditor funnelId={funnelId} />
    </div>
  );
};

// Exemplo de como integrar no Admin Dashboard existente
const FunnelManagementPage: React.FC = () => {
  const [selectedFunnel, setSelectedFunnel] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "editor" | "analytics">("list");

  const mockFunnels = [
    {
      id: "1",
      name: "Quiz de Personalidade",
      status: "published",
      views: 1250,
      conversions: 340,
      updatedAt: "2024-12-15T10:30:00Z",
    },
    {
      id: "2",
      name: "Funil de Vendas",
      status: "draft",
      views: 0,
      conversions: 0,
      updatedAt: "2024-12-14T15:45:00Z",
    },
  ];

  const renderStatusBadge = (status: string) => {
    const variants = {
      published: "default",
      draft: "secondary",
      review: "outline",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>{status}</Badge>
    );
  };

  const renderView = () => {
    switch (view) {
      case "editor":
        return selectedFunnel ? (
          <div className="h-full">
            <div className="flex items-center gap-4 p-4 border-b">
              <Button variant="ghost" size="sm" onClick={() => setView("list")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para Lista
              </Button>
              <h2 className="text-lg font-semibold">
                Editando: {mockFunnels.find(f => f.id === selectedFunnel)?.name}
              </h2>
            </div>
            <div className="flex-1">
              <EnhancedEditor funnelId={selectedFunnel} />
            </div>
          </div>
        ) : null;

      case "analytics":
        return (
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" size="sm" onClick={() => setView("list")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <h2 className="text-lg font-semibold">Analytics Avançado</h2>
            </div>
            {/* Aqui você pode importar e usar o AdvancedAnalytics diretamente */}
            <Card>
              <CardContent className="p-6">
                <p style={{ color: "#6B4F43" }}>Dashboard de Analytics estará aqui</p>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Gestão de Funis</h1>
              <Button onClick={() => setSelectedFunnel("new")}>
                <Edit3 className="h-4 w-4 mr-2" />
                Novo Funil
              </Button>
            </div>

            <div className="grid gap-4">
              {mockFunnels.map(funnel => (
                <Card key={funnel.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{funnel.name}</h3>
                          {renderStatusBadge(funnel.status)}
                        </div>

                        <div style={{ color: "#6B4F43" }}>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {funnel.views} visualizações
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {funnel.conversions} conversões
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(funnel.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedFunnel(funnel.id);
                            setView("analytics");
                          }}
                        >
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Analytics
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/preview/${funnel.id}`, "_blank")}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>

                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedFunnel(funnel.id);
                            setView("editor");
                          }}
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
    }
  };

  return <div style={{ backgroundColor: "#FAF9F7" }}>{renderView()}</div>;
};

// Hook personalizado para facilitar integração
const useEnhancedEditor = (funnelId: string) => {
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [funnelData, setFunnelData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Carregar dados do funil
    const loadFunnel = async () => {
      if (!funnelId || funnelId === "new") {
        setIsEditorReady(true);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Importar o serviço existente
        const { funnelService } = await import("../../services/funnelService");
        const data = await funnelService.loadFunnelData(funnelId);

        if (!isMounted) return;

        if (data) {
          setFunnelData(data);
          setIsEditorReady(true);
        } else {
          setError("Funil não encontrado");
        }
      } catch (error) {
        console.error("Erro ao carregar funil:", error);
        if (isMounted) {
          setError("Erro ao carregar dados do funil");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadFunnel();

    return () => {
      isMounted = false;
    };
  }, [funnelId]);

  // Métodos para ações do funil
  const saveFunnel = async (updatedData: any) => {
    try {
      const { funnelService } = await import("../../services/funnelService");
      const result = await funnelService.saveFunnelData(updatedData);
      if (result) {
        // Recarregar dados após salvar
        const freshData = await funnelService.loadFunnelData(funnelId);
        if (freshData) {
          setFunnelData(freshData);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao salvar funil:", error);
      return false;
    }
  };

  const publishFunnel = async () => {
    try {
      const { funnelService } = await import("../../services/funnelService");
      const result = await funnelService.updateFunnel(funnelId, {});
      return !!result;
    } catch (error) {
      console.error("Erro ao publicar funil:", error);
      return false;
    }
  };

  const deleteFunnel = async () => {
    try {
      const { funnelService } = await import("../../services/funnelService");
      await funnelService.deleteFunnel(funnelId);
      return true;
    } catch (error) {
      console.error("Erro ao deletar funil:", error);
      return false;
    }
  };

  return {
    // Estados
    isEditorReady,
    funnelData,
    isLoading,
    error,

    // Métodos de ação
    saveFunnel,
    publishFunnel,
    deleteFunnel,

    // Métodos de navegação
    openEditor: () => window.open(`/admin/funis/${funnelId}/editor`, "_blank"),
    openPreview: () => window.open(`/preview/${funnelId}`, "_blank"),
    openAnalytics: () => window.open(`/admin/funis/${funnelId}/analytics`, "_blank"),

    // Método para recarregar dados
    refresh: () => {
      setIsEditorReady(false);
      setIsLoading(true);
      setError(null);
      // O useEffect será chamado novamente devido à mudança de estado
    },
  };
};

// Exemplo de uso em um componente existente
const ExistingComponentExample: React.FC = () => {
  const funnelId = "exemplo-123";
  const {
    isEditorReady,
    isLoading,
    error,
    funnelData,
    openEditor,
    openPreview,
    saveFunnel,
    publishFunnel,
    deleteFunnel,
    refresh,
  } = useEnhancedEditor(funnelId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p style={{ color: "#6B4F43" }}>Carregando funil...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div style={{ color: "#432818" }}>❌</div>
            <p style={{ color: "#432818" }}>{error}</p>
            <Button onClick={refresh} size="sm">
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Ações do Funil
          {funnelData && (
            <Badge variant="outline" className="text-xs">
              {funnelData.name || "Sem nome"}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button onClick={openEditor} disabled={!isEditorReady} className="w-full">
          <Edit3 className="h-4 w-4 mr-2" />
          Abrir Editor Melhorado
        </Button>

        <Button variant="outline" onClick={openPreview} className="w-full">
          <Eye className="h-4 w-4 mr-2" />
          Visualizar Funil
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              const success = await publishFunnel();
              if (success) {
                alert("Funil publicado com sucesso!");
                refresh();
              } else {
                alert("Erro ao publicar funil");
              }
            }}
          >
            Publicar
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={async () => {
              if (confirm("Tem certeza que deseja deletar este funil?")) {
                const success = await deleteFunnel();
                if (success) {
                  alert("Funil deletado com sucesso!");
                } else {
                  alert("Erro ao deletar funil");
                }
              }
            }}
          >
            Deletar
          </Button>
        </div>

        {funnelData && (
          <div style={{ backgroundColor: "#FAF9F7" }}>
            <p>
              <strong>ID:</strong> {funnelData.id}
            </p>
            <p>
              <strong>Páginas:</strong> {funnelData.pages?.length || 0}
            </p>
            <p>
              <strong>Última atualização:</strong> {new Date().toLocaleDateString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EditorPage;
export { EmbeddedEditor, FunnelManagementPage, useEnhancedEditor, ExistingComponentExample };
