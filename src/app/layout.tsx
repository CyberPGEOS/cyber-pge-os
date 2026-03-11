/*
-------------------------------------------------------------------------
PROJETO: PROJECT GENESIS ENGINE (PGE)
MÓDULO: E:\Projetos\pge\src\app\layout.tsx
OBJETIVO: Casco estrutural da aplicação (HTML/Body).
GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
-------------------------------------------------------------------------
*/

import React from 'react'
import './globals.css'

export const metadata = {
  title: 'PGE GENESIS OS | ConnectionCyber',
  description: 'Orquestrador Corporativo de Inteligência de Projetos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-black text-white">
        {children}
      </body>
    </html>
  )
}