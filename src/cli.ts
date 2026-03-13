#!/usr/bin/env node
/*
-------------------------------------------------------------------------
PROJETO: PROJECT GENESIS ENGINE (PGE)
ARQUIVO: E:\Projetos\pge\src\cli.ts
OBJETIVO: Orquestrador com Persistência Cloud (Módulo P200) e Ingestão P300.
GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
DESCRIÇÃO: Versão Estabilizada com Resolução de Módulos ESM e Persistência.
-------------------------------------------------------------------------
*/

import dotenv from 'dotenv';
import { Command } from "commander";
import chalk from "chalk";
import fs from "fs";
import path from "path";

// Carrega variáveis de ambiente (.env) antes de qualquer lógica operacional
dotenv.config();

// Importação de metadados seguindo Padrão NodeNext
import pkg from "../package.json" with { type: "json" };

/**
 * INJEÇÃO DE MÓDULOS OPERACIONAIS
 * Regra Rigorosa: Em ambientes ESM, utilizamos a extensão .js no caminho.
 */
import { absorbProject, deepAbsorb } from "./modules/knowledge/absorb.js";
import { evolveBlueprint } from "./modules/knowledge/blueprint-evolve.js";
import { auditArsenal } from "./modules/audit/arsenal.js";

// Injeção de Camada de Inteligência
import { PGE_PERSONA, ANALYSIS_BLUEPRINT } from "./modules/knowledge/prompts.js";
import { supabase } from "./core/supabase.js";
import { askPGE } from "./core/ai.js";

const program = new Command();

program
  .name("pge")
  .description(chalk.green("Project Genesis Engine - Orquestrador Corporativo ConnectionCyberOS"))
  .version(pkg.version);

/* ============================================================
   COMANDO: pge doctor
   DESCRIÇÃO: Executa auditoria completa do arsenal técnico.
   ============================================================ */
program
  .command("doctor")
  .description("Verifica a saúde do ambiente e ferramentas instaladas")
  .action(async () => {
    await auditArsenal();
  });

/* ============================================================
   COMANDO: pge absorb <dir> (VERSÃO EVOLUÍDA P200 + P300)
   DESCRIÇÃO: Absorve conhecimento local e persiste na Nuvem.
   ============================================================ */
program
  .command("absorb")
  .description("Absorve o DNA local, conteúdo pedagógico e persiste no Supabase")
  .argument("<dir>", "Diretório do projeto")
  .action(async (dir) => {
    const target = path.resolve(dir);
    console.log(chalk.bold.cyan(`\n[PGE] INICIANDO CICLO DE ABSORÇÃO EM: ${target}`));
    
    // 1. Absorção Local e Estrutural (Disco Rígido)
    const summary = await absorbProject(target);
    
    if (summary) {
      console.log(chalk.green("\n[PGE] Resumo da Extração de DNA:"));
      console.log(chalk.gray(JSON.stringify(summary, null, 2)));

      // Injeção de Contexto de Governança
      const govDir = path.join(process.cwd(), "GOVERNANCE");
      let govContext = "Nenhuma norma específica encontrada.";

      if (fs.existsSync(govDir)) {
          const devPath = path.join(govDir, "DEV_STANDARDS.md");
          const uiPath = path.join(govDir, "UI_UX_STANDARDS.json");
          
          const devStandards = fs.existsSync(devPath) ? fs.readFileSync(devPath, "utf-8") : "N/A";
          const uiStandards = fs.existsSync(uiPath) ? fs.readFileSync(uiPath, "utf-8") : "N/A";
          
          govContext = `[REGRAS DEV]:\n${devStandards}\n\n[REGRAS UI/UX]:\n${uiStandards}`;
      }

      // 2. Persistência Cloud (Módulo P200)
      console.log(chalk.yellow("\n[P200] PERSISTINDO DNA ESTRUTURAL NA NUVEM..."));
      const { error: dbError } = await supabase
        .from('pge_knowledge')
        .insert([{
          project_path: summary.root || target,
          project_hash: `hash_${Date.now()}`,
          metadata: {
            structure: summary.structure,
            files_count: summary.files_count,
            timestamp: summary.timestamp,
            gov_context: govContext
          }
        }]);

      if (dbError) {
        console.log(chalk.red(`[ERRO CLOUD] Falha ao sincronizar DNA: ${dbError.message}`));
      } else {
        console.log(chalk.green.bold("\n[SUCESSO] DNA Sincronizado com o Ecossistema ConnectionCyberOS!"));
      }

      // 3. Absorção Profunda de Conteúdo (Módulo P300)
      console.log(chalk.yellow(`\n[P300] INICIANDO ANÁLISE DE CONTEÚDO PEDAGÓGICO...`));
      await processContent(summary.structure, target);
      console.log(chalk.bold.green(`\n[SUCESSO] Ciclo de vida completo para o DNA: ${target}`));

      // 4. Consulta de Inteligência
      console.log(chalk.cyan("\n[PGE] Consultando Inteligência Arquitetural..."));
      const promptContext = `${PGE_PERSONA}\n\n${ANALYSIS_BLUEPRINT(summary, govContext)}`;
      
      const promptPath = path.join(process.cwd(), "pge", "knowledge", "last_prompt.txt");
      fs.mkdirSync(path.dirname(promptPath), { recursive: true });
      fs.writeFileSync(promptPath, promptContext);
      
      const aiResponse = await askPGE(promptContext);
      
      console.log(chalk.bold.green("\n==============================================="));
      console.log(chalk.bold.green("   ANÁLISE DE BLUEPRINT - PGE-ANALYST"));
      console.log(chalk.bold.green("==============================================="));
      console.log(chalk.white(aiResponse));
      console.log(chalk.bold.green("===============================================\n"));
      
      console.log(chalk.green(`[OK] DNA persistido para análise em: ${promptPath}`));
    }
  });

