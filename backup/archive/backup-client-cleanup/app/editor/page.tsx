"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EditorProvider, useEditor } from "@/contexts/EditorContext";
import QuestionEditor from "@/components/editor/QuestionEditor";
import { Plus, Save, Eye, Settings } from "lucide-react";

interface Question {
  id: string;
  title: string;
  type: "multiple_choice" | "single_choice" | "text" | "rating";
  options: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
    points?: number;
  }>;
  required: boolean;
  description?: string;
  hint?: string;
  tags: string[];
}

const QuizEditorContent: React.FC = () => {
  const { activeTab, setActiveTab, blockSearch, setBlockSearch, availableBlocks, handleAddBlock } =
    useEditor();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizTitle, setQuizTitle] = useState("Novo Quiz");
  const [quizDescription, setQuizDescription] = useState("");

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `question-${Date.now()}`,
      title: "",
      type: "multiple_choice",
      options: [],
      required: true,
      tags: [],
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (question: Question, index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = question;
    setQuestions(updatedQuestions);
  };

  const deleteQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    const newOption = {
      id: `option-${Date.now()}`,
      text: "",
      isCorrect: false,
      points: 1,
    };
    updatedQuestions[questionIndex].options.push(newOption);
    setQuestions(updatedQuestions);
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    option: any,
    optIndex: number
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = option;
    setQuestions(updatedQuestions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(updatedQuestions);
  };

  const saveQuiz = () => {
    console.log("Saving quiz:", {
      title: quizTitle,
      description: quizDescription,
      questions,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Editor de Quiz</h1>
              <p className="text-gray-600">Crie e edite suas perguntas</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Visualizar
              </Button>
              <Button onClick={saveQuiz}>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Navegação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant={activeTab === "editor" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("editor")}
                  >
                    Editor
                  </Button>
                  <Button
                    variant={activeTab === "settings" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("settings")}
                  >
                    Configurações
                  </Button>
                </div>
              </CardContent>
            </Card>

            {activeTab === "editor" && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Blocos Disponíveis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Input
                      placeholder="Buscar blocos..."
                      value={blockSearch}
                      onChange={e => setBlockSearch(e.target.value)}
                    />

                    {/* Content Blocks */}
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm text-gray-700">Conteúdo</h4>
                      {availableBlocks
                        .filter(
                          (block: any) =>
                            block.category === "content" &&
                            block.name.toLowerCase().includes(blockSearch.toLowerCase())
                        )
                        .map((block: any) => (
                          <Button
                            key={block.type}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => handleAddBlock(block.type)}
                          >
                            <span className="mr-2">{block.icon}</span>
                            {block.name}
                          </Button>
                        ))}
                    </div>

                    {/* Layout Blocks */}
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm text-gray-700">Layout</h4>
                      {availableBlocks
                        .filter(
                          (block: any) =>
                            block.category === "layout" &&
                            block.name.toLowerCase().includes(blockSearch.toLowerCase())
                        )
                        .map((block: any) => (
                          <Button
                            key={block.type}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => handleAddBlock(block.type)}
                          >
                            <span className="mr-2">{block.icon}</span>
                            {block.name}
                          </Button>
                        ))}
                    </div>

                    {/* Quiz Blocks */}
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm text-gray-700">Quiz</h4>
                      {availableBlocks
                        .filter(
                          (block: any) =>
                            block.category === "quiz" &&
                            block.name.toLowerCase().includes(blockSearch.toLowerCase())
                        )
                        .map((block: any) => (
                          <Button
                            key={block.type}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => handleAddBlock(block.type)}
                          >
                            <span className="mr-2">{block.icon}</span>
                            {block.name}
                          </Button>
                        ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <Button onClick={addQuestion} className="w-full" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Nova Pergunta
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Editor Area */}
          <div className="lg:col-span-3">
            {activeTab === "editor" && (
              <div className="space-y-6">
                {/* Quiz Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações do Quiz</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="quiz-title">Título do Quiz</Label>
                      <Input
                        id="quiz-title"
                        value={quizTitle}
                        onChange={e => setQuizTitle(e.target.value)}
                        placeholder="Digite o título do seu quiz"
                      />
                    </div>
                    <div>
                      <Label htmlFor="quiz-description">Descrição</Label>
                      <Input
                        id="quiz-description"
                        value={quizDescription}
                        onChange={e => setQuizDescription(e.target.value)}
                        placeholder="Descreva brevemente seu quiz"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Questions */}
                <div className="space-y-4">
                  {questions.map((question: Question, index: number) => (
                    <QuestionEditor
                      key={question.id}
                      question={question}
                      onUpdate={updatedQuestion => updateQuestion(updatedQuestion, index)}
                      onDelete={() => deleteQuestion(index)}
                    />
                  ))}

                  {questions.length === 0 && (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <p className="text-gray-500 mb-4">Nenhuma pergunta adicionada ainda</p>
                        <Button onClick={addQuestion}>
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar Primeira Pergunta
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <Card>
                <CardHeader>
                  <CardTitle>Configurações Avançadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Configurações avançadas do quiz serão implementadas aqui.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function QuizEditorPage() {
  return (
    <EditorProvider>
      <QuizEditorContent />
    </EditorProvider>
  );
}
