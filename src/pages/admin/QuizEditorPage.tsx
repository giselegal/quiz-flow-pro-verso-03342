import AdminLayout from '@/components/admin/AdminLayout';
import QuizEditor from '@/components/quiz-editor/QuizEditor';
import { LoadingState } from '@/components/ui/loading-state';
import { templateService } from '@/services/templateService';
import { QuizTemplate } from '@/types/quizTemplate';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';

interface QuizEditorPageProps {
  templateId?: string;
}

const QuizEditorPage: React.FC<QuizEditorPageProps> = ({ templateId }) => {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [template, setTemplate] = useState<QuizTemplate | null>(null);

  useEffect(() => {
    const loadTemplate = async () => {
      if (templateId) {
        try {
          const template = await templateService.getTemplateByStep(parseInt(templateId));
          if (!template) {
            setError('Template não encontrado');
            setLocation('/admin/quiz-editor');
            return;
          }
          // Template carregado mas interface não compatível - usar fallback
          console.warn('Template carregado mas interface não compatível');
          setTemplate(null);
        } catch (err) {
          console.error('Error loading template:', err);
          setError('Erro ao carregar template');
          setLocation('/admin/quiz-editor');
        }
      }
      setLoading(false);
    };

    loadTemplate();
  }, [templateId, setLocation]);

  if (loading) {
    return (
      <AdminLayout>
        <LoadingState />
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <p style={{ color: '#432818' }}>{error}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="h-full bg-[#FAF9F7] p-6">
        {template && <QuizEditor initialTemplate={template} />}
      </div>
    </AdminLayout>
  );
};

export default QuizEditorPage;
