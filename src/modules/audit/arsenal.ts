/*
-------------------------------------------------------------------------
PROJETO: PROJECT GENESIS ENGINE (PGE)
MÓDULO: E:\Projetos\PGE\src\modules\audit\arsenal.ts
ARQUITETURA: AUDIT ENGINE (Node.js / Child Process / TypeScript)
GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
DESCRIÇÃO: Verificador de Arsenal Técnico e conformidade de binários.
-------------------------------------------------------------------------
*/

import { execSync } from "child_process";
import chalk from "chalk";

/**
 * Interface: ArsenalTool
 * Define o contrato para ferramentas que o PGE deve auditar.
 */
interface ArsenalTool {
  name: string;
  command: string;
  minVersion: string;
  required: boolean;
}

const ARSENAL_CONFIG: ArsenalTool[] = [
  { name: "Node.js", command: "node -v", minVersion: "18.0.0", required: true },
  { name: "NPM", command: "npm -v", minVersion: "9.0.0", required: true },
  { name: "Git", command: "git --version", minVersion: "2.30.0", required: true },
  { name: "TypeScript", command: "tsc -v", minVersion: "5.0.0", required: true },
  { name: "Docker", command: "docker -v", minVersion: "20.0.0", required: false },
];

/**
 * Rotina: auditArsenal
 * Objetivo: Executa varredura de binários no PATH do sistema operacional.
 */
export async function auditArsenal() {
  console.log(chalk.bold.cyan("\n[AUDITORIA] Iniciando Verificação de Arsenal Técnico..."));
  console.log(chalk.gray("---------------------------------------------------------"));

  let allClear = true;

  for (const tool of ARSENAL_CONFIG) {
    // CORREÇÃO TÉCNICA: Uso de padEnd para alinhamento (TypeScript Standard)
    const label = `Auditando ${tool.name}`.padEnd(25, ".");
    process.stdout.write(chalk.white(`${label} `));

    try {
      const output = execSync(tool.command).toString().trim();
      const versionMatch = output.match(/(\d+\.\d+\.\d+)/);
      const version = versionMatch ? versionMatch[0] : output;

      console.log(chalk.green(`[OK] v${version}`));
    } catch (error) {
      if (tool.required) {
        console.log(chalk.red("[FALHA] Não localizado ou erro no PATH"));
        allClear = false;
      } else {
        console.log(chalk.yellow("[AVISO] Opcional não encontrado"));
      }
    }
  }

  console.log(chalk.gray("---------------------------------------------------------"));

  if (allClear) {
    console.log(chalk.bold.green("✅ STATUS VERDE: Arsenal validado. Ambiente seguro.\n"));
    return true;
  } else {
    console.log(chalk.bold.red("🛑 STATUS VERMELHO: Arsenal incompleto.\n"));
    console.log(chalk.red("Ação Necessária: Instale as ferramentas requeridas acima.\n"));
    return false;
  }
}