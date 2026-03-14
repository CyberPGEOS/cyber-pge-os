# -------------------------------------------------------------------------
# PROJETO: CONNECTION CYBER PORTAL
# ARQUIVO: INITIALIZE_STRUCTURE.ps1
# OBJETIVO: Gênese da Estrutura Monorepo PGT-01
# -------------------------------------------------------------------------

$RootPath = "E:\Projetos\connection-cyber-portal"

Write-Host ">>> INICIANDO GÊNESE: CONNECTION CYBER PORTAL <<<" -ForegroundColor Cyan

$Directories = @(
    "backend",
    "frontend",
    "infra",
    "docs",
    "shared",
    "frontend/src/app",
    "frontend/src/components",
    "frontend/src/design-system",
    "backend/src/modules",
    "shared/types",
    "shared/constants"
)

foreach ($Dir in $Directories) {
    $FullPath = Join-Path $RootPath $Dir
    if (!(Test-Path $FullPath)) {
        New-Item -ItemType Directory -Path $FullPath -Force | Out-Null
        Write-Host "  [OK] Criado: $Dir" -ForegroundColor Green
    }
}

Write-Host "`n>>> ESTRUTURA PRONTA PARA INGESTÃO DE CÓDIGO <<<" -ForegroundColor Cyan