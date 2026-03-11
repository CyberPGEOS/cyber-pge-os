/*
-------------------------------------------------------------------------
PROJETO: PROJECT GENESIS ENGINE (PGE)
MÓDULO: E:\Projetos\pge\src\modules\knowledge\actions.ts
OBJETIVO: Server Actions para recuperação de dados da tabela pge_knowledge.
GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
-------------------------------------------------------------------------
*/

'use server'

/**
 * Ajuste técnico PGT-01: Inclusão da extensão .js exigida pelo compilador
 * em modo NodeNext para garantir a resolução do módulo compilado.
 */
import { supabase } from '../../core/supabase.js'

/**
 * Função: getProjectsDNA
 * Descrição: Recupera todos os registros da tabela pge_knowledge ordenados por data.
 */
export async function getProjectsDNA() {
  try {
    const { data, error } = await supabase
      .from('pge_knowledge')
      .select('*')
      .order('absorbed_at', { ascending: false })

    if (error) {
      return { data: null, error: error.message }
    }
    
    return { data, error: null }
  } catch (error: any) {
    console.error('[ERRO DASHBOARD FETCH]:', error.message)
    return { data: null, error: error.message }
  }
}