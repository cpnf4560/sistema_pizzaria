#!/bin/bash

echo "🍕 Setup completo da Pizzaria - Frontend + Backend"
echo "=================================================="

# Verificar se estamos no diretório correto
if [ ! -f "backend/package.json" ]; then
    echo "❌ Execute este script a partir da raiz do projeto (onde está o README.md)"
    exit 1
fi

# 1. Setup do Backend
echo ""
echo "📦 Configurando Backend..."
cd backend

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale o Node.js 16+ primeiro."
    exit 1
fi

echo "✅ Node.js versão: $(node --version)"

# Instalar dependências
echo "📥 Instalando dependências do Node.js..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

echo "✅ Dependências instaladas"

# Verificar arquivo .env
if [ ! -f ".env" ]; then
    echo "⚠️  Arquivo .env não encontrado. Foi criado automaticamente."
    echo "📝 Verifique as configurações de banco de dados no arquivo .env"
else
    echo "✅ Arquivo .env encontrado"
fi

# 2. Verificar MySQL
echo ""
echo "🗄️  Verificando MySQL..."

# Tentar conectar ao MySQL
mysql -h localhost -P 3307 -u root -przq7xgq8 -e "SELECT 1;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Conexão com MySQL OK"
    
    # Verificar se o banco existe
    mysql -h localhost -P 3307 -u root -przq7xgq8 -e "USE pizzaria; SELECT 1;" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo "✅ Banco de dados 'pizzaria' encontrado"
    else
        echo "⚠️  Banco de dados 'pizzaria' não encontrado"
        echo "📝 Crie o banco manualmente ou importe o esquema do projeto Java"
    fi
    
    # Executar migração
    echo "🔄 Executando migração de banco de dados..."
    mysql -h localhost -P 3307 -u root -przq7xgq8 pizzaria < database_migration.sql 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo "✅ Migração executada com sucesso"
        echo "📋 Usuário administrador criado: admin@pizzaria.com / admin123"
    else
        echo "⚠️  Erro na migração - verifique se o banco 'pizzaria' existe"
    fi
    
else
    echo "❌ Não foi possível conectar ao MySQL"
    echo "📝 Verifique:"
    echo "   - MySQL está rodando na porta 3307"
    echo "   - Credenciais: user=root, password=rzq7xgq8"
    echo "   - Banco 'pizzaria' existe"
fi

# 3. Testar API
echo ""
echo "🧪 Testando API..."
npm test

cd ..

# 4. Instruções finais
echo ""
echo "🎉 Setup concluído!"
echo "=================="
echo ""
echo "📋 Próximos passos:"
echo ""
echo "1. 🚀 Iniciar o backend:"
echo "   cd backend && npm run dev"
echo ""
echo "2. 🌐 Abrir o frontend:"
echo "   - Abra src/frontend/index.html no navegador"
echo "   - Ou use um servidor local: python -m http.server 8080"
echo ""
echo "3. 🔗 URLs importantes:"
echo "   - Frontend: http://localhost:8080/src/frontend/"
echo "   - API Backend: http://localhost:3000"
echo "   - API Docs: http://localhost:3000/api"
echo ""
echo "4. 👤 Login de administrador:"
echo "   - Email: admin@pizzaria.com"
echo "   - Senha: admin123"
echo ""
echo "📝 Nota: O frontend irá funcionar mesmo se o backend não estiver rodando"
echo "         (usando dados estáticos), mas para funcionalidade completa,"
echo "         inicie o backend primeiro."
