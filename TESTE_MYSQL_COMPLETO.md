# 🧪 Teste Completo - Registar Cliente e Encomenda no MySQL

## 📋 Passo a Passo para Testar

### 1. **Verificar Serviços**
- ✅ Backend: http://localhost:3000/health
- ✅ Frontend: http://localhost:8080

### 2. **Teste via Frontend (Recomendado)**

1. **Abrir**: http://localhost:8080
2. **Abrir Console do Navegador** (F12 → Console)
3. **Preencher dados do cliente**:
   ```
   Nome: Ana Costa
   Morada: Avenida da Liberdade, 200, Lisboa
   Telefone: +351 911222333
   Email: ana.costa@exemplo.com
   ```
4. **Clicar "Avançar para o Menu"**
5. **Adicionar pizzas ao carrinho** (pelo menos 1)
6. **Clicar "Finalizar encomenda"**

### 3. **Verificar Logs**
No console do navegador, deve aparecer:
```
✅ Salvando cliente: [dados]
✅ Cliente salvo: [dados com ID]
✅ Criando encomenda: [dados]
✅ Encomenda criada com sucesso: [dados]
```

### 4. **Verificar na Base de Dados**

```bash
# Ver clientes mais recentes
sudo mysql -h localhost -P 3307 -u root -p -e "
USE pizzaria; 
SELECT id, nome, email, created_at 
FROM clientes 
ORDER BY id DESC 
LIMIT 5;"

# Ver encomendas mais recentes  
sudo mysql -h localhost -P 3307 -u root -p -e "
USE pizzaria; 
SELECT e.id, c.nome, e.total, e.status, e.created_at 
FROM encomendas e 
JOIN clientes c ON e.cliente_id = c.id 
ORDER BY e.id DESC 
LIMIT 5;"
```

## 🔧 Teste Direto via API

### Criar Cliente
```bash
curl -X POST http://localhost:3000/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Pedro Santos",
    "email": "pedro@teste.com", 
    "telefone": "+351 933444555",
    "morada": "Rua do Ouro, 150, Porto"
  }'
```

### Criar Encomenda (usar ID do cliente criado)
```bash
curl -X POST http://localhost:3000/api/encomendas \
  -H "Content-Type: application/json" \
  -d '{
    "cliente_id": 23,
    "tipo_entrega": "recolha",
    "hora_entrega": "19:30",
    "observacoes": "Teste de API",
    "total": 15.50,
    "pizzas": [
      {
        "pizza_id": 1,
        "tamanho": "Média", 
        "quantidade": 1,
        "preco_unitario": 15.50
      }
    ]
  }'
```

## ✅ Resultado Esperado

Após teste completo:
- ✅ Cliente aparece na tabela `clientes`
- ✅ Encomenda aparece na tabela `encomendas`  
- ✅ Itens aparecem na tabela `encomenda_pizzas`
- ✅ Frontend mostra "Encomenda registada!"

## 🐛 Se Não Funcionar

1. **Verificar logs do backend** (terminal onde roda `npm run dev`)
2. **Verificar console do navegador** para erros
3. **Testar conexão MySQL**:
   ```bash
   sudo mysql -h localhost -P 3307 -u root -p -e "SELECT 1;"
   ```

## 🎯 Status Atual

Com as alterações feitas:
- ✅ Rotas de cliente e encomenda são públicas
- ✅ Frontend pode criar registos sem autenticação
- ✅ API responde com dados corretos
- ⚠️ Verificar se dados são persistidos no MySQL
