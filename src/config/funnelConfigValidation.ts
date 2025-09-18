/**
 * 🔧 VALIDAÇÃO E DEMONSTRAÇÃO DA CONFIGURAÇÃO JSON COMPLETA
 * 
 * Este arquivo demonstra como toda a estrutura de configuração JSON deve ser
 * implementada para persistência completa de funis, incluindo todas as 
 * configurações relevantes como SEO, URL, pixel, analytics, webhooks, etc.
 */

// 📊 ESTRUTURA COMPLETA DO JSON DE PERSISTÊNCIA
export const COMPLETE_FUNNEL_CONFIG_EXAMPLE = {
    // ============================================================================
    // IDENTIFICAÇÃO E METADADOS
    // ============================================================================
    id: 'quiz-style-21-steps-2025',
    name: 'Quiz de Estilo Pessoal - 21 Etapas',
    description: 'Quiz interativo completo para descoberta do estilo pessoal predominante',
    version: '2.0.0',
    category: 'quiz-interativo',
    templateType: 'quiz-complete',

    // Timestamps
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: null,

    // Metadados do criador
    creator: {
        id: 'gisele-galvao',
        name: 'Gisele Galvão',
        email: 'contato@giselegaalvao.com',
        role: 'admin'
    },

    // ============================================================================
    // CONFIGURAÇÕES DE SEO E DOMÍNIO
    // ============================================================================
    seo: {
        // Meta tags básicas
        title: 'Descubra Seu Estilo Pessoal - Quiz Interativo | Gisele Galvão',
        description: 'Descubra seu estilo predominante através do nosso quiz personalizado e transforme seu guarda-roupa com confiança. Consultoria de imagem profissional.',
        keywords: [
            'estilo pessoal',
            'consultoria de imagem',
            'quiz de estilo',
            'moda feminina',
            'guarda-roupa',
            'personal stylist',
            'Gisele Galvão',
            'quiz interativo',
            'descobrir estilo',
            'transformação visual'
        ],

        // Open Graph para redes sociais
        openGraph: {
            title: 'Descubra Seu Estilo Pessoal - Quiz Interativo',
            description: 'Faça nosso quiz personalizado e descubra qual é o seu estilo predominante. Transforme seu guarda-roupa e se vista com mais confiança.',
            image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/og-image-style-quiz-gisele.webp',
            url: 'https://quiz-sell-genius.com/',
            type: 'website',
            locale: 'pt_BR',
            siteName: 'Gisele Galvão - Consultoria de Imagem'
        },

        // Twitter Cards
        twitter: {
            card: 'summary_large_image',
            title: 'Descubra Seu Estilo Pessoal - Quiz Interativo',
            description: 'Faça nosso quiz personalizado e descubra qual é o seu estilo predominante.',
            image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/og-image-style-quiz-gisele.webp',
            site: '@giselegaalvao',
            creator: '@giselegaalvao'
        },

        // Configurações técnicas
        technical: {
            canonical: 'https://quiz-sell-genius.com/',
            robots: 'index, follow',
            favicon: '/favicon.ico',
            viewport: 'width=device-width, initial-scale=1.0',
            themeColor: '#B89B7A',
            appleMobileWebAppCapable: 'yes',
            appleMobileWebAppStatusBarStyle: 'default'
        },

        // Structured Data (JSON-LD)
        structuredData: {
            '@context': 'https://schema.org',
            '@type': 'Quiz',
            name: 'Quiz de Estilo Pessoal',
            description: 'Descubra seu estilo predominante através de perguntas personalizadas',
            author: {
                '@type': 'Person',
                name: 'Gisele Galvão',
                url: 'https://giselegaalvao.com',
                sameAs: [
                    'https://instagram.com/giselegaalvao',
                    'https://facebook.com/giselegaalvao'
                ]
            },
            provider: {
                '@type': 'Organization',
                name: 'Gisele Galvão - Consultoria de Imagem',
                url: 'https://giselegaalvao.com',
                logo: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp'
            },
            interactionType: 'https://schema.org/AssessAction',
            expectedDuration: 'PT5M', // 5 minutos
            educationalLevel: 'Beginner',
            inLanguage: 'pt-BR'
        }
    },

    // ============================================================================
    // CONFIGURAÇÕES DE DOMÍNIO E HOSTING
    // ============================================================================
    domain: {
        // Domínio principal
        primary: 'quiz-sell-genius.com',

        // Domínios alternativos
        aliases: [
            'quiz-descubra-seu-estilo.com',
            'estilopessoal.gisele.com',
            'quiz.giselegaalvao.com'
        ],

        // Configurações SSL
        ssl: {
            enabled: true,
            forceHTTPS: true,
            provider: 'letsencrypt',
            autoRenewal: true
        },

        // CDN Configuration
        cdn: {
            enabled: true,
            provider: 'cloudflare',
            regions: ['us-east-1', 'sa-east-1', 'eu-west-1'],
            cacheSettings: {
                static: '30d',
                dynamic: '1h',
                api: '5m'
            }
        },

        // Redirecionamentos
        redirects: [
            { from: '/quiz', to: '/', type: '301' },
            { from: '/estilo', to: '/', type: '301' },
            { from: '/descobrir-estilo', to: '/', type: '301' },
            { from: '/quiz-style', to: '/', type: '301' },
            { from: '/style-quiz', to: '/', type: '301' },
            { from: '/consultoria', to: '/resultado', type: '302' }
        ]
    },

    // ============================================================================
    // TRACKING E ANALYTICS
    // ============================================================================
    analytics: {
        // Google Analytics 4
        googleAnalytics: {
            measurementId: 'GA4-XXXXXXXXX', // 🔧 CONFIGURE AQUI
            enhanced: true,
            demographics: true,
            advertising: true,
            dataRetention: '26_months',

            // Eventos personalizados
            customEvents: [
                'quiz_started',
                'quiz_step_completed',
                'quiz_completed',
                'result_viewed',
                'offer_viewed',
                'email_captured',
                'conversion_completed'
            ],

            // Conversões
            conversions: [
                { name: 'quiz_completion', value: 10 },
                { name: 'email_capture', value: 25 },
                { name: 'purchase', value: 197 }
            ]
        },

        // Facebook Pixel
        facebookPixel: {
            pixelId: '123456789012345', // 🔧 CONFIGURE AQUI
            enabled: true,

            // Eventos do Facebook
            events: [
                'PageView',
                'ViewContent',
                'CompleteRegistration',
                'Lead',
                'Purchase',
                'InitiateCheckout'
            ],

            // Configurações avançadas
            advanced: {
                automaticMatching: true,
                firstPartyData: true,
                serverSideEvents: false,

                // Custom audiences
                customAudiences: [
                    'quiz_completers',
                    'email_subscribers',
                    'purchasers',
                    'high_engagement'
                ]
            }
        },

        // Google Tag Manager
        googleTagManager: {
            containerId: 'GTM-XXXXXXX', // 🔧 CONFIGURE AQUI
            enabled: true,
            dataLayer: 'dataLayer',

            // Tags personalizadas
            customTags: [
                'conversion_tracking',
                'remarketing',
                'enhanced_ecommerce',
                'user_engagement'
            ]
        },

        // Hotjar (Heatmaps e Session Recording)
        hotjar: {
            siteId: '1234567', // 🔧 CONFIGURE AQUI
            enabled: true,

            // Configurações de privacidade
            respectDNT: true,
            cookieless: false,

            // Session recording
            sessionRecording: {
                enabled: true,
                sampleRate: 100,
                recordConsoleErrors: true,
                maskSensitiveData: true
            },

            // Heatmaps
            heatmaps: {
                enabled: true,
                pages: ['/', '/resultado', '/oferta'],
                deviceTypes: ['desktop', 'tablet', 'mobile']
            }
        },

        // Configurações de privacy
        privacy: {
            respectDNT: true,
            gdprCompliant: true,
            lgpdCompliant: true,
            cookieConsent: true,
            dataMinimization: true
        }
    },

    // ============================================================================
    // CONFIGURAÇÕES DE PIXEL E REMARKETING
    // ============================================================================
    pixels: {
        // Facebook Pixel (duplicado para clareza)
        facebook: {
            id: '123456789012345', // 🔧 CONFIGURE AQUI
            enabled: true,
            events: ['PageView', 'ViewContent', 'CompleteRegistration', 'Lead', 'Purchase']
        },

        // Google Ads
        googleAds: {
            conversionId: 'AW-XXXXXXXXX', // 🔧 CONFIGURE AQUI
            conversionLabel: 'XXXXXXXXXXXXX', // 🔧 CONFIGURE AQUI
            enabled: true,
            remarketing: true
        },

        // LinkedIn Insight Tag
        linkedin: {
            partnerId: '12345', // 🔧 CONFIGURE AQUI
            enabled: false
        },

        // TikTok Pixel
        tiktok: {
            pixelId: 'XXXXXXXXXXXXX', // 🔧 CONFIGURE AQUI
            enabled: false
        },

        // Pinterest Tag
        pinterest: {
            tagId: 'XXXXXXXXXXXXX', // 🔧 CONFIGURE AQUI
            enabled: false
        }
    },

    // ============================================================================
    // CONFIGURAÇÕES UTM E CAMPANHAS
    // ============================================================================
    utm: {
        // Configurações padrão
        defaults: {
            source: 'facebook',
            medium: 'cpc',
            campaign: 'quiz_style_2025',
            term: '',
            content: ''
        },

        // Auto-tracking
        autoTracking: true,
        trackingPrefix: 'qsq',

        // Campanhas ativas
        campaigns: [
            {
                name: 'Facebook Quiz Campaign',
                source: 'facebook',
                medium: 'cpc',
                campaign: 'quiz_style_fb_2025',
                content: 'quiz_focus',
                budget: 1500,
                startDate: '2025-01-01',
                endDate: '2025-03-31'
            },
            {
                name: 'Instagram Stories',
                source: 'instagram',
                medium: 'story',
                campaign: 'quiz_style_ig_stories_2025',
                content: 'story_interactive',
                budget: 800,
                startDate: '2025-01-15',
                endDate: '2025-03-15'
            },
            {
                name: 'Google Ads Quiz',
                source: 'google',
                medium: 'cpc',
                campaign: 'quiz_style_google_2025',
                content: 'search_quiz',
                budget: 1200,
                startDate: '2025-01-01',
                endDate: '2025-06-30'
            }
        ],

        // A/B Testing
        abTests: [
            {
                name: 'Landing vs Quiz Direct',
                variants: [
                    { name: 'control', utmContent: 'quiz_direct', traffic: 50 },
                    { name: 'landing', utmContent: 'landing_first', traffic: 50 }
                ],
                status: 'active',
                startDate: '2025-01-01'
            }
        ]
    },

    // ============================================================================
    // WEBHOOKS E INTEGRAÇÕES
    // ============================================================================
    webhooks: {
        // Configurações gerais
        enabled: true,
        secretKey: 'webhook_secret_key_here', // 🔧 CONFIGURE AQUI
        timeout: 10000,
        retryAttempts: 3,
        retryDelay: 1000,

        // Endpoints por evento
        endpoints: {
            // Zapier
            zapier: {
                leadCapture: 'https://hooks.zapier.com/hooks/catch/123456/lead-capture/', // 🔧 CONFIGURE AQUI
                quizComplete: 'https://hooks.zapier.com/hooks/catch/123456/quiz-complete/', // 🔧 CONFIGURE AQUI
                purchase: 'https://hooks.zapier.com/hooks/catch/123456/purchase/', // 🔧 CONFIGURE AQUI
                stepCompleted: 'https://hooks.zapier.com/hooks/catch/123456/step-completed/' // 🔧 CONFIGURE AQUI
            },

            // ActiveCampaign
            activeCampaign: {
                apiUrl: 'https://youraccountname.api-us1.com', // 🔧 CONFIGURE AQUI
                apiKey: '', // 🔧 CONFIGURE AQUI
                listId: '', // 🔧 CONFIGURE AQUI
                enabled: false
            },

            // Mailchimp
            mailchimp: {
                apiKey: '', // 🔧 CONFIGURE AQUI
                audienceId: '', // 🔧 CONFIGURE AQUI
                enabled: false
            },

            // RD Station
            rdStation: {
                token: '', // 🔧 CONFIGURE AQUI
                enabled: false
            }
        },

        // Configurações de payload por evento
        payloadStructure: {
            leadCapture: {
                fields: ['userName', 'email', 'phone', 'timestamp', 'source', 'utmParams'],
                format: 'json',
                includeMetadata: true
            },

            quizComplete: {
                fields: [
                    'userName',
                    'email',
                    'answers',
                    'scores',
                    'primaryStyle',
                    'secondaryStyles',
                    'recommendations',
                    'sessionDuration',
                    'timestamp',
                    'source',
                    'utmParams'
                ],
                format: 'json',
                includeUserAgent: true,
                includeReferrer: true
            },

            stepCompleted: {
                fields: ['stepId', 'stepName', 'timeSpent', 'answers', 'timestamp'],
                format: 'json',
                batchMode: true,
                batchSize: 10
            }
        }
    },

    // ============================================================================
    // CONFIGURAÇÕES DE DESIGN E BRANDING
    // ============================================================================
    branding: {
        // Paleta de cores
        colors: {
            primary: '#B89B7A',
            secondary: '#432818',
            accent: '#3B82F6',
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',

            // Gradientes
            gradients: {
                primary: 'linear-gradient(135deg, #B89B7A 0%, #D4C2A8 100%)',
                accent: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
                warm: 'linear-gradient(135deg, #B89B7A 0%, #432818 100%)'
            },

            // Backgrounds
            backgrounds: {
                primary: '#FAF9F7',
                secondary: '#FFFFFF',
                card: '#FEFEFE',
                border: '#E6DDD4'
            }
        },

        // Tipografia
        typography: {
            primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            heading: "'Playfair Display', serif",

            // Scale tipográfica
            scale: {
                xs: '0.75rem',    // 12px
                sm: '0.875rem',   // 14px
                base: '1rem',     // 16px
                lg: '1.125rem',   // 18px
                xl: '1.25rem',    // 20px
                '2xl': '1.5rem',  // 24px
                '3xl': '1.875rem', // 30px
                '4xl': '2.25rem'  // 36px
            },

            // Pesos
            weights: {
                light: 300,
                normal: 400,
                medium: 500,
                semibold: 600,
                bold: 700
            }
        },

        // Assets visuais
        assets: {
            logo: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
            logoAlt: 'Gisele Galvão - Consultoria de Imagem',
            favicon: '/favicon.ico',

            // Imagens padrão
            placeholders: {
                loading: 'https://via.placeholder.com/400x300/B89B7A/FFFFFF?text=Carregando...',
                error: 'https://via.placeholder.com/400x300/EF4444/FFFFFF?text=Erro+ao+carregar',
                noImage: 'https://via.placeholder.com/400x300/E5E7EB/9CA3AF?text=Sem+imagem'
            }
        },

        // Layout e espaçamentos
        layout: {
            maxWidth: '1200px',
            containerPadding: '1rem',

            // Breakpoints responsivos
            breakpoints: {
                sm: '640px',
                md: '768px',
                lg: '1024px',
                xl: '1280px',
                '2xl': '1536px'
            },

            // Sistema de espaçamento
            spacing: {
                xs: '0.25rem',   // 4px
                sm: '0.5rem',    // 8px
                md: '1rem',      // 16px
                lg: '1.5rem',    // 24px
                xl: '2rem',      // 32px
                '2xl': '3rem',   // 48px
                '3xl': '4rem'    // 64px
            }
        }
    },

    // ============================================================================
    // CONFIGURAÇÕES LEGAIS E COMPLIANCE
    // ============================================================================
    legal: {
        // Políticas e termos
        policies: {
            privacy: '/privacy',
            terms: '/terms',
            cookies: '/cookies',
            disclaimer: '/disclaimer'
        },

        // Configurações de cookies
        cookies: {
            showBanner: true,
            position: 'bottom',
            theme: 'light',

            // Textos
            text: 'Este site utiliza cookies para melhorar sua experiência e personalizar o conteúdo. Ao continuar navegando, você concorda com nossa política de cookies.',
            acceptText: 'Aceitar todos',
            rejectText: 'Recusar opcionais',
            settingsText: 'Configurações',

            // Categorias de cookies
            categories: {
                necessary: {
                    name: 'Essenciais',
                    description: 'Necessários para o funcionamento básico do site',
                    required: true,
                    cookies: ['session', 'csrf_token', 'preferences']
                },
                analytics: {
                    name: 'Analíticos',
                    description: 'Nos ajudam a entender como você usa o site',
                    required: false,
                    cookies: ['_ga', '_gid', '_gat', 'hotjar']
                },
                marketing: {
                    name: 'Marketing',
                    description: 'Usados para personalizar anúncios e conteúdo',
                    required: false,
                    cookies: ['_fbp', '_fbc', 'google_ads']
                }
            }
        },

        // Compliance GDPR/LGPD
        compliance: {
            gdpr: true,
            lgpd: true,
            ccpa: false,

            // Direitos do usuário
            userRights: [
                'access',        // Direito de acesso
                'rectification', // Direito de retificação
                'erasure',       // Direito ao esquecimento
                'portability',   // Portabilidade de dados
                'restriction',   // Restrição de processamento
                'objection'      // Direito de oposição
            ],

            // Configurações de consentimento
            consent: {
                explicit: true,
                granular: true,
                withdrawable: true,
                recordKeeping: true,

                // Tipos de consentimento
                types: [
                    'email_marketing',
                    'analytics_tracking',
                    'advertising_cookies',
                    'third_party_integrations'
                ]
            }
        },

        // Informações da empresa
        company: {
            legalName: 'Gisele Galvão ME',
            tradeName: 'Gisele Galvão - Consultoria de Imagem',
            cnpj: '00.000.000/0001-00', // 🔧 CONFIGURE AQUI

            // Endereço
            address: {
                street: 'Rua Exemplo, 123',
                complement: 'Sala 45',
                neighborhood: 'Centro',
                city: 'São Paulo',
                state: 'SP',
                zipCode: '00000-000',
                country: 'Brasil'
            },

            // Contatos
            contact: {
                phone: '(11) 99999-9999', // 🔧 CONFIGURE AQUI
                whatsapp: '5511999999999', // 🔧 CONFIGURE AQUI
                email: 'contato@giselegaalvao.com', // 🔧 CONFIGURE AQUI
                website: 'https://giselegaalvao.com'
            },

            // Redes sociais
            social: {
                instagram: 'https://instagram.com/giselegaalvao',
                facebook: 'https://facebook.com/giselegaalvao',
                linkedin: 'https://linkedin.com/in/giselegaalvao',
                youtube: 'https://youtube.com/@giselegaalvao'
            }
        }
    },

    // ============================================================================
    // CONFIGURAÇÕES DE PERFORMANCE
    // ============================================================================
    performance: {
        // Cache
        caching: {
            enabled: true,
            strategy: 'stale-while-revalidate',

            // TTL por tipo de recurso
            ttl: {
                static: 2592000,  // 30 dias
                images: 604800,   // 7 dias
                api: 300,         // 5 minutos
                html: 3600        // 1 hora
            }
        },

        // Otimizações de imagem
        images: {
            lazyLoading: true,
            webpSupport: true,
            avifSupport: true,

            // Responsive images
            responsive: {
                breakpoints: [375, 768, 1024, 1200],
                formats: ['avif', 'webp', 'jpg'],
                qualities: [80, 85, 90]
            },

            // CDN
            cdn: {
                provider: 'cloudinary',
                baseUrl: 'https://res.cloudinary.com/dqljyf76t/',
                transformations: 'f_auto,q_auto,w_auto,dpr_auto'
            }
        },

        // Preloading
        preload: {
            critical: [
                'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
                'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap',
                'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp'
            ],

            prefetch: [
                '/resultado',
                '/oferta'
            ],

            preconnect: [
                'https://fonts.googleapis.com',
                'https://fonts.gstatic.com',
                'https://www.google-analytics.com',
                'https://connect.facebook.net'
            ]
        },

        // Monitoramento Web Vitals
        webVitals: {
            enabled: true,

            // Thresholds
            thresholds: {
                LCP: 2500,  // Largest Contentful Paint
                FID: 100,   // First Input Delay
                CLS: 0.1,   // Cumulative Layout Shift
                FCP: 1800,  // First Contentful Paint
                TTFB: 600   // Time to First Byte
            },

            // Reporting
            reporting: {
                googleAnalytics: true,
                customEndpoint: '/api/web-vitals',
                batchSize: 10,
                batchTimeout: 5000
            }
        }
    },

    // ============================================================================
    // CONFIGURAÇÕES DE SEGURANÇA
    // ============================================================================
    security: {
        // Headers de segurança
        headers: {
            contentSecurityPolicy: "default-src 'self'; script-src 'self' 'unsafe-inline' *.google-analytics.com *.googletagmanager.com *.facebook.net *.hotjar.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data: *.cloudinary.com *.google-analytics.com *.facebook.com *.hotjar.com; connect-src 'self' *.google-analytics.com *.hotjar.com *.supabase.co;",
            frameOptions: 'DENY',
            contentTypeOptions: 'nosniff',
            referrerPolicy: 'strict-origin-when-cross-origin',
            xssProtection: '1; mode=block'
        },

        // Rate limiting
        rateLimiting: {
            enabled: true,
            requests: 100,
            window: 3600000, // 1 hora em ms
            skipSuccessfulRequests: true,
            keyGenerator: 'ip' // ou 'user_id'
        },

        // Validação de input
        validation: {
            xssProtection: true,
            sqlInjectionProtection: true,
            maxInputLength: 1000,
            allowedFileTypes: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
            maxFileSize: 5242880 // 5MB
        },

        // CORS
        cors: {
            origin: ['https://giselegaalvao.com', 'https://quiz-sell-genius.com'],
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true
        }
    },

    // ============================================================================
    // CONFIGURAÇÕES DE DADOS DO USUÁRIO E SESSÃO
    // ============================================================================
    userData: {
        // Estrutura de coleta
        collection: {
            // Dados básicos
            basic: {
                userName: { required: true, maxLength: 50 },
                email: { required: false, validation: 'email' },
                phone: { required: false, validation: 'phone' }
            },

            // Dados do quiz
            quiz: {
                answers: { type: 'array', required: true },
                scores: { type: 'object', required: true },
                timeSpent: { type: 'number', required: true },
                completedAt: { type: 'datetime', required: true }
            },

            // Dados de sessão
            session: {
                startedAt: { type: 'datetime', required: true },
                userAgent: { type: 'string', required: false },
                referrer: { type: 'string', required: false },
                utmParams: { type: 'object', required: false },
                ipAddress: { type: 'string', required: false, encrypt: true }
            }
        },

        // Armazenamento
        storage: {
            local: true,
            session: true,
            database: 'supabase', // ou 'firebase', 'mongodb', etc.
            backup: true,

            // Configurações de retenção
            retention: {
                sessions: '30d',
                completedQuizzes: '2y',
                analytics: '26m' // 26 meses para compliance
            }
        },

        // Privacy
        privacy: {
            anonymization: true,
            pseudonymization: false,
            encryption: true,
            dataMinimization: true,

            // Consent tracking
            consentTracking: {
                enabled: true,
                granular: true,
                withdrawable: true,
                history: true
            }
        }
    },

    // ============================================================================
    // CONFIGURAÇÕES DE A/B TESTING
    // ============================================================================
    abTesting: {
        enabled: true,
        platform: 'custom', // ou 'optimizely', 'google_optimize', etc.

        // Configurações gerais
        settings: {
            cookieDuration: 30, // dias
            trafficAllocation: 100, // % do tráfego incluído nos testes
            statisticalSignificance: 0.95,
            minimumSampleSize: 100,
            maxRunningTime: 90 // dias
        },

        // Testes ativos
        activeTests: [
            {
                id: 'homepage_variant_2025',
                name: 'Homepage: Quiz vs Landing',
                status: 'active',
                startDate: '2025-01-01',
                endDate: '2025-03-31',

                variants: [
                    {
                        id: 'control',
                        name: 'Quiz Direto',
                        description: 'Usuário vai direto para o quiz',
                        trafficPercentage: 50,
                        path: '/',
                        utmContent: 'quiz_direct'
                    },
                    {
                        id: 'landing_first',
                        name: 'Landing Primeiro',
                        description: 'Página de apresentação antes do quiz',
                        trafficPercentage: 50,
                        path: '/landing',
                        utmContent: 'landing_first'
                    }
                ],

                // Métricas e objetivos
                primaryGoal: {
                    name: 'quiz_completion_rate',
                    type: 'conversion',
                    description: 'Taxa de conclusão do quiz'
                },

                secondaryGoals: [
                    {
                        name: 'email_capture_rate',
                        type: 'conversion',
                        description: 'Taxa de captura de email'
                    },
                    {
                        name: 'time_to_completion',
                        type: 'engagement',
                        description: 'Tempo até completar o quiz'
                    }
                ]
            }
        ]
    },

    // ============================================================================
    // CONFIGURAÇÕES ESPECÍFICAS DO TEMPLATE
    // ============================================================================
    templateConfig: {
        // Configurações do quiz
        quiz: {
            totalSteps: 21,
            scoringSystem: 'weighted',

            // Configurações por etapa
            steps: {
                intro: { id: 1, type: 'form', required: ['userName'] },
                questions: { start: 2, end: 11, type: 'quiz', selections: 3 },
                strategic: { start: 13, end: 18, type: 'strategic', selections: 1 },
                result: { id: 20, type: 'result' },
                offer: { id: 21, type: 'offer' }
            },

            // Sistema de pontuação
            scoring: {
                styles: [
                    'natural', 'classico', 'contemporaneo', 'elegante',
                    'romantico', 'sexy', 'dramatico', 'criativo'
                ],

                weights: {
                    quiz_questions: 0.7,      // 70% peso para questões do quiz
                    strategic_questions: 0.3  // 30% peso para questões estratégicas
                },

                // Algoritmo de resultado
                algorithm: {
                    primaryStyle: 'highest_score',
                    secondaryStyles: 'top_3_excluding_primary',
                    minimumScoreDifference: 0.1
                }
            }
        },

        // Configurações de integração
        integrations: {
            supabase: {
                enabled: true,
                url: process.env.NEXT_PUBLIC_SUPABASE_URL,
                anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,

                tables: {
                    users: 'quiz_users',
                    sessions: 'quiz_sessions',
                    answers: 'quiz_answers',
                    results: 'quiz_results'
                }
            },

            emailProvider: {
                service: 'sendgrid', // ou 'mailgun', 'ses', etc.
                apiKey: process.env.SENDGRID_API_KEY,
                templates: {
                    welcome: 'd-xxxxxxxx',
                    result: 'd-yyyyyyyy',
                    follow_up: 'd-zzzzzzzz'
                }
            }
        }
    },

    // ============================================================================
    // CONFIGURAÇÕES DE BACKUP E RECUPERAÇÃO
    // ============================================================================
    backup: {
        enabled: true,
        frequency: 'daily',
        retention: '30d',

        // O que fazer backup
        include: [
            'user_data',
            'quiz_results',
            'analytics_data',
            'configurations'
        ],

        // Onde armazenar
        storage: {
            primary: 'supabase',
            secondary: 's3',
            local: false
        },

        // Configurações de recuperação
        recovery: {
            automatic: true,
            pointInTime: true,
            maxRecoveryTime: '24h'
        }
    }
};

// 🧪 VALIDAÇÃO DA ESTRUTURA
export function validateFunnelConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validações básicas
    if (!config.id) errors.push('ID é obrigatório');
    if (!config.name) errors.push('Nome é obrigatório');
    if (!config.seo?.title) errors.push('Título SEO é obrigatório');
    if (!config.domain?.primary) errors.push('Domínio primário é obrigatório');

    // Validações de analytics
    if (config.analytics?.googleAnalytics?.measurementId === 'GA4-XXXXXXXXX') {
        errors.push('Configure o Google Analytics ID');
    }

    if (config.pixels?.facebook?.id === '123456789012345') {
        errors.push('Configure o Facebook Pixel ID');
    }

    // Validações de webhooks
    if (config.webhooks?.enabled && !config.webhooks?.secretKey) {
        errors.push('Secret key é obrigatório quando webhooks estão habilitados');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

// 📝 EXEMPLO DE USO
console.log('🔧 Configuração completa do funil carregada!');
console.log('📊 Validação:', validateFunnelConfig(COMPLETE_FUNNEL_CONFIG_EXAMPLE));

export default COMPLETE_FUNNEL_CONFIG_EXAMPLE;
