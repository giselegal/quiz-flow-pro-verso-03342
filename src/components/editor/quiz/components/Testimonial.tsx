/**
 * 💬 COMPONENTE: Testimonial (Depoimento)
 * 
 * Componente modular para exibir e editar depoimentos de clientes.
 * Usado principalmente em step-21 (offer) dentro do offer-map.
 * 
 * Suporta:
 * - Quote (citação)
 * - Author (autor com nome, idade, profissão)
 * - Foto opcional
 * - Modo editor e preview
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, User, Quote } from 'lucide-react';

// Tipos
export interface TestimonialContent {
    quote: string;
    author: string;
    photo?: string; // URL da foto (opcional)
}

export interface TestimonialProperties {
    showPhoto?: boolean;
    quoteStyle?: 'italic' | 'bold' | 'normal';
    alignment?: 'left' | 'center' | 'right';
    backgroundColor?: string;
    textColor?: string;
}

export interface TestimonialProps {
    content: TestimonialContent;
    properties?: TestimonialProperties;
    onUpdate?: (content: TestimonialContent) => void;
    onPropertiesUpdate?: (properties: TestimonialProperties) => void;
    mode?: 'editor' | 'preview';
}

/**
 * Componente Testimonial
 */
export function Testimonial({
    content,
    properties = {},
    onUpdate,
    onPropertiesUpdate,
    mode = 'preview'
}: TestimonialProps) {
    const {
        showPhoto = true,
        quoteStyle = 'italic',
        alignment = 'left',
        backgroundColor = 'transparent',
        textColor = '#5b4135'
    } = properties;

    // Extrair iniciais do autor para avatar fallback
    const getInitials = (name: string): string => {
        const parts = name.split(',')[0].trim().split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return parts[0]?.[0]?.toUpperCase() || '?';
    };

    // Modo Preview: Renderizar depoimento
    if (mode === 'preview') {
        const alignmentClass = {
            left: 'text-left',
            center: 'text-center',
            right: 'text-right'
        }[alignment];

        const quoteStyleClass = {
            italic: 'italic',
            bold: 'font-bold',
            normal: ''
        }[quoteStyle];

        return (
            <Card
                className="border border-gray-200 overflow-hidden"
                style={{ backgroundColor }}
            >
                <CardContent className="p-6">
                    <div className={`space-y-4 ${alignmentClass}`}>
                        {/* Quote Icon */}
                        <Quote
                            className="h-8 w-8 text-[#B89B7A] opacity-50"
                            style={{ margin: alignment === 'center' ? '0 auto' : '0' }}
                        />

                        {/* Citação */}
                        {content.quote && (
                            <blockquote
                                className={`text-base ${quoteStyleClass}`}
                                style={{ color: textColor }}
                            >
                                "{content.quote}"
                            </blockquote>
                        )}

                        {/* Autor */}
                        {content.author && (
                            <div
                                className="flex items-center gap-3"
                                style={{
                                    justifyContent: alignment === 'center' ? 'center' : alignment === 'right' ? 'flex-end' : 'flex-start'
                                }}
                            >
                                {showPhoto && (
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={content.photo} alt={content.author} />
                                        <AvatarFallback className="bg-[#B89B7A] text-white">
                                            {getInitials(content.author)}
                                        </AvatarFallback>
                                    </Avatar>
                                )}

                                <div>
                                    <p
                                        className="text-sm font-semibold"
                                        style={{ color: textColor }}
                                    >
                                        {content.author}
                                    </p>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <User className="h-3 w-3" />
                                        <span>Cliente verificada</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Modo Editor: Formulário de edição
    return (
        <Card className="border-2 border-blue-200 bg-blue-50/30">
            <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-[#B89B7A]" />
                        <h3 className="font-semibold text-sm">Depoimento</h3>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        Testimonial
                    </Badge>
                </div>

                {/* Citação */}
                <div>
                    <label className="text-sm font-medium mb-2 block">
                        Citação
                    </label>
                    <Textarea
                        value={content.quote}
                        onChange={(e) => onUpdate?.({ ...content, quote: e.target.value })}
                        placeholder='"Esse conteúdo transformou minha forma de me vestir. Agora me sinto confiante e estilosa todos os dias!"'
                        rows={3}
                        className="resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        O que a cliente disse sobre o produto/serviço
                    </p>
                </div>

                {/* Autor */}
                <div>
                    <label className="text-sm font-medium mb-2 block">
                        Autor
                    </label>
                    <Input
                        value={content.author}
                        onChange={(e) => onUpdate?.({ ...content, author: e.target.value })}
                        placeholder="Ana Silva, 35 anos, Empresária"
                        className="font-medium"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Nome, idade e profissão (formato: Nome, idade, profissão)
                    </p>
                </div>

                {/* Foto (opcional) */}
                <div>
                    <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                        Foto (opcional)
                        {!properties.showPhoto && (
                            <Badge variant="outline" className="text-[10px]">Oculta no preview</Badge>
                        )}
                    </label>
                    <Input
                        value={content.photo || ''}
                        onChange={(e) => onUpdate?.({ ...content, photo: e.target.value })}
                        placeholder="https://exemplo.com/foto.jpg"
                        type="url"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        URL da foto do cliente (deixe em branco para usar iniciais)
                    </p>
                </div>

                {/* Preview Inline */}
                <div className="border-t pt-4 mt-4">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Preview:</p>
                    <Testimonial
                        content={content}
                        properties={properties}
                        mode="preview"
                    />
                </div>

                {/* Propriedades Avançadas (colapsável) */}
                <details className="border-t pt-4 mt-4">
                    <summary className="text-xs font-semibold text-gray-700 cursor-pointer hover:text-[#B89B7A]">
                        ⚙️ Propriedades Avançadas
                    </summary>

                    <div className="space-y-3 mt-3">
                        {/* Mostrar Foto */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="showPhoto"
                                checked={properties.showPhoto !== false}
                                onChange={(e) => onPropertiesUpdate?.({ ...properties, showPhoto: e.target.checked })}
                                className="rounded"
                            />
                            <label htmlFor="showPhoto" className="text-sm">
                                Mostrar foto/avatar
                            </label>
                        </div>

                        {/* Estilo da Citação */}
                        <div>
                            <label className="text-xs font-medium mb-1 block">
                                Estilo da Citação
                            </label>
                            <select
                                value={properties.quoteStyle || 'italic'}
                                onChange={(e) => onPropertiesUpdate?.({ ...properties, quoteStyle: e.target.value as any })}
                                className="w-full text-sm border rounded p-2"
                            >
                                <option value="italic">Itálico</option>
                                <option value="bold">Negrito</option>
                                <option value="normal">Normal</option>
                            </select>
                        </div>

                        {/* Alinhamento */}
                        <div>
                            <label className="text-xs font-medium mb-1 block">
                                Alinhamento
                            </label>
                            <select
                                value={properties.alignment || 'left'}
                                onChange={(e) => onPropertiesUpdate?.({ ...properties, alignment: e.target.value as any })}
                                className="w-full text-sm border rounded p-2"
                            >
                                <option value="left">Esquerda</option>
                                <option value="center">Centro</option>
                                <option value="right">Direita</option>
                            </select>
                        </div>

                        {/* Cor de Fundo */}
                        <div>
                            <label className="text-xs font-medium mb-1 block">
                                Cor de Fundo
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    type="color"
                                    value={properties.backgroundColor || '#ffffff'}
                                    onChange={(e) => onPropertiesUpdate?.({ ...properties, backgroundColor: e.target.value })}
                                    className="w-16 h-8 p-1"
                                />
                                <Input
                                    type="text"
                                    value={properties.backgroundColor || 'transparent'}
                                    onChange={(e) => onPropertiesUpdate?.({ ...properties, backgroundColor: e.target.value })}
                                    className="flex-1 text-xs"
                                />
                            </div>
                        </div>

                        {/* Cor do Texto */}
                        <div>
                            <label className="text-xs font-medium mb-1 block">
                                Cor do Texto
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    type="color"
                                    value={properties.textColor || '#5b4135'}
                                    onChange={(e) => onPropertiesUpdate?.({ ...properties, textColor: e.target.value })}
                                    className="w-16 h-8 p-1"
                                />
                                <Input
                                    type="text"
                                    value={properties.textColor || '#5b4135'}
                                    onChange={(e) => onPropertiesUpdate?.({ ...properties, textColor: e.target.value })}
                                    className="flex-1 text-xs"
                                />
                            </div>
                        </div>
                    </div>
                </details>
            </CardContent>
        </Card>
    );
}

export default Testimonial;
