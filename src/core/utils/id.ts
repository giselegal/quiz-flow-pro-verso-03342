// Core ID utilities: centraliza geração/validação de UUID para todo o app
import { generateUuid as gen } from '@/types/unified-schema';

export const isUUID = (value: string | null | undefined): value is string => {
    if (!value) return false;
    return /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i.test(
        value
    );
};

export const generateUuid = (): string => gen();

export default { isUUID, generateUuid };
