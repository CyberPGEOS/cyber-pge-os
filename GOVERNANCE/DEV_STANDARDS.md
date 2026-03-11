# NORMA PGT-01: EXTREMO ZERO

## 1. Regra de Ouro: Integridade
- Fusões devem ser Módulo por Módulo, Linha por Linha.
- Proibido remover lógica validada anteriormente.
- Proibido alucinar variáveis sem contexto.

## 2. Arquitetura de Pastas (Next.js 15)
- Todos os arquivos dentro de `web/src/`.
- Proibido criar `src/` na raiz do repositório (fora da pasta web).

## 3. Banco de Dados (Supabase)
- RLS (Row Level Security) sempre ativo.
- Auditoria de progresso via Server Actions (`actions.ts`).