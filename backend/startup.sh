#!/bin/bash
# Script de startup para o backend
echo "🚀 Iniciando GeekHaven Brew Backend..."

# Executa o seed se necessário
echo "📊 Populando banco de dados..."
python simple_force_seed.py

# Inicia o servidor
echo "🌐 Iniciando servidor FastAPI..."
uvicorn app:app --host 0.0.0.0 --port ${PORT:-80}