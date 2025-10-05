/**
 * 🧩 COMPONENTE GRID DE OPÇÕES MODULAR
 * 
 * Componente de grid de opções configurável para o editor modular
 */

import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Button,
    Text,
    VStack,
    HStack,
    Input,
    IconButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    FormControl,
    FormLabel,
    Select,
    Switch,
    Divider,
} from '@chakra-ui/react';
// import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'; // Temporariamente comentado
import { OptionsGridBlockProps, QuizOption } from '@/types/modular-editor';

interface ModularOptionsGridProps extends OptionsGridBlockProps {
    isEditable?: boolean;
    isSelected?: boolean;
    onSelect?: () => void;
    onUpdate?: (newProps: Partial<OptionsGridBlockProps>) => void;
    onOptionSelect?: (optionId: string) => void;
    selectedOptionId?: string;
}

export const ModularOptionsGrid: React.FC<ModularOptionsGridProps> = ({
    options = [],
    columns = 2,
    gap = 4,
    optionStyle = "button",
    allowMultipleSelection = false,
    backgroundColor,
    padding,
    margin,
    isEditable = false,
    isSelected = false,
    onSelect,
    onUpdate,
    onOptionSelect,
    selectedOptionId,
    style,
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [localOptions, setLocalOptions] = useState<QuizOption[]>(options);
    const [editingOption, setEditingOption] = useState<QuizOption | null>(null);
    const [newOptionText, setNewOptionText] = useState("");
    const [newOptionValue, setNewOptionValue] = useState("");
    const [gridColumns, setGridColumns] = useState(columns);
    const [gridGap, setGridGap] = useState(gap);
    const [currentOptionStyle, setCurrentOptionStyle] = useState(optionStyle);
    const [multiSelect, setMultiSelect] = useState(allowMultipleSelection);

    useEffect(() => {
        setLocalOptions(options);
    }, [options]);

    const handleClick = () => {
        if (isEditable && onSelect) {
            onSelect();
        }
    };

    const handleOptionClick = (option: QuizOption) => {
        if (!isEditable && onOptionSelect) {
            onOptionSelect(option.id);
        }
    };

    const handleAddOption = () => {
        if (!newOptionText.trim()) return;

        const newOption: QuizOption = {
            id: `option_${Date.now()}`,
            text: newOptionText.trim(),
            value: newOptionValue.trim() || newOptionText.trim(),
        };

        const updatedOptions = [...localOptions, newOption];
        setLocalOptions(updatedOptions);

        if (onUpdate) {
            onUpdate({ options: updatedOptions });
        }

        setNewOptionText("");
        setNewOptionValue("");
    };

    const handleEditOption = (option: QuizOption) => {
        setEditingOption(option);
        setNewOptionText(option.text);
        setNewOptionValue(option.value || "");
    };

    const handleUpdateOption = () => {
        if (!editingOption || !newOptionText.trim()) return;

        const updatedOptions = localOptions.map(opt =>
            opt.id === editingOption.id
                ? {
                    ...opt,
                    text: newOptionText.trim(),
                    value: newOptionValue.trim() || newOptionText.trim(),
                }
                : opt
        );

        setLocalOptions(updatedOptions);

        if (onUpdate) {
            onUpdate({ options: updatedOptions });
        }

        setEditingOption(null);
        setNewOptionText("");
        setNewOptionValue("");
    };

    const handleDeleteOption = (optionId: string) => {
        const updatedOptions = localOptions.filter(opt => opt.id !== optionId);
        setLocalOptions(updatedOptions);

        if (onUpdate) {
            onUpdate({ options: updatedOptions });
        }
    };

    const handleConfigSave = () => {
        if (onUpdate) {
            onUpdate({
                columns: gridColumns,
                gap: gridGap,
                optionStyle: currentOptionStyle,
                allowMultipleSelection: multiSelect,
            });
        }
        onClose();
    };

    const getOptionVariant = (option: QuizOption) => {
        if (selectedOptionId === option.id) {
            return "solid";
        }
        return currentOptionStyle === "button" ? "outline" : "ghost";
    };

    const getOptionColorScheme = (option: QuizOption) => {
        if (selectedOptionId === option.id) {
            return "brand";
        }
        return "gray";
    };

    return (
        <Box
            w="full"
            h="auto"
            bg={backgroundColor || style?.backgroundColor}
            borderRadius={style?.borderRadius || 'md'}
            p={padding || style?.padding || 4}
            m={margin || style?.margin}
            cursor={isEditable ? 'pointer' : 'default'}
            onClick={handleClick}
            position="relative"
            border={isSelected ? '2px solid' : '2px solid transparent'}
            borderColor={isSelected ? 'brand.500' : 'transparent'}
            boxShadow={isSelected ? '0 0 0 3px rgba(0, 144, 255, 0.2)' : style?.boxShadow}
            transition="all 0.2s"
            _hover={isEditable ? {
                borderColor: 'brand.300',
                boxShadow: 'md',
            } : undefined}
        >
            {localOptions.length > 0 ? (
                <Grid
                    templateColumns={`repeat(${columns}, 1fr)`}
                    gap={gap}
                    w="full"
                >
                    {localOptions.map((option) => (
                        <Box key={option.id} position="relative">
                            <Button
                                w="full"
                                h="auto"
                                minH="12"
                                p={4}
                                variant={getOptionVariant(option)}
                                colorScheme={getOptionColorScheme(option)}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleOptionClick(option);
                                }}
                                whiteSpace="normal"
                                wordBreak="break-word"
                                textAlign="center"
                                isDisabled={isEditable}
                                _hover={!isEditable ? {
                                    transform: 'translateY(-2px)',
                                    boxShadow: 'md',
                                } : undefined}
                                transition="all 0.2s"
                            >
                                <Text fontSize="sm" fontWeight="medium">
                                    {option.text}
                                </Text>
                            </Button>

                            {/* Controles de edição */}
                            {isEditable && isSelected && (
                                <HStack
                                    position="absolute"
                                    top={-2}
                                    right={-2}
                                    bg="white"
                                    borderRadius="md"
                                    boxShadow="md"
                                    p={1}
                                    spacing={1}
                                >
                                    <IconButton
                                        aria-label="Editar opção"
                                        icon={<EditIcon />}
                                        size="xs"
                                        variant="ghost"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditOption(option);
                                        }}
                                    />
                                    <IconButton
                                        aria-label="Excluir opção"
                                        icon={<DeleteIcon />}
                                        size="xs"
                                        variant="ghost"
                                        colorScheme="red"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteOption(option.id);
                                        }}
                                    />
                                </HStack>
                            )}
                        </Box>
                    ))}
                </Grid>
            ) : (
                <VStack
                    spacing={4}
                    p={8}
                    border="2px dashed"
                    borderColor="gray.300"
                    borderRadius="md"
                    bg="gray.50"
                    minH="150px"
                    justify="center"
                >
                    <Text color="gray.500" textAlign="center" fontSize="sm">
                        Nenhuma opção configurada
                    </Text>

                    {isEditable && isSelected && (
                        <Button
                            leftIcon={<AddIcon />}
                            colorScheme="brand"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpen();
                            }}
                        >
                            Adicionar Opções
                        </Button>
                    )}
                </VStack>
            )}

            {/* Botão de configuração */}
            {isEditable && isSelected && localOptions.length > 0 && (
                <Button
                    leftIcon={<EditIcon />}
                    size="sm"
                    variant="outline"
                    colorScheme="brand"
                    position="absolute"
                    bottom={2}
                    right={2}
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpen();
                    }}
                >
                    Configurar
                </Button>
            )}

            {/* Modal de configuração */}
            <Modal isOpen={isOpen} onClose={onClose} size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {editingOption ? 'Editar Opção' : 'Configurar Grid de Opções'}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            {editingOption ? (
                                // Modo de edição de opção
                                <>
                                    <FormControl>
                                        <FormLabel>Texto da Opção</FormLabel>
                                        <Input
                                            value={newOptionText}
                                            onChange={(e) => setNewOptionText(e.target.value)}
                                            placeholder="Digite o texto da opção"
                                        />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Valor da Opção</FormLabel>
                                        <Input
                                            value={newOptionValue}
                                            onChange={(e) => setNewOptionValue(e.target.value)}
                                            placeholder="Valor interno (opcional)"
                                        />
                                    </FormControl>
                                </>
                            ) : (
                                // Modo de configuração geral
                                <>
                                    <FormControl>
                                        <FormLabel>Adicionar Nova Opção</FormLabel>
                                        <VStack spacing={2}>
                                            <Input
                                                value={newOptionText}
                                                onChange={(e) => setNewOptionText(e.target.value)}
                                                placeholder="Texto da opção"
                                            />
                                            <Input
                                                value={newOptionValue}
                                                onChange={(e) => setNewOptionValue(e.target.value)}
                                                placeholder="Valor interno (opcional)"
                                            />
                                            <Button
                                                leftIcon={<AddIcon />}
                                                colorScheme="brand"
                                                size="sm"
                                                w="full"
                                                onClick={handleAddOption}
                                                isDisabled={!newOptionText.trim()}
                                            >
                                                Adicionar Opção
                                            </Button>
                                        </VStack>
                                    </FormControl>

                                    <Divider />

                                    <FormControl>
                                        <FormLabel>Colunas no Grid</FormLabel>
                                        <Select
                                            value={gridColumns}
                                            onChange={(e) => setGridColumns(Number(e.target.value))}
                                        >
                                            <option value={1}>1 coluna</option>
                                            <option value={2}>2 colunas</option>
                                            <option value={3}>3 colunas</option>
                                            <option value={4}>4 colunas</option>
                                        </Select>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Espaçamento</FormLabel>
                                        <Select
                                            value={gridGap}
                                            onChange={(e) => setGridGap(Number(e.target.value))}
                                        >
                                            <option value={2}>Pequeno</option>
                                            <option value={4}>Médio</option>
                                            <option value={6}>Grande</option>
                                        </Select>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Estilo das Opções</FormLabel>
                                        <Select
                                            value={currentOptionStyle}
                                            onChange={(e) => setCurrentOptionStyle(e.target.value as any)}
                                        >
                                            <option value="button">Botão</option>
                                            <option value="card">Cartão</option>
                                        </Select>
                                    </FormControl>

                                    <FormControl display="flex" alignItems="center">
                                        <FormLabel mb={0}>Permitir Múltiplas Seleções</FormLabel>
                                        <Switch
                                            isChecked={multiSelect}
                                            onChange={(e) => setMultiSelect(e.target.checked)}
                                            colorScheme="brand"
                                        />
                                    </FormControl>
                                </>
                            )}
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            variant="ghost"
                            mr={3}
                            onClick={() => {
                                setEditingOption(null);
                                setNewOptionText("");
                                setNewOptionValue("");
                                onClose();
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            colorScheme="brand"
                            onClick={editingOption ? handleUpdateOption : handleConfigSave}
                        >
                            {editingOption ? 'Atualizar' : 'Salvar'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Indicador de Edição */}
            {isEditable && (
                <Box
                    position="absolute"
                    top={-2}
                    left={-2}
                    bg="brand.500"
                    color="white"
                    fontSize="xs"
                    px={2}
                    py={1}
                    borderRadius="md"
                    fontWeight="semibold"
                >
                    Opções
                </Box>
            )}
        </Box>
    );
};

export default ModularOptionsGrid;