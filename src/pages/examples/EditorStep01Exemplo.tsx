/**
 * 🎨 EXEMPLO PRÁTICO: Editor com Componentes Modulares
 * 
 * Demonstra como usar os componentes separados do Step-01
 * no editor /editor?template=quiz-estilo
 */

import React, { useState } from 'react';
import {
    IntroStep01_Main,
    IntroStep01_PropertiesPanel,
    // Imports alternativos para uso separado:
    IntroStep01_Header,
    IntroStep01_Title,
    IntroStep01_Image,
    IntroStep01_Description,
    IntroStep01_Form
} from '../../components/editor/quiz-estilo/step-01';

// ============================================================================
// EXEMPLO 1: USO INTEGRADO (RECOMENDADO)
// ============================================================================

export function EditorExemploIntegrado() {
    const [stepData, setStepData] = useState({
        // Header
        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        showBackButton: false,
        showProgressBar: true,
        progressValue: 5,

        // Title
        title: '<span style="color: #B89B7A; font-weight: 700;">Chega</span> de um guarda-roupa lotado e da sensação de que <span style="color: #B89B7A; font-weight: 700;">nada combina com você</span>.',
        titleColor: '#432818',
        titleAccentColor: '#B89B7A',

        // Image
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.png',
        imageAlt: 'Descubra seu estilo predominante',
        imageMaxWidth: 300,
        imageMaxHeight: 204,

        // Description
        description: 'Em poucos minutos, descubra seu <strong style="color: #B89B7A;">Estilo Predominante</strong> — e aprenda a montar looks que realmente refletem sua <strong style="color: #432818;">essência</strong>.',

        // Form
        formQuestion: 'Como posso te chamar?',
        inputPlaceholder: 'Digite seu primeiro nome aqui...',
        inputLabel: 'NOME',
        buttonText: 'Quero Descobrir meu Estilo Agora!',
        required: true,
        buttonColor: '#B89B7A',
        buttonTextColor: '#FFFFFF',

        // Background
        backgroundColor: '#FAF9F7'
    });

    const [selectedField, setSelectedField] = useState<string | null>(null);

    const handleEdit = (field: string, value: any) => {
        console.log(`✏️ Campo editado: ${field} = `, value);
        setStepData(prev => ({
            ...prev,
            [field]: value
        }));
        setSelectedField(field);
    };

    const handlePropertyUpdate = (key: string, value: any) => {
        console.log(`🔧 Propriedade atualizada: ${key} = `, value);
        setStepData(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleNameSubmit = (name: string) => {
        console.log(`📝 Nome submetido no editor: ${name}`);
        alert(`Nome salvo: ${name}\n\nNo editor, aqui você salvaria no banco de dados e avançaria para o step-02.`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Toolbar do Editor */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div>
                        <h1 className="text-lg font-bold text-gray-800">
                            Editor - Step 01: Introdução
                        </h1>
                        <p className="text-xs text-gray-500">
                            Clique nos elementos para editar • Campo selecionado: {selectedField || 'Nenhum'}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg">
                            💾 Salvar
                        </button>
                        <button className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
                            👁️ Preview
                        </button>
                    </div>
                </div>
            </div>

            {/* Layout: Canvas + Properties Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-0 max-w-[1800px] mx-auto">

                {/* Canvas de Preview */}
                <div className="border-r border-gray-200 overflow-y-auto" style={{ height: 'calc(100vh - 65px)' }}>
                    <div className="bg-white m-4 rounded-lg shadow-lg overflow-hidden">
                        {/* Componente Principal Integrado */}
                        <IntroStep01_Main
                            data={stepData}
                            onNameSubmit={handleNameSubmit}
                            isEditable={true}
                            onEdit={handleEdit}
                        />
                    </div>

                    {/* Dicas de Edição */}
                    <div className="m-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                            💡 <strong>Dica:</strong> Clique em qualquer elemento para editá-lo ou use o painel de propriedades à direita →
                        </p>
                    </div>
                </div>

                {/* Painel de Propriedades */}
                <div className="bg-white border-l border-gray-200 overflow-y-auto" style={{ height: 'calc(100vh - 65px)' }}>
                    <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
                        <h2 className="text-base font-bold text-gray-800">
                            🎛️ Propriedades
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">
                            Configure todos os aspectos visuais
                        </p>
                    </div>

                    <IntroStep01_PropertiesPanel
                        properties={stepData}
                        onUpdate={handlePropertyUpdate}
                    />
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// EXEMPLO 2: USO SEPARADO (CUSTOMIZADO)
// ============================================================================

export function EditorExemploSeparado() {
    const [title, setTitle] = useState('Meu Título Customizado');
    const [imageUrl, setImageUrl] = useState('https://via.placeholder.com/300x200');
    const [buttonText, setButtonText] = useState('Começar');

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto space-y-8">

                <h1 className="text-2xl font-bold">Exemplo: Componentes Separados</h1>

                {/* Apenas Header */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <IntroStep01_Header
                        logoUrl="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp"
                        showProgressBar={true}
                        progressValue={25}
                        isEditable={true}
                        onEdit={(field, value) => console.log(field, value)}
                    />
                </div>

                {/* Apenas Título */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <IntroStep01_Title
                        title={title}
                        textColor="#000000"
                        accentColor="#FF6B6B"
                        isEditable={true}
                        onEdit={(field, value) => setTitle(value)}
                    />
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-4 w-full p-2 border rounded"
                        placeholder="Edite o título"
                    />
                </div>

                {/* Apenas Imagem */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <IntroStep01_Image
                        imageUrl={imageUrl}
                        maxWidth={400}
                        maxHeight={300}
                        showShadow={true}
                        isEditable={true}
                        onEdit={(field, value) => setImageUrl(value)}
                    />
                    <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="mt-4 w-full p-2 border rounded"
                        placeholder="URL da imagem"
                    />
                </div>

                {/* Apenas Formulário */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <IntroStep01_Form
                        formQuestion="Qual seu nome?"
                        buttonText={buttonText}
                        buttonColor="#FF6B6B"
                        onSubmit={(name) => alert(`Nome: ${name}`)}
                        isEditable={true}
                        onEdit={(field, value) => {
                            if (field === 'buttonText') setButtonText(value);
                        }}
                    />
                    <input
                        type="text"
                        value={buttonText}
                        onChange={(e) => setButtonText(e.target.value)}
                        className="mt-4 w-full p-2 border rounded"
                        placeholder="Texto do botão"
                    />
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// EXEMPLO 3: MODO PREVIEW (SEM EDIÇÃO)
// ============================================================================

export function PreviewModo() {
    const savedData = {
        title: 'Título Final Salvo',
        imageUrl: 'https://via.placeholder.com/300x200',
        buttonText: 'Iniciar Quiz',
        backgroundColor: '#F0F4F8'
    };

    const handleSubmit = (name: string) => {
        console.log('Nome submetido:', name);
        // Redirecionar para próxima página
        window.location.href = `/quiz-estilo?step=2&name=${name}`;
    };

    return (
        <IntroStep01_Main
            data={savedData}
            onNameSubmit={handleSubmit}
            isEditable={false} // ← SEM modo edição
        />
    );
}

// ============================================================================
// EXEMPLO 4: TESTE UNITÁRIO
// ============================================================================

/*
import { render, screen, fireEvent } from '@testing-library/react';
import { IntroStep01_Form } from '@/components/editor/quiz-estilo/step-01';

describe('IntroStep01_Form', () => {
    it('chama onSubmit com nome digitado', () => {
        const handleSubmit = jest.fn();
        render(<IntroStep01_Form onSubmit={handleSubmit} />);

        const input = screen.getByPlaceholderText(/digite seu primeiro nome/i);
        const button = screen.getByRole('button');

        fireEvent.change(input, { target: { value: 'Maria' } });
        fireEvent.click(button);

        expect(handleSubmit).toHaveBeenCalledWith('Maria');
    });

    it('mostra erro se campo obrigatório estiver vazio', () => {
        render(<IntroStep01_Form required={true} />);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(screen.getByText(/por favor, digite seu nome/i)).toBeInTheDocument();
    });

    it('permite customizar cores', () => {
        const { container } = render(
            <IntroStep01_Form buttonColor="#FF0000" buttonTextColor="#FFFFFF" />
        );

        const button = container.querySelector('button');
        expect(button).toHaveStyle({
            backgroundColor: '#FF0000',
            color: '#FFFFFF'
        });
    });
});
*/

// ============================================================================
// EXEMPLO 5: STORYBOOK
// ============================================================================

/*
import type { Meta, StoryObj } from '@storybook/react';
import { IntroStep01_Main } from '@/components/editor/quiz-estilo/step-01';

const meta: Meta<typeof IntroStep01_Main> = {
    title: 'Quiz/Step-01/Main',
    component: IntroStep01_Main,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;
type Story = StoryObj<typeof IntroStep01_Main>;

export const Default: Story = {
    args: {
        data: {
            title: 'Título Padrão',
            imageUrl: 'https://via.placeholder.com/300x200',
            buttonText: 'Começar'
        },
        isEditable: false
    }
};

export const Editavel: Story = {
    args: {
        data: {
            title: 'Título Editável',
            imageUrl: 'https://via.placeholder.com/300x200',
            buttonText: 'Começar'
        },
        isEditable: true,
        onEdit: (field, value) => console.log(field, value)
    }
};

export const ComProgresso: Story = {
    args: {
        data: {
            showProgressBar: true,
            progressValue: 15,
            title: 'Título com Progresso',
            buttonText: 'Continuar'
        }
    }
};
*/

// ============================================================================
// EXPORT DEFAULT
// ============================================================================

export default EditorExemploIntegrado;
