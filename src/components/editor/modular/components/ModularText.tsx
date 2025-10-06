/**
 * 🧩 COMPONENTE TEXTO MODULAR
 * 
 * Componente de texto configurável para o editor modular
 */

import React, { useState, useEffect } from 'react';
import {
    Box,
    Text,
    Textarea,
    // useTheme, // Temporariamente comentado - não disponível na versão atual
    Editable,
    EditableTextarea,
    EditablePreview,
} from '@chakra-ui/react';
import { TextBlockProps } from '@/types/modular-editor';

interface ModularTextProps extends TextBlockProps {
    isEditable?: boolean;
    isSelected?: boolean;
    onSelect?: () => void;
    onUpdate?: (newProps: Partial<TextBlockProps>) => void;
}

export const ModularText: React.FC<ModularTextProps> = ({
    text,
    fontSize = "md",
    fontWeight = "normal",
    textAlign = "left",
    color,
    backgroundColor,
    padding,
    margin,
    maxLength,
    placeholder = "Digite o texto aqui...",
    isEditable = false,
    isSelected = false,
    onSelect,
    onUpdate,
    style,
}) => {
    // const theme = useTheme(); // Temporariamente comentado
    const [localText, setLocalText] = useState(text || "");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setLocalText(text || "");
    }, [text]);

    const handleClick = () => {
        if (isEditable && onSelect) {
            onSelect();
        }
    };

    const handleTextChange = (newText: string) => {
        // Aplicar limite de caracteres se definido
        const finalText = maxLength ? newText.slice(0, maxLength) : newText;
        setLocalText(finalText);
        if (onUpdate) {
            onUpdate({ text: finalText });
        }
    };

    const handleTextSubmit = () => {
        if (onUpdate) {
            onUpdate({ text: localText });
        }
        setIsEditing(false);
    };

    const displayText = localText || placeholder;
    const isPlaceholder = !localText && placeholder;

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
            {isEditable && isSelected ? (
                <Box>
                    <Editable
                        value={localText}
                        onChange={setLocalText}
                        onSubmit={handleTextSubmit}
                        onEdit={() => setIsEditing(true)}
                        onCancel={() => {
                            setLocalText(text || "");
                            setIsEditing(false);
                        }}
                        placeholder={placeholder}
                    >
                        <EditablePreview
                            as={Text}
                            fontSize={fontSize}
                            fontWeight={fontWeight}
                            textAlign={textAlign}
                            color={isPlaceholder ? 'gray.400' : (color || style?.color || 'gray.800')}
                            cursor="text"
                            _hover={{ bg: 'gray.50' }}
                            p={2}
                            borderRadius="md"
                            minH="10"
                            whiteSpace="pre-wrap"
                        >
                            {displayText}
                        </EditablePreview>
                        <EditableTextarea
                            fontSize={fontSize}
                            fontWeight={fontWeight}
                            textAlign={textAlign}
                            color={color || style?.color || 'gray.800'}
                            border="2px solid"
                            borderColor="brand.500"
                            resize="vertical"
                            minH="20"
                            placeholder={placeholder}
                            _focus={{
                                borderColor: 'brand.600',
                                boxShadow: '0 0 0 1px var(--chakra-colors-brand-600)',
                            }}
                            _placeholder={{
                                color: 'gray.400',
                            }}
                        />
                    </Editable>

                    {/* Contador de caracteres */}
                    {maxLength && (
                        <Text
                            fontSize="xs"
                            color="gray.500"
                            textAlign="right"
                            mt={1}
                        >
                            {localText.length}/{maxLength}
                        </Text>
                    )}
                </Box>
            ) : (
                <Box>
                    <Text
                        fontSize={fontSize}
                        fontWeight={fontWeight}
                        textAlign={textAlign}
                        color={isPlaceholder ? 'gray.400' : (color || style?.color || 'gray.800')}
                        lineHeight="tall"
                        whiteSpace="pre-wrap"
                    >
                        {displayText}
                    </Text>

                    {/* Contador de caracteres (somente leitura) */}
                    {maxLength && localText && (
                        <Text
                            fontSize="xs"
                            color="gray.500"
                            textAlign="right"
                            mt={1}
                        >
                            {localText.length}/{maxLength}
                        </Text>
                    )}
                </Box>
            )}

            {/* Indicador de Edição */}
            {isEditable && (
                <Box
                    position="absolute"
                    top={-2}
                    right={-2}
                    bg="brand.500"
                    color="white"
                    fontSize="xs"
                    px={2}
                    py={1}
                    borderRadius="md"
                    fontWeight="semibold"
                >
                    Texto
                </Box>
            )}
        </Box>
    );
};

export default ModularText;