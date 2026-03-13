/*
-------------------------------------------------------------------------
PROJETO: PROJECT GENESIS ENGINE (PGE)
MÓDULO: P400 - DASHBOARD UI
ARQUIVO: E:\Projetos\pge\src\components\Dashboard.tsx
OBJETIVO: Interface de monitoramento de DNA e Blocos Pedagógicos.
GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
DESCRIÇÃO: Versão Estabilizada. Restaura layout da Imagem 1 e corrige o contador.
-------------------------------------------------------------------------
*/

"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/core/supabase';
import { Database, FileText, Activity, Brain } from 'lucide-react';
import PGE_BaseCard from './PGE_BaseCard';

export default function Dashboard() {
  // Inicializamos com null para identificar o estado de carregamento
  const [stats, setStats] = useState({ dnaCount: 0, blocksCount: 0 });
  const [recentBlocks, setRecentBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Busca contagem de DNA
        const { count: dna } = await supabase.from('pge_knowledge').select('*', { count: 'exact', head: true });
        
        // 2. Busca dados e contagem de Blocos Pedagógicos (Sincronização Forçada)
        const { data: blocks, count: bCount, error: bError } = await supabase
          .from('pedagogical_blocks')
          .select('*', { count: 'exact' }) // Forçamos a contagem exata aqui
          .order('created_at', { ascending: false })
          .limit(5);

        if (bError) throw bError;

        // VALIDAÇÃO TÉCNICA: Se bCount for null mas blocks existir, usamos o length
        const realBlocksCount = bCount !== null ? bCount : (blocks ? blocks.length : 0);

        setStats({ 
          dnaCount: dna || 0, 
          blocksCount: realBlocksCount
        });
        setRecentBlocks(blocks || []);

      } catch (error) {
        console.error("Erro ao carregar dados do Dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      {/* Header Estático PGT-01 - Mantendo fidelidade à Imagem 1 */}
      <header className="mb-12 border-b border-zinc-800 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter text-zinc-100">PGE OS <span className="text-blue-500">v1.0</span></h1>
          <p className="text-zinc-500 uppercase text-xs tracking-[0.2em] mt-2 font-mono">Governança: PGT-01 / Conexão Cyber</p>
        </div>
        <div className="text-right">
          <p className="text-zinc-400 text-sm">Status: <span className="text-green-500 font-mono italic font-bold">ONLINE</span></p>
        </div>
      </header>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <PGE_BaseCard 
          title="DNA ESTRUTURAL" 
          value={stats.dnaCount} 
          label="Projetos Mapeados" 
          icon={<Database size={16}/>}
          variant="neutral"
        />

        <PGE_BaseCard 
          title="BLOCOS PEDAGÓGICOS" 
          value={stats.blocksCount} 
          label="Lições Extraídas" 
          icon={<Brain size={16}/>}
          variant="emerald"
        />

        <MetricCard 
          icon={<Activity size={20}/>} 
          title="INTEGRIDADE" 
          value="100%" 
          label="Norma Extremo Zero" 
          color="text-green-500"
        />
      </div>

      {/* Feed de Conhecimento Recente - Layout da Imagem 1 */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 shadow-2xl backdrop-blur-sm">
        <h2 className="flex items-center gap-2 text-xl font-bold mb-6 text-zinc-200 uppercase tracking-tight">
          <FileText size={20} className="text-blue-500" />
          Últimos Conhecimentos Absorvidos
        </h2>
        
        {loading ? (
          <p className="text-zinc-500 animate-pulse font-mono uppercase text-[10px] tracking-widest">Sincronizando com a nuvem...</p>
        ) : (
          <div className="space-y-4">
            {recentBlocks.map((block) => (
              <div key={block.id} className="border-l-2 border-zinc-700 hover:border-blue-500 transition-all pl-4 py-3 bg-zinc-900/30 rounded-r-lg group">
                <p className="text-sm font-bold text-zinc-100 uppercase tracking-tight group-hover:text-blue-400 transition-colors">{block.title}</p>
                <p className="text-xs text-zinc-500 mt-1 line-clamp-1 italic">{block.action_description || "Análise profunda concluída."}</p>
                <div className="mt-2 flex gap-4">
                  <span className="text-[10px] text-zinc-600 font-mono uppercase">ID: {block.id.substring(0,8)}</span>
                  <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400 font-bold uppercase tracking-tighter">DOMAIN: {block.domain}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ icon, title, value, label, color = "text-white" }: any) {
  return (
    <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl hover:border-zinc-700 transition-all group">
      <div className="flex items-center gap-3 mb-4 text-zinc-500 group-hover:text-zinc-300 transition-colors">
        {icon}
        <span className="text-[10px] font-bold tracking-widest uppercase">{title}</span>
      </div>
      <div className={`text-5xl font-bold tracking-tighter ${color} mb-1`}>
        {value}
      </div>
      <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{label}</div>
    </div>
  );
}