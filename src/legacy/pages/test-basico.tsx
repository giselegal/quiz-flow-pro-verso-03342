/**
 * Test Básico - Sem dependências externas
 */
export default function TestBasico() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#ff0000',
        color: 'white',
        padding: '20px',
        fontSize: '24px',
        zIndex: 9999,
      }}
    >
      <h1>🔍 TESTE BÁSICO FUNCIONANDO</h1>
      <p>Se você está vendo isso, o React está renderizando.</p>
      <p>Timestamp: {new Date().toISOString()}</p>
    </div>
  );
}
