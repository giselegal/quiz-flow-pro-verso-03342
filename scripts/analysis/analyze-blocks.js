import fs from "fs";

// Ler o arquivo
const content = fs.readFileSync("./client/src/config/blockDefinitions.ts", "utf8");

// Extrair apenas o array blockDefinitions
const startIndex = content.indexOf("export const blockDefinitions: BlockDefinition[] = [");
const endIndex = content.indexOf("];", startIndex);
const arrayContent = content.substring(startIndex, endIndex + 2);

// Contar objetos que começam com {
const blockMatches = arrayContent.match(/^\s+\{/gm);
const totalBlocks = blockMatches ? blockMatches.length : 0;

console.log(`Total de blocos encontrados: ${totalBlocks}`);

// Contar propriedades específicas
const nameMatches = arrayContent.match(/^\s+name:\s*'/gm);
const categoryMatches = arrayContent.match(/^\s+category:\s*'/gm);
const descriptionMatches = arrayContent.match(/^\s+description:\s*'/gm);
const iconMatches = arrayContent.match(/^\s+icon:\s*'/gm);

console.log(`Blocos com 'name': ${nameMatches ? nameMatches.length : 0}`);
console.log(`Blocos com 'category': ${categoryMatches ? categoryMatches.length : 0}`);
console.log(`Blocos com 'description': ${descriptionMatches ? descriptionMatches.length : 0}`);
console.log(`Blocos com 'icon': ${iconMatches ? iconMatches.length : 0}`);

// Estimativa de blocos válidos (com todas as propriedades)
const validBlocks = Math.min(
  nameMatches ? nameMatches.length : 0,
  categoryMatches ? categoryMatches.length : 0,
  descriptionMatches ? descriptionMatches.length : 0,
  iconMatches ? iconMatches.length : 0
);

console.log(`Blocos potencialmente válidos: ${validBlocks}`);
