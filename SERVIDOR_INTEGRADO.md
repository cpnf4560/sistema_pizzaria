# 🍕 Pizzaria do Carlos - Servidor Integrado

## 📋 Configuração Atual

O servidor backend agora serve tanto a API quanto o frontend numa única porta.

### 🌐 URLs de Acesso

- **Frontend Completo**: http://localhost:3000
- **Informações da API**: http://localhost:3000/api/
- **Arquivos Estáticos**: http://localhost:3000/static/

### 🔗 Endpoints da API

- **Autenticação**: http://localhost:3000/api/auth/
  - POST `/login` - Login de utilizador
  - POST `/register` - Registo de novo utilizador
  - GET `/me` - Dados do utilizador logado

- **Pizzas**: http://localhost:3000/api/pizzas/
  - GET `/` - Listar todas as pizzas

- **Clientes**: http://localhost:3000/api/clientes/
  - GET `/` - Listar clientes (admin)
  - POST `/` - Criar novo cliente

- **Encomendas**: http://localhost:3000/api/encomendas/
  - GET `/` - Listar encomendas (admin)
  - GET `/me` - Minhas encomendas (cliente)
  - POST `/` - Criar nova encomenda

- **Utilizadores**: http://localhost:3000/api/users/
  - GET `/` - Listar utilizadores (admin)

### ✅ Vantagens

1. **Uma só porta**: Tudo funciona em localhost:3000
2. **Mais simples**: Não precisa de servidor separado para frontend
3. **CORS automaticamente resolvido**: Frontend e API na mesma origem
4. **Fácil deploy**: Tudo num só servidor

### 🚀 Como usar

1. Inicie apenas o backend:
   ```bash
   cd backend
   node src/app.js
   ```

2. Acesse a aplicação:
   ```
   http://localhost:3000
   ```

3. A aplicação estará totalmente funcional!

### 📁 Estrutura de Arquivos

```
backend/src/app.js          # Servidor integrado
src/frontend/               # Arquivos do frontend
  ├── index.html           # Página principal
  ├── js/                  # JavaScript
  ├── css/                 # Estilos
  └── assets/              # Recursos
```

## 🎯 Status

✅ Frontend servido em localhost:3000
✅ API funcionando em localhost:3000/api/
✅ Autenticação operacional
✅ Histórico de encomendas funcionando
✅ Sistema completo integrado
