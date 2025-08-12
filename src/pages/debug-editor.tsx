import { useEditor } from "@/context/EditorContext";

const DebugEditorContext: React.FC = () => {
  console.log("🔥 DebugEditorContext: COMPONENTE RENDERIZANDO!");

  const {
    stages,
    activeStageId,
    computed: { stageCount },
  } = useEditor();

  console.log("🔥 DebugEditorContext: Dados do context:", {
    stages: stages?.length || 0,
    stagesIds: stages?.map(s => s.id) || [],
    activeStageId,
    stageCount,
  });

  return (
    <div style={{ backgroundColor: "#E5DDD5" }}>
      <h1 className="text-2xl font-bold mb-4">Debug Editor Context</h1>

      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h2 className="text-lg font-semibold mb-2">Estado do Context</h2>
        <p>
          <strong>Total de Etapas:</strong> {stages?.length || 0}
        </p>
        <p>
          <strong>Etapa Ativa:</strong> {activeStageId}
        </p>
        <p>
          <strong>Stage Count (computed):</strong> {stageCount}
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Lista de Etapas</h2>
        {stages && stages.length > 0 ? (
          <ul className="space-y-2">
            {stages.map((stage, _index) => (
              <li key={stage.id} className="p-2 border rounded">
                <strong>{stage.id}</strong>: {stage.name} ({stage.type})
                {stage.id === activeStageId && (
                  <span className=" ml-2 text-green-600">← ATIVA</span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "#432818" }}>❌ Nenhuma etapa encontrada!</p>
        )}
      </div>
    </div>
  );
};

export default DebugEditorContext;
