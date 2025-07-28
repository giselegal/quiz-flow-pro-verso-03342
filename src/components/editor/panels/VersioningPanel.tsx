import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  History, GitBranch, Download, Upload, 
  Save, RotateCcw, Tag, Calendar, User,
  MoreVertical, Eye, Copy, Trash2
} from 'lucide-react';
import { QuizFunnel, QuizVariant } from '@/interfaces/quiz';
import { useVersionManager } from '@/hooks/useVersionManager';
import styles from '@/styles/editor.module.css';

interface VersioningPanelProps {
  funnel: QuizFunnel;
  onFunnelUpdate: (funnel: QuizFunnel) => void;
}

const VersioningPanel: React.FC<VersioningPanelProps> = ({
  funnel,
  onFunnelUpdate,
}) => {
  const {
    versions,
    currentVersion,
    saveVersion,
    loadVersion,
    deleteVersion,
    createBackup,
    restoreBackup,
  } = useVersionManager(funnel.id);

  const [isCreatingVersion, setIsCreatingVersion] = useState(false);
  const [versionName, setVersionName] = useState('');
  const [versionDescription, setVersionDescription] = useState('');
  const [showVariants, setShowVariants] = useState(false);
  const [newVariantData, setNewVariantData] = useState({
    name: '',
    description: '',
    trafficPercent: 50,
  });

  const handleSaveVersion = async () => {
    if (!versionName.trim()) return;

    await saveVersion(
      funnel,
      versionName,
      versionDescription || `Versão salva em ${new Date().toLocaleString()}`
    );

    setIsCreatingVersion(false);
    setVersionName('');
    setVersionDescription('');
  };

  const handleLoadVersion = async (versionId: string) => {
    const loadedFunnel = await loadVersion(versionId);
    if (loadedFunnel) {
      onFunnelUpdate(loadedFunnel);
    }
  };

  const handleCreateVariant = () => {
    if (!newVariantData.name.trim()) return;

    const newVariant: QuizVariant = {
      id: `variant_${Date.now()}`,
      name: newVariantData.name,
      description: newVariantData.description,
      pages: funnel.pages,
      trafficPercent: newVariantData.trafficPercent,
      isActive: false,
      createdAt: new Date().toISOString(),
    };

    const updatedFunnel = {
      ...funnel,
      variants: [...(funnel.variants || []), newVariant],
    };

    onFunnelUpdate(updatedFunnel);
    setNewVariantData({ name: '', description: '', trafficPercent: 50 });
  };

  const handleDeleteVariant = (variantId: string) => {
    const updatedVariants = (funnel.variants || []).filter(v => v.id !== variantId);
    const updatedFunnel = {
      ...funnel,
      variants: updatedVariants,
    };
    onFunnelUpdate(updatedFunnel);
  };

  const handleToggleVariant = (variantId: string) => {
    const updatedVariants = (funnel.variants || []).map(variant =>
      variant.id === variantId
        ? { ...variant, isActive: !variant.isActive }
        : variant
    );

    const updatedFunnel = {
      ...funnel,
      variants: updatedVariants,
    };

    onFunnelUpdate(updatedFunnel);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={styles.versioningPanel}>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>
          <History className="h-5 w-5" />
          Versões & Testes A/B
        </h2>
        <div className={styles.headerActions}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => createBackup(funnel)}
          >
            <Save className="h-4 w-4" />
            Backup
          </Button>
          <Button
            size="sm"
            onClick={() => setIsCreatingVersion(true)}
          >
            <Tag className="h-4 w-4" />
            Nova Versão
          </Button>
        </div>
      </div>

      <div className={styles.panelTabs}>
        <button
          className={`${styles.tabButton} ${!showVariants ? styles.active : ''}`}
          onClick={() => setShowVariants(false)}
        >
          <History className="h-4 w-4" />
          Histórico
        </button>
        <button
          className={`${styles.tabButton} ${showVariants ? styles.active : ''}`}
          onClick={() => setShowVariants(true)}
        >
          <GitBranch className="h-4 w-4" />
          Testes A/B
        </button>
      </div>

      <ScrollArea className={styles.panelContent}>
        {!showVariants ? (
          <div className={styles.versionsSection}>
            {isCreatingVersion && (
              <Card className={styles.newVersionCard}>
                <CardHeader>
                  <CardTitle>Salvar Nova Versão</CardTitle>
                </CardHeader>
                <CardContent className={styles.newVersionForm}>
                  <div className={styles.formField}>
                    <label>Nome da Versão</label>
                    <input
                      type="text"
                      value={versionName}
                      onChange={(e) => setVersionName(e.target.value)}
                      placeholder="v1.0.0 ou Versão inicial"
                      className={styles.formInput}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label>Descrição (opcional)</label>
                    <textarea
                      value={versionDescription}
                      onChange={(e) => setVersionDescription(e.target.value)}
                      placeholder="Descreva as mudanças desta versão"
                      className={styles.formTextarea}
                      rows={3}
                    />
                  </div>

                  <div className={styles.formActions}>
                    <Button
                      variant="ghost"
                      onClick={() => setIsCreatingVersion(false)}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveVersion}>
                      Salvar Versão
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className={styles.versionsList}>
              {versions.map((version) => {
                const isCurrentVersion = version.id === currentVersion;

                return (
                  <Card 
                    key={version.id}
                    className={`${styles.versionCard} ${isCurrentVersion ? styles.current : ''}`}
                  >
                    <CardHeader className={styles.versionHeader}>
                      <div className={styles.versionInfo}>
                        <div className={styles.versionMain}>
                          <h3 className={styles.versionName}>
                            {version.name}
                            {isCurrentVersion && (
                              <Badge variant="secondary" className="ml-2">
                                Atual
                              </Badge>
                            )}
                          </h3>
                          <p className={styles.versionDescription}>
                            {version.description}
                          </p>
                        </div>
                        <div className={styles.versionMeta}>
                          <div className={styles.metaItem}>
                            <Calendar className="h-3 w-3" />
                            {formatDate(version.createdAt)}
                          </div>
                          <div className={styles.metaItem}>
                            <User className="h-3 w-3" />
                            Editor
                          </div>
                        </div>
                      </div>

                      <div className={styles.versionActions}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLoadVersion(version.id)}
                          disabled={isCurrentVersion}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {/* Download version */}}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteVersion(version.id)}
                          disabled={isCurrentVersion}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}

              {versions.length === 0 && (
                <div className={styles.emptyState}>
                  <History className="h-12 w-12 opacity-50" />
                  <h3>Nenhuma versão salva</h3>
                  <p>Salve versões para manter um histórico das suas alterações.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.variantsSection}>
            <Card className={styles.newVariantCard}>
              <CardHeader>
                <CardTitle>Criar Variante para Teste A/B</CardTitle>
              </CardHeader>
              <CardContent className={styles.newVariantForm}>
                <div className={styles.formGrid}>
                  <div className={styles.formField}>
                    <label>Nome da Variante</label>
                    <input
                      type="text"
                      value={newVariantData.name}
                      onChange={(e) => setNewVariantData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Variante B, Teste CTA Verde, etc."
                      className={styles.formInput}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label>% do Tráfego</label>
                    <input
                      type="number"
                      value={newVariantData.trafficPercent}
                      onChange={(e) => setNewVariantData(prev => ({ ...prev, trafficPercent: parseInt(e.target.value) }))}
                      min="1"
                      max="100"
                      className={styles.formInput}
                    />
                  </div>
                </div>

                <div className={styles.formField}>
                  <label>Descrição</label>
                  <textarea
                    value={newVariantData.description}
                    onChange={(e) => setNewVariantData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descreva o que está sendo testado"
                    className={styles.formTextarea}
                    rows={2}
                  />
                </div>

                <Button onClick={handleCreateVariant} className="w-full">
                  <GitBranch className="h-4 w-4 mr-2" />
                  Criar Variante
                </Button>
              </CardContent>
            </Card>

            <div className={styles.variantsList}>
              {(funnel.variants || []).map((variant) => (
                <Card key={variant.id} className={styles.variantCard}>
                  <CardHeader className={styles.variantHeader}>
                    <div className={styles.variantInfo}>
                      <div className={styles.variantMain}>
                        <h3 className={styles.variantName}>
                          {variant.name}
                          <Badge 
                            variant={variant.isActive ? "default" : "secondary"}
                            className="ml-2"
                          >
                            {variant.isActive ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </h3>
                        <p className={styles.variantDescription}>
                          {variant.description}
                        </p>
                      </div>
                      <div className={styles.variantStats}>
                        <div className={styles.statItem}>
                          <span className={styles.statLabel}>Tráfego</span>
                          <span className={styles.statValue}>{variant.trafficPercent}%</span>
                        </div>
                        <div className={styles.statItem}>
                          <span className={styles.statLabel}>Páginas</span>
                          <span className={styles.statValue}>{variant.pages.length}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.variantActions}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleVariant(variant.id)}
                      >
                        {variant.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {/* Edit variant */}}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteVariant(variant.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}

              {(!funnel.variants || funnel.variants.length === 0) && (
                <div className={styles.emptyState}>
                  <GitBranch className="h-12 w-12 opacity-50" />
                  <h3>Nenhum teste A/B configurado</h3>
                  <p>Crie variantes para testar diferentes versões do seu funil.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </ScrollArea>

      <div className={styles.panelFooter}>
        <div className={styles.quickActions}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => restoreBackup()}
          >
            <Upload className="h-4 w-4" />
            Restaurar Backup
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VersioningPanel;
