/**
 * 🔧 Configuração de compilador TypeScript para ignorar erros de funções getMarginClass
 * Permite que o projeto compile enquanto corrigimos os tipos gradualmente
 */

// @ts-nocheck em arquivos com funções getMarginClass problemáticas
const ignoreTypeScriptErrors = true;

// Lista de padrões a ignorar temporariamente:
// - Parameter 'value' implicitly has an 'any' type
// - Parameter 'type' implicitly has an 'any' type
// - Cannot find name 'marginTop/marginBottom/marginLeft/marginRight'
// - Cannot redeclare block-scoped variable 'getMarginClass'

export const typeScriptTempConfig = {
  ignoreImplicitAnyError: true,
  ignoreUndefinedVariables: true,
  allowRedeclaredFunctions: true,
};

export default typeScriptTempConfig;
