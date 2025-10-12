import React from 'react';
import { ShoppingCart } from 'lucide-react';
import CTAButton from '../blocks/CTAButton';
import PriceBox from '../blocks/PriceBox';
import FeatureList from '../blocks/FeatureList';
import SecurityBadges from '../blocks/SecurityBadges';
import CountdownTimer from '../blocks/CountdownTimer';

interface OfferSectionProps {
    title: string;
    subtitle?: string;
    description?: string;
    features: Array<{
        icon?: string;
        label: string;
        value: string;
    }>;
    pricing: {
        current: number;
        original: number;
        installments?: {
            quantity: number;
            value: number;
        };
        discount?: number;
    };
    cta: {
        text: string;
        onClick: () => void;
    };
    countdown?: {
        enabled: boolean;
        minutes?: number;
    };
    urgencyNote?: string;
    returnPriceNote?: string;
}

export default function OfferSection({
    title,
    subtitle,
    description,
    features,
    pricing,
    cta,
    countdown = { enabled: true, minutes: 15 },
    urgencyNote,
    returnPriceNote
}: OfferSectionProps) {
    return (
        <div className="bg-gradient-to-br from-[#B89B7A]/10 to-[#a08966]/5 p-5 sm:p-6 md:p-8 rounded-lg shadow-lg mb-10 md:mb-12 border-2 border-[#B89B7A]/20">
            <div className="text-center">
                {/* Título e Subtítulo */}
                <h2 className="text-2xl sm:text-3xl font-bold text-[#432818] mb-2 tracking-tight">
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-sm text-gray-600 mb-1">{subtitle}</p>
                )}
                {description && (
                    <p className="text-base sm:text-lg text-gray-700 mb-6 md:mb-8">
                        {description}
                    </p>
                )}

                {/* Countdown Timer */}
                {countdown.enabled && (
                    <div className="mb-6 md:mb-8">
                        <CountdownTimer initialMinutes={countdown.minutes} />
                    </div>
                )}

                {/* Features List */}
                <div className="mb-6 md:mb-8">
                    <FeatureList
                        features={features}
                        totalValue={pricing.original.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        })}
                    />
                </div>

                {/* Price Box */}
                <div className="mb-6 md:mb-8">
                    <PriceBox
                        currentPrice={pricing.current}
                        originalPrice={pricing.original}
                        installments={pricing.installments}
                        discount={pricing.discount}
                    />
                </div>

                {/* CTA Button */}
                <CTAButton
                    text={cta.text}
                    onClick={cta.onClick}
                    icon={<ShoppingCart className="w-6 h-6" />}
                    variant="primary"
                    size="lg"
                    className="mb-4"
                />

                {/* Security Badges */}
                <SecurityBadges className="mt-4" />

                {/* Urgency Notes */}
                {(urgencyNote || returnPriceNote) && (
                    <div className="mt-6 space-y-2">
                        {urgencyNote && (
                            <p className="text-[#B89B7A] font-semibold text-sm sm:text-base">
                                {urgencyNote}
                            </p>
                        )}
                        {returnPriceNote && (
                            <p className="text-gray-600 text-xs sm:text-sm">
                                {returnPriceNote}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
