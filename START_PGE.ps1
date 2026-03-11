# -------------------------------------------------------------------------
# PROJETO: PROJECT GENESIS ENGINE (PGE)
# GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
# PROFISSIONAIS: Chief Integrated Systems Architect & Dev Sênior Full Stack
# -------------------------------------------------------------------------

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Clear-Host
$line = "---------------------------------------------------------"

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "         PGE GENESIS ENGINE | START PROTOCOL              " -ForegroundColor White -BackgroundColor DarkGreen
Write-Host "         PROTOCOLO: PGT-01 (ORDEM CRONOLÓGICA)            " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Green

# 1. MANIFESTO DE GOVERNANÇA (DIRETRIZ PARA IA)
Write-Host "`n[GOVERNANÇA] Carregando Manifesto de Operação..." -ForegroundColor Cyan
Write-Host "  > Ordem: Cronológica, Linha a Linha, Comando a Comando." -ForegroundColor White
Write-Host "  > Validação: Proibido avançar sem confirmação da etapa anterior." -ForegroundColor White
Write-Host "  > Código: Completo, com nome, extensão e caminho exato." -ForegroundColor White
Write-Host "  > Local: E:\Projetos\PGE" -ForegroundColor White

Write-Host "`n[1/4] VALIDACAO DE LOCALIZACAO..." -ForegroundColor Yellow
if ($PWD.Path -notlike "*\Projetos\PGE") {
    Write-Host "  [ERRO] Execute este script dentro de E:\Projetos\PGE" -ForegroundColor Red
    Pause; exit
}
Write-Host "  [OK] Localização validada." -ForegroundColor Gray

# 2. ISOLAMENTO DE IDENTIDADE GIT
Write-Host "`n[2/4] Configurando Identidade para CyberPGEOS..." -ForegroundColor Yellow
git config --local user.name "CyberPGEOS"
git config --local user.email "joaquimmariocoelho@gmail.com"
git remote set-url origin "https://github.com/CyberPGEOS/cyber-pge-os.git"
Write-Host "  [OK] Identidade Git configurada localmente." -ForegroundColor Gray

# 3. LIMPEZA DE CREDENCIAIS (Escudo Anti-403)
Write-Host "`n[3/4] Blindando credenciais contra conflitos..." -ForegroundColor Yellow
try {
    cmdkey /list | Select-String "github.com" | ForEach-Object {
        $target = $_.ToString().Split(' ')[-1].Trim()
        if ($target -like "*github.com*") { cmdkey /delete:$target }
    }
} catch { }
Write-Host "  [OK] Cache de credenciais purgado." -ForegroundColor Gray

# 4. VALIDACAO DE ARSENAL (BUILD)
Write-Host "`n[4/4] Verificando integridade do motor (TSC)..." -ForegroundColor Yellow
npm run build

Write-Host "`n$line" -ForegroundColor Gray
Write-Host "[OK] CONTEXTO PGE ATIVADO COM SUCESSO" -ForegroundColor Green
Write-Host "Identidade Git  : CyberPGEOS" -ForegroundColor White
Write-Host "Repositorio     : CyberPGEOS/cyber-pge-os" -ForegroundColor White
Write-Host "Supabase        : PGE-PRODUCTION" -ForegroundColor White
Write-Host "$line" -ForegroundColor Gray

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host " [ALERTA PARA IA] LEIA AS DIRETRIZES DE DESENVOLVIMENTO   " -ForegroundColor Black -BackgroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "Joaquim, informe à IA que o ambiente PGE está ativo." -ForegroundColor White
Write-Host "A IA deve produzir arquivos completos com estrutura total." -ForegroundColor White
Write-Host "A IA deve validar cada processo antes de seguir adiante." -ForegroundColor White

# Inicia o editor
code .