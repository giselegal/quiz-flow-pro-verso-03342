import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';
import { Button } from '@/components/ui/button';
import { Share2, Facebook, Twitter, Linkedin, MessageCircle } from 'lucide-react';

export default function ResultShareBlock({
    block,
    isSelected,
    onClick
}: AtomicBlockProps) {
    // ✅ Ler apenas de content
    const title = block.content?.title || 'Compartilhe seu resultado';
    const platforms = block.content?.platforms || ['facebook', 'twitter', 'whatsapp', 'linkedin'];
    const message = block.content?.message || 'Confira meu resultado!';

    const shareHandlers: Record<string, () => void> = {
        facebook: () => {
            const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(message)}`;
            window.open(url, '_blank', 'width=600,height=400');
        },
        twitter: () => {
            const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(window.location.href)}`;
            window.open(url, '_blank', 'width=600,height=400');
        },
        whatsapp: () => {
            const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message + ' ' + window.location.href)}`;
            window.open(url, '_blank');
        },
        linkedin: () => {
            const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
            window.open(url, '_blank', 'width=600,height=400');
        }
    };

    const platformIcons: Record<string, React.ReactNode> = {
        facebook: <Facebook className="w-5 h-5" />,
        twitter: <Twitter className="w-5 h-5" />,
        whatsapp: <MessageCircle className="w-5 h-5" />,
        linkedin: <Linkedin className="w-5 h-5" />
    };

    const platformLabels: Record<string, string> = {
        facebook: 'Facebook',
        twitter: 'Twitter',
        whatsapp: 'WhatsApp',
        linkedin: 'LinkedIn'
    };

    return (
        <div
            className={`mt-8 p-6 border rounded-lg ${isSelected ? 'ring-2 ring-primary' : ''}`}
            onClick={onClick}
        >
            <div className="flex items-center gap-2 mb-4">
                <Share2 className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold">{title}</h3>
            </div>

            <div className="flex flex-wrap gap-2">
                {platforms.map((platform: string) => {
                    if (!shareHandlers[platform]) return null;

                    return (
                        <Button
                            key={platform}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!isSelected) {
                                    shareHandlers[platform]();
                                }
                            }}
                        >
                            {platformIcons[platform]}
                            <span>{platformLabels[platform]}</span>
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}
