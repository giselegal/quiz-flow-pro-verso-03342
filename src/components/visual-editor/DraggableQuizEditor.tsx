import React, { useState, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { cn } from '@/lib/utils';
import { QuizQuestion, QuizOption } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle, Trash2, Copy, Eye, Move, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import QuestionOptionEditor from '../quiz-editor/QuestionOptionEditor';
import { QuizOption as QuizOptionComponent } from '../quiz/QuizOption';

type ItemType = 'QUESTION' | 'OPTION';

interface DraggableItemProps {
  id: string;
  index: number;
  type: ItemType;
  moveItem: (dragIndex: number, hoverIndex: number, type: ItemType, parentId?: string) => void;
  children: React.ReactNode;
  parentId?: string;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ 
  id, 
  index, 
  type, 
  moveItem, 
  children,
  parentId 
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, drag] = useDrag({
    type,
    item: { id, index, type, parentId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: type,
    hover: (item: { id: string; index: number; type: ItemType; parentId?: string }, monitor) => {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      
      // Don't replace items with themselves
      if (dragIndex === hoverIndex && item.parentId === parentId) return;

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      // Time to actually perform the action
      moveItem(dragIndex, hoverIndex, type, parentId);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div 
      ref={ref} 
      className={cn(
        "transition-opacity duration-200",
        isDragging ? "opacity-50" : "opacity-100"
      )}
    >
      {children}
    </div>
  );
};

interface QuestionBlockProps {
  question: QuizQuestion;
  index: number;
  moveQuestion: (dragIndex: number, hoverIndex: number) => void;
  updateQuestion: (id: string, updates: Partial<QuizQuestion>) => void;
  deleteQuestion: (id: string) => void;
  duplicateQuestion: (id: string) => void;
  moveOption: (questionId: string, dragIndex: number, hoverIndex: number) => void;
  addOption: (questionId: string) => void;
  updateOption: (questionId: string, optionId: string, updates: Partial<QuizOption>) => void;
  deleteOption: (questionId: string, optionId: string) => void;
  previewMode: boolean;
}

const QuestionBlock: React.FC<QuestionBlockProps> = ({
  question,
  index,
  moveQuestion,
  updateQuestion,
  deleteQuestion,
  duplicateQuestion,
  moveOption,
  addOption,
  updateOption,
  deleteOption,
  previewMode
}) => {
  const [expanded, setExpanded] = useState(true);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const handleMoveOption = useCallback(
    (dragIndex: number, hoverIndex: number, type: ItemType, parentId?: string) => {
      if (type === 'OPTION' && parentId === question.id) {
        moveOption(question.id, dragIndex, hoverIndex);
      }
    },
    [moveOption, question.id]
  );

  if (previewMode) {
    return (
      <div className="mb-8 p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-[#B89B7A]/20">
        <h3 className="text-xl font-medium text-[#432818] mb-4">{question.title}</h3>
        <div className={cn(
          "grid gap-4",
          question.options.length <= 2 ? "grid-cols-1 md:grid-cols-2" :
          question.options.length <= 4 ? "grid-cols-2 md:grid-cols-4" :
          "grid-cols-2 md:grid-cols-4"
        )}>
          {question.options.map((option) => (
            <QuizOptionComponent
              key={option.id}
              option={option}
              isSelected={option.id === selectedOptionId}
              onSelect={(id) => setSelectedOptionId(id)}
              type={question.type}
              questionId={question.id}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <DraggableItem
      id={question.id}
      index={index}
      type="QUESTION"
      moveItem={moveQuestion}
    >
      <Card className="mb-6 border-[#B89B7A]/20 shadow-sm overflow-hidden">
        <div className="bg-[#FAF9F7] p-3 border-b border-[#B89B7A]/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Move className="h-4 w-4 text-[#B89B7A] cursor-move" />
            <h3 className="font-medium text-[#432818]">
              Pergunta {index + 1}: {question.title}
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setExpanded(!expanded)}
              className="h-8 w-8"
            >
              <Settings className="h-4 w-4 text-[#8F7A6A]" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => duplicateQuestion(question.id)}
              className="h-8 w-8"
            >
              <Copy className="h-4 w-4 text-[#8F7A6A]" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteQuestion(question.id)}
              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent className="p-4">
                <div className="mb-4">
                  <input
                    type="text"
                    value={question.title}
                    onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
                    className="w-full p-2 border border-[#B89B7A]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B89B7A]/30"
                    placeholder="Título da pergunta"
                  />
                </div>

                <div className="mb-4 flex gap-4">
                  <div>
                    <label className="block text-sm text-[#8F7A6A] mb-1">Tipo de pergunta</label>
                    <select
                      value={question.type}
                      onChange={(e) => updateQuestion(question.id, { type: e.target.value as 'text' | 'image' | 'both' | 'normal' | 'strategic' })}
                      className="p-2 border border-[#B89B7A]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B89B7A]/30"
                    >
                      <option value="text">Texto</option>
                      <option value="image">Imagem</option>
                      <option value="both">Texto e Imagem</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-[#8F7A6A] mb-1">Seleção múltipla</label>
                    <select
                      value={question.multiSelect}
                      onChange={(e) => updateQuestion(question.id, { multiSelect: parseInt(e.target.value) })}
                      className="p-2 border border-[#B89B7A]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B89B7A]/30"
                    >
                      <option value="1">Única (1)</option>
                      <option value="2">Até 2 opções</option>
                      <option value="3">Até 3 opções</option>
                      <option value="4">Até 4 opções</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-[#432818] mb-2">Opções</h4>
                  <div className="space-y-3">
                    {question.options.map((option, optionIndex) => (
                      <DraggableItem
                        key={option.id}
                        id={option.id}
                        index={optionIndex}
                        type="OPTION"
                        moveItem={handleMoveOption}
                        parentId={question.id}
                      >
                        <QuestionOptionEditor
                          option={option}
                          questionType={question.type}
                          onUpdate={(updatedOption) => updateOption(question.id, option.id, updatedOption)}
                          onDelete={() => deleteOption(question.id, option.id)}
                          index={optionIndex}
                        />
                      </DraggableItem>
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => addOption(question.id)}
                  className="w-full mt-2 border-dashed border-[#B89B7A]/40 text-[#8F7A6A] hover:bg-[#FAF9F7]"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Adicionar Opção
                </Button>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </DraggableItem>
  );
};

interface DraggableQuizEditorProps {
  questions: QuizQuestion[];
  onQuestionsChange: (questions: QuizQuestion[]) => void;
}

const DraggableQuizEditor: React.FC<DraggableQuizEditorProps> = ({ questions, onQuestionsChange }) => {
  const [previewMode, setPreviewMode] = useState(false);

  const moveQuestion = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const draggedQuestion = questions[dragIndex];
      const newQuestions = [...questions];
      newQuestions.splice(dragIndex, 1);
      newQuestions.splice(hoverIndex, 0, draggedQuestion);
      onQuestionsChange(newQuestions);
    },
    [questions, onQuestionsChange]
  );

  const updateQuestion = useCallback(
    (id: string, updates: Partial<QuizQuestion>) => {
      const newQuestions = questions.map((q) =>
        q.id === id ? { ...q, ...updates } : q
      );
      onQuestionsChange(newQuestions);
    },
    [questions, onQuestionsChange]
  );

  const deleteQuestion = useCallback(
    (id: string) => {
      const newQuestions = questions.filter((q) => q.id !== id);
      onQuestionsChange(newQuestions);
    },
    [questions, onQuestionsChange]
  );

  const duplicateQuestion = useCallback(
    (id: string) => {
      const questionToDuplicate = questions.find((q) => q.id === id);
      if (questionToDuplicate) {
        const duplicatedQuestion = {
          ...questionToDuplicate,
          id: `question-${Date.now()}`,
          options: questionToDuplicate.options.map((opt) => ({
            ...opt,
            id: `option-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          })),
        };
        onQuestionsChange([...questions, duplicatedQuestion]);
      }
    },
    [questions, onQuestionsChange]
  );

  const moveOption = useCallback(
    (questionId: string, dragIndex: number, hoverIndex: number) => {
      const newQuestions = questions.map((q) => {
        if (q.id === questionId) {
          const newOptions = [...q.options];
          const draggedOption = newOptions[dragIndex];
          newOptions.splice(dragIndex, 1);
          newOptions.splice(hoverIndex, 0, draggedOption);
          return { ...q, options: newOptions };
        }
        return q;
      });
      onQuestionsChange(newQuestions);
    },
    [questions, onQuestionsChange]
  );

  const addOption = useCallback(
    (questionId: string) => {
      const newQuestions = questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: [
              ...q.options,
              {
                id: `option-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                text: 'Nova opção',
                styleCategory: 'Natural',
                points: 1,
              },
            ],
          };
        }
        return q;
      });
      onQuestionsChange(newQuestions);
    },
    [questions, onQuestionsChange]
  );

  const updateOption = useCallback(
    (questionId: string, optionId: string, updates: Partial<QuizOption>) => {
      const newQuestions = questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.map((opt) =>
              opt.id === optionId ? { ...opt, ...updates } : opt
            ),
          };
        }
        return q;
      });
      onQuestionsChange(newQuestions);
    },
    [questions, onQuestionsChange]
  );

  const deleteOption = useCallback(
    (questionId: string, optionId: string) => {
      const newQuestions = questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.filter((opt) => opt.id !== optionId),
          };
        }
        return q;
      });
      onQuestionsChange(newQuestions);
    },
    [questions, onQuestionsChange]
  );

  const addQuestion = useCallback(() => {
    const newQuestion: QuizQuestion = {
      id: `question-${Date.now()}`,
      title: 'Nova pergunta',
      type: 'text',
      multiSelect: 1,
      options: [
        {
          id: `option-${Date.now()}-1`,
          text: 'Opção 1',
          styleCategory: 'Natural',
          points: 1,
        },
        {
          id: `option-${Date.now()}-2`,
          text: 'Opção 2',
          styleCategory: 'Clássico',
          points: 1,
        },
      ],
    };
    onQuestionsChange([...questions, newQuestion]);
  }, [questions, onQuestionsChange]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-playfair text-[#432818]">Editor de Quiz</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              {previewMode ? 'Modo Edição' : 'Pré-visualizar'}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {questions.map((question, index) => (
            <QuestionBlock
              key={question.id}
              question={question}
              index={index}
              moveQuestion={moveQuestion}
              updateQuestion={updateQuestion}
              deleteQuestion={deleteQuestion}
              duplicateQuestion={duplicateQuestion}
              moveOption={moveOption}
              addOption={addOption}
              updateOption={updateOption}
              deleteOption={deleteOption}
              previewMode={previewMode}
            />
          ))}
        </div>

        <Button
          onClick={addQuestion}
          className="mt-6 bg-[#B89B7A] hover:bg-[#A38A69] text-white"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Adicionar Pergunta
        </Button>
      </div>
    </DndProvider>
  );
};

export default DraggableQuizEditor;