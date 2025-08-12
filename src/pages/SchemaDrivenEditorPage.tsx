import SchemaDrivenEditorResponsive from '@/components/editor/SchemaDrivenEditorResponsive';
import { useRoute } from 'wouter';

const SchemaDrivenEditorPage: React.FC = () => {
  const [_match, params] = useRoute('/editor/:id');
  const funnelId = params?.id;

  return (
    <div className="h-screen w-full overflow-hidden bg-gray-50">
      <SchemaDrivenEditorResponsive funnelId={funnelId} />
    </div>
  );
};

export default SchemaDrivenEditorPage;
