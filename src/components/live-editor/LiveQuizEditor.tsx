// @ts-nocheck
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LiveQuizEditorProps {
  quizId?: string;
}

export const LiveQuizEditor: React.FC<LiveQuizEditorProps> = ({ quizId, onSave }) => {
  return (
    <div className="h-full bg-[#FAF9F7]">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-[#432818] font-playfair">Editor de Quiz ao Vivo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-medium text-[#432818] mb-2">Editor em Desenvolvimento</h3>
            <p className="text-[#8F7A6A]">Esta funcionalidade estará disponível em breve</p>
            {quizId && <p className="text-sm text-[#8F7A6A] mt-2">Quiz ID: {quizId}</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveQuizEditor;
