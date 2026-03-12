/*
-------------------------------------------------------------------------
PROJETO: PROJECT GENESIS ENGINE (PGE)
MÓDULO: P100 - CLI-CORE
ARQUIVO: E:\Projetos\pge\src\modules\knowledge\absorb.ts
OBJETIVO: Varredura recursiva, extração de DNA e sincronização híbrida.
GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
DESCRIÇÃO: Versão Estabilizada ESM com Persistência Cloud e Local.
-------------------------------------------------------------------------
*/

import fs from 'fs-extra';
import path from 'path';
import crypto from 'crypto';
import chalk from 'chalk';
import { supabase } from "../../core/supabase.js";
import { ProjectSummary, KnowledgePatterns } from "../../types/index.js";

/**
 * Interface que define a estrutura do DNA extraído.
 * Exportação Nomeada para tipagem rigorosa no CLI.
 */
export interface ProjectDNA {
  root: string;
  timestamp: string;
  structure: any;
  files_count: number;
}

const KNOWLEDGE_DIR = path.join(process.cwd(), "pge", "knowledge");
const PATTERNS_FILE = path.join(KNOWLEDGE_DIR, "patterns.json");
const PROJECTS_FILE = path.join(KNOWLEDGE_DIR, "projects.json");

/**
 * LISTA DE EXCLUSÃO — Filtro Corporativo Unificado
 */
const EXCLUDE_LIST = [
  'node_modules', '.next', '.git', 'dist', '.vercel', 'build',
  'package-lock.json', '.DS_Store', 'pge/knowledge', 'snapshot',
  '.cache', 'out', 'tmp', 'vendor', 'logs', 'coverage'
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
   FUNÇÕES AUXILIARES DE AUDITORIA
   ============================================================ */
function isExcluded(fullPath: string): boolean {
  const normalized = fullPath.replace(/\\/g, "/").toLowerCase();
  const isDirExcluded = EXCLUDE_LIST.some(dir => normalized.includes(`/${dir.toLowerCase()}/`));
  const isExtExcluded = EXCLUDE_EXTENSIONS.some(ext => normalized.endsWith(ext));
  return isDirExcluded || isExtExcluded;
}

function computeHash(structure: any): string {
  const hash = crypto.createHash("sha256");
  hash.update(JSON.stringify(structure));
  return hash.digest("hex");
}

/**
 * Função Privada de Mapeamento: Constrói a árvore de diretórios recursivamente.
 */
async function mapDirectory(currentPath: string, relBase = ""): Promise<any> {
  const stats = await fs.stat(currentPath);
  const info: any = {
    name: path.basename(currentPath),
    type: stats.isDirectory() ? 'directory' : 'file',
    path: relBase
  };

  if (stats.isDirectory()) {
    const items = await fs.readdir(currentPath);
    const filteredItems = items.filter(item => !EXCLUDE_LIST.includes(item));
    
    info.children = await Promise.all(
      filteredItems.map(child => 
        mapDirectory(path.join(currentPath, child), path.join(relBase, child))
      )
    );
  }

  return info;
}

/**
 * EXPORTAÇÃO NOMEADA: absorbProject
 * Realiza a varredura atômica e registra o DNA no disco e na nuvem.
 */
export async function absorbProject(targetPath: string): Promise<ProjectDNA | null> {
  ensureKnowledge();

  try {
    // Validação de Existência (Zero Alucinação de Caminho)
    if (!(await fs.pathExists(targetPath))) {
      console.log(chalk.red(`[P100][ERRO] Caminho não localizado: ${targetPath}`));
      return null;
    }

    console.log(chalk.cyan(`[P100] Mapeando estrutura...`));
    const structure = await mapDirectory(targetPath);
    
    // Extração de métricas de densidade
    const fileMatches = JSON.stringify(structure).match(/"type":"file"/g);
    const files_count = fileMatches ? fileMatches.length : 0;
    const projectHash = computeHash(structure);

    const dna: ProjectDNA = {
      root: targetPath,
      timestamp: new Date().toISOString(),
      structure: structure,
      files_count: files_count
    };

    // 1. PERSISTÊNCIA LOCAL (Audit Log)
    const projects = await fs.readJson(PROJECTS_FILE);
    const alreadyExistsLocally = projects.some((p: any) => p.hash === projectHash);

    if (!alreadyExistsLocally) {
      projects.push({
        path: targetPath,
        hash: projectHash,
        files_count,
        timestamp: dna.timestamp
      });
      await fs.writeJson(PROJECTS_FILE, projects, { spaces: 2 });
    }

    // 2. SINCRONIZAÇÃO CLOUD (Supabase)
    console.log(chalk.yellow(`[P200][CLOUD] Sincronizando DNA no Supabase...`));
    
    const { error } = await supabase
      .from('pge_knowledge')
      .upsert({
        project_path: targetPath,
        project_hash: projectHash,
        docs_count: files_count, 
        structures_count: (JSON.stringify(structure).match(/"type":"directory"/g) || []).length,
        metadata: dna.structure
      }, { onConflict: 'project_hash' });

    if (error) {
      console.error(chalk.red(`[ERRO CLOUD] Falha ao sincronizar: ${error.message}`));
    } else {
      console.log(chalk.green(`[OK] DNA Sincronizado: ${projectHash.substring(0, 8)}...`));
    }

    return dna;

  } catch (error) {
    console.log(chalk.red(`[P100][FATAL] Falha na rotina de absorção: ${error}`));
    return null;
  }
}