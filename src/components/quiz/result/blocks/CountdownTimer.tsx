import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
    initialMinutes?: number;
    onExpire?: () => void;
    urgencyMessage?: string;
}

export default function CountdownTimer({
    initialMinutes = 15,
    onExpire,
    urgencyMessage = 'Esta oferta especial expira em:'
}: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);

    useEffect(() => {
        if (timeLeft <= 0) {
            onExpire?.();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, onExpire]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-3">
                <Clock className="w-5 h-5 text-red-600" />
                <div className="text-center">
                    <p className="text-sm text-gray-700 mb-1">{urgencyMessage}</p>
                    <div className="flex gap-2 items-center justify-center">
                        <div className="bg-white px-3 py-2 rounded shadow-sm">
                            <span className="text-2xl font-bold text-red-600">
                                {String(minutes).padStart(2, '0')}
                            </span>
                        </div>
                        <span className="text-xl font-bold text-red-600">:</span>
                        <div className="bg-white px-3 py-2 rounded shadow-sm">
                            <span className="text-2xl font-bold text-red-600">
                                {String(seconds).padStart(2, '0')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
