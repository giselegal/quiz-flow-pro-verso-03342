import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { QuizFunnel, SimplePage } from '@/interfaces/quiz';
import styles from '@/styles/editor.module.css';
import { ArrowDown, ArrowUp, Copy, FolderTree, MoreVertical, Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { generateSemanticId } from '../../../utils/semanticIdGenerator';

interface FunnelManagementPanelProps {
  funnel: QuizFunnel;
  onFunnelUpdate: (funnel: QuizFunnel) => void;
  onPageSelect: (pageIndex: number) => void;
  selectedPageIndex: number;
}

const FunnelManagementPanel: React.FC<FunnelManagementPanelProps> = ({
  funnel,
  onFunnelUpdate,
  onPageSelect,
  selectedPageIndex,
}) => {
  const [showPageSettings, setShowPageSettings] = useState<string | null>(null);
  const [isCreatingPage, setIsCreatingPage] = useState(false);
  const [newPageData, setNewPageData] = useState({
    title: '',
    type: 'question' as SimplePage['type'],
  });

  const pageTypes = [
    { value: 'intro', label: 'Introdução', icon: '🏁', color: 'blue' },
    { value: 'question', label: 'Pergunta', icon: '❓', color: 'green' },
    { value: 'loading', label: 'Carregamento', icon: '⏳', color: 'yellow' },
    { value: 'result', label: 'Resultado', icon: '🎯', color: 'purple' },
    { value: 'offer', label: 'Oferta', icon: '💰', color: 'orange' },
    { value: 'sales', label: 'Vendas', icon: '🛒', color: 'red' },
    { value: 'checkout', label: 'Checkout', icon: '💳', color: 'indigo' },
    { value: 'upsell', label: 'Upsell', icon: '⬆️', color: 'pink' },
    { value: 'thankyou', label: 'Obrigado', icon: '🙏', color: 'teal' },
  ];

  const getPageTypeInfo = (type: string) => {
    return pageTypes.find(pt => pt.value === type) || pageTypes[1];
  };

  const handleCreatePage = () => {
    const newPage: SimplePage = {
      id: generateSemanticId({
        context: 'funnel',
        type: 'page',
        identifier: 'page',
        index: Math.floor(Math.random() * 1000),
      }),
      title: newPageData.title || `Nova ${getPageTypeInfo(newPageData.type).label}`,
      type: newPageData.type,
      progress: Math.round((funnel.pages.length / (funnel.pages.length + 1)) * 100),
      showHeader: true,
      showProgress: true,
      components: [],
    };

    const updatedFunnel = {
      ...funnel,
      pages: [...funnel.pages, newPage],
    };

    onFunnelUpdate(updatedFunnel);
    setIsCreatingPage(false);
    setNewPageData({ title: '', type: 'question' });
  };

  const handleDeletePage = (pageIndex: number) => {
    if (funnel.pages.length <= 1) return; // Não permitir deletar a última página

    const updatedPages = funnel.pages.filter((_, index) => index !== pageIndex);
    const updatedFunnel = {
      ...funnel,
      pages: updatedPages,
    };

    onFunnelUpdate(updatedFunnel);

    // Ajustar seleção se necessário
    if (selectedPageIndex >= updatedPages.length) {
      onPageSelect(updatedPages.length - 1);
    } else if (selectedPageIndex === pageIndex && selectedPageIndex > 0) {
      onPageSelect(selectedPageIndex - 1);
    }
  };

  const handleDuplicatePage = (pageIndex: number) => {
    const originalPage = funnel.pages[pageIndex];
    const duplicatedPage: SimplePage = {
      ...originalPage,
      id: generateSemanticId({
        context: 'funnel',
        type: 'page',
        identifier: 'page',
        index: Math.floor(Math.random() * 1000),
      }),
      title: `${originalPage.title} (Cópia)`,
      components: originalPage.components.map(comp => ({
        ...comp,
        id: `${comp.id}_copy_${Date.now()}`,
      })),
    };

    const updatedPages = [
      ...funnel.pages.slice(0, pageIndex + 1),
      duplicatedPage,
      ...funnel.pages.slice(pageIndex + 1),
    ];

    const updatedFunnel = {
      ...funnel,
      pages: updatedPages,
    };

    onFunnelUpdate(updatedFunnel);
  };

  const handleMovePageUp = (pageIndex: number) => {
    if (pageIndex === 0) return;

    const updatedPages = [...funnel.pages];
    [updatedPages[pageIndex - 1], updatedPages[pageIndex]] = [
      updatedPages[pageIndex],
      updatedPages[pageIndex - 1],
    ];

    const updatedFunnel = {
      ...funnel,
      pages: updatedPages,
    };

    onFunnelUpdate(updatedFunnel);
    onPageSelect(pageIndex - 1);
  };

  const handleMovePageDown = (pageIndex: number) => {
    if (pageIndex === funnel.pages.length - 1) return;

    const updatedPages = [...funnel.pages];
    [updatedPages[pageIndex], updatedPages[pageIndex + 1]] = [
      updatedPages[pageIndex + 1],
      updatedPages[pageIndex],
    ];

    const updatedFunnel = {
      ...funnel,
      pages: updatedPages,
    };

    onFunnelUpdate(updatedFunnel);
    onPageSelect(pageIndex + 1);
  };

  const handlePageUpdate = (pageIndex: number, updates: Partial<SimplePage>) => {
    const updatedPages = funnel.pages.map((page, index) =>
      index === pageIndex ? { ...page, ...updates } : page
    );

    const updatedFunnel = {
      ...funnel,
      pages: updatedPages,
    };

    onFunnelUpdate(updatedFunnel);
  };

  return (
    <div className={styles.funnelPanel}>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>
          <FolderTree className="h-5 w-5" />
          Estrutura do Funil
        </h2>
        <Button size="sm" onClick={() => setIsCreatingPage(true)} className={styles.addButton}>
          <Plus className="h-4 w-4" />
          Nova Página
        </Button>
      </div>

      <ScrollArea className={styles.panelContent}>
        <div className={styles.funnelFlow}>
          {funnel.pages.map((page, index) => {
            const pageTypeInfo = getPageTypeInfo(page.type);
            const isSelected = index === selectedPageIndex;
            const isLastPage = index === funnel.pages.length - 1;

            return (
              <div key={page.id} className={styles.pageFlowItem}>
                <Card
                  className={`${styles.pageCard} ${isSelected ? styles.selected : ''}`}
                  onClick={() => onPageSelect(index)}
                >
                  <CardHeader className={styles.pageCardHeader}>
                    <div className={styles.pageInfo}>
                      <div className={`${styles.pageTypeIcon} bg-${pageTypeInfo.color}-100`}>
                        {pageTypeInfo.icon}
                      </div>
                      <div className={styles.pageDetails}>
                        <h3 className={styles.pageTitle}>{page.title}</h3>
                        <div className={styles.pageMetadata}>
                          <Badge
                            variant="secondary"
                            className={`bg-${pageTypeInfo.color}-100 text-${pageTypeInfo.color}-800`}
                          >
                            {pageTypeInfo.label}
                          </Badge>
                          <span className={styles.componentCount}>
                            {page.components.length} componentes
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.pageActions}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={e => {
                          e.stopPropagation();
                          setShowPageSettings(showPageSettings === page.id ? null : page.id);
                        }}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  {showPageSettings === page.id && (
                    <CardContent className={styles.pageSettings}>
                      <div className={styles.settingsGrid}>
                        <div className={styles.settingField}>
                          <label>Título da Página</label>
                          <input
                            type="text"
                            value={page.title}
                            onChange={e => handlePageUpdate(index, { title: e.target.value })}
                            className={styles.settingInput}
                          />
                        </div>

                        <div className={styles.settingField}>
                          <label>Tipo</label>
                          <select
                            value={page.type}
                            onChange={e =>
                              handlePageUpdate(index, {
                                type: e.target.value as SimplePage['type'],
                              })
                            }
                            className={styles.settingSelect}
                          >
                            {pageTypes.map(type => (
                              <option key={type.value} value={type.value}>
                                {type.icon} {type.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className={styles.settingField}>
                          <label className={styles.checkboxLabel}>
                            <input
                              type="checkbox"
                              checked={page.showHeader}
                              onChange={e =>
                                handlePageUpdate(index, {
                                  showHeader: e.target.checked,
                                })
                              }
                            />
                            Mostrar Cabeçalho
                          </label>
                        </div>

                        <div className={styles.settingField}>
                          <label className={styles.checkboxLabel}>
                            <input
                              type="checkbox"
                              checked={page.showProgress}
                              onChange={e =>
                                handlePageUpdate(index, {
                                  showProgress: e.target.checked,
                                })
                              }
                            />
                            Mostrar Progresso
                          </label>
                        </div>
                      </div>

                      <div className={styles.settingActions}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMovePageUp(index)}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMovePageDown(index)}
                          disabled={isLastPage}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDuplicatePage(index)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePage(index)}
                          disabled={funnel.pages.length <= 1}
                          style={{ color: '#432818' }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>

                {!isLastPage && (
                  <div className={styles.flowConnector}>
                    <ArrowDown className="h-4 w-4 text-gray-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {isCreatingPage && (
          <Card className={styles.newPageCard}>
            <CardHeader>
              <CardTitle>Nova Página</CardTitle>
            </CardHeader>
            <CardContent className={styles.newPageForm}>
              <div className={styles.formField}>
                <label>Título</label>
                <input
                  type="text"
                  value={newPageData.title}
                  onChange={e =>
                    setNewPageData(prev => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Digite o título da página"
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formField}>
                <label>Tipo de Página</label>
                <select
                  value={newPageData.type}
                  onChange={e =>
                    setNewPageData(prev => ({
                      ...prev,
                      type: e.target.value as SimplePage['type'],
                    }))
                  }
                  className={styles.formSelect}
                >
                  {pageTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formActions}>
                <Button variant="ghost" onClick={() => setIsCreatingPage(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreatePage}>Criar Página</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </ScrollArea>

      <div className={styles.panelFooter}>
        <div className={styles.funnelStats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Total de Páginas</span>
            <span className={styles.statValue}>{funnel.pages.length}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Componentes</span>
            <span className={styles.statValue}>
              {funnel.pages.reduce((total, page) => total + page.components.length, 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunnelManagementPanel;
