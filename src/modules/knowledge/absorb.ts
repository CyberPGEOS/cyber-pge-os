/*
-------------------------------------------------------------------------
PROJETO: PROJECT GENESIS ENGINE (PGE)
MÓDULO: E:\Projetos\PGE\src\modules\knowledge\absorb.ts
ARQUITETURA: CORE ENGINE + CLOUD SYNC
GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
DESCRIÇÃO: Motor de varredura tipado com sincronização automática Supabase.
-------------------------------------------------------------------------
*/

import fs from "fs-extra";
import path from "path";
import crypto from "crypto";
import chalk from "chalk";
import { supabase } from "../../core/supabase.js"; // Injeção do Cliente Cloud
import { ProjectSummary, KnowledgePatterns } from "../../types/index.js";

const KNOWLEDGE_DIR = path.join(process.cwd(), "pge", "knowledge");
const PATTERNS_FILE = path.join(KNOWLEDGE_DIR, "patterns.json");
const PROJECTS_FILE = path.join(KNOWLEDGE_DIR, "projects.json");

/* ============================================================
   LISTA DE EXCLUSÃO — Filtro Corporativo Unificado
   ============================================================ */
const EXCLUDE_DIRS = [
  "node_modules", "dist", "build", ".next", ".cache", "out", "tmp", 
  "vendor", "site-packages", "__pycache__", ".venv", ".env", "logs", 
  "coverage", "snapshot", ".git"
];

const EXCLUDE_EXTENSIONS = [".log", ".map", ".d.ts", ".bin"];

/* ============================================================
   GARANTE QUE A BASE DE CONHECIMENTO EXISTE
   ============================================================ */
function ensureKnowledge() {
  if (!fs.existsSync(KNOWLEDGE_DIR)) fs.mkdirSync(KNOWLEDGE_DIR, { recursive: true });
  if (!fs.existsSync(PATTERNS_FILE)) fs.writeJsonSync(PATTERNS_FILE, { docs: [], structures: [] });
  if (!fs.existsSync(PROJECTS_FILE)) fs.writeJsonSync(PROJECTS_FILE, []);
}

/* ============================================================
   FUNÇÕES AUXILIARES
   ============================================================ */
function isExcluded(fullPath: string): boolean {
  const normalized = fullPath.replace(/\\/g, "/").toLowerCase();
  
  if (normalized.includes("snapshot")) return true;

  const isDirExcluded = EXCLUDE_DIRS.some(dir => normalized.includes(`/${dir.toLowerCase()}/`));
  const isExtExcluded = EXCLUDE_EXTENSIONS.some(ext => normalized.endsWith(ext));

  return isDirExcluded || isExtExcluded;
}

function computeHash(docs: string[], structures: string[]): string {
  const hash = crypto.createHash("sha256");
  hash.update(JSON.stringify([...docs].sort()));
  hash.update(JSON.stringify([...structures].sort()));
  return hash.digest("hex");
}

/**
 * Função Principal: absorbProject (Tipada + Cloud Sync)
 * Objetivo: Realiza a varredura atômica e registra o DNA no disco e na nuvem.
 */
export async function absorbProject(projectDir: string): Promise<ProjectSummary | null> {
  ensureKnowledge();

  if (!fs.existsSync(projectDir)) {
    console.error(chalk.red(`[ERRO] Caminho não localizado: ${projectDir}`));
    return null;
  }

  const docsFound: string[] = [];
  const structuresFound: string[] = [];

  /**
   * Rotina Walk: Varredura recursiva com mapeamento de estruturas e documentos.
   */
  function walk(current: string, relBase = "") {
    const entries = fs.readdirSync(current, { withFileTypes: true });

    for (const e of entries) {
      const rel = path.join(relBase, e.name);
      const full = path.join(current, e.name);

      if (isExcluded(full)) continue;

      if (e.isDirectory()) {
        // AJUSTE TÉCNICO: Se o diretório atual é um dos padrões, registra como estrutura
        if (["src", "apps", "packages", "components", "services", "modules", "core"].includes(e.name)) {
          structuresFound.push(rel);
        }
        walk(full, rel);
      } else {
        // Captura de Documentos e Código-Fonte para análise de IA
        if (e.name.endsWith(".md") || e.name.endsWith(".json") || e.name.endsWith(".ts")) {
            docsFound.push(rel);
        }
      }
    }
  }

  walk(projectDir);

  const projectHash = computeHash(docsFound, structuresFound);
  
  const summary: ProjectSummary = {
    path: projectDir,
    hash: projectHash,
    docsCount: docsFound.length,
    structuresCount: structuresFound.length,
    timestamp: new Date().toISOString(),
    docsFound,
    structuresFound
  };

  // 1. PERSISTÊNCIA LOCAL (JSON)
  const projects = await fs.readJson(PROJECTS_FILE);
  const alreadyExistsLocally = projects.some((p: ProjectSummary) => p.hash === projectHash);

  if (!alreadyExistsLocally) {
    projects.push(summary);
    const patterns: KnowledgePatterns = await fs.readJson(PATTERNS_FILE);
    patterns.docs = Array.from(new Set([...patterns.docs, ...docsFound]));
    patterns.structures = Array.from(new Set([...patterns.structures, ...structuresFound]));

    await fs.writeJson(PATTERNS_FILE, patterns, { spaces: 2 });
    await fs.writeJson(PROJECTS_FILE, projects, { spaces: 2 });
  }

  // 2. SINCRONIZAÇÃO CLOUD (Supabase)
  console.log(chalk.yellow(`\n[CLOUD] Sincronizando DNA do projeto no Supabase...`));
  
  const { error } = await supabase
    .from('pge_knowledge')
    .upsert({
      project_path: summary.path,
      project_hash: summary.hash,
      docs_count: summary.docsCount,        // Correção: usando camelCase da Interface
      structures_count: summary.structuresCount, // Correção: usando camelCase da Interface
      metadata: { docs: summary.docsFound, structures: summary.structuresFound }
    }, { onConflict: 'project_hash' });

  if (error) {
    console.error(chalk.red(`[ERRO CLOUD] Falha ao sincronizar: ${error.message}`));
  } else {
    console.log(chalk.green(`[OK] Sincronização concluída para o Hash: ${projectHash.substring(0, 8)}...`));
  }

  return summary;
}