/*
-------------------------------------------------------------------------
PROJETO: PROJECT GENESIS ENGINE (PGE)
COMPONENTE: E:\Projetos\pge\src\components\Dashboard.tsx
VISUAL: Tailwind CSS + Lucide React (Modo Cinema / Dark Mode)
GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
-------------------------------------------------------------------------
*/

import React from 'react'
import { ShieldCheck, Activity, FolderGit2, Database } from 'lucide-react'
// Importação validada no Tópico A (necessário incluir .js para conformidade)
import { getProjectsDNA } from '../modules/knowledge/actions.js'

export default async function Dashboard() {
  const { data: projects, error } = await getProjectsDNA()

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans selection:bg-green-500/30">
      {/* Header de Governança */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 border-b border-zinc-800 pb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tighter flex items-center gap-2">
            <ShieldCheck className="text-green-500" size={28} /> PGE GENESIS OS
          </h1>
          <p className="text-zinc-500 text-sm">Hold ConnectionCyber Assessoria e Treinamento</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-800">
            <span className="block text-[10px] text-zinc-500 uppercase tracking-widest">Status Engine</span>
            <span className="text-green-400 font-mono text-xs flex items-center gap-2">
              <Activity size={12} className="animate-pulse" /> CORE_ONLINE
            </span>
          </div>
        </div>
      </header>

      {/* Grid de Monitoramento de DNA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project: any) => (
          <div key={project.id} className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-xl hover:border-green-500/40 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-green-500/10 transition-colors" />
            
            <div className="flex justify-between items-start mb-6">
              <div className="p-2 bg-zinc-800 rounded-lg group-hover:bg-green-500/20 group-hover:text-green-400 transition-colors">
                <FolderGit2 size={20} />
              </div>
              <span className="text-[10px] font-mono text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded">
                {project.absorbed_at ? new Date(project.absorbed_at).toLocaleDateString('pt-BR') : 'SINCRONIZANDO...'}
              </span>
            </div>
            
            <div className="space-y-1 mb-6">
              <h3 className="font-bold text-sm tracking-tight text-zinc-200">
                {project.project_path?.split('\\').pop() || 'DNA_UNKNOWN'}
              </h3>
              <p className="text-[10px] text-zinc-500 font-mono truncate" title={project.project_hash}>
                HASH: {project.project_hash}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800/50">
              <div className="space-y-1">
                <span className="block text-[9px] text-zinc-500 uppercase tracking-tighter">Documentos</span>
                <span className="text-sm font-bold text-zinc-300">{project.docs_count || 0}</span>
              </div>
              <div className="space-y-1">
                <span className="block text-[9px] text-zinc-500 uppercase tracking-tighter">Estruturas</span>
                <span className="text-sm font-bold text-zinc-300">{project.structures_count || 0}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Estado Vazio */}
        {(!projects || projects.length === 0) && !error && (
          <div className="col-span-full py-24 border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center">
            <Database className="text-zinc-700 mb-4" size={40} />
            <p className="text-zinc-500 text-sm">Aguardando absorção de novos projetos...</p>
            <code className="mt-2 text-[10px] text-zinc-600">pge absorb [caminho]</code>
          </div>
        )}

        {/* Alerta de Erro */}
        {error && (
          <div className="col-span-full p-4 bg-red-900/10 border border-red-900/50 text-red-400 rounded-lg text-xs font-mono">
            [FATAL_ERROR]: Falha na comunicação com a base de dados ConnectionCyber.
            <br />Detalhe: {error}
          </div>
        )}
      </div>
    </div>
  )
}