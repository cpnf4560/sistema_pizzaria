# Backend Node.js para PizzariaJava

Backend completo em Node.js/Express para o sistema de pizzaria com autenticação JWT e diferentes perfis de usuário.

## 🚀 Funcionalidades

### Sistema de Autenticação
- ✅ Registro e login de usuários
- ✅ JWT tokens para autenticação
- ✅ Middleware de autorização por perfil
- ✅ Hash seguro de senhas com bcrypt
- ✅ Rate limiting para segurança

### Perfis de Usuário
- **Cliente**: Pode fazer pedidos e ver histórico próprio
- **Supervisor**: Acesso completo ao sistema, gestão de usuários

### APIs REST Disponíveis

#### Autenticação (`/api/auth`)
- `POST /register` - Registrar novo usuário
- `POST /login` - Fazer login
- `POST /logout` - Fazer logout
- `GET /me` - Obter dados do usuário logado
- `POST /refresh` - Renovar token

#### Pizzas (`/api/pizzas`)
- `GET /` - Listar todas as pizzas (público)
- `GET /:id` - Ver pizza específica (público)
- `POST /` - Criar pizza (apenas supervisores)
- `PUT /:id` - Atualizar pizza (apenas supervisores)
- `DELETE /:id` - Excluir pizza (apenas supervisores)

#### Clientes (`/api/clientes`)
- `GET /me` - Ver próprio perfil (clientes)
- `GET /` - Listar todos os clientes (supervisores)
- `GET /:id` - Ver cliente específico (supervisores)
- `POST /` - Criar cliente
- `PUT /:id` - Atualizar cliente
- `DELETE /:id` - Excluir cliente (supervisores)

#### Encomendas (`/api/encomendas`)
- `GET /me` - Ver próprias encomendas (clientes)
- `GET /` - Listar encomendas (filtrada por perfil)
- `GET /:id` - Ver encomenda específica
- `POST /` - Criar nova encomenda
- `PATCH /:id/status` - Atualizar status (supervisores)

#### Usuários (`/api/users`) - Apenas Supervisores
- `GET /` - Listar todos os usuários
- `GET /stats` - Estatísticas de usuários
- `GET /:id` - Ver usuário específico
- `PATCH /:id/status` - Ativar/desativar usuário
- `DELETE /:id` - "Excluir" usuário (desativa)

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 16+ 
- MySQL 5.7+
- npm ou yarn

### Passos de Instalação

1. **Instalar dependências**
```bash
cd backend
npm install
```

2. **Configurar banco de dados**
```bash
# Execute o script SQL no seu banco MySQL
mysql -u root -p pizzaria < database_migration.sql
```

3. **Configurar variáveis de ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. **Executar o servidor**
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

O servidor estará disponível em `http://localhost:3000`

## 🔧 Configuração

### Variáveis de Ambiente (.env)

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3307
DB_NAME=pizzaria
DB_USER=root
DB_PASSWORD=sua_senha

# JWT Configuration
JWT_SECRET=sua-chave-secreta-jwt
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080
```

## 📊 Estrutura do Banco de Dados

O backend integra com as tabelas existentes:
- `pizza` - Pizzas do menu
- `clientes` - Dados dos clientes
- `encomendas` - Pedidos realizados
- `encomenda_pizzas` - Relação pedido-pizza

E adiciona:
- `usuarios` - Sistema de autenticação

## 🔐 Segurança

- ✅ Hash de senhas com bcrypt (12 rounds)
- ✅ JWT tokens com expiração configurável
- ✅ Rate limiting (100 req/15min geral, 5 req/15min para auth)
- ✅ Helmet para headers de segurança
- ✅ CORS configurado
- ✅ Validação de entrada com express-validator
- ✅ Prepared statements para prevenir SQL injection

## 📚 Exemplos de Uso

### Registrar usuário
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@pizzaria.com",
    "password": "Admin123!",
    "nome": "Administrador",
    "perfil": "Supervisor"
  }'
```

### Fazer login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@pizzaria.com",
    "password": "Admin123!"
  }'
```

### Criar encomenda
```bash
curl -X POST http://localhost:3000/api/encomendas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "cliente_id": 1,
    "tipo_entrega": "Entrega",
    "observacoes": "Sem cebola",
    "pizzas": [
      {
        "pizza_id": 1,
        "tamanho": "Média"
      }
    ]
  }'
```

## 🧪 Testando a API

### Health Check
```bash
curl http://localhost:3000/health
```

### Listar pizzas (não requer autenticação)
```bash
curl http://localhost:3000/api/pizzas
```

## 📈 Monitoramento

- Health check endpoint: `/health`
- Logs detalhados de erros
- Rate limiting com feedback
- Tratamento gracioso de erros

## 🔄 Scripts Disponíveis

```bash
npm start          # Executar em produção
npm run dev        # Executar em desenvolvimento com nodemon
npm test           # Executar testes (quando implementados)
```

## 🎯 Status dos Requisitos

- ✅ Integração com MySQL existente
- ✅ Sistema de autenticação JWT
- ✅ Perfis Cliente e Supervisor
- ✅ APIs REST completas
- ✅ Middleware de autorização
- ✅ Segurança implementada
- ✅ Estrutura organizada
- ✅ Documentação completa

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.