/*
-------------------------------------------------------------------------
PROJETO: PROJECT GENESIS ENGINE (PGE)
MÓDULO: E:\Projetos\PGE\src\modules\knowledge\blueprint-evolve.ts
ARQUITETURA: CORE ENGINE (TypeScript / Node.js)
GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
DESCRIÇÃO: Motor de evolução de Blueprints e consolidação de padrões.
-------------------------------------------------------------------------
*/

import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

const KNOWLEDGE_DIR = path.join(process.cwd(), "pge", "knowledge");
const PATTERNS_FILE = path.join(KNOWLEDGE_DIR, "patterns.json");
const BLUEPRINT_FILE = path.join(KNOWLEDGE_DIR, "blueprints", "evolved.md");

/**
 * Função Principal: evolveBlueprint
 * Objetivo: Transforma dados brutos de padrões em documentação estratégica.
 */
export async function evolveBlueprint() {
  if (!fs.existsSync(PATTERNS_FILE)) {
    console.error(chalk.red("\n[ERRO] patterns.json não encontrado. Execute 'pge absorb' primeiro."));
    return;
  }

  // Lógica de leitura assíncrona robusta (fs-extra)
  const patterns = await fs.readJson(PATTERNS_FILE);

  let content = `# 🧬 BLUEPRINT EVOLUÍDO — GESTÃO CORPORATIVA\n`;
  content += `> Este arquivo foi gerado automaticamente pelo PGE Knowledge Engine.\n`;
  content += `> Atualizado em: ${new Date().toLocaleString('pt-BR')}\n\n`;

  content += `## 📚 Documentação Técnica Consolidada (Documentos detectados)\n`;
  if (patterns.docs && patterns.docs.length > 0) {
    patterns.docs.forEach((doc: string) => {
      content += `- ${doc}\n`;
    });
  } else {
    content += `*Nenhum documento detectado.*\n`;
  }

  content += `\n## 🏗️ Estruturas de Arquitetura Identificadas\n`;
  if (patterns.structures && patterns.structures.length > 0) {
    patterns.structures.forEach((struct: string) => {
      content += `- ${struct}\n`;
    });
  } else {
    content += `*Nenhuma estrutura detectada.*\n`;
  }

  content += `\n---\n*Gerado automaticamente pelo motor PGE - Norma PGT-01*`;

  // Garante a existência do diretório antes da escrita (Injeção de Segurança)
  await fs.ensureDir(path.dirname(BLUEPRINT_FILE));
  await fs.writeFile(BLUEPRINT_FILE, content, "utf-8");

  console.log(chalk.green(`[OK] Blueprint evoluído gerado/atualizado em: ${BLUEPRINT_FILE}`));
}