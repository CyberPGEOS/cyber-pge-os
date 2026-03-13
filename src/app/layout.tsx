/*
-------------------------------------------------------------------------
PROJETO: PROJECT GENESIS ENGINE (PGE)
MÓDULO: P400 - UI CORE
ARQUIVO: E:\Projetos\pge\src\app\layout.tsx
OBJETIVO: Root Layout com injeção global de Tailwind (Casco Estrutural).
GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
DESCRIÇÃO: Versão Fundida. Garante o vínculo do motor CSS ao navegador.
-------------------------------------------------------------------------
*/

import type { Metadata } from "next";
import React from 'react';
import "./globals.css"; // INJEÇÃO CRÍTICA: Ativa o motor Tailwind no Client-side.

export const metadata: Metadata = {
  title: "PGE GENESIS OS | ConnectionCyber",
  description: "Engine de Governança e Inteligência Arquitetural",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-black text-white">
        {children}
      </body>
    </html>
  );
}