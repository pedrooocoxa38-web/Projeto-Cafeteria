#!/bin/bash
# Build script para Render

echo "🔧 Instalando dependências do backend..."
cd backend
pip install -r requirements.txt

echo "🔧 Instalando dependências do frontend..."
cd ..
npm install

echo "🏗️ Building frontend..."
npm run build

echo "✅ Build concluído!"