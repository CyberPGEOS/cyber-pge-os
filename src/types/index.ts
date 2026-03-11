/*
-------------------------------------------------------------------------
PROJETO: PROJECT GENESIS ENGINE (PGE)
MÓDULO: E:\Projetos\PGE\src\types\index.ts
ARQUITETURA: DATA MODELING (TypeScript Interfaces)
GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
DESCRIÇÃO: Definições de tipos globais para o ecossistema PGE.
-------------------------------------------------------------------------
*/

/**
 * Interface: ProjectSummary
 * Resultado da absorção atômica de um diretório.
 */
export interface ProjectSummary {
  path: string;
  hash: string;
  docsCount: number;
  structuresCount: number;
  timestamp: string;
  skipped?: boolean;
  reason?: string;
  docsFound?: string[];
  structuresFound?: string[];
}

/**
 * Interface: KnowledgePatterns
 * Estrutura do arquivo patterns.json (Cérebro do PGE).
 */
export interface KnowledgePatterns {
  docs: string[];
  structures: string[];
}

/**
 * Interface: AuditResult
 * Resultado do comando 'pge doctor'.
 */
export interface AuditResult {
  tool: string;
  status: 'OK' | 'FALHA' | 'AVISO';
  version?: string;
  message?: string;
}

/**
 * Interface: PGEConfig
 * Configurações globais do orquestrador.
 */
export interface PGEConfig {
  rootVolume: string;
  excludeList: string[];
  supabaseUrl: string;
  version: string;
}