import React, { useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface QuizGlobalScoringEditorProps {
    questions: any[];
    styles: { id: string; name: string }[];
    onQuestionsChange: (qs: any[]) => void;
}

// Editor global: visão por questão, exibindo matriz estilo x respostas.
// Edita diretamente os stylePoints de cada answer.
export const QuizGlobalScoringEditor: React.FC<QuizGlobalScoringEditorProps> = ({ questions, styles, onQuestionsChange }) => {
    const [filter, setFilter] = useState('');
    const filtered = useMemo(() => {
        if (!filter.trim()) return questions;
        const f = filter.toLowerCase();
        return questions.filter(q => (q.title || '').toLowerCase().includes(f));
    }, [questions, filter]);

    const updateStylePoint = (questionId: string, answerId: string, styleId: string, value: string) => {
        const numeric = Number(value);
        if (isNaN(numeric)) return;
        const updated = questions.map(q => {
            if (q.id !== questionId) return q;
            const answers = (q.answers || []).map((a: any) => {
                if (a.id !== answerId) return a;
                const stylePoints = { ...(a.stylePoints || {}) };
                stylePoints[styleId] = numeric;
                return { ...a, stylePoints };
            });
            return { ...q, answers };
        });
        onQuestionsChange(updated);
    };

    const clearQuestion = (questionId: string) => {
        const updated = questions.map(q => {
            if (q.id !== questionId) return q;
            const answers = (q.answers || []).map((a: any) => ({ ...a, stylePoints: {} }));
            return { ...q, answers };
        });
        onQuestionsChange(updated);
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">Editor Global de Pontuação</CardTitle>
                <CardDescription>
                    Ajuste rapidamente os pontos por estilo para todas as respostas. Alterações entram no auto-save.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                    <Input
                        placeholder="Filtrar questão pelo título..."
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        className="max-w-sm"
                    />
                    <Badge variant="outline">{filtered.length} / {questions.length} questões</Badge>
                </div>
                <Separator />
                {filtered.length === 0 && (
                    <p className="text-sm text-muted-foreground">Nenhuma questão corresponde ao filtro.</p>
                )}
                <div className="space-y-10">
                    {filtered.map(q => (
                        <div key={q.id} className="space-y-3 border rounded-lg p-4">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-sm">{q.title || q.id}</h3>
                                    <div className="flex gap-2 flex-wrap text-xs">
                                        <Badge variant="outline">{q.rawType || q.type}</Badge>
                                        <Badge variant="secondary">{(q.answers || []).length} respostas</Badge>
                                    </div>
                                </div>
                                <Button size="sm" variant="ghost" onClick={() => clearQuestion(q.id)}>
                                    Limpar Pontos
                                </Button>
                            </div>
                            {(q.answers || []).length === 0 ? (
                                <p className="text-xs text-muted-foreground">Sem respostas para pontuar.</p>
                            ) : (
                                <div className="overflow-auto">
                                    <table className="w-full text-xs border min-w-[600px]">
                                        <thead>
                                            <tr className="bg-muted/30">
                                                <th className="text-left p-2 w-56">Resposta</th>
                                                {styles.map(s => (
                                                    <th key={s.id} className="text-left p-2">{s.name}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(q.answers || []).map((a: any) => (
                                                <tr key={a.id} className="border-t">
                                                    <td className="p-2 font-medium align-top">{a.text}</td>
                                                    {styles.map(s => (
                                                        <td key={s.id} className="p-1 align-top">
                                                            <Input
                                                                type="number"
                                                                className="h-7 text-xs"
                                                                value={a.stylePoints?.[s.id] ?? ''}
                                                                onChange={e => updateStylePoint(q.id, a.id, s.id, e.target.value)}
                                                                placeholder="0"
                                                            />
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default QuizGlobalScoringEditor;