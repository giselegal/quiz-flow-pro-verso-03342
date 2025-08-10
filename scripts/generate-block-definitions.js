import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolver __dirname em ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function pascalToKebab(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

function splitPascal(str) {
  return str.replace(/([A-Z])/g, " $1").trim();
}

const blocksDir = path.resolve(__dirname, "../src/components/editor/blocks");
const outFile = path.resolve(__dirname, "../src/config/generatedBlockDefinitions.ts");

// Read all files ending with Block.tsx
const files = fs.readdirSync(blocksDir).filter(f => f.endsWith("Block.tsx"));

const definitions = files.map(file => {
  const nameWithoutExt = file.replace(".tsx", "");
  const type = pascalToKebab(nameWithoutExt.replace(/Block$/, ""));
  const name = splitPascal(nameWithoutExt.replace(/Block$/, "")).trim();
  return {
    type,
    name,
    description: name,
    icon: "Edit",
    category: "General",
    propertiesSchema: [],
    defaultProperties: {},
  };
});

const content = `import { BlockDefinition } from './blockDefinitions';

// Definições geradas automaticamente de todos os componentes *Block.tsx
// Atualizado pelo script em scripts/generate-block-definitions.js

export const generatedBlockDefinitions: BlockDefinition[] = ${JSON.stringify(definitions, null, 2)};
`;

fs.writeFileSync(outFile, content, "utf8");
console.log("generatedBlockDefinitions.ts updated with", definitions.length, "blocks");
