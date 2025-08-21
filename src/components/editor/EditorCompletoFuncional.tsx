import React, { useCallback, useState } from 'react';

interface Question {
  id: string;
  tipo: 'multipla-escolha' | 'verdadeiro-falso' | 'texto-livre';
  pergunta: string;
  opcoes?: string[];
  resposta_correta?: string;
  pontos: number;
}

interface Quiz {
  id: string;
  titulo: string;
  descricao: string;
  perguntas: Question[];
  configuracoes: {
    tempo_limite?: number;
    permitir_voltar: boolean;
    mostrar_resultado_imediato: boolean;
  };
}

/**
 * 🚀 EDITOR COMPLETO E FUNCIONAL
 *
 * Editor de quiz com funcionalidades reais:
 * ✅ Criar/editar perguntas
 * ✅ Múltiplos tipos de pergunta
 * ✅ Preview em tempo real
 * ✅ Interface moderna e responsiva
 */
const EditorCompletoFuncional: React.FC = () => {
  const [quiz, setQuiz] = useState<Quiz>({
    id: 'quiz-' + Date.now(),
    titulo: 'Meu Novo Quiz',
    descricao: 'Descrição do quiz',
    perguntas: [],
    configuracoes: {
      permitir_voltar: true,
      mostrar_resultado_imediato: false,
    },
  });

  const [perguntaAtiva, setPerguntaAtiva] = useState<number | null>(null);
  const [modoPreview, setModoPreview] = useState(false);

  const adicionarPergunta = useCallback(
    (tipo: Question['tipo']) => {
      const novaPergunta: Question = {
        id: 'pergunta-' + Date.now(),
        tipo,
        pergunta: 'Nova pergunta',
        pontos: 10,
        ...(tipo === 'multipla-escolha' && {
          opcoes: ['Opção 1', 'Opção 2', 'Opção 3', 'Opção 4'],
        }),
        ...(tipo === 'verdadeiro-falso' && { opcoes: ['Verdadeiro', 'Falso'] }),
      };

      setQuiz(prev => ({
        ...prev,
        perguntas: [...prev.perguntas, novaPergunta],
      }));
      setPerguntaAtiva(quiz.perguntas.length);
    },
    [quiz.perguntas.length]
  );

  const atualizarPergunta = useCallback((index: number, campo: keyof Question, valor: any) => {
    setQuiz(prev => ({
      ...prev,
      perguntas: prev.perguntas.map((p, i) => (i === index ? { ...p, [campo]: valor } : p)),
    }));
  }, []);

  const removerPergunta = useCallback((index: number) => {
    setQuiz(prev => ({
      ...prev,
      perguntas: prev.perguntas.filter((_, i) => i !== index),
    }));
    setPerguntaAtiva(null);
  }, []);

  const salvarQuiz = useCallback(() => {
    localStorage.setItem('quiz-' + quiz.id, JSON.stringify(quiz));
    alert('Quiz salvo com sucesso!');
  }, [quiz]);

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        padding: '20px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '15px',
          }}
        >
          <div>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '28px', color: '#333' }}>
              🎯 Editor de Quiz Funcional
            </h1>
            <input
              type="text"
              value={quiz.titulo}
              onChange={e => setQuiz(prev => ({ ...prev, titulo: e.target.value }))}
              style={{
                fontSize: '20px',
                padding: '8px 12px',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                background: 'white',
                minWidth: '300px',
              }}
              placeholder="Título do Quiz"
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setModoPreview(!modoPreview)}
              style={{
                background: modoPreview ? '#28a745' : '#6f42c1',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              {modoPreview ? '📝 Editar' : '👁️ Preview'}
            </button>

            <button
              onClick={salvarQuiz}
              style={{
                background: '#28a745',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              💾 Salvar Quiz
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: modoPreview ? 'wrap' : 'nowrap' }}>
        {/* Painel Esquerdo - Editor */}
        {!modoPreview && (
          <div
            style={{
              flex: '1',
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '15px',
              padding: '20px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              minWidth: '400px',
            }}
          >
            <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>
              Perguntas ({quiz.perguntas.length})
            </h2>

            {/* Botões para adicionar pergunta */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#666' }}>
                Adicionar pergunta:
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => adicionarPergunta('multipla-escolha')}
                  style={{
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '10px 15px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  📝 Múltipla Escolha
                </button>
                <button
                  onClick={() => adicionarPergunta('verdadeiro-falso')}
                  style={{
                    background: '#17a2b8',
                    color: 'white',
                    border: 'none',
                    padding: '10px 15px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  ✅ Verdadeiro/Falso
                </button>
                <button
                  onClick={() => adicionarPergunta('texto-livre')}
                  style={{
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    padding: '10px 15px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  📖 Texto Livre
                </button>
              </div>
            </div>

            {/* Lista de perguntas */}
            <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {quiz.perguntas.map((pergunta, index) => (
                <div
                  key={pergunta.id}
                  style={{
                    background: perguntaAtiva === index ? '#e3f2fd' : '#f8f9fa',
                    border: perguntaAtiva === index ? '2px solid #2196f3' : '1px solid #dee2e6',
                    borderRadius: '8px',
                    padding: '15px',
                    marginBottom: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onClick={() => setPerguntaAtiva(index)}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          marginBottom: '8px',
                        }}
                      >
                        <span
                          style={{
                            background:
                              pergunta.tipo === 'multipla-escolha'
                                ? '#007bff'
                                : pergunta.tipo === 'verdadeiro-falso'
                                  ? '#17a2b8'
                                  : '#6c757d',
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                          }}
                        >
                          {pergunta.tipo.replace('-', ' ').toUpperCase()}
                        </span>
                        <span style={{ fontSize: '14px', color: '#666' }}>
                          {pergunta.pontos} pts
                        </span>
                      </div>
                      <p
                        style={{
                          margin: '0',
                          fontWeight: 'bold',
                          color: '#333',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {index + 1}. {pergunta.pergunta}
                      </p>
                    </div>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        removerPergunta(index);
                      }}
                      style={{
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      ❌
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Painel Direito - Edição da pergunta ativa ou Preview */}
        <div
          style={{
            flex: '1',
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '15px',
            padding: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            minWidth: '400px',
          }}
        >
          {modoPreview ? (
            // Modo Preview
            <div>
              <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>👁️ Preview do Quiz</h2>
              <div
                style={{
                  background: '#f8f9fa',
                  padding: '20px',
                  borderRadius: '10px',
                  border: '2px solid #e9ecef',
                }}
              >
                <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{quiz.titulo}</h3>
                <p style={{ margin: '0 0 20px 0', color: '#666' }}>{quiz.descricao}</p>

                <div style={{ marginBottom: '20px' }}>
                  <strong style={{ color: '#495057' }}>
                    Total de perguntas: {quiz.perguntas.length}
                  </strong>
                </div>

                {quiz.perguntas.map((pergunta, index) => (
                  <div
                    key={pergunta.id}
                    style={{
                      background: 'white',
                      padding: '15px',
                      borderRadius: '8px',
                      marginBottom: '15px',
                      border: '1px solid #dee2e6',
                    }}
                  >
                    <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>
                      {index + 1}. {pergunta.pergunta}
                    </h4>
                    {pergunta.opcoes && (
                      <div style={{ paddingLeft: '10px' }}>
                        {pergunta.opcoes.map((opcao, opcaoIndex) => (
                          <div key={opcaoIndex} style={{ margin: '5px 0' }}>
                            <label style={{ cursor: 'pointer', color: '#555' }}>
                              <input
                                type={pergunta.tipo === 'multipla-escolha' ? 'radio' : 'radio'}
                                name={`pergunta-${index}`}
                                style={{ marginRight: '8px' }}
                              />
                              {opcao}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                    {pergunta.tipo === 'texto-livre' && (
                      <textarea
                        placeholder="Digite sua resposta aqui..."
                        style={{
                          width: '100%',
                          minHeight: '80px',
                          padding: '10px',
                          border: '1px solid #ced4da',
                          borderRadius: '4px',
                          fontSize: '14px',
                          resize: 'vertical',
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : perguntaAtiva !== null ? (
            // Modo Edição da pergunta ativa
            <div>
              <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>
                Editando Pergunta {perguntaAtiva + 1}
              </h2>

              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    color: '#555',
                  }}
                >
                  Pergunta:
                </label>
                <textarea
                  value={quiz.perguntas[perguntaAtiva].pergunta}
                  onChange={e => atualizarPergunta(perguntaAtiva, 'pergunta', e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '10px',
                    border: '2px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '16px',
                    resize: 'vertical',
                  }}
                  placeholder="Digite a pergunta aqui..."
                />
              </div>

              {quiz.perguntas[perguntaAtiva].opcoes && (
                <div style={{ marginBottom: '20px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontWeight: 'bold',
                      marginBottom: '5px',
                      color: '#555',
                    }}
                  >
                    Opções de resposta:
                  </label>
                  {quiz.perguntas[perguntaAtiva].opcoes!.map((opcao, opcaoIndex) => (
                    <div key={opcaoIndex} style={{ marginBottom: '10px' }}>
                      <input
                        type="text"
                        value={opcao}
                        onChange={e => {
                          const novasOpcoes = [...quiz.perguntas[perguntaAtiva].opcoes!];
                          novasOpcoes[opcaoIndex] = e.target.value;
                          atualizarPergunta(perguntaAtiva, 'opcoes', novasOpcoes);
                        }}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #ced4da',
                          borderRadius: '4px',
                          fontSize: '14px',
                        }}
                        placeholder={`Opção ${opcaoIndex + 1}`}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    color: '#555',
                  }}
                >
                  Pontos:
                </label>
                <input
                  type="number"
                  value={quiz.perguntas[perguntaAtiva].pontos}
                  onChange={e =>
                    atualizarPergunta(perguntaAtiva, 'pontos', parseInt(e.target.value) || 0)
                  }
                  style={{
                    width: '100px',
                    padding: '8px 12px',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                  min="0"
                  max="100"
                />
              </div>
            </div>
          ) : (
            // Nenhuma pergunta selecionada
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
              <h3 style={{ margin: '0 0 15px 0' }}>✨ Selecione uma pergunta para editar</h3>
              <p style={{ margin: '0', fontSize: '16px' }}>
                Ou adicione uma nova pergunta usando os botões ao lado
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Estatísticas rodapé */}
      <div
        style={{
          background: 'rgba(255,255,255,0.9)',
          borderRadius: '10px',
          padding: '15px',
          marginTop: '20px',
          textAlign: 'center',
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
          <div>
            <strong style={{ color: '#007bff' }}>📊 Perguntas: {quiz.perguntas.length}</strong>
          </div>
          <div>
            <strong style={{ color: '#28a745' }}>
              🎯 Pontos Total: {quiz.perguntas.reduce((sum, p) => sum + p.pontos, 0)}
            </strong>
          </div>
          <div>
            <strong style={{ color: '#6f42c1' }}>
              ⏱️ Tempo Estimado: {Math.max(1, quiz.perguntas.length * 2)} min
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorCompletoFuncional;
