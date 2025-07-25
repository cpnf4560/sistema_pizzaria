# 🍕 Guia de Instalação - Pizzaria Frontend + Backend

## ⚠️ Pré-requisitos

### 1. Instalar Node.js e npm

#### Ubuntu/Debian:
```bash
# Atualizar repositórios
sudo apt update

# Instalar Node.js e npm
sudo apt install nodejs npm

# Verificar instalação
node --version
npm --version
```

#### CentOS/RHEL/Rocky:
```bash
sudo yum install nodejs npm
# ou
sudo dnf install nodejs npm
```

#### Arch Linux:
```bash
sudo pacman -S nodejs npm
```

#### Manual (qualquer distribuição):
```bash
# Baixar e instalar Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Verificar MySQL
```bash
# Verificar se MySQL está rodando
sudo systemctl status mysql
# ou
sudo service mysql status

# Se não estiver rodando
sudo systemctl start mysql
```

## 🚀 Setup Passo a Passo

### 1. Preparar Backend
```bash
cd /home/carloscorreia/NetBeansProjects/Pizzaria/backend

# Instalar dependências
npm install

# Verificar se o .env existe (já foi criado)
ls -la .env

# Testar conexão com a base de dados
npm test
```

### 2. Configurar Base de Dados
```bash
# Conectar ao MySQL
mysql -h localhost -P 3307 -u root -p

# Criar base de dados se não existir
CREATE DATABASE IF NOT EXISTS pizzaria;

# Sair do MySQL
exit

# Executar migração
mysql -h localhost -P 3307 -u root -p pizzaria < database_migration.sql
```

### 3. Iniciar Backend
```bash
cd /home/carloscorreia/NetBeansProjects/Pizzaria/backend

# Modo desenvolvimento (com auto-reload)
npm run dev

# ou modo produção
npm start
```

### 4. Testar Frontend
```bash
# Navegar para o frontend
cd /home/carloscorreia/NetBeansProjects/Pizzaria/src/frontend

# Opção 1: Servidor Python (se Python estiver instalado)
python3 -m http.server 8080

# Opção 2: Servidor Node.js simples
npx http-server -p 8080

# Opção 3: Abrir diretamente no navegador
firefox index.html
# ou
google-chrome index.html
```

## 🔗 URLs de Acesso

Após iniciar os serviços:

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **Teste da API**: http://localhost:3000/health

## 🧪 Testar Conexão

### 1. Testar Backend
```bash
# Verificar se API está funcionando
curl http://localhost:3000/health

# Listar pizzas
curl http://localhost:3000/api/pizzas
```

### 2. Testar Frontend
1. Abra http://localhost:8080 no navegador
2. Preencha o formulário de cliente
3. Adicione pizzas ao carrinho
4. Finalize a encomenda
5. Verifique no terminal do backend se aparecem logs da API

## 🐛 Problemas Comuns

### "npm: command not found"
```bash
# Instalar Node.js e npm
sudo apt install nodejs npm
```

### "Error: connect ECONNREFUSED"
```bash
# Verificar se MySQL está rodando
sudo systemctl status mysql

# Verificar porta do MySQL
sudo netstat -tlnp | grep :3307
```

### "CORS error no navegador"
- Certifique-se que o backend está rodando na porta 3000
- Use http://localhost:8080 (não file://) para acessar o frontend

### "Error: ER_BAD_DB_ERROR: Unknown database 'pizzaria'"
```bash
# Criar a base de dados
mysql -h localhost -P 3307 -u root -p -e "CREATE DATABASE pizzaria;"
```

## 📋 Checklist de Verificação

- [ ] Node.js instalado (`node --version`)
- [ ] npm instalado (`npm --version`)
- [ ] MySQL rodando na porta 3307
- [ ] Base de dados 'pizzaria' existe
- [ ] Backend rodando na porta 3000
- [ ] Frontend acessível via servidor local
- [ ] API responde em http://localhost:3000/health

## 🎯 Resultado Esperado

Quando tudo estiver funcionando:

1. **Backend logs** mostrarão:
   ```
   🍕 Servidor da Pizzaria rodando na porta 3000
   ✅ Conectado à base de dados MySQL
   ```

2. **Frontend** carregará pizzas da API automaticamente

3. **Encomendas** serão guardadas na base de dados MySQL

4. **Console do navegador** não mostrará erros de CORS ou conexão
