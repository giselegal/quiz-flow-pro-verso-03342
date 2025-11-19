declare module '@/types/blocks' {
    export type Block = {
        id: string;
        type: string;
        properties?: Record<string, any>;
        content?: Record<string, any>;
        order?: number;
        parentId?: string | null;
        stageId?: string | null;
    };

    export type BlockData = Block;

    export type BlockComponentProps<T extends Block = Block> = {
        block: T;
        onUpdate?: (patch: Partial<T>) => void;
        onSelect?: (id: string | null) => void;
    };

    export function createDefaultBlock(type: string, stageId?: string | null): Block;
}
