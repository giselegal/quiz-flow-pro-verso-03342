import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useQuizStages } from './useQuizStages';
import { useQuizComponents } from './useQuizComponents';
import { generateInitialStages, createBuilderStateFromQuiz } from '@/services/quizBuilderService';
import caktoquizQuestions from '@/data/caktoquizQuestions';

const STORAGE_KEY = 'quiz_builder_data';

export const useQuizBuilder = () => {
  const [loading, setLoading] = useState(true);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);

  const {
    stages,
    activeStageId,
    addStage,
    updateStage,
    deleteStage,
    moveStage,
    setActiveStage,
    initializeStages,
  } = useQuizStages();

  const {
    components,
    addComponent,
    updateComponent,
    deleteComponent,
    moveComponent,
    initializeComponents,
  } = useQuizComponents();

  // Load data from localStorage on initialization
  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          initializeStages(parsedData.stages);
          initializeComponents(parsedData.components);

          if (parsedData.stages && parsedData.stages.length > 0) {
            setActiveStage(parsedData.stages[0].id);
          }
        } else {
          // Initialize with existing quiz questions
          const { stages: initialStages, components: initialComponents } =
            createBuilderStateFromQuiz(caktoquizQuestions);

          initializeStages(initialStages);
          initializeComponents(initialComponents);
          if (initialStages.length > 0) {
            setActiveStage(initialStages[0].id);
          }
        }
      } catch (error) {
        console.error('Error loading quiz data:', error);
        // Fallback to generated stages if there's an error
        const { stages: initialStages, components: initialComponents } = generateInitialStages();
        initializeStages(initialStages);
        initializeComponents(initialComponents);
        if (initialStages.length > 0) {
          setActiveStage(initialStages[0].id);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [initializeComponents, initializeStages, setActiveStage]);

  // Reset selected component when active stage changes
  useEffect(() => {
    setSelectedComponentId(null);
  }, [activeStageId]);

  // Save data to localStorage on changes
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            components,
            stages,
          })
        );
      } catch (error) {
        console.error('Error saving quiz data:', error);
        toast({
          title: 'Error saving',
          description: 'Could not save quiz changes.',
          variant: 'destructive',
        });
      }
    }
  }, [components, stages, loading]);

  const saveCurrentState = useCallback(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          components,
          stages,
        })
      );
      return true;
    } catch (error) {
      console.error('Error saving quiz data:', error);
      toast({
        title: 'Error saving',
        description: 'Could not save quiz changes.',
        variant: 'destructive',
      });
      return false;
    }
  }, [components, stages]);

  return {
    components,
    stages,
    activeStageId,
    selectedComponentId,
    addComponent,
    updateComponent,
    deleteComponent,
    moveComponent,
    addStage,
    updateStage,
    deleteStage,
    moveStage,
    setActiveStage,
    setSelectedComponentId,
    saveCurrentState,
    initializeStages,
    initializeComponents,
    loading,
  };
};
