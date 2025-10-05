/**
 * 🧩 COMPONENTE IMAGEM MODULAR
 * 
 * Componente de imagem configurável para o editor modular
 */

import React, { useState, useRef } from 'react';
import {
    Box,
    Image,
    Button,
    Text,
    VStack,
    Input,
    FormControl,
    FormLabel,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Icon,
    Flex,
} from '@chakra-ui/react';
// import { AttachmentIcon, EditIcon } from '@chakra-ui/icons'; // Temporariamente comentado
import { ImageBlockProps } from '@/types/modular-editor';

interface ModularImageProps extends ImageBlockProps {
    isEditable?: boolean;
    isSelected?: boolean;
    onSelect?: () => void;
    onUpdate?: (newProps: Partial<ImageBlockProps>) => void;
}

export const ModularImage: React.FC<ModularImageProps> = ({
    src,
    alt = "Imagem",
    width = "auto",
    height = "auto",
    objectFit = "cover",
    borderRadius,
    backgroundColor,
    padding,
    margin,
    allowUpload = true,
    maxFileSize,
    acceptedFormats,
    isEditable = false,
    isSelected = false,
    onSelect,
    onUpdate,
    style,
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageUrl, setImageUrl] = useState(src || "");
    const [altText, setAltText] = useState(alt);
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = () => {
        if (isEditable && onSelect) {
            onSelect();
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validar tamanho do arquivo
        if (maxFileSize && file.size > maxFileSize) {
            alert(`Arquivo muito grande. Tamanho máximo: ${maxFileSize / 1024 / 1024}MB`);
            return;
        }

        // Validar formato
        if (acceptedFormats && !acceptedFormats.some(format => file.type.includes(format))) {
            alert(`Formato não suportado. Formatos aceitos: ${acceptedFormats.join(', ')}`);
            return;
        }

        setIsLoading(true);

        // Criar URL temporária para preview
        const reader = new FileReader();
        reader.onload = (e) => {
            const newUrl = e.target?.result as string;
            setImageUrl(newUrl);
            if (onUpdate) {
                onUpdate({ src: newUrl });
            }
            setIsLoading(false);
        };
        reader.readAsDataURL(file);
    };

    const handleUrlUpdate = () => {
        if (onUpdate) {
            onUpdate({
                src: imageUrl,
                alt: altText
            });
        }
        onClose();
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    const hasImage = src || imageUrl;

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
            {hasImage ? (
                <Box position="relative">
                    <Image
                        src={src || imageUrl}
                        alt={alt}
                        w={width}
                        h={height}
                        objectFit={objectFit}
                        borderRadius={borderRadius || style?.borderRadius}
                        fallback={
                            <Box
                                w={width}
                                h={height || "200px"}
                                bg="gray.200"
                                borderRadius={borderRadius || style?.borderRadius}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Text color="gray.500" fontSize="sm">
                                    Erro ao carregar imagem
                                </Text>
                            </Box>
                        }
                    />

                    {/* Overlay de edição */}
                    {isEditable && isSelected && (
                        <Box
                            position="absolute"
                            top={0}
                            left={0}
                            right={0}
                            bottom={0}
                            bg="blackAlpha.600"
                            borderRadius={borderRadius || style?.borderRadius}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            opacity={0}
                            _hover={{ opacity: 1 }}
                            transition="opacity 0.2s"
                        >
                            <Button
                                leftIcon={<EditIcon />}
                                colorScheme="brand"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onOpen();
                                }}
                            >
                                Editar Imagem
                            </Button>
                        </Box>
                    )}
                </Box>
            ) : (
                <VStack
                    spacing={4}
                    p={8}
                    border="2px dashed"
                    borderColor="gray.300"
                    borderRadius="md"
                    bg="gray.50"
                    minH="200px"
                    justify="center"
                >
                    <Icon as={AttachmentIcon} boxSize={8} color="gray.400" />
                    <Text color="gray.500" textAlign="center" fontSize="sm">
                        Nenhuma imagem selecionada
                    </Text>

                    {isEditable && isSelected && allowUpload && (
                        <Button
                            leftIcon={<AttachmentIcon />}
                            colorScheme="brand"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpen();
                            }}
                        >
                            Adicionar Imagem
                        </Button>
                    )}
                </VStack>
            )}

            {/* Input oculto para upload */}
            <Input
                ref={fileInputRef}
                type="file"
                accept={acceptedFormats?.map(f => `.${f}`).join(',') || 'image/*'}
                onChange={handleImageUpload}
                display="none"
            />

            {/* Modal de edição */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Configurar Imagem</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <FormControl>
                                <FormLabel>URL da Imagem</FormLabel>
                                <Input
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="https://exemplo.com/imagem.jpg"
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Texto Alternativo (Alt)</FormLabel>
                                <Input
                                    value={altText}
                                    onChange={(e) => setAltText(e.target.value)}
                                    placeholder="Descrição da imagem"
                                />
                            </FormControl>

                            {allowUpload && (
                                <Box w="full">
                                    <Text fontSize="sm" color="gray.600" mb={2}>
                                        Ou faça upload de um arquivo:
                                    </Text>
                                    <Button
                                        leftIcon={<AttachmentIcon />}
                                        variant="outline"
                                        w="full"
                                        onClick={openFileDialog}
                                        isLoading={isLoading}
                                        loadingText="Carregando..."
                                    >
                                        Escolher Arquivo
                                    </Button>
                                </Box>
                            )}
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button colorScheme="brand" onClick={handleUrlUpdate}>
                            Salvar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

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
                    Imagem
                </Box>
            )}
        </Box>
    );
};

export default ModularImage;