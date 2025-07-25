# 🍕 Pizzaria - Conexão HTML ↔ Base de Dados SQL

## ✅ O Que Foi Implementado

### 1. **Frontend Modernizado**
- ✅ `src/frontend/app.js` - JavaScript modular que conecta à API
- ✅ `src/frontend/index.html` - HTML atualizado para usar app.js
- ✅ Gestão de estado do carrinho e cliente
- ✅ Validação de formulários
- ✅ Interface responsiva

### 2. **Backend API Completo**
- ✅ `backend/` - API Node.js/Express completa
- ✅ Conexão MySQL com as tabelas existentes
- ✅ Endpoints REST para pizzas, clientes, encomendas
- ✅ Sistema de autenticação JWT (opcional)
- ✅ Validação de dados e segurança

### 3. **Scripts de Configuração**
- ✅ `setup_completo.sh` - Setup automático completo
- ✅ `demo_frontend.sh` - Demo rápida do frontend
- ✅ `servidor_frontend.py` - Servidor Python alternativo
- ✅ `GUIA_INSTALACAO.md` - Guia detalhado

## 🔗 Como a Conexão Funciona

```
[Frontend HTML/JS] ↔ [API REST Node.js] ↔ [MySQL Database]
```

### Fluxo de Dados:

1. **Carregar Pizzas**: 
   - `app.js` → `GET /api/pizzas` → MySQL `pizza` table

2. **Registrar Cliente**: 
   - Formulário → `POST /api/clientes` → MySQL `clientes` table

3. **Criar Encomenda**: 
   - Carrinho → `POST /api/encomendas` → MySQL `encomendas` + `encomenda_pizzas` tables

## 🚀 Como Executar

### Opção 1: Completo (Frontend + Backend + BD)
```bash
# 1. Instalar Node.js (se necessário)
sudo apt install nodejs npm

# 2. Setup automático
./setup_completo.sh

# 3. Iniciar backend
cd backend && npm run dev

# 4. Iniciar frontend
python3 servidor_frontend.py

# 5. Aceder: http://localhost:8080
```

### Opção 2: Apenas Frontend (Demo)
```bash
# Frontend funciona independentemente com dados mock
./demo_frontend.sh

# Ou manualmente:
cd src/frontend
python3 -m http.server 8080
```

### Opção 3: Integração com Java
O backend Node.js é compatível com o projeto Java existente:
- ✅ Usa as mesmas tabelas MySQL
- ✅ Mantém a estrutura de dados
- ✅ Pode coexistir com a aplicação Java

## 📊 Endpoints da API

### Pizzas (Público)
```
GET /api/pizzas           # Listar todas
GET /api/pizzas/:id       # Ver específica
```

### Clientes
```
POST /api/clientes        # Criar cliente
GET /api/clientes/me      # Ver próprio perfil
```

### Encomendas
```
POST /api/encomendas      # Criar encomenda
GET /api/encomendas       # Listar encomendas
GET /api/encomendas/:id   # Ver específica
```

### Autenticação (Opcional)
```
POST /api/auth/register   # Registrar
POST /api/auth/login      # Login
GET /api/auth/me          # Perfil
```

## 🗄️ Estrutura da Base de Dados

### Tabelas Existentes (Java)
- `pizza` - Catálogo de pizzas
- `clientes` - Dados dos clientes
- `encomendas` - Pedidos
- `encomenda_pizzas` - Itens dos pedidos

### Tabela Nova (Backend)
- `usuarios` - Sistema de autenticação

## 🎯 Funcionalidades Implementadas

### Frontend
- [x] Carregamento dinâmico de pizzas da API
- [x] Gestão de carrinho em tempo real
- [x] Validação de formulários
- [x] Cálculo automático de preços
- [x] Interface responsiva
- [x] Tratamento de erros
- [x] Fallback para dados estáticos

### Backend
- [x] API REST completa
- [x] Conexão MySQL
- [x] Validação de dados
- [x] Autenticação JWT
- [x] CORS configurado
- [x] Rate limiting
- [x] Logs de sistema
- [x] Testes automatizados

## 🔧 Configuração

### Arquivo .env (Backend)
```bash
DB_HOST=localhost
DB_PORT=3307
DB_NAME=pizzaria
DB_USER=root
DB_PASSWORD=rzq7xgq8
PORT=3000
JWT_SECRET=your-secret-key
```

### JavaScript (Frontend)
```javascript
// app.js conecta automaticamente ao backend
const API_BASE = 'http://localhost:3000/api';

// Carrega pizzas da API
async function loadPizzas() {
    const response = await apiCall('/pizzas');
    pizzas = response.data;
}
```

## 🧪 Testes

### Testar API
```bash
cd backend
npm test
# ou
node examples/test_api.js
```

### Testar Frontend
```bash
# Aceder a http://localhost:8080
# 1. Preencher dados do cliente
# 2. Adicionar pizzas ao carrinho
# 3. Finalizar encomenda
# 4. Verificar na BD se foi guardado
```

## 📝 Notas Importantes

1. **Compatibilidade**: Frontend funciona com ou sem backend
2. **Segurança**: Backend inclui validações e rate limiting  
3. **Escalabilidade**: API REST permite futuras expansões
4. **Manutenção**: Código modular e bem documentado

## 🎉 Resultado Final

- ✅ HTML conectado à base de dados SQL
- ✅ Interface moderna e responsiva  
- ✅ API REST profissional
- ✅ Sistema completo e funcional
- ✅ Fácil de expandir e manter

O sistema agora permite que clientes façam encomendas através da interface web, com todos os dados sendo guardados automaticamente na base de dados MySQL! 🍕
