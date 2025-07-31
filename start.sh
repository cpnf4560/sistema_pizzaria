#!/bin/bash
# Script de inicialização da Pizzaria do Carlos

echo "🍕 Iniciando Pizzaria do Carlos..."

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Por favor, instale Node.js primeiro."
    exit 1
fi

# Verificar se MySQL está a correr
if ! pgrep -x "mysqld" > /dev/null; then
    echo "⚠️  MySQL não parece estar a correr. Certifique-se de que está ativo."
fi

# Iniciar backend
echo "🚀 Iniciando backend..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

# Verificar se .env existe
if [ ! -f ".env" ]; then
    echo "⚠️  Arquivo .env não encontrado. Criando configuração padrão..."
    cat > .env << EOF
DB_HOST=localhost
DB_PORT=3307
DB_USER=pizzaria_user
DB_PASSWORD=pizzaria123
DB_NAME=pizzaria
JWT_SECRET=pizzaria_secret_key_2025
PORT=3000
EOF
fi

echo "✅ Backend configurado!"
echo "📡 Iniciando servidor na porta 3000..."
node src/app.js &
BACKEND_PID=$!

# Aguardar um pouco para o backend iniciar
sleep 3

# Iniciar frontend
echo "🌐 Iniciando frontend na porta 8080..."
cd ../src/frontend
python3 -m http.server 8080 &
FRONTEND_PID=$!

echo ""
echo "🎉 Pizzaria do Carlos está ativa!"
echo "📱 Frontend: http://localhost:8080"
echo "🔧 Backend:  http://localhost:3000"
echo ""
echo "Para parar os servidores:"
echo "kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "Pressione Ctrl+C para parar..."

# Aguardar sinal de interrupção
trap "echo 'Parando servidores...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT

# Manter script em execução
wait
