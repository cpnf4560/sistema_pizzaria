# 🔧 Guia de Teste - Botão Finalizar Encomenda

## 🎯 Correções Aplicadas

### ✅ **Problemas Identificados e Corrigidos:**

1. **Compatibilidade de dados**: Código agora funciona com ambos os formatos (API e mock)
2. **Tratamento de erros**: Melhor logging e fallbacks
3. **Validação de cliente**: ID do cliente agora é garantido
4. **Logs de debug**: Console logs para identificar problemas

## 🧪 **Como Testar Agora**

### 1. **Abrir Consola do Navegador**
- Pressione `F12` no navegador
- Vá para a aba "Console"
- Mantenha aberta para ver os logs

### 2. **Testar o Fluxo Completo**
```
1. Aceder: http://localhost:8080
2. Preencher dados do cliente:
   - Nome: João Silva
   - Morada: Rua das Flores, 123
   - Telefone: +351 912345678
   - Email: joao@exemplo.com
3. Clicar "Avançar para o Menu"
4. Adicionar pizzas ao carrinho (clicar nos botões P/M/G)
5. Verificar se carrinho atualiza
6. Clicar "Finalizar encomenda"
```

### 3. **Verificar Logs no Console**
Deve aparecer:
```
✅ Configurando event listener para form-encomenda
✅ Pizzas carregadas: [quantidade] encontradas
✅ Salvando cliente: [dados]
✅ Cliente salvo: [dados com ID]
✅ Formulário de encomenda submetido!
✅ Carrinho: [itens]
✅ Cliente: [dados]
✅ Dados da encomenda: [dados completos]
✅ Encomenda criada com sucesso: [resposta]
```

## 🐛 **Se Ainda Não Funcionar**

### Verificar se:
1. **Ambos os serviços estão rodando:**
   - Backend: http://localhost:3000/health
   - Frontend: http://localhost:8080

2. **Há erros no console:**
   - Abrir F12 → Console
   - Procurar mensagens em vermelho

3. **Elementos DOM existem:**
   - Aceder: http://localhost:8080/debug.html
   - Verificar se todos elementos estão ✅

## 🔄 **Reiniciar se Necessário**

```bash
# Parar serviços (Ctrl+C nos terminais)

# Reiniciar backend
cd /home/carloscorreia/NetBeansProjects/Pizzaria/backend
npm run dev

# Reiniciar frontend (novo terminal)
cd /home/carloscorreia/NetBeansProjects/Pizzaria
python3 servidor_frontend.py
```

## 📋 **Teste de Validação**

✅ **Sucesso quando:**
- Console mostra "Formulário de encomenda submetido!"
- Dados são enviados para API (ou simulados)
- Página muda para "Encomenda registada!"
- Não há erros vermelhos no console

❌ **Problema se:**
- Nada acontece ao clicar "Finalizar"
- Console mostra erros vermelhos
- Página não muda de estado

## 💡 **Próximos Passos**

Se tudo funcionar:
1. **Verificar na base de dados:**
   ```bash
   mysql -h localhost -P 3307 -u root -p -e "USE pizzaria; SELECT * FROM encomendas ORDER BY id DESC LIMIT 3;"
   ```

2. **Testar diferentes cenários:**
   - Carrinho vazio
   - Entrega ao domicílio
   - Diferentes pizzas e tamanhos

## 🎉 **Status Esperado**

O botão "Finalizar encomenda" deve agora:
- Responder ao clique
- Validar dados
- Enviar para API
- Mostrar confirmação
- Guardar na base de dados (se backend funcionar)