/* ============================================================
   COMANDO: pge think
   DESCRIÇÃO: Registra regras, ideias e seções para futura aplicação.
   ============================================================ */
program
  .command("think")
  .description("Registra um ideário ou regra de negócio no conhecimento")
  .argument("<titulo>", "Título da ideia ou regra")
  .argument("<descricao>", "Descrição detalhada")
  .action(async (titulo, descricao) => {
    console.log(chalk.cyan(`\n[PGE] Processando Ideário: ${titulo}`));
    
    const summary = {
      path: "INTENT_DATA",
      hash: `intent_${Date.now()}`,
      docsCount: 1,
      structuresCount: 0,
      timestamp: new Date().toISOString(),
      metadata: { titulo, descricao, type: "INTENT" }
    };

    const { error } = await supabase.from('pge_knowledge').insert([{
      project_path: summary.path,
      project_hash: summary.hash,
      metadata: summary.metadata
    }]);

    if (error) {
      console.error(chalk.red(`[ERRO CLOUD] Falha ao selar ideia: ${error.message}`));
    } else {
      console.log(chalk.green("[OK] Ideia selada na Memória Cloud."));
    }
  });

/* ============================================================
   COMANDO: pge absorb-all
   ============================================================ */
program
  .command("absorb-all")
  .description("Absorve TODOS os projetos dentro de E:\\Projetos")
  .action(async () => {
    const root = "E:\\Projetos";
    console.log(chalk.bold.green("\n==============================================="));
    console.log(chalk.bold.green("   PGE - Varredura Completa de Projetos"));
    console.log(chalk.white("   Volume: ") + chalk.cyan(root));
    console.log(chalk.bold.green("==============================================="));
    
    if (!fs.existsSync(root)) {
        console.error(chalk.red("\n[PGE] ERRO: O diretório não existe:"), root);
        return;
    }

    const dirs = fs
        .readdirSync(root, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => path.join(root, d.name));

    for (const dir of dirs) {
        console.log(chalk.gray("\n-----------------------------------------------"));
        console.log(chalk.cyan("[PGE] Absorvendo projeto:"), chalk.white(dir));
        await absorbProject(dir);
    }

    console.log(chalk.yellow("\n[PGE] Atualizando Blueprint Evoluído..."));
    await evolveBlueprint();
    console.log(chalk.bold.green("\n==============================================="));
    console.log(chalk.bold.green("   Varredura concluída com sucesso!"));
    console.log(chalk.bold.green("==============================================="));
});

/**
 * Função Auxiliar para Processamento de Conteúdo (Módulo P300)
 * Varre a estrutura gerada pelo absorbProject e chama o deepAbsorb para arquivos MD/TXT.
 */
async function processContent(node: any, basePath: string) {
  const currentFullPath = path.join(basePath, node.path || "");

  if (node.type === 'file') {
    const ext = path.extname(node.name).toLowerCase();
    if (ext === '.md' || ext === '.txt') {
      await deepAbsorb(currentFullPath);
    }
  } else if (node.type === 'directory' && node.children) {
    for (const child of node.children) {
      await processContent(child, basePath);
    }
  }
}

// Ação Padrão (Banner de Status)
program.action(() => {
  console.log(chalk.bold.green("\n[PGE] Motor Inicializado com Sucesso."));
  console.log(chalk.white("Status: ") + chalk.green("ONLINE"));
  console.log(chalk.white("Versão: ") + chalk.cyan(pkg.version));
  console.log(chalk.white("Norma:  ") + chalk.yellow("PGT-01 (Extremo Zero)\n"));
  console.log(chalk.gray("Execute 'pge --help' para ver os comandos disponíveis.\n"));
});

try {
  program.parse(process.argv);
} catch (error) {
  console.error(chalk.red("\n[ERRO CRÍTICO] Falha na execução do motor CLI:"));
  console.error(error);
  process.exit(1);
}