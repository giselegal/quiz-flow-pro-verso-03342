"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useQuiz } from "@/hooks/useQuiz";
import { useQuizzes } from "@/hooks/useQuizzes";
import { blockComponents } from "@/components/editor/blocks/BlockComponents";
import { Quiz, Question } from "@/types/quiz";

// Define interfaces
interface EditorBlock {
  id: string;
  type: "text" | "question" | "image";
  content: any;
}

interface EditableContent {
  text?: string;
  question?: string;
  options?: string[];
  imageUrl?: string;
  alt?: string;
}

export default function QuizEditorPage() {
  const [selectedView, setSelectedView] = useState("dashboard");
  const [blocks, setBlocks] = useState<EditorBlock[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  const { quizzes, loading: quizzesLoading, loadQuizzes } = useQuizzes();
  const {
    quiz,
    questions,
    loading: quizLoading,
    saveQuiz,
    loadQuiz,
    updateQuiz,
    addQuestion,
    updateQuestion,
    deleteQuestion,
  } = useQuiz();

  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);

  const addBlock = (type: EditorBlock["type"]) => {
    const newBlock: EditorBlock = {
      id: Date.now().toString(),
      type,
      content: getDefaultContent(type),
    };
    setBlocks([...blocks, newBlock]);
  };

  const getDefaultContent = (type: EditorBlock["type"]): EditableContent => {
    switch (type) {
      case "text":
        return { text: "" };
      case "question":
        return { question: "", options: ["", ""] };
      case "image":
        return { imageUrl: "", alt: "" };
      default:
        return {};
    }
  };

  const updateBlock = (id: string, content: EditableContent) => {
    setBlocks(blocks.map(block => (block.id === id ? { ...block, content } : block)));
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
  };

  const handleQuizSelect = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    loadQuiz(quiz.id);
    setSelectedView("editor");
  };

  const handleCreateQuiz = async () => {
    try {
      await saveQuiz({
        title: "Novo Quiz",
        description: "Descrição do quiz",
        category: "general",
        is_public: false,
        is_published: false,
      });
      loadQuizzes();
      setSelectedView("editor");
    } catch (error) {
      console.error("Erro ao criar quiz:", error);
    }
  };

  if (quizzesLoading) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {selectedView === "dashboard" && (
        <div className="container mx-auto p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Quiz Editor</h1>
            <Button onClick={handleCreateQuiz} className="flex items-center gap-2">
              <Plus size={16} />
              Criar Novo Quiz
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map(quiz => (
              <Card key={quiz.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {quiz.title}
                    <Badge variant="secondary">{quiz.category}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{quiz.description}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleQuizSelect(quiz)}
                      className="flex items-center gap-1"
                    >
                      <Edit size={14} />
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedView === "editor" && (
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="w-64 bg-white border-r p-4">
            <Button variant="ghost" onClick={() => setSelectedView("dashboard")} className="mb-4">
              ← Voltar
            </Button>

            <h2 className="font-bold mb-4">Componentes</h2>
            <div className="space-y-2">
              {Object.keys(blockComponents).map(type => (
                <Button
                  key={type}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => addBlock(type as EditorBlock["type"])}
                >
                  {type === "text" && "Texto"}
                  {type === "question" && "Pergunta"}
                  {type === "image" && "Imagem"}
                </Button>
              ))}
            </div>
          </div>

          {/* Main Editor */}
          <div className="flex-1 p-8">
            {selectedQuiz && (
              <div className="mb-6">
                <Input
                  value={selectedQuiz.title}
                  onChange={e => updateQuiz({ title: e.target.value })}
                  className="text-2xl font-bold mb-2"
                  placeholder="Título do Quiz"
                />
                <Textarea
                  value={selectedQuiz.description || ""}
                  onChange={e => updateQuiz({ description: e.target.value })}
                  placeholder="Descrição do quiz"
                  className="mb-4"
                />
              </div>
            )}

            <div className="space-y-4">
              {blocks.map(block => {
                const BlockComponent = blockComponents[block.type];
                if (!BlockComponent) return null;

                return (
                  <div key={block.id} className="border rounded-lg p-4">
                    <BlockComponent
                      content={block.content}
                      onUpdate={(content: EditableContent) => updateBlock(block.id, content)}
                      onDelete={() => deleteBlock(block.id)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
