# 🍕 Pizzaria do Carlos - Configuração Separada

## ✅ Configuração Correta Aplicada

Revertido para a convenção padrão de desenvolvimento:

### 🌐 URLs de Acesso

- **🔧 Backend (API)**: http://localhost:3000
- **🎨 Frontend**: http://localhost:8080

### 🔗 Separação de Responsabilidades

**Backend (Porta 3000):**
- API REST completa
- Autenticação JWT
- Gestão de base de dados
- Endpoints: `/api/auth`, `/api/pizzas`, `/api/encomendas`, etc.

**Frontend (Porta 8080):**
- Interface de utilizador
- Páginas HTML/CSS/JavaScript
- Comunicação com API via AJAX/Fetch

### 🚀 Como Usar

1. **Iniciar Backend:**
   ```bash
   cd backend
   node src/app.js
   ```
   ➜ Disponível em http://localhost:3000

2. **Iniciar Frontend:**
   ```bash
   cd src/frontend
   python3 -m http.server 8080
   ```
   ➜ Disponível em http://localhost:8080

### ✅ Vantagens desta Configuração

1. **Separação clara**: Frontend e Backend independentes
2. **Desenvolvimento flexível**: Pode desenvolver cada parte separadamente
3. **Convenção padrão**: Portas 3000 (backend) e 8080 (frontend)
4. **Fácil debug**: Logs separados para cada serviço
5. **Deploy independente**: Pode fazer deploy de cada parte em servidores diferentes

### 🎯 Status Atual

- ✅ Backend rodando na porta 3000
- ✅ Frontend rodando na porta 8080
- ✅ CORS configurado entre ambas as portas
- ✅ Aplicação totalmente funcional

### 📋 Teste Rápido

- Backend: http://localhost:3000 (deve mostrar info da API)
- Frontend: http://localhost:8080 (deve mostrar a aplicação da pizzaria)

## 🔄 Comparação

| Aspecto | Integrado (3000) | Separado (3000+8080) |
|---------|------------------|---------------------|
| Simplicidade | ✅ Mais simples | ⚪ Requer 2 comandos |
| Desenvolvimento | ⚪ Menos flexível | ✅ Mais flexível |
| Debug | ⚪ Logs misturados | ✅ Logs separados |
| Deploy | ✅ Um só servidor | ⚪ Dois servidores |
| Convenção | ⚪ Não padrão | ✅ Padrão industria |

**Escolha atual: Separado (Convenção Padrão)** ✅
