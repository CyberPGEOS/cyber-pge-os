/*
-------------------------------------------------------------------------
PROJETO: PROJECT GENESIS ENGINE (PGE)
MÓDULO: E:\Projetos\PGE\src\core\supabase.ts
ARQUITETURA: CLOUD PERSISTENCE (Supabase SDK)
GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
DESCRIÇÃO: Singleton de conexão com o banco de dados Supabase.
-------------------------------------------------------------------------
*/

import { createClient } from "@supabase/supabase-js";
import chalk from "chalk";
import dotenv from "dotenv";

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Escudo de Integridade: Validação de Credenciais antes da ignição
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(chalk.bold.red("\n[ERRO CRÍTICO] Variáveis de ambiente SUPABASE ausentes no arquivo .env."));
  console.error(chalk.red("O motor de sincronização em nuvem não pode ser iniciado.\n"));
  process.exit(1);
}

/**
 * Instância Suprema do Cliente Supabase
 * Exportada como Singleton para reaproveitamento em todos os módulos.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log(chalk.cyan("[PGE] Conexão com Supabase instanciada com sucesso."));