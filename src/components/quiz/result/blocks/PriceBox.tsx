import React from 'react';

interface PriceBoxProps {
    currentPrice: number;
    originalPrice: number;
    installments?: {
        quantity: number;
        value: number;
    };
    discount?: number;
    title?: string;
    urgencyText?: string;
}

export default function PriceBox({
    currentPrice,
    originalPrice,
    installments,
    discount,
    title = 'OFERTA ESPECIAL',
    urgencyText = '🔥 78% de desconto - HOJE APENAS'
}: PriceBoxProps) {
    const formatPrice = (price: number) => {
        return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    return (
        <div className="text-center p-4 bg-gradient-to-r from-[#B89B7A]/5 to-[#a08966]/5 rounded-lg border border-[#B89B7A]/20">
            <p className="text-[#B89B7A] uppercase font-bold text-sm mb-2">
                {title}
            </p>
            <p className="text-4xl font-bold text-[#B89B7A] mb-1">
                {formatPrice(currentPrice)}
            </p>
            {installments && (
                <p className="text-sm text-gray-600">
                    ou {installments.quantity}x de {formatPrice(installments.value)}
                </p>
            )}
            {(discount || urgencyText) && (
                <div className="mt-3">
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">
                        {urgencyText}
                    </span>
                </div>
            )}
        </div>
    );
}
