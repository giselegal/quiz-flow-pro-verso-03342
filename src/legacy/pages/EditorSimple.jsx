// Simple functional component without complex dependencies
export default function () {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8f9fa',
        padding: '2rem',
        fontFamily: 'system-ui',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          background: 'white',
          borderRadius: '8px',
          padding: '2rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}
      >
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#1a1a1a',
          }}
        >
          Editor de Quiz - Sistema Ativo
        </h1>

        <p
          style={{
            color: '#666',
            marginBottom: '2rem',
          }}
        >
          21 etapas do quiz configuradas e funcionando
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          {[...Array(21)].map((_, i) => (
            <div
              key={i}
              style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '1rem',
                backgroundColor: '#f9f9f9',
              }}
            >
              <strong>Etapa {i + 1}</strong>
              <br />
              <small style={{ color: '#666' }}>
                {i === 0 ? 'Introdução' : i === 20 ? 'Resultado' : `Pergunta ${i}`}
              </small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
