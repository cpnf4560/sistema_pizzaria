# API Documentation - Pizzaria Backend

## Autenticação

### Registrar Usuário
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "MinhaSenh@123",
  "nome": "Nome do Usuário",
  "perfil": "Cliente" // ou "Supervisor"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Usuário registrado com sucesso",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "nome": "Nome do Usuário",
      "perfil": "Cliente",
      "ativo": true
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Fazer Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "MinhaSenh@123"
}
```

### Obter Dados do Usuário
```http
GET /api/auth/me
Authorization: Bearer {token}
```

## Pizzas

### Listar Pizzas (Público)
```http
GET /api/pizzas
```

### Criar Pizza (Supervisor apenas)
```http
POST /api/pizzas
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Pizza Margherita",
  "descricao": "Molho de tomate, mozzarella e manjericão",
  "preco_pequena": 8.50,
  "preco_media": 12.00,
  "preco_grande": 15.50
}
```

## Clientes

### Ver Próprio Perfil (Cliente)
```http
GET /api/clientes/me
Authorization: Bearer {token}
```

### Listar Clientes (Supervisor)
```http
GET /api/clientes
Authorization: Bearer {token}
```

### Criar Cliente
```http
POST /api/clientes
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "João Silva",
  "morada": "Rua das Flores, 123",
  "telefone": "+351 912 345 678",
  "email": "joao@example.com"
}
```

## Encomendas

### Criar Encomenda
```http
POST /api/encomendas
Authorization: Bearer {token}
Content-Type: application/json

{
  "cliente_id": 1,
  "tipo_entrega": "Entrega", // ou "Takeaway"
  "observacoes": "Sem cebola na pizza",
  "pizzas": [
    {
      "pizza_id": 1,
      "tamanho": "Média"
    },
    {
      "pizza_id": 2,
      "tamanho": "Grande"
    }
  ]
}
```

### Listar Encomendas
```http
GET /api/encomendas?status=Pendente&data_inicio=2024-01-01&data_fim=2024-12-31
Authorization: Bearer {token}
```

### Atualizar Status (Supervisor)
```http
PATCH /api/encomendas/1/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "Preparando" // Pendente, Preparando, Pronto, Entregue, Cancelado
}
```

## Usuários (Supervisor apenas)

### Listar Usuários
```http
GET /api/users
Authorization: Bearer {token}
```

### Estatísticas
```http
GET /api/users/stats
Authorization: Bearer {token}
```

### Atualizar Status do Usuário
```http
PATCH /api/users/1/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "ativo": false
}
```

## Códigos de Status HTTP

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Dados inválidos
- `401` - Não autenticado
- `403` - Sem permissão
- `404` - Não encontrado
- `429` - Muitas tentativas (rate limit)
- `500` - Erro interno do servidor

## Filtros e Parâmetros

### Encomendas
- `status` - Filtrar por status
- `cliente_id` - Filtrar por cliente (supervisor)
- `data_inicio` - Data inicial (YYYY-MM-DD)
- `data_fim` - Data final (YYYY-MM-DD)

## Estrutura de Resposta Padrão

```json
{
  "success": true|false,
  "message": "Mensagem descritiva",
  "data": {}, // Dados da resposta (quando success: true)
  "errors": [] // Erros de validação (quando success: false)
}
```