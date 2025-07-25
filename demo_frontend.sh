#!/bin/bash

echo "🍕 Demo da Pizzaria - Frontend com Dados Mock"
echo "============================================="

# Verificar se estamos no diretório correto
if [ ! -f "src/frontend/index.html" ]; then
    echo "❌ Execute este script a partir da raiz do projeto Pizzaria"
    exit 1
fi

echo "📋 Esta demonstração mostra:"
echo "- ✅ Frontend HTML/CSS/JavaScript funcionando"
echo "- ✅ JavaScript modular (app.js)"
echo "- ✅ Preparado para conectar ao backend Node.js"
echo "- ⚠️  Usando dados mock (sem backend)"

echo ""
echo "🚀 Iniciando servidor frontend..."

# Verificar se Python está disponível
if command -v python3 &> /dev/null; then
    echo "🐍 Usando Python 3 para servir arquivos"
    python3 servidor_frontend.py
elif command -v python &> /dev/null; then
    echo "🐍 Usando Python para servir arquivos"
    cd src/frontend
    python -m http.server 8080
else
    echo "⚠️  Python não encontrado"
    echo "📝 Abra manualmente: src/frontend/index.html no navegador"
    echo "   Ou instale Python: sudo apt install python3"
    
    # Tentar abrir no navegador
    if command -v xdg-open &> /dev/null; then
        echo "🌐 Tentando abrir no navegador..."
        xdg-open "src/frontend/index.html"
    elif command -v firefox &> /dev/null; then
        firefox "src/frontend/index.html" &
    elif command -v google-chrome &> /dev/null; then
        google-chrome "src/frontend/index.html" &
    fi
fi
