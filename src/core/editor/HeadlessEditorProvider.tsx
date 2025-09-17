import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { QuizFunnelSchema } from '../../types/quiz-schema';
import { editorDataService } from './services/EditorDataService';

interface HeadlessEditorContextType {
  schema: QuizFunnelSchema | null;
  isLoading: boolean;
  error: string | null;
  isDirty: boolean;
  loadSchema: (schemaId: string) => Promise<void>;
  updateSchema: (schema: QuizFunnelSchema) => void;
  saveSchema: () => Promise<void>;
  resetChanges: () => void;
}

const HeadlessEditorContext = createContext<HeadlessEditorContextType | undefined>(undefined);

export const useHeadlessEditor = () => {
  const context = useContext(HeadlessEditorContext);
  if (!context) {
    throw new Error('useHeadlessEditor deve ser usado dentro de HeadlessEditorProvider');
  }
  return context;
};

interface HeadlessEditorProviderProps {
  children: React.ReactNode;
  schemaId?: string;
}

export const HeadlessEditorProvider: React.FC<HeadlessEditorProviderProps> = ({ children, schemaId }) => {
  const [schema, setSchema] = useState<QuizFunnelSchema | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const loadSchema = useCallback(async (targetSchemaId: string) => {
    try {
      setError(null);
      setIsLoading(true);

      console.log('🔄 Carregando schema para:', targetSchemaId);

      // Usar o EditorDataService para carregar os dados
      const steps = await editorDataService.loadSchemaFromTemplate(targetSchemaId);

      if (!steps || steps.length === 0) {
        throw new Error(`Template não encontrado: ${targetSchemaId}`);
      }

      console.log('✅ Steps carregados:', steps.length, 'etapas');

      // Criar schema básico mas válido - usando configurações mínimas
      const loadedSchema: QuizFunnelSchema = {
        id: targetSchemaId,
        name: `Quiz - ${targetSchemaId}`,
        description: 'Quiz carregado do template',
        version: '1.0',
        category: 'quiz',
        templateType: 'quiz-complete',
        settings: {
          seo: {
            title: 'Quiz',
            description: 'Quiz interativo',
            keywords: [],
            robots: 'index,follow' as const,
            openGraph: {
              title: 'Quiz',
              description: 'Quiz interativo',
              image: '',
              imageAlt: 'Quiz',
              type: 'website' as const,
              url: '',
              siteName: 'Quiz'
            },
            twitter: {
              card: 'summary' as const,
              title: 'Quiz',
              description: 'Quiz interativo',
              image: ''
            },
            structuredData: {
              '@type': 'Quiz' as const,
              name: 'Quiz',
              description: 'Quiz interativo',
              provider: {
                '@type': 'Organization' as const,
                name: 'Quiz Provider',
                url: '',
                logo: ''
              },
              category: ['quiz'],
              dateCreated: new Date().toISOString(),
              dateModified: new Date().toISOString()
            }
          },
          analytics: {
            enabled: false,
            customEvents: [],
            utm: {
              source: '',
              medium: '',
              campaign: ''
            }
          },
          branding: {
            logo: {
              primary: '',
              secondary: '',
              favicon: '',
              appleTouchIcon: ''
            },
            colors: {
              primary: '#007bff',
              secondary: '#6c757d',
              accent: '#17a2b8',
              background: '#ffffff',
              surface: '#f8f9fa',
              text: {
                primary: '#212529',
                secondary: '#6c757d',
                disabled: '#adb5bd'
              },
              error: '#dc3545',
              warning: '#ffc107',
              success: '#28a745'
            },
            typography: {
              fontFamily: {
                primary: 'Inter',
                secondary: 'Inter',
                monospace: 'Monaco'
              },
              fontSizes: {
                xs: '0.75rem',
                sm: '0.875rem',
                base: '1rem',
                lg: '1.125rem',
                xl: '1.25rem',
                '2xl': '1.5rem',
                '3xl': '1.875rem',
                '4xl': '2.25rem'
              },
              fontWeights: {
                light: 300,
                normal: 400,
                medium: 500,
                semibold: 600,
                bold: 700
              },
              lineHeight: {
                tight: 1.25,
                normal: 1.5,
                relaxed: 1.75
              }
            },
            spacing: {
              xs: '0.25rem',
              sm: '0.5rem',
              md: '1rem',
              lg: '1.5rem',
              xl: '3rem',
              '2xl': '4rem'
            },
            borderRadius: {
              none: '0',
              sm: '0.125rem',
              md: '0.375rem',
              lg: '0.5rem',
              xl: '0.75rem',
              full: '9999px'
            },
            shadows: {
              sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
              md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }
          },
          persistence: {
            enabled: true,
            storage: ['localStorage'],
            autoSave: true,
            autoSaveInterval: 30000,
            compression: false,
            encryption: false,
            backupEnabled: false
          },
          integrations: {
            email: undefined,
            crm: undefined,
            payment: undefined,
            webhooks: []
          },
          performance: {
            cache: {
              enabled: true,
              strategy: 'stale-while-revalidate',
              ttl: 3600
            },
            lazyLoading: {
              images: true,
              components: true,
              threshold: 100
            },
            preload: {
              criticalResources: [],
              nextStep: true
            },
            compression: {
              images: true,
              scripts: true,
              styles: true
            }
          },
          legal: {
            privacy: {
              enabled: false,
              policyUrl: '',
              consentRequired: false,
              cookieNotice: false
            },
            terms: {
              enabled: false,
              termsUrl: '',
              acceptanceRequired: false
            },
            dataProcessing: {
              purpose: [],
              legalBasis: 'consent',
              retentionPeriod: 365,
              rightToDelete: true,
              rightToPortability: true
            }
          }
        },
        steps,
        publication: {
          status: 'draft' as const,
          publishedAt: undefined,
          baseUrl: '',
          customDomain: undefined,
          slug: targetSchemaId,
          version: '1.0.0',
          changelog: [],
          accessControl: {
            public: true
          },
          cdn: {
            enabled: false
          }
        },
        editorMeta: {
          lastModified: new Date().toISOString(),
          lastModifiedBy: 'system',
          editorVersion: '1.0.0',
          editorSettings: {
            autoSave: true,
            previewMode: 'desktop' as const,
            showGrid: false,
            snapToGrid: false
          },
          tags: [],
          variations: [],
          collaborators: [],
          categories: [],
          stats: {
            totalBlocks: 0,
            totalSteps: steps.length,
            estimatedCompletionTime: 5
          }
        }
      };

      setSchema(loadedSchema);
      setIsDirty(false);
      console.log(`✅ Schema carregado com sucesso: ${targetSchemaId}`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar schema';
      console.error(`❌ Erro ao carregar schema ${targetSchemaId}:`, error);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (schemaId) {
      loadSchema(schemaId);
    }
  }, [schemaId, loadSchema]);

  const contextValue: HeadlessEditorContextType = {
    schema,
    isLoading,
    error,
    isDirty,
    loadSchema,
    updateSchema: (newSchema: QuizFunnelSchema) => {
      setSchema(newSchema);
      setIsDirty(true);
    },
    saveSchema: async () => {
      console.log('Save not implemented');
    },
    resetChanges: () => {
      if (schemaId) loadSchema(schemaId);
    }
  };

  return (
    <HeadlessEditorContext.Provider value={contextValue}>
      {children}
    </HeadlessEditorContext.Provider>
  );
};
