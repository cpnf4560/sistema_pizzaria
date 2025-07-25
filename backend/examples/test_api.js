#!/usr/bin/env node

/**
 * Script de exemplo para testar a API da Pizzaria
 * Execute: node examples/test_api.js
 */

const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';
let authToken = '';

// Configurar axios para capturar erros
const api = axios.create({
  baseURL: API_BASE,
  timeout: 5000
});

api.interceptors.request.use(config => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

const log = (title, data) => {
  console.log(`\n🔹 ${title}`);
  console.log('─'.repeat(50));
  console.log(JSON.stringify(data, null, 2));
};

const logError = (title, error) => {
  console.log(`\n❌ ${title}`);
  console.log('─'.repeat(50));
  if (error.response) {
    console.log('Status:', error.response.status);
    console.log('Data:', JSON.stringify(error.response.data, null, 2));
  } else {
    console.log('Error:', error.message);
  }
};

async function testAPI() {
  console.log('🍕 Testando API da Pizzaria');
  console.log('=' .repeat(50));

  try {
    // 1. Health Check
    try {
      const health = await api.get('/health');
      log('Health Check', health.data);
    } catch (error) {
      logError('Health Check Failed', error);
      console.log('⚠️  Servidor não está rodando. Execute: npm run dev');
      return;
    }

    // 2. Listar pizzas (público)
    try {
      const pizzas = await api.get('/pizzas');
      log('Pizzas Disponíveis', pizzas.data);
    } catch (error) {
      logError('Erro ao listar pizzas', error);
    }

    // 3. Registrar usuário supervisor
    try {
      const registerData = {
        email: `admin-${Date.now()}@pizzaria.com`,
        password: 'Admin123!',
        nome: 'Administrador Teste',
        perfil: 'Supervisor'
      };

      const register = await api.post('/auth/register', registerData);
      log('Usuário Registrado', register.data);
      authToken = register.data.data.token;
    } catch (error) {
      logError('Erro no registro', error);
    }

    // 4. Login (alternativo)
    if (!authToken) {
      try {
        const login = await api.post('/auth/login', {
          email: 'admin@pizzaria.com',
          password: 'admin123'
        });
        log('Login Realizado', login.data);
        authToken = login.data.data.token;
      } catch (error) {
        logError('Erro no login', error);
      }
    }

    if (authToken) {
      // 5. Dados do usuário
      try {
        const me = await api.get('/auth/me');
        log('Meus Dados', me.data);
      } catch (error) {
        logError('Erro ao obter dados do usuário', error);
      }

      // 6. Criar pizza (supervisor)
      try {
        const novaPizza = {
          nome: 'Pizza Teste API',
          descricao: 'Pizza criada via API de teste',
          preco_pequena: 9.99,
          preco_media: 13.99,
          preco_grande: 17.99
        };

        const pizza = await api.post('/pizzas', novaPizza);
        log('Pizza Criada', pizza.data);
      } catch (error) {
        logError('Erro ao criar pizza', error);
      }

      // 7. Criar cliente
      try {
        const novoCliente = {
          nome: 'Cliente Teste API',
          morada: 'Rua de Teste, 123',
          telefone: '+351 912 345 678',
          email: `cliente-${Date.now()}@test.com`
        };

        const cliente = await api.post('/clientes', novoCliente);
        log('Cliente Criado', cliente.data);

        // 8. Criar encomenda
        if (cliente.data.data && cliente.data.data.id) {
          try {
            const novaEncomenda = {
              cliente_id: cliente.data.data.id,
              tipo_entrega: 'Entrega',
              observacoes: 'Encomenda de teste via API',
              pizzas: [
                {
                  pizza_id: 1, // Assumindo que existe uma pizza com ID 1
                  tamanho: 'Média'
                }
              ]
            };

            const encomenda = await api.post('/encomendas', novaEncomenda);
            log('Encomenda Criada', encomenda.data);
          } catch (error) {
            logError('Erro ao criar encomenda', error);
          }
        }
      } catch (error) {
        logError('Erro ao criar cliente', error);
      }

      // 9. Listar usuários (supervisor)
      try {
        const users = await api.get('/users');
        log('Lista de Usuários', users.data);
      } catch (error) {
        logError('Erro ao listar usuários', error);
      }

      // 10. Estatísticas
      try {
        const stats = await api.get('/users/stats');
        log('Estatísticas de Usuários', stats.data);
      } catch (error) {
        logError('Erro ao obter estatísticas', error);
      }
    }

    console.log('\n✅ Testes concluídos!');
    console.log('📚 Consulte API_DOCS.md para mais informações');

  } catch (error) {
    console.error('\n❌ Erro geral:', error.message);
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  testAPI().catch(console.error);
}

module.exports = { testAPI };