# ---------------------------------------------------------
# PROJETO: PROJECT GENESIS ENGINE (PGE)
# GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
# ---------------------------------------------------------

Clear-Host
$line = "---------------------------------------------------------"

Write-Host "[INICIO] Iniciando Protocolo de Ignicao: PGE" -ForegroundColor Cyan
Write-Host $line -ForegroundColor Gray

# 1. VALIDACAO DE LOCALIZACAO
if ($currentPath -and ($currentPath -notlike "*\Projetos\PGE")) {
    Write-Host "[ERRO] Execute o script dentro de E:\Projetos\PGE" -ForegroundColor Red
    exit
}

# 2. ISOLAMENTO DE IDENTIDADE GIT
Write-Host "[GIT] Configurando Identidade para CyberPGEOS..." -ForegroundColor Yellow
git config --local user.name "CyberPGEOS"
git config --local user.email "joaquimmariocoelho@gmail.com"
git remote set-url origin "https://github.com/CyberPGEOS/cyber-pge-os.git"

# 3. LIMPEZA DE CREDENCIAIS (Escudo Anti-403)
Write-Host "[AUTH] Blindando credenciais contra conflitos..." -ForegroundColor Yellow
try {
    cmdkey /list | Select-String "github.com" | ForEach-Object {
        $target = $_.ToString().Split(' ')[-1].Trim()
        if ($target -like "*github.com*") { cmdkey /delete:$target }
    }
} catch { }

# 4. VALIDACAO DE ARSENAL
Write-Host "[AUDIT] Verificando integridade do motor..." -ForegroundColor Yellow
npm run build

# 5. ATIVACAO DO CONTEXTO VISUAL
Write-Host $line -ForegroundColor Gray
Write-Host "[OK] CONTEXTO PGE ATIVADO COM SUCESSO" -ForegroundColor Green
Write-Host "Identidade Git  : CyberPGEOS" -ForegroundColor White
Write-Host "Repositorio     : CyberPGEOS/cyber-pge-os" -ForegroundColor White
Write-Host "Supabase        : PGE-PRODUCTION" -ForegroundColor White
Write-Host $line -ForegroundColor Gray

# Inicia o editor
code .