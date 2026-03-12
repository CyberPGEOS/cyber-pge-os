/*
-------------------------------------------------------------------------
PROJETO: PROJECT GENESIS ENGINE (PGE)
MÓDULO: P200 - CLOUD PERSISTENCE
ARQUIVO: E:\Projetos\pge\src\modules\knowledge\actions.ts
OBJETIVO: Server Actions para persistência e recuperação de DNA.
GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
-------------------------------------------------------------------------
*/

'use server'; // DIRETIVA OBRIGATÓRIA PARA VERCEL / NEXT.JS 15

import { supabase } from '../../core/supabase';
import { revalidatePath } from 'next/cache';

/**
 * Interface de Resposta Unificada
 * Garante que o Arquiteto tenha previsibilidade sobre o retorno das ações.
 */
export interface ActionResponse {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Ação: getProjectsDNA
 * Objetivo: Recupera todos os projetos absorvidos do Supabase.
 * Compatibilidade: Next.js 15 Server-side / Node.js Runtime.
 */
export async function getProjectsDNA(): Promise<ActionResponse> {
  try {
    const { data, error } = await supabase
      .from('pge_knowledge')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }
    
    return {
      success: true,
      data: data
    };

  } catch (error: any) {
    console.error(`[PGE][ACTION_ERROR][FETCH]: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Ação: deleteProjectDNA
 * Objetivo: Remove um registro de DNA do banco e limpa o cache da página.
 */
export async function deleteProjectDNA(id: string): Promise<ActionResponse> {
  try {
    const { error } = await supabase
      .from('pge_knowledge')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Força a Vercel a limpar o cache e atualizar a lista visual instantaneamente
    revalidatePath('/');
    
    return { success: true };

  } catch (error: any) {
    console.error(`[PGE][ACTION_ERROR][DELETE]: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}