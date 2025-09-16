/**
 * 🧪 TESTES INDIVIDUAIS - COMPONENTES STEP 20
 * Validação específica dos componentes modulares do Step 20
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { EditorProvider } from '@/components/editor/EditorProvider';
import { Block } from '@/types/editor';

// Importação dos componentes Step 20
import { Step20ResultHeader } from '@/components/editor/blocks/Step20/Step20ResultHeader';
import { Step20StyleReveal } from '@/components/editor/blocks/Step20/Step20StyleReveal';
import { Step20UserGreeting } from '@/components/editor/blocks/Step20/Step20UserGreeting';
import { Step20Compatibility } from '@/components/editor/blocks/Step20/Step20Compatibility';
import { Step20SecondaryStyles } from '@/components/editor/blocks/Step20/Step20SecondaryStyles';
import { Step20PersonalizedOffer } from '@/components/editor/blocks/Step20/Step20PersonalizedOffer';

const mockEditorContext = {
    state: {
        stepBlocks: { 'step-20': [] },
        currentStep: 20,
        selectedBlockId: null,
        stepValidation: {},
        isSupabaseEnabled: false,
        databaseMode: 'local' as const,
        isLoading: false,
    },
    actions: {
        updateBlock: vi.fn(),
        setSelectedBlockId: vi.fn(),
        addBlock: vi.fn(),
        removeBlock: vi.fn(),
        reorderBlocks: vi.fn(),
    }
};

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <EditorProvider initial={mockEditorContext.state}>
        {children}
    </EditorProvider>
);

describe('Step 20 - Componentes Modulares', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Step20ResultHeader', () => {
        const defaultBlock: Block = {
            id: 'test-result-header',
            type: 'step20-result-header',
            order: 0,
            content: {},
            properties: {
                celebrationText: 'Parabéns!',
                resultTitle: 'Seu Estilo é...',
                showConfetti: true,
                backgroundColor: '#f8f9fa',
                textColor: '#333333'
            }
        };

        it('deve renderizar header com texto de celebração', () => {
            render(
                <TestWrapper>
                    <Step20ResultHeader block={defaultBlock} />
                </TestWrapper>
            );

            expect(screen.getByText('Parabéns!')).toBeInTheDocument();
            expect(screen.getByText('Seu Estilo é...')).toBeInTheDocument();
        });

        it('deve mostrar confetti quando habilitado', () => {
            render(
                <TestWrapper>
                    <Step20ResultHeader block={defaultBlock} />
                </TestWrapper>
            );

            // Verificar se o componente de confetti está presente
            expect(screen.getByTestId('confetti-animation')).toBeInTheDocument();
        });

        it('deve ocultar confetti quando desabilitado', () => {
            const blockWithoutConfetti = {
                ...defaultBlock,
                properties: { ...defaultBlock.properties, showConfetti: false }
            };

            render(
                <TestWrapper>
                    <Step20ResultHeader block={blockWithoutConfetti} />
                </TestWrapper>
            );

            expect(screen.queryByTestId('confetti-animation')).not.toBeInTheDocument();
        });

        it('deve aplicar cores customizadas', () => {
            const customColorBlock = {
                ...defaultBlock,
                properties: {
                    ...defaultBlock.properties,
                    backgroundColor: '#ff0000',
                    textColor: '#ffffff'
                }
            };

            render(
                <TestWrapper>
                    <Step20ResultHeader block={customColorBlock} />
                </TestWrapper>
            );

            const headerElement = screen.getByTestId('result-header');
            expect(headerElement).toHaveStyle('background-color: #ff0000');
            expect(headerElement).toHaveStyle('color: #ffffff');
        });
    });

    describe('Step20StyleReveal', () => {
        const defaultBlock: Block = {
            id: 'test-style-reveal',
            type: 'step20-style-reveal',
            order: 0,
            content: {},
            properties: {
                styleName: 'Clássico Elegante',
                styleDescription: 'Um estilo atemporal que combina sofisticação e elegância.',
                showAnimation: true,
                cardStyle: 'elegant',
                imageUrl: '/images/classic-elegant.jpg'
            }
        };

        it('deve exibir nome e descrição do estilo', () => {
            render(
                <TestWrapper>
                    <Step20StyleReveal block={defaultBlock} />
                </TestWrapper>
            );

            expect(screen.getByText('Clássico Elegante')).toBeInTheDocument();
            expect(screen.getByText(/Um estilo atemporal/)).toBeInTheDocument();
        });

        it('deve renderizar imagem do estilo', () => {
            render(
                <TestWrapper>
                    <Step20StyleReveal block={defaultBlock} />
                </TestWrapper>
            );

            const image = screen.getByRole('img');
            expect(image).toHaveAttribute('src', '/images/classic-elegant.jpg');
            expect(image).toHaveAttribute('alt', 'Clássico Elegante');
        });

        it('deve aplicar animação quando habilitada', () => {
            render(
                <TestWrapper>
                    <Step20StyleReveal block={defaultBlock} />
                </TestWrapper>
            );

            const revealCard = screen.getByTestId('style-reveal-card');
            expect(revealCard).toHaveClass('animate-reveal');
        });

        it('deve aplicar estilo de cartão correto', () => {
            render(
                <TestWrapper>
                    <Step20StyleReveal block={defaultBlock} />
                </TestWrapper>
            );

            const revealCard = screen.getByTestId('style-reveal-card');
            expect(revealCard).toHaveClass('card-elegant');
        });
    });

    describe('Step20UserGreeting', () => {
        const defaultBlock: Block = {
            id: 'test-user-greeting',
            type: 'step20-user-greeting',
            order: 0,
            content: {},
            properties: {
                greetingText: 'Olá, {userName}!',
                personalizedMessage: true,
                showAvatar: false,
                avatarStyle: 'circular'
            }
        };

        // Mock do contexto do usuário
        const mockUserContext = {
            userName: 'Maria Silva',
            userAvatar: '/avatars/maria.jpg'
        };

        it('deve personalizar saudação com nome do usuário', () => {
            // Mock do contexto que fornece dados do usuário
            const GreetingWithContext = () => (
                <TestWrapper>
                    <div data-user-name="Maria Silva">
                        <Step20UserGreeting block={defaultBlock} />
                    </div>
                </TestWrapper>
            );

            render(<GreetingWithContext />);

            expect(screen.getByText(/Olá, Maria Silva!/)).toBeInTheDocument();
        });

        it('deve mostrar avatar quando habilitado', () => {
            const blockWithAvatar = {
                ...defaultBlock,
                properties: { ...defaultBlock.properties, showAvatar: true }
            };

            render(
                <TestWrapper>
                    <Step20UserGreeting block={blockWithAvatar} />
                </TestWrapper>
            );

            expect(screen.getByTestId('user-avatar')).toBeInTheDocument();
        });

        it('deve ocultar avatar quando desabilitado', () => {
            render(
                <TestWrapper>
                    <Step20UserGreeting block={defaultBlock} />
                </TestWrapper>
            );

            expect(screen.queryByTestId('user-avatar')).not.toBeInTheDocument();
        });
    });

    describe('Step20Compatibility', () => {
        const defaultBlock: Block = {
            id: 'test-compatibility',
            type: 'step20-compatibility',
            order: 0,
            content: {},
            properties: {
                percentage: 85,
                showAnimatedCounter: true,
                color: '#22c55e',
                description: 'compatibilidade com seu estilo',
                animationDuration: 2000
            }
        };

        it('deve exibir percentual de compatibilidade', () => {
            render(
                <TestWrapper>
                    <Step20Compatibility block={defaultBlock} />
                </TestWrapper>
            );

            expect(screen.getByText('85%')).toBeInTheDocument();
            expect(screen.getByText(/compatibilidade com seu estilo/)).toBeInTheDocument();
        });

        it('deve animar contador quando habilitado', async () => {
            render(
                <TestWrapper>
                    <Step20Compatibility block={defaultBlock} />
                </TestWrapper>
            );

            const counter = screen.getByTestId('compatibility-counter');
            expect(counter).toHaveClass('animate-counter');

            // Verificar se a animação inicia com 0 e vai até o valor final
            expect(counter).toHaveAttribute('data-target', '85');
        });

        it('deve aplicar cor personalizada', () => {
            render(
                <TestWrapper>
                    <Step20Compatibility block={defaultBlock} />
                </TestWrapper>
            );

            const progressBar = screen.getByTestId('compatibility-progress');
            expect(progressBar).toHaveStyle('background-color: #22c55e');
        });

        it('deve lidar com diferentes valores de percentual', () => {
            const variations = [
                { percentage: 0, expected: '0%' },
                { percentage: 50, expected: '50%' },
                { percentage: 100, expected: '100%' }
            ];

            variations.forEach(({ percentage, expected }) => {
                const testBlock = {
                    ...defaultBlock,
                    properties: { ...defaultBlock.properties, percentage }
                };

                const { unmount } = render(
                    <TestWrapper>
                        <Step20Compatibility block={testBlock} />
                    </TestWrapper>
                );

                expect(screen.getByText(expected)).toBeInTheDocument();
                unmount();
            });
        });
    });

    describe('Step20SecondaryStyles', () => {
        const defaultBlock: Block = {
            id: 'test-secondary-styles',
            type: 'step20-secondary-styles',
            order: 0,
            content: {},
            properties: {
                showSecondaryStyles: true,
                maxSecondaryStyles: 3,
                cardLayout: 'grid',
                secondaryStyles: [
                    {
                        name: 'Moderno Minimalista',
                        percentage: 75,
                        description: 'Linhas limpas e simplicidade',
                        imageUrl: '/images/modern.jpg'
                    },
                    {
                        name: 'Romântico Delicado',
                        percentage: 65,
                        description: 'Suavidade e feminilidade',
                        imageUrl: '/images/romantic.jpg'
                    }
                ]
            }
        };

        it('deve renderizar estilos secundários quando habilitados', () => {
            render(
                <TestWrapper>
                    <Step20SecondaryStyles block={defaultBlock} />
                </TestWrapper>
            );

            expect(screen.getByText('Moderno Minimalista')).toBeInTheDocument();
            expect(screen.getByText('Romântico Delicado')).toBeInTheDocument();
            expect(screen.getByText('75%')).toBeInTheDocument();
            expect(screen.getByText('65%')).toBeInTheDocument();
        });

        it('deve respeitar limite máximo de estilos', () => {
            const blockWithManyStyles = {
                ...defaultBlock,
                properties: {
                    ...defaultBlock.properties,
                    maxSecondaryStyles: 1,
                    secondaryStyles: [
                        ...defaultBlock.properties.secondaryStyles,
                        {
                            name: 'Terceiro Estilo',
                            percentage: 55,
                            description: 'Teste',
                            imageUrl: '/images/third.jpg'
                        }
                    ]
                }
            };

            render(
                <TestWrapper>
                    <Step20SecondaryStyles block={blockWithManyStyles} />
                </TestWrapper>
            );

            // Deve mostrar apenas o primeiro estilo
            expect(screen.getByText('Moderno Minimalista')).toBeInTheDocument();
            expect(screen.queryByText('Romântico Delicado')).not.toBeInTheDocument();
            expect(screen.queryByText('Terceiro Estilo')).not.toBeInTheDocument();
        });

        it('deve aplicar layout de grid', () => {
            render(
                <TestWrapper>
                    <Step20SecondaryStyles block={defaultBlock} />
                </TestWrapper>
            );

            const container = screen.getByTestId('secondary-styles-container');
            expect(container).toHaveClass('grid-layout');
        });

        it('deve ocultar estilos quando desabilitados', () => {
            const blockWithoutSecondary = {
                ...defaultBlock,
                properties: { ...defaultBlock.properties, showSecondaryStyles: false }
            };

            render(
                <TestWrapper>
                    <Step20SecondaryStyles block={blockWithoutSecondary} />
                </TestWrapper>
            );

            expect(screen.queryByText('Moderno Minimalista')).not.toBeInTheDocument();
            expect(screen.queryByText('Romântico Delicado')).not.toBeInTheDocument();
        });
    });

    describe('Step20PersonalizedOffer', () => {
        const defaultBlock: Block = {
            id: 'test-personalized-offer',
            type: 'step20-personalized-offer',
            order: 0,
            content: {},
            properties: {
                offerTitle: 'Consultoria Personalizada',
                offerDescription: 'Descubra como aplicar seu estilo no dia a dia',
                ctaText: 'Quero Minha Consultoria',
                showDiscount: true,
                discountPercentage: 20,
                originalPrice: '297',
                discountedPrice: '237',
                urgencyText: 'Oferta válida por tempo limitado!',
                showUrgency: true
            }
        };

        it('deve renderizar oferta personalizada completa', () => {
            render(
                <TestWrapper>
                    <Step20PersonalizedOffer block={defaultBlock} />
                </TestWrapper>
            );

            expect(screen.getByText('Consultoria Personalizada')).toBeInTheDocument();
            expect(screen.getByText(/Descubra como aplicar/)).toBeInTheDocument();
            expect(screen.getByText('Quero Minha Consultoria')).toBeInTheDocument();
        });

        it('deve mostrar desconto quando habilitado', () => {
            render(
                <TestWrapper>
                    <Step20PersonalizedOffer block={defaultBlock} />
                </TestWrapper>
            );

            expect(screen.getByText('20% OFF')).toBeInTheDocument();
            expect(screen.getByText('R$ 297')).toBeInTheDocument();
            expect(screen.getByText('R$ 237')).toBeInTheDocument();
        });

        it('deve ocultar desconto quando desabilitado', () => {
            const blockWithoutDiscount = {
                ...defaultBlock,
                properties: { ...defaultBlock.properties, showDiscount: false }
            };

            render(
                <TestWrapper>
                    <Step20PersonalizedOffer block={blockWithoutDiscount} />
                </TestWrapper>
            );

            expect(screen.queryByText('20% OFF')).not.toBeInTheDocument();
            expect(screen.queryByText('R$ 297')).not.toBeInTheDocument();
        });

        it('deve mostrar urgência quando habilitado', () => {
            render(
                <TestWrapper>
                    <Step20PersonalizedOffer block={defaultBlock} />
                </TestWrapper>
            );

            expect(screen.getByText(/Oferta válida por tempo limitado/)).toBeInTheDocument();
        });

        it('deve lidar com clique no CTA', async () => {
            const user = userEvent.setup();

            render(
                <TestWrapper>
                    <Step20PersonalizedOffer block={defaultBlock} />
                </TestWrapper>
            );

            const ctaButton = screen.getByRole('button', { name: 'Quero Minha Consultoria' });
            await user.click(ctaButton);

            // Verificar se o evento de clique foi tratado
            expect(ctaButton).toHaveClass('clicked');
        });

        it('deve ser responsivo', () => {
            render(
                <TestWrapper>
                    <Step20PersonalizedOffer block={defaultBlock} />
                </TestWrapper>
            );

            const offerContainer = screen.getByTestId('personalized-offer');
            expect(offerContainer).toHaveClass('responsive-offer');
        });
    });

    describe('Integração entre Componentes Step 20', () => {
        it('deve manter estado consistente entre componentes', () => {
            const blocks = [
                {
                    id: 'header',
                    type: 'step20-result-header' as const,
                    order: 0,
                    content: {},
                    properties: { celebrationText: 'Parabéns!', resultTitle: 'Seu resultado:' }
                },
                {
                    id: 'reveal',
                    type: 'step20-style-reveal' as const,
                    order: 1,
                    content: {},
                    properties: { styleName: 'Clássico', showAnimation: true }
                }
            ];

            render(
                <TestWrapper>
                    <div data-testid="step20-integration">
                        <Step20ResultHeader block={blocks[0]} />
                        <Step20StyleReveal block={blocks[1]} />
                    </div>
                </TestWrapper>
            );

            expect(screen.getByTestId('step20-integration')).toBeInTheDocument();
            expect(screen.getByText('Parabéns!')).toBeInTheDocument();
            expect(screen.getByText('Clássico')).toBeInTheDocument();
        });

        it('deve sincronizar dados entre componentes', async () => {
            // Teste de sincronização de dados entre componentes
            const user = userEvent.setup();

            render(
                <TestWrapper>
                    <Step20UserGreeting block={{
                        id: 'greeting',
                        type: 'step20-user-greeting',
                        order: 0,
                        content: {},
                        properties: { greetingText: 'Olá, {userName}!' }
                    }} />
                    <Step20PersonalizedOffer block={{
                        id: 'offer',
                        type: 'step20-personalized-offer',
                        order: 1,
                        content: {},
                        properties: {
                            offerTitle: 'Oferta para {userName}',
                            ctaText: 'Aceitar Oferta'
                        }
                    }} />
                </TestWrapper>
            );

            // Verificar se ambos os componentes referenciam o mesmo usuário
            expect(screen.getAllByText(/userName/)).toHaveLength(2);
        });
    });
});