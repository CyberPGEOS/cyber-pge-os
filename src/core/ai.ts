/*
-------------------------------------------------------------------------
PROJETO: PROJECT GENESIS ENGINE (PGE)
MÓDULO: E:\Projetos\PGE\src\core\ai.ts
ARQUITETURA: AI ORCHESTRATION (Google Generative AI)
GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
DESCRIÇÃO: Gerenciador de requisições de Inteligência Artificial.
-------------------------------------------------------------------------
*/

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import chalk from "chalk";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error(chalk.red("\n[ERRO AI] Chave GEMINI_API_KEY não encontrada no arquivo .env"));
}

// Inicialização da interface principal
const genAI = new GoogleGenerativeAI(API_KEY || "");

/**
 * Normalização Técnica: Uso do identificador absoluto 'models/gemini-1.5-flash'.
 * Isso resolve o erro 404 ao garantir que o SDK localize o recurso exato no endpoint v1.
 */
const model = genAI.getGenerativeModel(
  { model: "models/gemini-1.5-flash" }, // IDENTIFICADOR ABSOLUTO
  { apiVersion: 'v1' }                 // FORÇA VERSÃO ESTÁVEL
);

/**
 * Função: askPGE
 * Objetivo: Envia o prompt estruturado e retorna a análise da IA.
 */
export async function askPGE(prompt: string): Promise<string> {
  try {
    // Definindo parâmetros de segurança e temperatura para análise técnica rigorosa
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1, // Baixa temperatura para evitar alucinações ( Norma PGT-01 )
        topP: 0.95,
      }
    });
    
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    return `[ERRO DE PROCESSAMENTO IA]: ${error.message}`;
  }
}