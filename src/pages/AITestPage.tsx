import { AITestComponent } from '@/components/ai/AITestComponent';

export function AITestPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        🤖 Teste GitHub Models IA
                    </h1>
                    <p className="text-gray-600">
                        Experimente a integração com modelos de IA gratuitos do GitHub
                    </p>
                </div>

                <AITestComponent />
            </div>
        </div>
    );
}

export default AITestPage;