/**
 * 🎛️ PAINEL LATERAL DE COMPONENTES
 * 
 * Painel para adicionar, configurar e gerenciar componentes modulares
 */

import React, { useState } from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    Button,
    IconButton,
    Divider,
    Collapse,
    useDisclosure,
    Grid,
    Tooltip,
    Badge,
    Input,
    InputGroup,
    InputLeftElement,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Card,
    CardBody,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react';
import {
    AddIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    SearchIcon,
    SettingsIcon,
} from '@chakra-ui/icons';
import { ComponentType } from '@/types/modular-editor';
import {
    getAllComponents,
    getComponentsByCategory,
    createDefaultComponent,
    ComponentInfo
} from './ComponentRegistry';

interface ComponentSidebarProps {
    isOpen: boolean;
    onToggle: () => void;
    onAddComponent: (type: ComponentType) => void;
    selectedComponentId?: string;
    onComponentSelect?: (componentId: string) => void;
}

export const ComponentSidebar: React.FC<ComponentSidebarProps> = ({
    isOpen,
    onToggle,
    onAddComponent,
    selectedComponentId,
    onComponentSelect,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState(0);

    // Filtrar componentes por busca
    const filteredComponents = getAllComponents().filter(({ info }) =>
        info.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        info.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Agrupar por categoria
    const componentsByCategory = {
        layout: getComponentsByCategory('layout'),
        content: getComponentsByCategory('content'),
        input: getComponentsByCategory('input'),
        media: getComponentsByCategory('media'),
        navigation: getComponentsByCategory('navigation'),
    };

    const categoryNames = {
        layout: 'Layout',
        content: 'Conteúdo',
        input: 'Entrada',
        media: 'Mídia',
        navigation: 'Navegação',
    };

    const handleAddComponent = (type: ComponentType) => {
        onAddComponent(type);
    };

    return (
        <Box
            position="fixed"
            right={0}
            top="60px" // Altura da navbar
            bottom={0}
            w={isOpen ? "320px" : "60px"}
            bg="white"
            borderLeft="1px solid"
            borderColor="gray.200"
            boxShadow="lg"
            transition="width 0.3s ease"
            zIndex={1000}
            overflow="hidden"
        >
            {/* Header do Sidebar */}
            <HStack
                p={4}
                borderBottom="1px solid"
                borderColor="gray.200"
                bg="gray.50"
                justify="space-between"
            >
                <HStack spacing={2}>
                    <SettingsIcon color="brand.500" />
                    {isOpen && (
                        <Text fontWeight="semibold" fontSize="sm">
                            Componentes
                        </Text>
                    )}
                </HStack>

                <IconButton
                    aria-label="Toggle sidebar"
                    icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    size="sm"
                    variant="ghost"
                    onClick={onToggle}
                    transform={isOpen ? 'rotate(90deg)' : 'rotate(-90deg)'}
                    transition="transform 0.3s ease"
                />
            </HStack>

            {/* Conteúdo do Sidebar */}
            <Collapse in={isOpen} animateOpacity>
                <Box h="calc(100vh - 120px)" overflowY="auto">
                    <VStack spacing={0} align="stretch">

                        {/* Barra de Busca */}
                        <Box p={4}>
                            <InputGroup size="sm">
                                <InputLeftElement>
                                    <SearchIcon color="gray.400" />
                                </InputLeftElement>
                                <Input
                                    placeholder="Buscar componentes..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    bg="white"
                                    border="1px solid"
                                    borderColor="gray.300"
                                />
                            </InputGroup>
                        </Box>

                        {/* Tabs de Navegação */}
                        <Tabs size="sm" variant="enclosed" index={activeTab} onChange={setActiveTab}>
                            <TabList px={4}>
                                <Tab fontSize="xs">Adicionar</Tab>
                                <Tab fontSize="xs">Propriedades</Tab>
                            </TabList>

                            <TabPanels>

                                {/* Tab: Adicionar Componentes */}
                                <TabPanel p={0}>
                                    {searchTerm ? (
                                        // Resultados da busca
                                        <Box p={4}>
                                            <Text fontSize="xs" color="gray.600" mb={3}>
                                                {filteredComponents.length} resultado(s) encontrado(s)
                                            </Text>
                                            <VStack spacing={2} align="stretch">
                                                {filteredComponents.map(({ type, info }) => (
                                                    <ComponentCard
                                                        key={type}
                                                        type={type}
                                                        info={info}
                                                        onAdd={handleAddComponent}
                                                    />
                                                ))}
                                            </VStack>
                                        </Box>
                                    ) : (
                                        // Componentes por categoria
                                        <Accordion allowMultiple defaultIndex={[0]}>
                                            {Object.entries(componentsByCategory).map(([category, components]) => (
                                                <AccordionItem key={category} border="none">
                                                    <AccordionButton py={3} px={4} _hover={{ bg: 'gray.50' }}>
                                                        <Box flex="1" textAlign="left">
                                                            <HStack>
                                                                <Text fontSize="sm" fontWeight="medium">
                                                                    {categoryNames[category as keyof typeof categoryNames]}
                                                                </Text>
                                                                <Badge
                                                                    size="sm"
                                                                    colorScheme="gray"
                                                                    variant="subtle"
                                                                >
                                                                    {components.length}
                                                                </Badge>
                                                            </HStack>
                                                        </Box>
                                                        <AccordionIcon />
                                                    </AccordionButton>
                                                    <AccordionPanel pb={4} px={2}>
                                                        <VStack spacing={2} align="stretch">
                                                            {components.map(({ type, info }) => (
                                                                <ComponentCard
                                                                    key={type}
                                                                    type={type}
                                                                    info={info}
                                                                    onAdd={handleAddComponent}
                                                                />
                                                            ))}
                                                        </VStack>
                                                    </AccordionPanel>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    )}
                                </TabPanel>

                                {/* Tab: Propriedades do Componente */}
                                <TabPanel p={4}>
                                    {selectedComponentId ? (
                                        <ComponentPropertiesPanel
                                            componentId={selectedComponentId}
                                            onComponentSelect={onComponentSelect}
                                        />
                                    ) : (
                                        <Box textAlign="center" py={8}>
                                            <Text fontSize="sm" color="gray.500">
                                                Selecione um componente para editar suas propriedades
                                            </Text>
                                        </Box>
                                    )}
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </VStack>
                </Box>
            </Collapse>
        </Box>
    );
};

// Card de componente individual
interface ComponentCardProps {
    type: ComponentType;
    info: ComponentInfo;
    onAdd: (type: ComponentType) => void;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
    type,
    info,
    onAdd,
}) => {
    return (
        <Card size="sm" variant="outline" cursor="pointer" _hover={{ bg: 'gray.50' }}>
            <CardBody p={3}>
                <HStack spacing={3} align="center">
                    <Box
                        fontSize="lg"
                        w="32px"
                        h="32px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        bg="gray.100"
                        borderRadius="md"
                    >
                        {info.icon}
                    </Box>

                    <Box flex={1} minW={0}>
                        <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                            {info.name}
                        </Text>
                        <Text fontSize="xs" color="gray.600" noOfLines={2}>
                            {info.description}
                        </Text>
                    </Box>

                    <Tooltip label={`Adicionar ${info.name}`} placement="left">
                        <IconButton
                            aria-label={`Adicionar ${info.name}`}
                            icon={<AddIcon />}
                            size="xs"
                            colorScheme="brand"
                            variant="ghost"
                            onClick={(e) => {
                                e.stopPropagation();
                                onAdd(type);
                            }}
                        />
                    </Tooltip>
                </HStack>
            </CardBody>
        </Card>
    );
};

// Painel de propriedades do componente selecionado
interface ComponentPropertiesPanelProps {
    componentId: string;
    onComponentSelect?: (componentId: string) => void;
}

const ComponentPropertiesPanel: React.FC<ComponentPropertiesPanelProps> = ({
    componentId,
    onComponentSelect,
}) => {
    // TODO: Implementar painel de propriedades real com base no componente selecionado
    // Por enquanto, apenas placeholder

    return (
        <VStack spacing={4} align="stretch">
            <Text fontSize="sm" fontWeight="medium">
                Propriedades do Componente
            </Text>

            <Box p={4} bg="gray.50" borderRadius="md">
                <Text fontSize="xs" color="gray.600">
                    ID: {componentId}
                </Text>
            </Box>

            <Text fontSize="xs" color="gray.500">
                Painel de propriedades será implementado nas próximas iterações.
            </Text>

            <Button
                size="sm"
                variant="outline"
                colorScheme="red"
                onClick={() => {
                    if (onComponentSelect) {
                        onComponentSelect('');
                    }
                }}
            >
                Deselecionar
            </Button>
        </VStack>
    );
};

export default ComponentSidebar;