// Script para migrar dados legados
import { runDataMigration } from './src/utils/migrationRunner.js';

console.log('🔄 Iniciando migração de dados...');
runDataMigration();
console.log('✅ Migração concluída!');
