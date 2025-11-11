#!/usr/bin/env ts-node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// scripts/migrateTemplatesV3_2.ts
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var stepsDir = import_path.default.join(process.cwd(), "public", "templates", "funnels", "quiz21StepsComplete", "steps");
var masterFile = import_path.default.join(process.cwd(), "public", "templates", "funnels", "quiz21StepsComplete", "master.v3.json");
var TYPE_MAPPING = {
  "hero-block": "intro-logo-header",
  "welcome-form-block": "intro-form",
  "transition.next": "transition-hero",
  "result.headline": "result-main",
  "result.secondaryList": "result-secondary-styles",
  "offer.core": "cta-inline",
  // opção simples; poderia ser 'pricing'
  "offer.urgency": "urgency-timer-inline",
  "offer.testimonial": "testimonials"
};
var CONTENT_KEYS = /* @__PURE__ */ new Set([
  "title",
  "titleHtml",
  "subtitle",
  "subtitleHtml",
  "message",
  "paragraphs",
  "buttonLabel",
  "questionLabel",
  "placeholder",
  "required",
  "questionText",
  "questionNumber",
  "options",
  "imageUrl",
  "imageAlt",
  "logoUrl",
  "logoAlt",
  "deadlineISO",
  "quote",
  "author",
  "prefix",
  "highlight",
  "showSecondary",
  "max",
  "ctaLabel",
  "ctaUrl",
  "accent",
  "requiredSelections",
  "width"
]);
function migrateBlock(block) {
  const originalType = block.type;
  if (TYPE_MAPPING[originalType]) {
    block.type = TYPE_MAPPING[originalType];
  }
  if (!block.content) block.content = {};
  if (block.config && typeof block.config === "object") {
    for (const [key, value] of Object.entries(block.config)) {
      if (CONTENT_KEYS.has(key)) {
        if (block.content[key] === void 0) {
          block.content[key] = value;
        }
      } else {
        if (!block.properties) block.properties = {};
        if (block.properties[key] === void 0) {
          block.properties[key] = value;
        }
      }
    }
    delete block.config;
  }
  if (block.type.includes(".") && !TYPE_MAPPING[originalType]) {
    console.warn(`\u26A0\uFE0F  Tipo com ponto n\xE3o mapeado: ${originalType} (mantido como ${block.type})`);
  }
  return block;
}
function migrateStepFile(filePath) {
  const raw = import_fs.default.readFileSync(filePath, "utf-8");
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error(`\u274C JSON inv\xE1lido em ${filePath}:`, e);
    return;
  }
  if (!Array.isArray(data.blocks)) {
    console.warn(`\u26A0\uFE0F  Sem blocks em ${filePath}`);
    return;
  }
  let changed = false;
  if (data.templateVersion !== "3.2") {
    data.templateVersion = "3.2";
    changed = true;
  }
  data.blocks = data.blocks.map((b) => {
    const before = JSON.stringify(b);
    const migrated = migrateBlock({ ...b });
    if (JSON.stringify(migrated) !== before) changed = true;
    return migrated;
  });
  if (changed) {
    import_fs.default.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`\u2705 Migrado: ${import_path.default.basename(filePath)}`);
  } else {
    console.log(`\u2194\uFE0F  Sem mudan\xE7as: ${import_path.default.basename(filePath)}`);
  }
}
function migrateMaster(filePath) {
  if (!import_fs.default.existsSync(filePath)) return;
  const raw = import_fs.default.readFileSync(filePath, "utf-8");
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error("\u274C master.v3.json inv\xE1lido", e);
    return;
  }
  let changed = false;
  if (data.templateVersion !== "3.2") {
    data.templateVersion = "3.2";
    changed = true;
  }
  if (typeof data.description === "string" && !data.description.includes("v3.2")) {
    data.description = "Master JSON V3.2 com 21 steps em formato blocks[] normalizado";
    changed = true;
  }
  if (changed) {
    import_fs.default.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log("\u2705 Migrado: master.v3.json");
  } else {
    console.log("\u2194\uFE0F  Sem mudan\xE7as: master.v3.json");
  }
}
function run() {
  if (!import_fs.default.existsSync(stepsDir)) {
    console.error("\u274C Diret\xF3rio de steps n\xE3o encontrado:", stepsDir);
    process.exit(1);
  }
  const files = import_fs.default.readdirSync(stepsDir).filter((f) => f.endsWith(".json"));
  console.log(`\u{1F6E0}\uFE0F  Iniciando migra\xE7\xE3o de ${files.length} steps...`);
  files.forEach((f) => migrateStepFile(import_path.default.join(stepsDir, f)));
  migrateMaster(masterFile);
  console.log("\u{1F3C1} Migra\xE7\xE3o conclu\xEDda.");
}
run();
