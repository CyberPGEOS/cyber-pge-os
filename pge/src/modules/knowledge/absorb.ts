/*
-------------------------------------------------------------------------
PROJETO: PROJECT GENESIS ENGINE (PGE)
MÓDULO: P100 - CLI-CORE
ARQUIVO: E:\Projetos\pge\src\modules\knowledge\absorb.ts
OBJETIVO: Varredura recursiva e extração de DNA de diretórios.
GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO / MASTER_SPEC_DETAILED)
-------------------------------------------------------------------------
*/

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

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
 * Filtros de Higiene: Pastas e arquivos que devem ser ignorados 
 * para manter o DNA limpo (conforme Seção 3.1.1 do EGT-01).
 */
const EXCLUDE_LIST = [
  'node_modules',
  '.next',
  '.git',
  'dist',
  '.vercel',
  'package-lock.json',
  '.DS_Store'
];

/**
 * Função Core: Mapeia recursivamente a árvore de diretórios.
 */
async function mapDirectory(currentPath: string): Promise<any> {
  const stats = await fs.stat(currentPath);
  const info: any = {
    name: path.basename(currentPath),
    type: stats.isDirectory() ? 'directory' : 'file'
  };

  if (stats.isDirectory()) {
    const items = await fs.readdir(currentPath);
    // Aplica o rigor do filtro de higiene
    const filteredItems = items.filter(item => !EXCLUDE_LIST.includes(item));
    
    info.children = await Promise.all(
      filteredItems.map(child => mapDirectory(path.join(currentPath, child)))
    );
  }

  return info;
}

/**
 * Executa a absorção completa de um projeto alvo.
 * @param targetPath Caminho absoluto do projeto a ser absorvido.
 */
export async function absorbProject(targetPath: string): Promise<ProjectDNA | null> {
  try {
    console.log(chalk.cyan(`\n[P100] Iniciando absorção em: ${targetPath}`));

    if (!(await fs.pathExists(targetPath))) {
      console.log(chalk.red(`[ERRO] Caminho não localizado: ${targetPath}`));
      return null;
    }

    const structure = await mapDirectory(targetPath);
    
    // Contagem simplificada de arquivos para o log
    const dna: ProjectDNA = {
      root: targetPath,
      timestamp: new Date().toISOString(),
      structure: structure,
      files_count: JSON.stringify(structure).split('"type":"file"').length - 1
    };

    console.log(chalk.green(`[SUCESSO] Absorção concluída. ${dna.files_count} arquivos mapeados.`));
    return dna;

  } catch (error) {
    console.log(chalk.red(`[FATAL] Falha na rotina absorb: ${error}`));
    return null;
  }
}