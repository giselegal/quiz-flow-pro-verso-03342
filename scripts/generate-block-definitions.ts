import fs from "fs";
import path from "path";
import { BlockDefinition } from "../src/config/blockDefinitions";

function pascalToKebab(str: string) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

function splitPascal(str: string) {
  return str.replace(/([A-Z])/g, " $1").trim();
}

const blocksDir = path.resolve(__dirname, "../src/components/editor/blocks");
const outFile = path.resolve(__dirname, "../src/config/generatedBlockDefinitions.ts");

// Read all files ending with Block.tsx
const files = fs.readdirSync(blocksDir).filter(f => f.endsWith("Block.tsx"));

const definitions: BlockDefinition[] = files.map(file => {
  const nameWithoutExt = file.replace(".tsx", "");
  const type = pascalToKebab(nameWithoutExt.replace(/Block$/, ""));
  const name = splitPascal(nameWithoutExt.replace(/Block$/, ""));
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

export const generatedBlockDefinitions: BlockDefinition[] = ${JSON.stringify(definitions, null, 2)};
`;

fs.writeFileSync(outFile, content);
console.log("generatedBlockDefinitions.ts updated with", definitions.length, "blocks");
