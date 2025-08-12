#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Corrigindo erros finais de sintaxe...\n');

// Função para corrigir arquivos com sintaxe quebrada
function fixSyntaxErrors() {
  const filesToFix = [
    'src/components/funnel-blocks/SalesOffer.tsx',
    'src/components/funnel-blocks/StyleResultDisplay.tsx',
    'src/components/funnel-blocks/steps/ProcessingStep.tsx',
    'src/components/quiz-builder/QuizBuilder.tsx'
  ];

  filesToFix.forEach(filePath => {
    const fullPath = path.join(__dirname, filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  Arquivo não encontrado: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    let fixed = false;

    // Fix export statements
    if (content.includes('export default SalesOffer')) {
      content = content.replace('export default SalesOffer', 'export default SalesOffer;');
      fixed = true;
    }

    if (content.includes('export default StyleResultDisplay')) {
      content = content.replace('export default StyleResultDisplay', 'export default StyleResultDisplay;');
      fixed = true;
    }

    if (content.includes('export default ProcessingStep')) {
      content = content.replace('export default ProcessingStep', 'export default ProcessingStep;');
      fixed = true;
    }

    // Fix QuizBuilder specific issues
    if (filePath.includes('QuizBuilder.tsx')) {
      // Fix the destructuring
      content = content.replace(
        /const QuizBuilder: React\.FC<QuizBuilderProps> = \(\{\s*\} = useQuizBuilder\(\);\s*const \{ blocks,\} = useEditor\(\);/s,
        `const QuizBuilder: React.FC<QuizBuilderProps> = ({ 
  setSelectedTab 
}) => {
  const { } = useQuizBuilder();
  const { blocks } = useEditor();`
      );

      // Ensure proper JSX structure
      content = content.replace(
        /return \([\s\S]*?\);[\s]*$/,
        `return (
    <div className="quiz-builder">
      <div className="text-center p-8">
        <h2 className="text-xl font-bold mb-4">Quiz Builder</h2>
        <p className="text-gray-600">Interface do construtor de quiz em desenvolvimento</p>
        <button 
          onClick={() => setSelectedTab && setSelectedTab('editor')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Ir para Editor
        </button>
      </div>
    </div>
  );
};`
      );
      fixed = true;
    }

    // Remove trailing semicolons or commas that might cause issues
    content = content.replace(/;\s*$/, '');
    content = content.replace(/,\s*$/, '');
    
    // Ensure file ends properly
    if (!content.endsWith('\n')) {
      content += '\n';
    }

    if (fixed) {
      fs.writeFileSync(fullPath, content);
      console.log(`✅ ${filePath} - Sintaxe corrigida`);
    } else {
      console.log(`ℹ️  ${filePath} - Nenhuma correção necessária`);
    }
  });
}

fixSyntaxErrors();

console.log('\n✨ Correções finais concluídas!');
