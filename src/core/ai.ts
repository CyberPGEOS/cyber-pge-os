import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import chalk from "chalk";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// A CONFIGURAÇÃO DEFINITIVA: model + suffix
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash-latest" 
});

export async function askPGE(prompt: string): Promise<string> {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error(chalk.red(`\n[AI-LOG] Erro: ${error.message}`));
    return `[FALHA ARQUITETURAL]: IA indisponível.`;
  }
}