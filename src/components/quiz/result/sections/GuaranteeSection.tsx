import React from 'react';
import GuaranteeCard from '../blocks/GuaranteeCard';
import CTAButton from '../blocks/CTAButton';

interface GuaranteeSectionProps {
    days?: number;
    title?: string;
    description?: string;
    urgencyNote?: string;
    returnPriceNote?: string;
    cta?: {
        text: string;
        onClick: () => void;
    };
    className?: string;
}

export default function GuaranteeSection({
    days = 7,
    title,
    description,
    urgencyNote,
    returnPriceNote,
    cta,
    className = ''
}: GuaranteeSectionProps) {
    return (
        <div className={className}>
            <GuaranteeCard
                days={days}
                title={title}
                description={description}
            />

            {/* Urgency Notes */}
            {(urgencyNote || returnPriceNote) && (
                <div className="text-center mt-6 space-y-2">
                    {urgencyNote && (
                        <p className="text-[#B89B7A] font-semibold">
                            {urgencyNote}
                        </p>
                    )}
                    {returnPriceNote && (
                        <p className="text-gray-600 text-sm">
                            {returnPriceNote}
                        </p>
                    )}
                </div>
            )}

            {/* Optional Secondary CTA */}
            {cta && (
                <div className="mt-6 max-w-md mx-auto">
                    <CTAButton
                        text={cta.text}
                        onClick={cta.onClick}
                        variant="secondary"
                        size="md"
                    />
                </div>
            )}
        </div>
    );
}
