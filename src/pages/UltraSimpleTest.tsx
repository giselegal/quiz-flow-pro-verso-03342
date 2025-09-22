// Teste super básico sem imports complexos
const UltraSimpleTest = () => {
    console.log('🚀 UltraSimpleTest renderizando...');

    const style = {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
        color: '#fff',
        fontFamily: 'monospace',
        fontSize: '20px',
        textAlign: 'center' as const
    };

    return (
        <div style={style}>
            <div>
                <h1>🎯 SISTEMA FUNCIONANDO!</h1>
                <p>Timestamp: {Date.now()}</p>
                <p>React renderizado com sucesso ✅</p>
                <div style={{ marginTop: '20px' }}>
                    <p>Debug dos services:</p>
                    <p>• Template: {typeof window !== 'undefined' && (window as any).QUIZ_STYLE_21_STEPS_TEMPLATE ? '✅' : '❌'}</p>
                    <p>• Builder: {typeof window !== 'undefined' && (window as any).builder ? '✅' : '❌'}</p>
                    <p>• LocalStorage: {typeof localStorage !== 'undefined' ? '✅' : '❌'}</p>
                </div>
            </div>
        </div>
    );
};

export default UltraSimpleTest;