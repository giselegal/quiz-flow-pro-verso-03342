/**
 * 🚀 INICIALIZADOR DOS STEPS MODULARES
 * 
 * Carrega automaticamente todos os steps disponíveis.
 * Deve ser importado no início da aplicação.
 */

// Importar steps para registrá-los automaticamente
import './step-01';

// Pode importar outros steps aqui conforme forem criados
// import './step-02';
// import './step-03';
// ...

// (exports removidos para evitar mistura de componentes e utilitários neste módulo)

// Importar stepRegistry localmente para usar no log
import { stepRegistry } from '../step-registry/StepRegistry';
import { appLogger } from '@/lib/utils/appLogger';

appLogger.info('📱 Steps modulares carregados:', { data: [{
    total: stepRegistry.getAll().length,
    steps: stepRegistry.getAll().map(s => s.name),
}] });
