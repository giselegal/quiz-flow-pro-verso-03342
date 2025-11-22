import { appLogger } from '@/lib/utils/appLogger';

/**
 * Fashion Image AI Service
 * Provides AI-powered image generation for fashion and outfit recommendations
 * Supports multiple providers (OpenAI DALL-E, Stability AI, etc.)
 */

export interface FashionImageRequest {
    prompt: string;
    style?: string;
    size?: string;
    quality?: string;
}

export interface ImageGenerationResponse {
    url: string;
    revised_prompt?: string;
    created: number;
    success?: boolean;
    error?: string;
}

interface CachedGeneration {
    prompt: string;
    response: ImageGenerationResponse;
    timestamp: number;
}

export class FashionImageAI {
    private cache: Map<string, CachedGeneration> = new Map();
    private readonly CACHE_DURATION = 60 * 60 * 1000; // 1 hour
    private readonly MAX_CACHE_SIZE = 100;

    constructor(
        private config: { 
            provider: string; 
            apiKey: string; 
            style?: string;
            baseUrl?: string;
        }
    ) {}

    /**
     * Generate a fashion image from a prompt
     */
    async generateImage(request: FashionImageRequest): Promise<ImageGenerationResponse> {
        // Check cache first
        const cacheKey = this.getCacheKey(request);
        const cached = this.getFromCache(cacheKey);
        if (cached) {
            appLogger.info('[FashionImageAI] Cache hit', { data: [request.prompt] });
            return cached;
        }

        try {
            const response = await this.callProvider(request);
            
            // Cache successful responses
            if (response.success !== false) {
                this.addToCache(cacheKey, request.prompt, response);
            }
            
            appLogger.info('[FashionImageAI] Image generated successfully', {
                data: [{ provider: this.config.provider, prompt: request.prompt }]
            });
            
            return response;
        } catch (error) {
            appLogger.error('[FashionImageAI] Image generation failed', { data: [error] });
            return {
                url: '',
                created: Date.now(),
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    /**
     * Generate an outfit image (specialized prompt)
     */
    async generateOutfitImage(request: FashionImageRequest): Promise<ImageGenerationResponse> {
        const enhancedRequest = {
            ...request,
            prompt: this.enhanceOutfitPrompt(request.prompt, request.style),
        };
        return this.generateImage(enhancedRequest);
    }

    /**
     * Generate multiple images in batch
     */
    async batchGenerate(requests: FashionImageRequest[]): Promise<ImageGenerationResponse[]> {
        appLogger.info('[FashionImageAI] Batch generation started', {
            data: [{ count: requests.length }]
        });

        const results: ImageGenerationResponse[] = [];
        
        // Process in batches to avoid overwhelming the API
        const batchSize = 3;
        for (let i = 0; i < requests.length; i += batchSize) {
            const batch = requests.slice(i, i + batchSize);
            const batchResults = await Promise.all(
                batch.map(req => this.generateImage(req))
            );
            results.push(...batchResults);
            
            // Add delay between batches to respect rate limits
            if (i + batchSize < requests.length) {
                await this.delay(1000);
            }
        }
        
        return results;
    }

    /**
     * Generate multiple variations of an outfit
     */
    async generateOutfitVariations(
        request: FashionImageRequest, 
        count: number
    ): Promise<ImageGenerationResponse[]> {
        const variations = Array.from({ length: count }, (_, i) => ({
            ...request,
            prompt: `${request.prompt} (variation ${i + 1})`,
        }));
        
        return this.batchGenerate(variations);
    }

    /**
     * Check if the AI provider is available
     */
    async checkProviderStatus(): Promise<{ available: boolean; message?: string }> {
        // If no API key is configured, return mock mode
        if (!this.config.apiKey || this.config.apiKey === 'mock' || this.config.apiKey === 'test') {
            return { 
                available: true, 
                message: 'Running in mock mode - using placeholder images' 
            };
        }

        try {
            // For real providers, we would make a lightweight API call here
            // For now, just check if config is valid
            if (this.config.provider && this.config.apiKey) {
                return { available: true, message: `Provider ${this.config.provider} configured` };
            }
            return { available: false, message: 'Provider not properly configured' };
        } catch (error) {
            return { 
                available: false, 
                message: error instanceof Error ? error.message : 'Unknown error' 
            };
        }
    }

    // =========================================================================
    // PRIVATE HELPER METHODS
    // =========================================================================

    /**
     * Call the configured AI provider
     */
    private async callProvider(request: FashionImageRequest): Promise<ImageGenerationResponse> {
        // Mock mode for development/testing
        if (!this.config.apiKey || this.config.apiKey === 'mock' || this.config.apiKey === 'test') {
            return this.generateMockResponse(request);
        }

        // Real provider implementation
        switch (this.config.provider.toLowerCase()) {
            case 'openai':
            case 'dall-e':
                return this.callOpenAI(request);
            case 'stability':
            case 'stable-diffusion':
                return this.callStabilityAI(request);
            default:
                throw new Error(`Unsupported provider: ${this.config.provider}`);
        }
    }

    /**
     * Call OpenAI DALL-E API
     */
    private async callOpenAI(request: FashionImageRequest): Promise<ImageGenerationResponse> {
        const url = this.config.baseUrl || 'https://api.openai.com/v1/images/generations';
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`,
            },
            body: JSON.stringify({
                model: 'dall-e-3',
                prompt: request.prompt,
                n: 1,
                size: request.size || '1024x1024',
                quality: request.quality || 'standard',
            }),
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.statusText}`);
        }

        const data = await response.json();
        
        return {
            url: data.data[0].url,
            revised_prompt: data.data[0].revised_prompt,
            created: Date.now(),
            success: true,
        };
    }

    /**
     * Call Stability AI API
     */
    private async callStabilityAI(request: FashionImageRequest): Promise<ImageGenerationResponse> {
        const url = this.config.baseUrl || 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image';
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`,
            },
            body: JSON.stringify({
                text_prompts: [{ text: request.prompt }],
                cfg_scale: 7,
                height: 1024,
                width: 1024,
                samples: 1,
                steps: 30,
            }),
        });

        if (!response.ok) {
            throw new Error(`Stability AI error: ${response.statusText}`);
        }

        const data = await response.json();
        const base64Image = data.artifacts[0].base64;
        const imageUrl = `data:image/png;base64,${base64Image}`;
        
        return {
            url: imageUrl,
            created: Date.now(),
            success: true,
        };
    }

    /**
     * Generate mock response for development
     */
    private generateMockResponse(request: FashionImageRequest): ImageGenerationResponse {
        // Use placeholder image service
        const width = 1024;
        const height = 1024;
        const seed = this.hashCode(request.prompt);
        
        // Use picsum.photos for realistic placeholder images
        const url = `https://picsum.photos/seed/${seed}/${width}/${height}`;
        
        appLogger.info('[FashionImageAI] Generated mock image', {
            data: [{ prompt: request.prompt, url }]
        });
        
        return {
            url,
            revised_prompt: request.prompt,
            created: Date.now(),
            success: true,
        };
    }

    /**
     * Enhance prompt specifically for outfit generation
     */
    private enhanceOutfitPrompt(basePrompt: string, style?: string): string {
        const stylePrefix = style ? `${style} style, ` : '';
        const fashionContext = 'high quality fashion photography, ';
        const technicalDetails = 'professional lighting, detailed textures, 4k resolution';
        
        return `${fashionContext}${stylePrefix}${basePrompt}, ${technicalDetails}`;
    }

    /**
     * Generate cache key from request
     */
    private getCacheKey(request: FashionImageRequest): string {
        return `${request.prompt}_${request.style || ''}_${request.size || ''}_${request.quality || ''}`;
    }

    /**
     * Get cached response if available and not expired
     */
    private getFromCache(key: string): ImageGenerationResponse | null {
        const cached = this.cache.get(key);
        if (!cached) return null;
        
        const age = Date.now() - cached.timestamp;
        if (age > this.CACHE_DURATION) {
            this.cache.delete(key);
            return null;
        }
        
        return cached.response;
    }

    /**
     * Add response to cache
     */
    private addToCache(key: string, prompt: string, response: ImageGenerationResponse): void {
        // Manage cache size
        if (this.cache.size >= this.MAX_CACHE_SIZE) {
            const oldestKey = Array.from(this.cache.entries())
                .sort((a, b) => a[1].timestamp - b[1].timestamp)[0][0];
            this.cache.delete(oldestKey);
        }
        
        this.cache.set(key, {
            prompt,
            response,
            timestamp: Date.now(),
        });
    }

    /**
     * Simple hash function for strings
     */
    private hashCode(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    /**
     * Delay helper
     */
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/**
 * Default instance with mock provider for development
 */
export const fashionImageAI = new FashionImageAI({
    provider: 'mock',
    apiKey: 'mock',
    style: 'modern',
});
