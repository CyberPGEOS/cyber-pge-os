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
 */
export interface ProjectDNA {
  root: string;
  timestamp: string;
  structure: any;
  files_count: number;
}

/**
 * Interface para a Metodologia de Ensino Pedagógica Personalizada.
 */
interface PedagogicalBlock {
  title: string;
  action_description: string;
  technical_instruction: string;
  technical_meaning: string;
  educational_justification: string;
  pedagogical_commentary: string;
  mini_challenge: string;
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
 * Auxiliar para extrair seções baseadas nos seus marcadores (Ex: #### Ação:)
 */
function extractSection(content: string, sectionName: string): string {
  const regex = new RegExp(`${sectionName}:?\\s*([\\s\\S]*?)(?=(####|###|##|#|📌|$))`, 'i');
  const match = content.match(regex);
  return match ? match[1].trim() : '';
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

/* ============================================================
   ROTINAS DE ABSORÇÃO (NOMEADAS)
   ============================================================ */

/**
 * EXPORTAÇÃO NOMEADA: deepAbsorb
 * Analisa o conteúdo interno de arquivos para extrair blocos pedagógicos.
 */
export async function deepAbsorb(filePath: string) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const fileName = path.basename(filePath);

    console.log(chalk.blue(`[P100] Analisando DNA Pedagógico: ${fileName}`));

    const block: Partial<PedagogicalBlock> = {
      title: fileName.replace('.md', '').replace('.txt', ''),
      action_description: extractSection(content, 'Ação'),
      technical_instruction: extractSection(content, 'Instrução Técnica'),
      technical_meaning: extractSection(content, 'Significado Técnico'),
      educational_justification: extractSection(content, 'Justificativa Educacional'),
      pedagogical_commentary: extractSection(content, 'Comentário Pedagógico'),
      mini_challenge: extractSection(content, 'Mini Desafio')
    };

    const { error } = await supabase
      .from('pedagogical_blocks')
      .upsert([{ 
        ...block,
        metadata: { source_path: filePath, absorbed_at: new Date().toISOString() }
      }], { onConflict: 'title' });

    if (error) throw error;

    console.log(chalk.green(`[SUCESSO] Bloco "${block.title}" integrado ao cérebro.`));
  } catch (err: any) {
    console.error(chalk.red(`[ERRO] Falha na absorção de ${filePath}: ${err.message}`));
  }
}

/**
 * EXPORTAÇÃO NOMEADA: absorbProject
 * Realiza a varredura atômica e registra o DNA no disco e na nuvem.
 */
export async function absorbProject(targetPath: string): Promise<ProjectDNA | null> {
  ensureKnowledge();

  try {
    if (!(await fs.pathExists(targetPath))) {
      console.log(chalk.red(`[P100][ERRO] Caminho não localizado: ${targetPath}`));
      return null;
    }

    console.log(chalk.cyan(`[P100] Lendo DNA LOCAL: ${targetPath}`));
    console.log(chalk.cyan(`[P100] Mapeando estrutura...`));
    const structure = await mapDirectory(targetPath);
    
    const fileMatches = JSON.stringify(structure).match(/"type":"file"/g);
    const files_count = fileMatches ? fileMatches.length : 0;
    const projectHash = computeHash(structure);

    const dna: ProjectDNA = {
      root: targetPath,
      timestamp: new Date().toISOString(),
      structure: structure,
      files_count: files_count
    };

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