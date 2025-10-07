import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { templatesApi, componentsApi } from './client';
import { TemplateDraftShared } from '../../shared/templateEngineTypes';

const keys = {
    all: ['templates'] as const,
    list: () => [...keys.all, 'list'] as const,
    detail: (id: string) => [...keys.all, 'detail', id] as const,
    validate: (id: string) => [...keys.all, 'validate', id] as const
};

export function useTemplatesList() {
    return useQuery({ queryKey: keys.list(), queryFn: () => templatesApi.list() });
}

export function useTemplateDraft(id: string | undefined) {
    return useQuery({ queryKey: id ? keys.detail(id) : ['templates', 'detail', '_'], queryFn: () => id ? templatesApi.get(id) : Promise.resolve(null), enabled: !!id });
}

export function useCreateTemplate() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ name, slug }: { name: string; slug: string }) => templatesApi.create(name, slug),
        onSuccess: () => { qc.invalidateQueries({ queryKey: keys.list() }); }
    });
}

export function useUpdateMeta(id: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (patch: Partial<TemplateDraftShared['meta']>) => templatesApi.updateMeta(id, patch),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: keys.detail(id) });
            qc.invalidateQueries({ queryKey: keys.list() });
        }
    });
}

export function useAddStage(id: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (params: { type: string; afterStageId?: string; label?: string }) => templatesApi.addStage(id, params),
        onSuccess: () => qc.invalidateQueries({ queryKey: keys.detail(id) })
    });
}

export function useReorderStages(id: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (orderedIds: string[]) => templatesApi.reorderStages(id, orderedIds),
        onSuccess: () => qc.invalidateQueries({ queryKey: keys.detail(id) })
    });
}

// ---- Stage Components Hooks ----
export function useAddStageComponent(templateId: string, stageId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: { componentId?: string; component?: { type: string; props?: any; styleTokens?: any }; position?: number }) => templatesApi.addStageComponent(templateId, stageId, payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: keys.detail(templateId) })
    });
}

export function useReorderStageComponents(templateId: string, stageId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (orderedIds: string[]) => templatesApi.reorderStageComponents(templateId, stageId, orderedIds),
        onSuccess: () => qc.invalidateQueries({ queryKey: keys.detail(templateId) })
    });
}

export function useRemoveStageComponent(templateId: string, stageId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (componentId: string) => templatesApi.removeStageComponent(templateId, stageId, componentId),
        onSuccess: () => qc.invalidateQueries({ queryKey: keys.detail(templateId) })
    });
}

export function useSetOutcomes(id: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (outcomes: TemplateDraftShared['outcomes']) => templatesApi.setOutcomes(id, outcomes),
        onSuccess: () => qc.invalidateQueries({ queryKey: keys.detail(id) })
    });
}

export function useSetScoring(id: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (scoring: Partial<TemplateDraftShared['logic']['scoring']>) => templatesApi.setScoring(id, scoring),
        onSuccess: () => qc.invalidateQueries({ queryKey: keys.detail(id) })
    });
}

export function useSetBranching(id: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (rules: TemplateDraftShared['logic']['branching']) => templatesApi.setBranching(id, rules),
        onSuccess: () => qc.invalidateQueries({ queryKey: keys.detail(id) })
    });
}

export function useValidateDraft(id: string) {
    return useQuery({ queryKey: keys.validate(id), queryFn: () => templatesApi.validate(id), enabled: !!id, staleTime: 5_000 });
}

export function usePublish(id: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: () => templatesApi.publish(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: keys.detail(id) });
            qc.invalidateQueries({ queryKey: keys.list() });
        }
    });
}

export function usePreviewStart(id: string) {
    return useMutation({ mutationFn: () => templatesApi.startPreview(id) });
}

export function useUpdateComponentProps(componentId: string, templateId?: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (patch: Record<string, any>) => componentsApi.patch(componentId, patch),
        onSuccess: () => {
            if (templateId) qc.invalidateQueries({ queryKey: ['templates', 'detail', templateId] });
        }
    });
}
