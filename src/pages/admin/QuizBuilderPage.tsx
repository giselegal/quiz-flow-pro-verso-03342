import AdminLayout from '../../components/admin/AdminLayout';
// Legacy builder removido do build; usar editor moderno se necessário
const EnhancedQuizBuilder = () => (
  <div className="p-6">
    <h2 className="text-xl font-semibold">Editor legado indisponível</h2>
    <p className="text-sm text-muted-foreground">Use o Editor Unificado Moderno em /editor.</p>
  </div>
);

const QuizBuilderPage = () => {
  return (
    <AdminLayout>
      <div className="h-[calc(100vh-64px)]">
        <EnhancedQuizBuilder />
      </div>
    </AdminLayout>
  );
};

export default QuizBuilderPage;
