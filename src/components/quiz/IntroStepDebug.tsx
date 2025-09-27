export default function IntroStepDebug({ data, onNameSubmit }: any) {
    console.log('🔍 DEBUG IntroStep - dados recebidos:', data);

    return (
        <div style={{ padding: '20px', background: '#f5f5f5', margin: '20px' }}>
            <h2>🔍 DEBUG - Dados do IntroStep</h2>
            <pre style={{ background: '#333', color: '#fff', padding: '10px', fontSize: '12px' }}>
                {JSON.stringify(data, null, 2)}
            </pre>
            <hr />
            <div style={{ fontFamily: '"Playfair Display", serif' }}>
                <h1 style={{ color: '#432818', textAlign: 'center' }}>
                    <span style={{ color: '#B89B7A', fontWeight: 700 }}>Chega</span> de um guarda-roupa lotado e da sensação de que{' '}
                    <span style={{ color: '#B89B7A', fontWeight: 700 }}>nada combina com você</span>.
                </h1>
                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                    <input type="text" placeholder="Digite seu nome" />
                    <br />
                    <button onClick={() => onNameSubmit('Test')} style={{
                        background: '#B89B7A',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        marginTop: '10px',
                        borderRadius: '5px'
                    }}>
                        Teste
                    </button>
                </div>
            </div>
        </div>
    );
}