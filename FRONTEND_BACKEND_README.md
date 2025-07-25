# 🍕 Pizzaria Java - Frontend + Backend

Sistema completo de pizzaria com frontend HTML/JavaScript e backend Node.js conectado à base de dados MySQL.

## 🏗️ Arquitetura

```
Pizzaria/
├── src/frontend/          # Frontend HTML/CSS/JS
│   ├── index.html        # Interface principal
│   └── app.js           # JavaScript conectado à API
├── backend/             # Backend Node.js/Express
│   ├── src/            # Código fonte da API
│   ├── .env           # Configurações
│   └── package.json   # Dependências
├── build/             # Projeto Java compilado
└── src/pizzaria/      # Código Java original
```

## 🚀 Setup Rápido

### 1. Configuração Automática
```bash
chmod +x setup_completo.sh
./setup_completo.sh
```

### 2. Configuração Manual

#### Backend (Node.js)
```bash
cd backend
npm install
cp .env.example .env
# Edite o .env com suas configurações de BD
npm run dev
```

#### Base de Dados
1. Certifique-se que o MySQL está rodando na porta 3307
2. Crie a base de dados 'pizzaria' (ou use a existente do projeto Java)
3. Execute a migração:
```bash
mysql -h localhost -P 3307 -u root -p pizzaria < backend/database_migration.sql
```

#### Frontend
```bash
# Opção 1: Abrir diretamente no navegador
open src/frontend/index.html

# Opção 2: Servidor local Python
cd src/frontend
python -m http.server 8080
# Acesse: http://localhost:8080
```

## 🔗 Como Funciona a Conexão

### Frontend → Backend
O arquivo `src/frontend/app.js` substitui o JavaScript inline do HTML original e conecta-se ao backend através de:

1. **Carregamento de Pizzas**: `GET /api/pizzas`
2. **Gestão de Clientes**: `POST /api/clientes`
3. **Criação de Encomendas**: `POST /api/encomendas`

### APIs Disponíveis

#### Pizzas (Público)
- `GET /api/pizzas` - Listar todas as pizzas
- `GET /api/pizzas/:id` - Ver pizza específica

#### Clientes
- `POST /api/clientes` - Criar cliente
- `GET /api/clientes/me` - Ver próprio perfil (logado)

#### Encomendas
- `POST /api/encomendas` - Criar nova encomenda
- `GET /api/encomendas` - Listar encomendas

#### Autenticação (Opcional)
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/auth/me` - Dados do usuário

## 🎯 Fluxo da Aplicação

1. **Cliente acede ao site** → `src/frontend/index.html`
2. **JavaScript carrega pizzas** → `app.js` faz `GET /api/pizzas`
3. **Cliente preenche dados** → Guarda em `localStorage` e envia `POST /api/clientes`
4. **Cliente escolhe pizzas** → Adiciona ao carrinho local
5. **Cliente finaliza encomenda** → `POST /api/encomendas` com dados completos
6. **Confirmação** → Encomenda guardada na BD

## 📱 Funcionalidades

### Frontend (HTML/JS)
- ✅ Interface responsiva
- ✅ Validação de formulários
- ✅ Carrinho de compras dinâmico
- ✅ Formatação automática de telefone
- ✅ Cálculo automático de preços
- ✅ Conexão com API backend

### Backend (Node.js)
- ✅ API REST completa
- ✅ Autenticação JWT (opcional)
- ✅ Validação de dados
- ✅ Conexão MySQL
- ✅ Sistema de logs
- ✅ Rate limiting para segurança

### Base de Dados
- ✅ Compatível com esquema Java existente
- ✅ Tabelas: pizzas, clientes, encomendas, encomenda_pizzas
- ✅ Sistema de usuários para administração

## 🔧 Configuração Detalhada

### Variáveis de Ambiente (.env)
```bash
# Base de Dados
DB_HOST=localhost
DB_PORT=3307
DB_NAME=pizzaria
DB_USER=root
DB_PASSWORD=sua_senha

# Servidor
PORT=3000
NODE_ENV=development

# CORS (Frontend URLs permitidas)
ALLOWED_ORIGINS=http://localhost:8080,http://127.0.0.1:8080
```

### Estrutura da Base de Dados
O backend utiliza as mesmas tabelas do projeto Java:
- `pizza` - Catálogo de pizzas
- `clientes` - Dados dos clientes
- `encomendas` - Pedidos realizados
- `encomenda_pizzas` - Itens de cada pedido
- `usuarios` - Sistema de autenticação (novo)

## 🧪 Testes

### Testar Backend
```bash
cd backend
npm test
# ou
node examples/test_api.js
```

### Testar Frontend
1. Abra `src/frontend/index.html` no navegador
2. Preencha o formulário de cliente
3. Adicione pizzas ao carrinho
4. Finalize a encomenda
5. Verifique na BD se os dados foram guardados

## 🐛 Resolução de Problemas

### "Não foi possível conectar ao servidor"
- Verifique se o backend está rodando: `cd backend && npm run dev`
- Confirme a porta 3000 está livre
- Verifique as configurações CORS no .env

### "Erro de base de dados"
- Confirme que o MySQL está rodando na porta 3307
- Verifique credenciais no arquivo .env
- Execute a migração: `mysql ... < database_migration.sql`

### "CORS error"
- Adicione a URL do frontend em ALLOWED_ORIGINS no .env
- Reinicie o backend após alterar .env

## 📊 URLs de Acesso

- **Frontend**: http://localhost:8080/src/frontend/
- **API Backend**: http://localhost:3000
- **Documentação API**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health

## 🔐 Credenciais Padrão

**Administrador**:
- Email: admin@pizzaria.com
- Senha: admin123

## 📝 Notas Importantes

1. **Compatibilidade**: O frontend funciona independentemente do backend (com dados estáticos)
2. **Segurança**: Em produção, altere JWT_SECRET e use HTTPS
3. **Performance**: O backend inclui rate limiting e validações
4. **Logs**: Todos os pedidos são registados na base de dados
