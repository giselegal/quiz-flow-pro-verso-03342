/**
 * 🧩 COMPONENTE HEADER MODULAR
 * 
 * Componente de cabeçalho configurável para o editor modular
 */

import React from 'react';
import {
    Box,
    Flex,
    Image,
    IconButton,
    Progress,
    useTheme,
} from '@chakra-ui/react';
// import { ArrowBackIcon } from '@chakra-ui/icons'; // Temporariamente comentado
import { HeaderBlockProps } from '@/types/modular-editor';

interface ModularHeaderProps extends HeaderBlockProps {
    currentStep?: number;
    totalSteps?: number;
    onBack?: () => void;
    isEditable?: boolean;
    isSelected?: boolean;
    onSelect?: () => void;
}

export const ModularHeader: React.FC<ModularHeaderProps> = ({
    showLogo,
    logoUrl,
    logoAlt = "Logo",
    showProgress,
    progressColor,
    allowReturn,
    returnText = "Voltar",
    backgroundColor,
    textColor,
    currentStep = 1,
    totalSteps = 10,
    onBack,
    isEditable = false,
    isSelected = false,
    onSelect,
    style,
}) => {
    const theme = useTheme();

    const progressPercentage = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

    const handleClick = () => {
        if (isEditable && onSelect) {
            onSelect();
        }
    };

    const handleBackClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onBack && !isEditable) {
            onBack();
        }
    };

    return (
        <Box
            w="full"
            h="auto"
            bg={backgroundColor || style?.backgroundColor || 'white'}
            color={textColor || style?.color || 'gray.800'}
            borderRadius={style?.borderRadius || 'md'}
            p={style?.padding || 4}
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
            <Flex direction="row" w="full" align="center" justify="center" position="relative">

                {/* Botão de Voltar */}
                {allowReturn && (
                    <IconButton
                        aria-label={returnText}
                        icon={<ArrowBackIcon />}
                        variant="ghost"
                        size="md"
                        position="absolute"
                        left={0}
                        onClick={handleBackClick}
                        isDisabled={isEditable}
                        _hover={!isEditable ? { bg: 'gray.100' } : undefined}
                    />
                )}

                {/* Conteúdo Central */}
                <Flex direction="column" align="center" justify="center" w="full" maxW="md" gap={4}>

                    {/* Logo */}
                    {showLogo && logoUrl && (
                        <Image
                            src={logoUrl}
                            alt={logoAlt}
                            maxW="24"
                            maxH="24"
                            objectFit="contain"
                            fallback={
                                <Box
                                    w="24"
                                    h="24"
                                    bg="gray.200"
                                    borderRadius="md"
                                    display="flex"
                                    align="center"
                                    justify="center"
                                    fontSize="xs"
                                    color="gray.500"
                                >
                                    Logo
                                </Box>
                            }
                        />
                    )}

                    {/* Barra de Progresso */}
                    {showProgress && (
                        <Box w="full">
                            <Progress
                                value={progressPercentage}
                                colorScheme={progressColor || 'brand'}
                                size="sm"
                                borderRadius="full"
                                bg="gray.200"
                            />
                        </Box>
                    )}
                </Flex>

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
                        Header
                    </Box>
                )}
            </Flex>
        </Box>
    );
};

export default ModularHeader;