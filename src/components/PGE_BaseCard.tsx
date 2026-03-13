/*
-------------------------------------------------------------------------
PROJETO: PROJECT GENESIS ENGINE (PGE)
MÓDULO: P400 - UI COMPONENTS
ARQUIVO: E:\Projetos\pge\src\components\PGE_BaseCard.tsx
OBJETIVO: Versão FINAL de Produção (Enterprise Emerald).
GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
DESCRIÇÃO: Versão Fundida. Estabilização visual sem blocos de diagnóstico.
-------------------------------------------------------------------------
*/

import React from 'react';

interface BaseCardProps {
  title: string;
  value?: string | number;
  label?: string;
  icon?: React.ReactNode;
  variant?: 'neutral' | 'emerald' | 'amber' | 'red';
  children?: React.ReactNode;
  className?: string;
}

export default function PGE_BaseCard({ 
  title, 
  value, 
  label, 
  icon, 
  variant = 'neutral', 
  children,
  className = "" 
}: BaseCardProps) {
  
  // Mapeamento de variantes Tailwind Estabilizadas
  const variants = {
    neutral: "border-zinc-800 shadow-[0_0_15px_rgba(39,39,42,0.2)] hover:border-zinc-700",
    emerald: "border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)] hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]",
    amber: "border-amber-900/50 shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:border-amber-500",
    red: "border-red-900/50 shadow-[0_0_20px_rgba(239,68,68,0.15)] hover:border-red-500"
  };

  const textColors = {
    neutral: "text-zinc-100",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    red: "text-red-400"
  };

  return (
    <div className={`
        relative overflow-hidden
        bg-zinc-900/40 backdrop-blur-md 
        border rounded-2xl p-6 
        transition-all duration-500 group
        ${variants[variant]}
        ${className}
      `}>
      {/* Glossy Reflection Effect (Enterprise Emerald) */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all" />

      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg bg-zinc-950/50 border border-zinc-800 ${textColors[variant]}`}>
          {icon}
        </div>
        <span className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase italic">
          {title}
        </span>
      </div>

      {value !== undefined && (
        <div className={`text-6xl font-black tracking-tighter mb-2 ${textColors[variant]}`}>
          {value}
        </div>
      )}

      {label && (
        <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">
          {label}
        </div>
      )}

      {children && (
        <div className="mt-4 text-zinc-400 text-xs leading-relaxed border-t border-zinc-800/50 pt-4">
          {children}
        </div>
      )}
    </div>
  );
}