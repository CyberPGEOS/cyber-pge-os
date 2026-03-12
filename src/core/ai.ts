import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import chalk from "chalk";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * CONFIGURAÇÃO ESTÁVEL 2026:
 * Forçamos o modelo puro e a API v1 para evitar o erro 404 da rota v1beta.
 */
const model = genAI.getGenerativeModel(
  { model: "gemini-1.5-flash" },
  { apiVersion: 'v1' } 
);

export async function askPGE(prompt: string): Promise<string> {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error(chalk.red(`\n[AI-LOG] Erro de Rota: ${error.message}`));
    return `[FALHA ARQUITETURAL]: IA indisponível na rota v1.`;
  }
}