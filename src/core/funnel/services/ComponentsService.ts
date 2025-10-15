/**
 * Components Service Stub - Legacy compatibility
 */

export interface AddComponentInput {
    type: string;
    props?: Record<string, any>;
}

export interface UpdateComponentInput {
    id: string;
    props?: Record<string, any>;
}

export interface ComponentInstance {
    id: string;
    instance_key: string;
    component_type_key: string;
    step_number: number;
    order_index: number;
    properties: Record<string, any>;
}

export class ComponentsService {
    getComponents(): ComponentInstance[] { 
        return []; 
    }
}

export const componentsService = new ComponentsService();
