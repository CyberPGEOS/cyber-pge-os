# -------------------------------------------------------------------------
# PROJETO: PROJECT GENESIS ENGINE (PGE)
# ARQUIVO: E:\Projetos\pge\AUDIT_TREE_PGE.ps1
# OBJETIVO: VISUALIZAÇÃO LIMPA (ASCII COMPATÍVEL - FOCO EM ENGENHARIA)
# GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
# -------------------------------------------------------------------------

Clear-Host
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "                 PGE GENESIS OS v1.0                      " -ForegroundColor White -BackgroundColor DarkBlue
Write-Host "             MAPEAMENTO DE ESTRUTURA TÉCNICA              " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Local: E:\Projetos\pge`n" -ForegroundColor Gray

# 🛡️ FILTRO DE HIGIENE (Arquivos e Pastas desnecessários/lixo)
$Exclude = @(
    "node_modules", 
    ".next", 
    ".git", 
    "package-lock.json", 
    "public", 
    ".vercel", 
    "dist",
    ".DS_Store",
    "thumbs.db",
    "out",
    ".turbo"
)

function Get-CleanTree {
    param (
        [string]$Path = ".",
        [string]$Indent = ""
    )
    
    # Obtém itens filtrados e ordenados (pastas primeiro)
    $Items = Get-ChildItem -Path $Path | 
             Where-Object { $Exclude -notcontains $_.Name } | 
             Sort-Object PSIsContainer -Descending
    
    foreach ($Item in $Items) {
        if ($Item.PSIsContainer) {
            # Renderiza Pasta com padrão ASCII seguro
            Write-Host "$Indent+---$($Item.Name)/" -ForegroundColor Yellow
            
            # Recorrência para subpastas
            Get-CleanTree -Path $Item.FullName -Indent "$Indent|   "
        } else {
            # Renderiza Arquivo com padrão ASCII seguro
            Write-Host "$Indent|---$($Item.Name)" -ForegroundColor Gray
        }
    }
}

# Execução do Mapeamento na Raiz do Projeto
Get-CleanTree -Path "E:\Projetos\pge"

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host " MAPEAMENTO CONCLUÍDO COM SUCESSO!                        " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan