#!/usr/bin/env node
/*
-------------------------------------------------------------------------
PROJETO: PROJECT GENESIS ENGINE (PGE)
MÓDULO: E:\Projetos\PGE\src\cli.ts
ARQUITETURA: CLI ENGINE (Node.js / TypeScript / Commander)
GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
DESCRIÇÃO: Ponto de entrada oficial (Entry Point) do orquestrador PGE.
-------------------------------------------------------------------------
*/

import { Command } from "commander";
import chalk from "chalk";
import fs from "fs";
import path from "path";

// Importação de metadados seguindo Padrão NodeNext
import pkg from "../package.json" with { type: "json" };

// Injeção de Módulos Operacionais
import { absorbProject } from "./modules/knowledge/absorb.js";
import { evolveBlueprint } from "./modules/knowledge/blueprint-evolve.js";
import { auditArsenal } from "./modules/audit/arsenal.js";
// Injeção de Camada de Inteligência (Módulo 6)
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
   COMANDO: pge absorb <dir>
   DESCRIÇÃO: Absorve conhecimento e gera Blueprint Inteligente.
   ============================================================ */
program
  .command("absorb")
  .description("Absorve conhecimento de um projeto existente")
  .argument("<dir>", "Diretório do projeto")
  .action(async (dir) => {
    const target = path.resolve(dir);
    console.log(chalk.cyan("\n[PGE] Absorvendo projeto:"), chalk.white(target));
    
    const summary = await absorbProject(target);
    
    if (summary) {
      console.log(chalk.green("\n[PGE] Resumo da absorção:"));
      console.log(chalk.gray(JSON.stringify(summary, null, 2)));

      // Injeção de Contexto de Governança
      const govDir = path.join(process.cwd(), "GOVERNANCE");
      let govContext = "Nenhuma norma específica encontrada.";

      if (fs.existsSync(govDir)) {
          const devStandards = fs.readFileSync(path.join(govDir, "DEV_STANDARDS.md"), "utf-8");
          const uiStandards = fs.readFileSync(path.join(govDir, "UI_UX_STANDARDS.json"), "utf-8");
          govContext = `[REGRAS DEV]:\n${devStandards}\n\n[REGRAS UI/UX]:\n${uiStandards}`;
      }

      // Injeção Funcional: Geração de Prompt de Contexto para IA
      console.log(chalk.cyan("\n[PGE] Consultando Inteligência Arquitetural..."));
      const promptContext = `${PGE_PERSONA}\n\n${ANALYSIS_BLUEPRINT(summary, govContext)}`;
      
      // Persistência do prompt gerado para auditoria do Arquiteto
      const promptPath = path.join(process.cwd(), "pge", "knowledge", "last_prompt.txt");
      fs.writeFileSync(promptPath, promptContext);
      
      // Chamada da IA para Análise Real-time
      const aiResponse = await askPGE(promptContext);
      
      console.log(chalk.bold.green("\n==============================================="));
      console.log(chalk.bold.green("   ANÁLISE DE BLUEPRINT - PGE-ANALYST"));
      console.log(chalk.bold.green("==============================================="));
      console.log(chalk.white(aiResponse));
      console.log(chalk.bold.green("===============================================\n"));
      
      console.log(chalk.green(`[OK] Prompt persistido em: ${promptPath}`));
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
        console.log(chalk.gray("-----------------------------------------------"));
        await absorbProject(dir);
    }

    console.log(chalk.yellow("\n[PGE] Atualizando Blueprint Evoluído..."));
    await evolveBlueprint();
    console.log(chalk.bold.green("\n==============================================="));
    console.log(chalk.bold.green("   Varredura concluída com sucesso!"));
    console.log(chalk.bold.green("==============================================="));
});

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