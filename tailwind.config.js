/*
-------------------------------------------------------------------------
PROJETO: PROJECT GENESIS ENGINE (PGE)
MÓDULO: P400 - UI CONFIG (ENGINE)
ARQUIVO: E:\Projetos\pge\tailwind.config.js
OBJETIVO: Mapeamento de diretórios para compilação de classes CSS.
GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
DESCRIÇÃO: Versão Fundida. Resolve a falha de renderização (Scan total).
-------------------------------------------------------------------------
*/

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // INJEÇÃO CRÍTICA: Garante varredura total na src
  ],
  theme: {
    extend: {
      colors: {
        // Vincula as cores do Tailwind às variáveis do globals.css
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
}