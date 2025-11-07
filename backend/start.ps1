# Script de inicializacao rapida do backend
# Execute: .\start.ps1

Write-Host "Iniciando GeekHaven Brew Backend..." -ForegroundColor Green
Write-Host ""

# Verifica se o ambiente virtual existe
if (Test-Path ".\venv") {
    Write-Host "Ambiente virtual encontrado" -ForegroundColor Green
    .\venv\Scripts\Activate.ps1
} else {
    Write-Host "Ambiente virtual nao encontrado. Criando..." -ForegroundColor Yellow
    python -m venv venv
    .\venv\Scripts\Activate.ps1
    Write-Host "Ambiente virtual criado" -ForegroundColor Green
}

Write-Host ""

# Verifica se as dependencias estao instaladas
Write-Host "Verificando dependencias..." -ForegroundColor Cyan
pip install -r requirements.txt --quiet

Write-Host ""

# Verifica se o banco existe
if (-Not (Test-Path ".\cafeteria.db")) {
    Write-Host "Banco de dados nao encontrado. Executando seed..." -ForegroundColor Yellow
    python seed.py
    Write-Host ""
}

Write-Host "Iniciando servidor FastAPI..." -ForegroundColor Magenta
Write-Host "Documentacao: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""

uvicorn app:app --reload
