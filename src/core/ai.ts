/*
-------------------------------------------------------------------------
PROJETO: PROJECT GENESIS ENGINE (PGE)
MÓDULO: P100 - CORE INTELLIGENCE
ARQUIVO: E:\Projetos\pge\src\core\ai.ts
OBJETIVO: Interface de comunicação com Google Gemini AI.
GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
DESCRIÇÃO: Versão FINAL BLINDADA. Resolve conflitos de rota v1/v1beta.
-------------------------------------------------------------------------
*/

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import chalk from "chalk";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY || "";

if (!API_KEY) {
  console.error(chalk.red("[PGE][CRÍTICO] Chave GEMINI_API_KEY não localizada no .env"));
}

const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * CONFIGURAÇÃO BLINDADA:
 * Utilizamos o modelo 'gemini-1.5-flash' (mais disponível mundialmente) 
 * na rota 'v1beta' com identificador explícito.
 */
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash" 
});

/**
 * Função: askPGE
 * Finalidade: Enviar contexto estruturado para o cérebro da IA e retornar análise.
 */
export async function askPGE(prompt: string): Promise<string> {
  try {
    // Chamada direta sem forçar apiVersion no getGenerativeModel para deixar o SDK decidir
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) throw new Error("Resposta da IA vazia.");

    return text;

  } catch (error: any) {
    // TENTATIVA DE FALLBACK AUTOMÁTICO (Caso o modelo flash falhe, tentamos o pro silenciosamente)
    try {
        const fallbackModel = genAI.getGenerativeModel({ model: "gemini-pro" });
        const fbResult = await fallbackModel.generateContent(prompt);
        return fbResult.response.text();
    } catch (fbError) {
        console.error(chalk.red(`\n[AI-LOG][CRÍTICO]: ${error.message}`));
        return `[ERRO DE INFRAESTRUTURA]: Falha na comunicação com Google AI. Verifique se sua chave API em https://aistudio.google.com/app/apikey possui o plano "Pay-as-you-go" ou se atingiu o limite de requisições gratuitas.`;
    }
  }
}