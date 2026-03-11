#!/usr/bin/env node
import { Command } from "commander";
import fs from "fs";
import path from "path";
import { absorbProject } from "./modules/knowledge/absorb";
import { evolveBlueprint } from "./modules/knowledge/blueprint-evolve";
const program = new Command();
program
    .name("pge")
    .description("Project Genesis Engine - CLI Oficial")
    .version("1.0.0");
/* ============================================================
   COMANDO: pge absorb <dir>
   ============================================================ */
program
    .command("absorb")
    .description("Absorve conhecimento de um projeto existente")
    .argument("<dir>", "Diretório do projeto")
    .action(async (dir) => {
    const target = path.resolve(dir);
    console.log("[PGE] Absorvendo projeto:", target);
    const summary = await absorbProject(target);
    console.log("[PGE] Resumo da absorção:");
    console.log(JSON.stringify(summary, null, 2));
});
/* ============================================================
   COMANDO: pge absorb-all
   ============================================================ */
program
    .command("absorb-all")
    .description("Absorve TODOS os projetos dentro de E:\\Projetos")
    .action(async () => {
    const root = "E:\\Projetos";
    console.log("===============================================");
    console.log("   PGE - Varredura Completa de Projetos");
    console.log("   Volume:", root);
    console.log("===============================================");
    if (!fs.existsSync(root)) {
        console.error("[PGE] ERRO: O diretório não existe:", root);
        return;
    }
    const dirs = fs
        .readdirSync(root, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => path.join(root, d.name));
    for (const dir of dirs) {
        console.log("-----------------------------------------------");
        console.log("[PGE] Absorvendo projeto:", dir);
        console.log("-----------------------------------------------");
        await absorbProject(dir);
    }
    console.log("\n[PGE] Atualizando Blueprint Evoluído...");
    await evolveBlueprint();
    console.log("\n===============================================");
    console.log("   Varredura concluída com sucesso!");
    console.log("   Todos os projetos foram absorvidos.");
    console.log("===============================================");
});
program.parse(process.argv);
//# sourceMappingURL=cli.js.map