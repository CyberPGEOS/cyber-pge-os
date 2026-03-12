/*
-------------------------------------------------------------------------
PROJETO: PROJECT GENESIS ENGINE (PGE)
ARQUIVO: E:\Projetos\pge\src\core\ai.ts
OBJETIVO: Instância da Camada de Inteligência (Gemini SDK) - v2026.1.1
GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
DESCRIÇÃO: Força endpoint V1 para aniquilar erro 404.
-------------------------------------------------------------------------
*/

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import chalk from "chalk";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY || "";

if (!API_KEY) {
  console.error(chalk.red("\n[ERRO AI] Chave GEMINI_API_KEY não configurada."));
}

// Inicialização com Rigor: Forçando a versão da API na raiz da instância
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * CONFIGURAÇÃO DE MODELO ESTABILIZADA
 * Forçamos o modelo 'gemini-1.5-flash' e a apiVersion 'v1' explicitamente.
 */
const model = genAI.getGenerativeModel(
  { model: "gemini-1.5-flash" }, 
  { apiVersion: 'v1' } // ESSENCIAL: Impede o fallback para v1beta (Causa do 404)
);

/**
 * Função: askPGE
 * Realiza o processamento estruturado do DNA enviado pelo motor de absorção.
 */
export async function askPGE(prompt: string): Promise<string> {
  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1, // Norma PGT-01
        topP: 0.95,
      }
    });
    
    const response = await result.response;
    return response.text();
    
  } catch (error: any) {
    // Log de auditoria para o Arquiteto
    console.error(chalk.red(`\n[AI-LOG] Erro de Rota/Modelo: ${error.message}`));
    return `[FALHA ARQUITETURAL]: Erro na comunicação com o cérebro da IA (v1).`;
  }
}