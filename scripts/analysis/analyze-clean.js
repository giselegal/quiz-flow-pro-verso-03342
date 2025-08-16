import fs from "fs";
const content = fs.readFileSync("./client/src/config/blockDefinitionsClean.ts", "utf8");
console.log("Clean file blocks:", (content.match(/^\s+\{$/gm) || []).length);
console.log("Clean file with name:", (content.match(/^\s+name:\s*'/gm) || []).length);
