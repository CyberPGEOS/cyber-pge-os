/*
-------------------------------------------------------------------------
PROJETO: PROJECT GENESIS ENGINE (PGE)
ARQUIVO: E:\Projetos\pge\src\core\ai.ts
OBJETIVO: Instância da Camada de Inteligência (Gemini SDK).
GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
-------------------------------------------------------------------------
*/

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import chalk from "chalk";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Função Core: askPGE
 * Tenta inicializar o modelo de forma resiliente.
 */
export async function askPGE(prompt: string): Promise<string> {
  try {
    // Tentativa com identificador direto (padrão v1/v1beta)
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
            temperature: 0.1,
            topP: 0.95,
        }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
    
  } catch (error: any) {
    // Log detalhado para o Arquiteto no terminal
    console.log(chalk.red(`\n[AI-LOG] Falha na Resolução do Modelo: ${error.message}`));
    
    return `[FALHA ARQUITETURAL]: A camada de IA está temporariamente indisponível (Erro de Rota).`;
  }
}