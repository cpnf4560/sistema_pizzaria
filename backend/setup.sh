#!/bin/bash

# Script para configurar o backend da Pizzaria
echo "🍕 Configuração do Backend Pizzaria"
echo "==================================="

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale o Node.js 16+ primeiro."
    exit 1
fi

echo "✅ Node.js versão: $(node --version)"

# Verificar se o npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Instale o npm primeiro."
    exit 1
fi

echo "✅ npm versão: $(npm --version)"

# Instalar dependências
echo ""
echo "📦 Instalando dependências..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependências instaladas com sucesso"
else
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

# Verificar arquivo .env
if [ ! -f ".env" ]; then
    echo ""
    echo "⚠️  Arquivo .env não encontrado. Copiando do exemplo..."
    cp .env.example .env
    echo "📝 Por favor, edite o arquivo .env com suas configurações de banco de dados"
else
    echo "✅ Arquivo .env encontrado"
fi

# Executar testes
echo ""
echo "🧪 Executando testes..."
npm test

if [ $? -eq 0 ]; then
    echo "✅ Todos os testes passaram"
else
    echo "❌ Alguns testes falharam"
fi

echo ""
echo "📋 Próximos passos:"
echo "1. Configure seu banco MySQL"
echo "2. Execute o script SQL: mysql -u root -p pizzaria < database_migration.sql"
echo "3. Edite o arquivo .env com suas configurações"
echo "4. Execute: npm run dev"
echo ""
echo "📚 Documentação: README.md e API_DOCS.md"
echo "🌐 Servidor rodará em: http://localhost:3000"