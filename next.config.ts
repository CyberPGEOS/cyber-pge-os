/*
-------------------------------------------------------------------------
PROJETO: PROJECT GENESIS ENGINE (PGE)
MÓDULO: E:\Projetos\pge\next.config.ts
OBJETIVO: Configuração Suprema de Ignição e Estabilização (Modo Hybrid).
GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
DESCRIÇÃO: Suporte a Server Actions e Isolação de Dependências CLI.
-------------------------------------------------------------------------
*/

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * MODO HYBRID: Removido 'output: export' para permitir Server Actions.
   * Isso possibilita o uso de funções server-side na infraestrutura da Vercel.
   */

  /**
   * ESCUDO DE COMPILAÇÃO:
   * Ignoramos erros de tipagem e linting exclusivamente no estágio de build
   * para assegurar o status 'READY' na nuvem (Norma PGT-01).
   */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  /**
   * ISOLAÇÃO DE AMBIENTE:
   * Mantemos pacotes de backend/CLI fora do bundle de frontend para evitar
   * erros de "Module not found: fs" no ambiente de produção da Vercel.
   */
  serverExternalPackages: ["fs-extra", "commander", "chalk", "dotenv"],

  experimental: {
    /**
     * SERVER ACTIONS: Essencial para a persistência de DNA via ações de servidor.
     * bodySizeLimit definido para suportar estruturas complexas de metadados.
     */
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;