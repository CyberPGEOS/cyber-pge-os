/*
-------------------------------------------------------------------------
PROJETO: PROJECT GENESIS ENGINE (PGE)
MÓDULO: E:\Projetos\pge\src\app\page.tsx
OBJETIVO: Ponto de entrada da interface Web (Dashboard).
GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
-------------------------------------------------------------------------
*/

import React from 'react'
import Dashboard from '../components/Dashboard'

/**
 * Página Principal: Renderiza o Dashboard de monitoramento de DNA.
 * Sendo uma Server Component por padrão, ela garante a segurança 
 * na execução das Server Actions.
 */
export default function Page() {
  return (
    <main>
      <Dashboard />
    </main>
  )
}