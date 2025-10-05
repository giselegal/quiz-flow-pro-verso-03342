/**
 * 🎯 PÁGINA DO EDITOR MODULAR
 * 
 * Sistema completo de edição modular de quiz com:
 * ✅ Componentes modulares independentes 
 * ✅ Drag & Drop com @dnd-kit
 * ✅ Chakra UI integrado
 * ✅ Context e state management
 * ✅ Visual editor completo
 */

import React from 'react';
import { Box, Container, VStack, Heading, Text, Alert, AlertIcon } from '@chakra-ui/react';
import { ModularEditorExample } from '@/components/editor/modular/ModularEditorExample';
import { QuizEditorProvider } from '@/context/QuizEditorContext';
import { ThemeProvider as ChakraThemeProvider } from '@chakra-ui/react';
import { modularEditorTheme } from '@/components/editor/modular/theme/modularEditorTheme';

/**
 * Página principal do Editor Modular
 * Implementa o sistema completo de componentes modulares
 */
const ModularEditorPage: React.FC = () => {
    return (
        <ChakraThemeProvider theme={modularEditorTheme}>
            <QuizEditorProvider>
                <Container maxW="full" p={0} minH="100vh">
                    <VStack spacing={0} align="stretch" minH="100vh">
                        {/* Header da Página */}
                        <Box bg="gray.900" color="white" py={4} px={6}>
                            <VStack spacing={2} align="start">
                                <Heading size="lg">
                                    🎯 Editor Modular de Quiz
                                </Heading>
                                <Text color="gray.300" fontSize="sm">
                                    Sistema completo de componentes modulares, independentes e editáveis
                                </Text>
                            </VStack>
                        </Box>

                        {/* Informações do Sistema */}
                        <Box p={6} bg="gray.50">
                            <Alert status="info" borderRadius="md">
                                <AlertIcon />
                                <VStack align="start" spacing={1} flex={1}>
                                    <Text fontWeight="bold">
                                        ✅ Sistema Modular Ativo
                                    </Text>
                                    <Text fontSize="sm">
                                        • 15+ componentes modulares implementados
                                        • Drag & Drop funcional com @dnd-kit
                                        • Edição inline e painéis de propriedades
                                        • Context e state management completo
                                    </Text>
                                </VStack>
                            </Alert>
                        </Box>

                        {/* Editor Modular */}
                        <Box flex={1}>
                            <ModularEditorExample />
                        </Box>
                    </VStack>
                </Container>
            </QuizEditorProvider>
        </ChakraThemeProvider>
    );
};

export default ModularEditorPage;