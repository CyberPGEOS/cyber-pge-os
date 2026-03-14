# -------------------------------------------------------------------------
# PROJETO: CONNECTION CYBER PORTAL
# ARQUIVO: CLOSE_SESSION.ps1
# OBJETIVO: Encerramento de Sessão e Backup Híbrido (Físico + Cloud)
# -------------------------------------------------------------------------

$VolumeEsperado = "BACKUPSYSTEM"
$DriveLetra = "J"
$Origem = "E:\Projetos\connection-cyber-portal"
$Destino = "J:\connection-cyber-portal"

Clear-Host
Write-Host "==========================================================" -ForegroundColor Red
Write-Host "       CONNECTION CYBER PORTAL - PROTOCOLO DE FECHAMENTO  " -ForegroundColor White -BackgroundColor DarkRed
Write-Host "==========================================================" -ForegroundColor Red

# 1. VALIDAÇÃO DE TRAVA DE HARDWARE
try {
    $Vol = Get-Volume -DriveLetter $DriveLetra -ErrorAction Stop
    if ($Vol.FileSystemLabel -ne $VolumeEsperado) {
        Write-Host "  [ERRO] Volume incorreto no Drive J:. Esperado: $VolumeEsperado" -ForegroundColor Red
        Pause; Exit
    }
} catch {
    Write-Host "  [CRÍTICO] Drive J: não localizado!" -ForegroundColor Red
    Pause; Exit
}

# 2. BACKUP FÍSICO (ROBOCOPY)
Write-Host "`n[1/2] Iniciando Espelhamento Físico..." -ForegroundColor Yellow
robocopy $Origem $Destino /MIR /Z /R:5 /W:5 /MT:8 /XD node_modules .next .git /NFL /NDL

# 3. BACKUP CLOUD (GITHUB)
Write-Host "`n[2/2] Sincronizando com GitHub..." -ForegroundColor Yellow
git add .
git commit -m "Auto-Backup: Sessão encerrada em $(Get-Date -Format 'dd/MM/yyyy HH:mm')"
git push origin main

Write-Host "`n[SUCESSO] Ambiente Protegido." -ForegroundColor Green