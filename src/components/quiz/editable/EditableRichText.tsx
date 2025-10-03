import React, { useEffect, useRef, useState } from 'react';
import { EditableField } from './EditableField';

export interface EditableRichTextProps {
    // Conteúdo
    content?: string;
    placeholder?: string;

    // Layout
    maxWidth?: number; // 10-100
    generalAlignment?: 'start' | 'center' | 'end';

    // Configurações do Editor
    showToolbar?: boolean;
    minHeight?: number;

    // Personalização
    backgroundColor?: string;
    borderColor?: string;

    // Avançado  
    componentId?: string;

    // Controle
    isEditable?: boolean;
    onEdit?: (field: string, value: any) => void;
    onChange?: (content: string) => void;
}

/**
 * 🎯 RICH TEXT EDITOR INLINE
 * 
 * Componente que replica o editor Quill.js do modelo HTML:
 * - Editor inline completo com toolbar
 * - Formatação rica (headers, listas, cores, alinhamento)
 * - Edição direta no canvas (não via painel)
 * - Suporte a HTML completo
 */
export default function EditableRichText({
    content = '<h2>Título</h2><p><br></p><p>Preencha o texto.</p>',
    placeholder = 'Digite seu texto aqui...',
    maxWidth = 100,
    generalAlignment = 'start',
    showToolbar = true,
    minHeight = 150,
    backgroundColor = '#ffffff',
    borderColor = '#e5e7eb',
    componentId = '',
    isEditable = false,
    onEdit = () => { },
    onChange = () => { }
}: EditableRichTextProps) {

    const editorRef = useRef<HTMLDivElement>(null);
    const [quillInstance, setQuillInstance] = useState<any>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Importar Quill dinamicamente 
    useEffect(() => {
        const initQuill = async () => {
            if (typeof window === 'undefined' || isInitialized) return;

            try {
                // Importar Quill dinamicamente
                const { default: Quill } = await import('quill');

                // Importar estilos do Quill
                await import('quill/dist/quill.snow.css');

                if (editorRef.current && !quillInstance) {
                    const quill = new Quill(editorRef.current, {
                        theme: 'snow',
                        modules: {
                            toolbar: showToolbar ? [
                                [{ 'header': [1, 2, 3, false] }],
                                [{ 'size': ['small', false, 'large', 'huge'] }],
                                ['bold', 'italic', 'underline', 'strike'],
                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                ['link'],
                                [{ 'align': [] }],
                                [{ 'color': [] }, { 'background': [] }],
                                ['clean']
                            ] : false
                        },
                        placeholder: placeholder,
                        readOnly: !isEditable
                    });

                    // Configurar conteúdo inicial
                    if (content) {
                        quill.root.innerHTML = content;
                    }

                    // Configurar evento de mudança
                    quill.on('text-change', () => {
                        const htmlContent = quill.root.innerHTML;
                        onChange(htmlContent);
                        onEdit('content', htmlContent);
                    });

                    setQuillInstance(quill);
                    setIsInitialized(true);
                }
            } catch (error) {
                console.warn('Quill não pôde ser carregado, usando fallback:', error);
                setIsInitialized(true);
            }
        };

        initQuill();
    }, [isEditable, showToolbar, placeholder]);

    // Atualizar conteúdo quando props mudarem
    useEffect(() => {
        if (quillInstance && content !== quillInstance.root.innerHTML) {
            quillInstance.root.innerHTML = content;
        }
    }, [content, quillInstance]);

    // Atualizar modo de edição
    useEffect(() => {
        if (quillInstance) {
            quillInstance.enable(isEditable);
        }
    }, [isEditable, quillInstance]);

    // Classes para alinhamento geral
    const getGeneralAlignmentClasses = () => {
        const alignmentMap = {
            start: 'self-start',
            center: 'self-center',
            end: 'self-end'
        };
        return alignmentMap[generalAlignment];
    };

    // Estilo do container
    const containerStyle = {
        backgroundColor: backgroundColor !== '#ffffff' ? backgroundColor : undefined,
        borderColor: borderColor !== '#e5e7eb' ? borderColor : undefined,
        maxWidth: maxWidth < 100 ? `${maxWidth}%` : undefined,
        minHeight: `${minHeight}px`
    };

    // Fallback se Quill não carregar
    if (isInitialized && !quillInstance) {
        return (
            <div
                className={`min-h-[1.25rem] min-w-full relative box-border border rounded-md p-4 ${getGeneralAlignmentClasses()}`}
                style={containerStyle}
                id={componentId || undefined}
            >
                <div
                    contentEditable={isEditable}
                    dangerouslySetInnerHTML={{ __html: content }}
                    className="w-full focus:outline-none"
                    onBlur={(e) => {
                        const newContent = e.currentTarget.innerHTML;
                        onChange(newContent);
                        onEdit('content', newContent);
                    }}
                />

                {/* Indicador de modo fallback */}
                {isEditable && (
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-yellow-600 bg-yellow-50 py-1 px-3 rounded border border-yellow-200">
                        ⚠️ Editor básico (Quill não disponível)
                    </div>
                )}
            </div>
        );
    }

    return (
        <div
            className={`min-h-[1.25rem] min-w-full relative box-border ${getGeneralAlignmentClasses()}`}
            style={containerStyle}
            id={componentId || undefined}
        >
            {/* Container do Quill Editor */}
            <div className="quill w-full border rounded-md">
                <div ref={editorRef} />
            </div>

            {/* Indicador de Modo Edição */}
            {isEditable && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-blue-600 bg-blue-50 py-1 px-3 rounded border border-blue-200">
                    ✏️ Editor de texto rico inline
                </div>
            )}
        </div>
    );
}

/**
 * 🎯 WRAPPER COM PROPRIEDADES EDITÁVEIS
 */
export function EditableRichTextWithProperties(props: EditableRichTextProps) {
    return (
        <EditableField
            value={props.content || '<p>Digite aqui...</p>'}
            onChange={(content) => props.onChange?.(content)}
            isEditable={props.isEditable ?? true}
        >
            <EditableRichText {...props} />
        </EditableField>
    );
}