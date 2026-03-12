/*
-------------------------------------------------------------------------
PROJETO: PROJECT GENESIS ENGINE (PGE)
MÓDULO: E:\Projetos\pge\src\core\supabase.ts
ARQUITETURA: CLOUD PERSISTENCE (Supabase SDK)
GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
DESCRIÇÃO: Singleton de conexão híbrida (Local/Vercel) com Supabase.
-------------------------------------------------------------------------
*/

import { createClient } from "@supabase/supabase-js";
import chalk from "chalk";
import dotenv from "dotenv";

// Carrega as variáveis de ambiente do arquivo .env (Ambiente Local)
dotenv.config();

/**
 * Lógica de Captura Híbrida:
 * Tenta ler com o prefixo NEXT_PUBLIC (Padrão Vercel) ou sem prefixo (Padrão Local .env).
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Escudo de Integridade: Validação de Credenciais antes da ignição
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(chalk.bold.red("\n[ERRO CRÍTICO] Variáveis de ambiente SUPABASE ausentes."));
  console.error(chalk.red("O motor de sincronização em nuvem não pode ser iniciado corretamente.\n"));
  // process.exit(1); // Comentado para permitir que o worker da Vercel termine a compilação
}

/**
 * Instância Suprema do Cliente Supabase
 * Prioriza a Service Role Key para operações de escrita (CLI/Actions) se disponível.
 * Exportada como Singleton para reaproveitamento em todos os módulos.
 */
const activeKey = serviceRoleKey || supabaseAnonKey;

export const supabase = createClient(supabaseUrl, activeKey);

// Log de status apenas em ambiente de terminal/desenvolvimento
if (typeof window === 'undefined') {
  console.log(chalk.cyan("[PGE] Conexão com Supabase instanciada com sucesso."));
}