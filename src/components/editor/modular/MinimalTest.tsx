/**
 * 🔧 TESTE MINIMAL - DEBUG
 */

import React from 'react';

const MinimalTest: React.FC = () => {
    return (
        <div style={{
            padding: '20px',
            border: '2px solid red',
            background: '#f0f0f0',
            minHeight: '400px',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h1 style={{ color: 'red' }}>🔧 TESTE MINIMAL FUNCIONANDO!</h1>
            <p>Se você está vendo isso, o sistema de renderização está OK.</p>
            <div style={{
                display: 'flex',
                gap: '10px',
                marginTop: '20px'
            }}>
                <div style={{
                    width: '200px',
                    height: '100px',
                    background: 'blue',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    COLUNA 1
                </div>
                <div style={{
                    width: '200px',
                    height: '100px',
                    background: 'green',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    COLUNA 2
                </div>
                <div style={{
                    width: '200px',
                    height: '100px',
                    background: 'orange',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    COLUNA 3
                </div>
                <div style={{
                    width: '200px',
                    height: '100px',
                    background: 'purple',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    COLUNA 4
                </div>
            </div>
        </div>
    );
};

export default MinimalTest;