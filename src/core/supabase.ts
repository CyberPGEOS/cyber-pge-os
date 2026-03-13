/*
-------------------------------------------------------------------------
PROJETO: PROJECT GENESIS ENGINE (PGE)
MÓDULO: P100 - CORE INFRA
ARQUIVO: E:\Projetos\pge\src\core\supabase.ts
OBJETIVO: Instanciar o cliente Supabase com suporte Híbrido.
GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
DESCRIÇÃO: Versão compatível com Server-side (CLI) e Client-side (Web).
-------------------------------------------------------------------------
*/

import { createClient } from '@supabase/supabase-js';

/**
 * Lógica de Captura Híbrida:
 * No Next.js, variáveis para o browser devem ter NEXT_PUBLIC_.
 * No CLI (Node), usamos process.env puro.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  // Log apenas no servidor para não poluir o console do browser sem necessidade
  if (typeof window === 'undefined') {
    console.error("[PGE][ERRO] Variáveis do Supabase não encontradas.");
  }
}

// Exportação do cliente instanciado
export const supabase = createClient(supabaseUrl, supabaseAnonKey);