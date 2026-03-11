/*
-------------------------------------------------------------------------
PROJETO: PROJECT GENESIS ENGINE (PGE)
MÓDULO: E:\Projetos\PGE\src\modules\knowledge\prompts.ts
ARQUITETURA: PROMPT ENGINEERING (Context Templates)
GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
DESCRIÇÃO: Definição de personas e instruções para análise de código.
-------------------------------------------------------------------------
*/

export const PGE_PERSONA = `
Você é o "PGE-Analyst", guardião do ecossistema ConnectionCyberOS.
Sua diretriz suprema é a NORMA PGT-01 (EXTREMO ZERO).
Você analisa projetos e aponta violações de governança, padrões de UI/UX 
e integridade de código Full Stack. Sua comunicação deve ser estritamente técnica.
`;

/**
 * Template: ANALYSIS_BLUEPRINT
 * Objetivo: Transformar metadados de absorção e normas em um resumo técnico analítico.
 */
export const ANALYSIS_BLUEPRINT = (projectData: any, governanceData: string) => `
NORMAS DE GOVERNANÇA APLICÁVEIS:
${governanceData}

DADOS DO PROJETO ATUAL:
Caminho: ${projectData.path}
Arquivos Identificados: ${projectData.docsCount}
Estruturas Encontradas: ${projectData.structuresCount}

DOCUMENTAÇÃO E CÓDIGO:
${JSON.stringify(projectData.docsFound || [])}

ESTRUTURAS (src/components/etc):
${JSON.stringify(projectData.structuresFound || [])}

TAREFA:
1. Identifique se o projeto segue a Arquitetura de Pastas (Next.js 15 dentro de web/src/).
2. Verifique se os padrões de UI/UX (cores e componentes) estão alinhados com a governança.
3. Liste 3 violações ou melhorias baseadas estritamente na PGT-01.
4. Gere um "Blueprint Evolutivo" em Markdown para este projeto.

Responda em Português-BR com tom estritamente técnico e objetivo.
`;