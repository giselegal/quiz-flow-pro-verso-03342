/**
 * 🎨 DEMONSTRAÇÃO DO SISTEMA MODULAR
 * 
 * Exemplo simplificado funcionando
 */

import React, { useState } from 'react';
import { ChakraProvider, Box, VStack, HStack, Button, Text, Container } from '@chakra-ui/react';
import { QuizEditorProvider, useQuizEditor } from '@/context/QuizEditorContext';
import { editorTheme } from '@/theme/editor-theme';
import { ComponentListRenderer } from './ComponentRenderer';
import { createDefaultComponent } from './ComponentRegistry';
import { ModularQuizFunnel, ComponentType } from '@/types/modular-editor';

// Funil de exemplo
const exampleFunnel: ModularQuizFunnel = {
  id: 'demo-funnel',
  name: 'Quiz Modular Demo',
  description: 'Demonstração do sistema',
  status: 'draft',
  steps: [
    {
      id: 'step-1',
      name: 'Etapa de Introdução',
      type: 'intro',
      order: 1,
      components: [
        {
          id: 'header-1',
          type: 'header',
          order: 0,
          isVisible: true,
          isEditable: true,
          showLogo: true,
          logoUrl: '/logo.png',
          showProgress: true,
          progressColor: 'brand',
          allowReturn: false,
        },
        {
          id: 'title-1', 
          type: 'title',
          order: 1,
          isVisible: true,
          isEditable: true,
          text: 'Bem-vindo ao Quiz Modular!',
          level: 1,
          alignment: 'center',
          fontSize: '2xl',
          fontWeight: 'bold',
          color: 'gray.800',
        },
      ],
      settings: {
        allowSkip: false,
        showProgress: true,
        autoAdvance: false,
        timeLimit: 0,
      },
    },
  ],
  settings: {
    theme: {
      primaryColor: '#0090ff',
      secondaryColor: '#64748b',
      fontFamily: 'Inter',
      colors: {
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1e293b',
        textSecondary: '#64748b',
        accent: '#3b82f6',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter',
      },
      borderRadius: '8px',
      shadows: true,
    },
    allowBackNavigation: true,
    showProgressBar: true,
    saveProgress: true,
    resultCalculation: 'points',
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: 'demo',
  version: 1,
};

// Componente do Editor
const SimpleModularEditor: React.FC = () => {
  const { funnel, addComponent, deleteComponent } = useQuizEditor();
  const [selectedComponentId, setSelectedComponentId] = useState<string>('');
  
  const currentStep = funnel.steps[0]; // Primeira etapa

  const handleAddComponent = (type: ComponentType) => {
    try {
      const newComponent = createDefaultComponent(type);
      addComponent(currentStep.id, newComponent);
      console.log(`Componente ${type} adicionado!`);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleDeleteComponent = (componentId: string) => {
    deleteComponent(currentStep.id, componentId);
    console.log('Componente removido!');
  };

  if (!currentStep) {
    return <Text>Nenhuma etapa encontrada</Text>;
  }

  return (
    <Box w="full" minH="100vh" bg="gray.50">
      <Container maxW="container.lg" py={8}>
        <VStack gap={6} align="stretch">
          
          {/* Header */}
          <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
            <HStack justify="space-between" align="center">
              <VStack align="start" gap={1}>
                <Text fontSize="xl" fontWeight="bold">
                  Editor Modular - Demo
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {currentStep.components.length} componente(s)
                </Text>
              </VStack>
              
              <HStack gap={2}>
                <Button 
                  colorScheme="blue" 
                  size="sm"
                  onClick={() => handleAddComponent('title')}
                >
                  + Título
                </Button>
                <Button 
                  colorScheme="blue" 
                  size="sm"
                  onClick={() => handleAddComponent('text')}
                >
                  + Texto
                </Button>
                <Button 
                  colorScheme="blue" 
                  size="sm"
                  onClick={() => handleAddComponent('image')}
                >
                  + Imagem
                </Button>
              </HStack>
            </HStack>
          </Box>

          {/* Canvas */}
          <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" minH="400px">
            {currentStep.components.length === 0 ? (
              <VStack py={12} gap={4}>
                <Text fontSize="lg" color="gray.500">
                  Esta etapa está vazia
                </Text>
                <Text fontSize="sm" color="gray.400">
                  Clique nos botões acima para adicionar componentes
                </Text>
              </VStack>
            ) : (
              <VStack gap={4} align="stretch">
                {currentStep.components.map((component, index) => (
                  <Box key={component.id} position="relative">
                    
                    {/* Componente */}
                    <ComponentListRenderer
                      components={[component]}
                      selectedComponentId={selectedComponentId}
                      isEditable={true}
                      onComponentSelect={setSelectedComponentId}
                      renderContext="editor"
                    />
                    
                    {/* Controles */}
                    <HStack 
                      position="absolute" 
                      top={-2} 
                      right={-2}
                      gap={1}
                    >
                      <Button
                        size="xs"
                        colorScheme="red"
                        onClick={() => handleDeleteComponent(component.id)}
                      >
                        🗑️
                      </Button>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            )}
          </Box>

          {/* Status */}
          <Box bg="blue.50" p={4} borderRadius="lg">
            <Text fontSize="sm" color="blue.800">
              ✅ Sistema Modular funcionando! Os componentes são renderizados dinamicamente.
            </Text>
          </Box>

        </VStack>
      </Container>
    </Box>
  );
};

// App principal
export const ModularSystemDemo: React.FC = () => {
  return (
    <ChakraProvider theme={editorTheme}>
      <QuizEditorProvider initialFunnel={exampleFunnel}>
        <SimpleModularEditor />
      </QuizEditorProvider>
    </ChakraProvider>
  );
};

export default ModularSystemDemo;