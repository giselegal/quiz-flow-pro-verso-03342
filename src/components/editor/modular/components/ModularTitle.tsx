/**
 * 🧩 COMPONENTE TÍTULO MODULAR
 * 
 * Componente de título configurável para o editor modular
 */

import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Heading,
    Input,
    useTheme,
    Editable,
    EditableInput,
    EditablePreview,
} from '@chakra-ui/react';
import { TitleBlockProps } from '@/types/modular-editor';

interface ModularTitleProps extends TitleBlockProps {
    isEditable?: boolean;
    isSelected?: boolean;
    onSelect?: () => void;
    onUpdate?: (newProps: Partial<TitleBlockProps>) => void;
}

export const ModularTitle: React.FC<ModularTitleProps> = ({
    text,
    fontSize = "2xl",
    fontWeight = "bold",
    textAlign = "center",
    color,
    backgroundColor,
    padding,
    margin,
    isEditable = false,
    isSelected = false,
    onSelect,
    onUpdate,
    style,
}) => {
    const theme = useTheme();
    const [localText, setLocalText] = useState(text || "Título");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setLocalText(text || "Título");
    }, [text]);

    const handleClick = () => {
        if (isEditable && onSelect) {
            onSelect();
        }
    };

    const handleTextChange = (newText: string) => {
        setLocalText(newText);
        if (onUpdate) {
            onUpdate({ text: newText });
        }
    };

    const handleTextSubmit = () => {
        if (onUpdate) {
            onUpdate({ text: localText });
        }
        setIsEditing(false);
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
            {isEditable && isSelected ? (
                <Editable
                    value={localText}
                    onChange={setLocalText}
                    onSubmit={handleTextSubmit}
                    onEdit={() => setIsEditing(true)}
                    onCancel={() => {
                        setLocalText(text || "Título");
                        setIsEditing(false);
                    }}
                    selectAllOnFocus
                >
                    <EditablePreview
                        as={Heading}
                        size={fontSize}
                        fontWeight={fontWeight}
                        textAlign={textAlign}
                        color={color || style?.color || 'gray.800'}
                        cursor="text"
                        _hover={{ bg: 'gray.50' }}
                        p={2}
                        borderRadius="md"
                    />
                    <EditableInput
                        as={Input}
                        fontSize={fontSize}
                        fontWeight={fontWeight}
                        textAlign={textAlign}
                        color={color || style?.color || 'gray.800'}
                        border="2px solid"
                        borderColor="brand.500"
                        _focus={{
                            borderColor: 'brand.600',
                            boxShadow: '0 0 0 1px var(--chakra-colors-brand-600)',
                        }}
                    />
                </Editable>
            ) : (
                <Heading
                    as="h1"
                    size={fontSize}
                    fontWeight={fontWeight}
                    textAlign={textAlign}
                    color={color || style?.color || 'gray.800'}
                    lineHeight="shorter"
                >
                    {localText}
                </Heading>
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
                    Título
                </Box>
            )}
        </Box>
    );
};

export default ModularTitle;