import AdminLayout from "../../components/admin/AdminLayout";
import EnhancedQuizBuilder from "@/components/enhanced-editor/EnhancedQuizBuilder";

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
