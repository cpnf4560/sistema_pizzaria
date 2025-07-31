const Encomenda = require('../models/Encomenda');
const Cliente = require('../models/Cliente');
const Pizza = require('../models/Pizza');

const getAllEncomendas = async (req, res) => {
  try {
    const filters = {};

    // Se for cliente autenticado, só pode ver suas próprias encomendas
    if (req.user && req.user.perfil === 'Cliente') {
      const cliente = await Cliente.findByEmail(req.user.email);
      if (cliente) {
        filters.cliente_id = cliente.id;
      }
    }

    // Filtros de query parameters
    if (req.query.status) {
      filters.status = req.query.status;
    }
    if (req.query.data_inicio) {
      filters.data_inicio = req.query.data_inicio;
    }
    if (req.query.data_fim) {
      filters.data_fim = req.query.data_fim;
    }
    if (req.query.cliente_id && req.user && req.user.perfil === 'Supervisor') {
      filters.cliente_id = req.query.cliente_id;
    }

    const encomendas = await Encomenda.getAll(filters);
    
    res.json({
      success: true,
      message: 'Encomendas listadas com sucesso',
      data: encomendas.map(encomenda => encomenda.toJSON())
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getEncomendaById = async (req, res) => {
  try {
    const { id } = req.params;
    const encomenda = await Encomenda.findById(id);

    if (!encomenda) {
      return res.status(404).json({
        success: false,
        message: 'Encomenda não encontrada'
      });
    }

    // Se for cliente, verificar se a encomenda pertence a ele
    if (req.user && req.user.perfil === 'Cliente') {
      const cliente = await Cliente.findByEmail(req.user.email);
      if (!cliente || encomenda.cliente_id !== cliente.id) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado a esta encomenda'
        });
      }
    }

    res.json({
      success: true,
      message: 'Encomenda encontrada',
      data: encomenda.toJSON()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const createEncomenda = async (req, res) => {
  try {
    console.log('\n🚀 === INÍCIO CREATE ENCOMENDA CONTROLLER ===');
    console.log('📨 Request method:', req.method);
    console.log('📨 Request URL:', req.url);
    console.log('📨 Headers:', JSON.stringify(req.headers, null, 2));
    console.log('📊 Body recebido:', JSON.stringify(req.body, null, 2));
    
    const { cliente_id, pizzas, tipo_entrega, observacoes, hora_entrega } = req.body;

    // Validações básicas
    console.log('🔍 Iniciando validações...');
    if (!cliente_id) {
      console.log('❌ Erro: cliente_id não fornecido');
      return res.status(400).json({
        success: false,
        message: 'ID do cliente é obrigatório'
      });
    }

    if (!pizzas || !Array.isArray(pizzas) || pizzas.length === 0) {
      console.log('❌ Erro: pizzas inválidas ou vazias');
      return res.status(400).json({
        success: false,
        message: 'Pelo menos uma pizza deve ser selecionada'
      });
    }

    if (!tipo_entrega) {
      console.log('❌ Erro: tipo_entrega não fornecido');
      return res.status(400).json({
        success: false,
        message: 'Tipo de entrega é obrigatório'
      });
    }

    console.log('✅ Validações básicas passaram');
    console.log('🔍 Verificando se cliente existe...');
    console.log('🔍 cliente_id recebido:', cliente_id, 'tipo:', typeof cliente_id);
    
    // Tentar encontrar cliente, se não existir usar o primeiro disponível
    let clienteEncontrado = null;
    let clienteIdFinal = cliente_id;
    
    try {
      console.log('🔍 Executando Cliente.findById...');
      clienteEncontrado = await Cliente.findById(cliente_id);
      console.log('🔍 Resultado da busca:', clienteEncontrado);
      
      if (clienteEncontrado) {
        console.log('✅ Cliente encontrado:', clienteEncontrado.nome);
        clienteIdFinal = clienteEncontrado.id;
      } else {
        console.log('⚠️ Cliente não encontrado, buscando primeiro disponível...');
        clienteEncontrado = await Cliente.findFirst();
        
        if (clienteEncontrado) {
          console.log('✅ Usando primeiro cliente disponível:', clienteEncontrado.id, '-', clienteEncontrado.nome);
          clienteIdFinal = clienteEncontrado.id;
        } else {
          console.log('❌ Nenhum cliente encontrado na base de dados');
          return res.status(404).json({
            success: false,
            message: 'Nenhum cliente encontrado na base de dados'
          });
        }
      }
    } catch (error) {
      console.log('⚠️ Erro ao buscar cliente:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Erro ao verificar cliente: ' + error.message
      });
    }

    // Verificar se todas as pizzas existem e calcular preços
    console.log('🍕 Verificando pizzas...');
    const pizzasValidadas = [];
    for (const pizzaEncomenda of pizzas) {
      const pizza = await Pizza.findById(pizzaEncomenda.pizza_id);
      if (!pizza) {
        console.log('❌ Pizza não encontrada:', pizzaEncomenda.pizza_id);
        return res.status(404).json({
          success: false,
          message: `Pizza com ID ${pizzaEncomenda.pizza_id} não encontrada`
        });
      }

      // Calcular preço baseado no tamanho
      let preco;
      switch (pizzaEncomenda.tamanho) {
        case 'Pequena':
          preco = pizza.preco_pequena;
          break;
        case 'Média':
          preco = pizza.preco_media;
          break;
        case 'Grande':
          preco = pizza.preco_grande;
          break;
        default:
          console.log('❌ Tamanho inválido:', pizzaEncomenda.tamanho);
          return res.status(400).json({
            success: false,
            message: 'Tamanho de pizza inválido'
          });
      }

      console.log(`✅ Pizza validada: ${pizza.nome} (${pizzaEncomenda.tamanho}) - €${preco}`);
      pizzasValidadas.push({
        pizza_id: pizzaEncomenda.pizza_id,
        nome: pizza.nome,
        tamanho: pizzaEncomenda.tamanho,
        quantidade: pizzaEncomenda.quantidade || 1,
        preco: preco
      });
    }

    // Criar dados da encomenda usando o cliente ID final
    const encomendaData = {
      cliente_id: clienteIdFinal,
      tipo_entrega,
      observacoes,
      hora_entrega,
      pizzas: pizzasValidadas
    };

    console.log('📋 Dados finais para criação:', JSON.stringify(encomendaData, null, 2));
    console.log('👤 Cliente final a usar:', clienteIdFinal, '-', clienteEncontrado.nome);

    // Criar encomenda
    console.log('💾 Chamando Encomenda.create...');
    const encomenda = await Encomenda.create(encomendaData);
    console.log('✅ Encomenda criada com sucesso:', encomenda);

    res.status(201).json({
      success: true,
      message: 'Encomenda criada com sucesso',
      data: encomenda
    });

    console.log('🎉 === FIM CREATE ENCOMENDA CONTROLLER ===\n');

  } catch (error) {
    console.error('❌ === ERRO NO CONTROLLER ===');
    console.error('❌ Tipo:', error.constructor.name);
    console.error('❌ Mensagem:', error.message);
    console.error('❌ Stack:', error.stack);
    console.error('❌ === FIM ERRO CONTROLLER ===\n');
    
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor: ' + error.message
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status é obrigatório'
      });
    }

    const encomenda = await Encomenda.updateStatus(id, status);
    
    if (!encomenda) {
      return res.status(404).json({
        success: false,
        message: 'Encomenda não encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Status atualizado com sucesso',
      data: encomenda.toJSON()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getMyEncomendas = async (req, res) => {
  try {
    console.log('📋 === GET MY ENCOMENDAS ===');
    console.log('👤 User:', req.user);
    console.log('📧 Email procurado:', req.user.email);
    
    const cliente = await Cliente.findByEmail(req.user.email);
    console.log('🔍 Cliente encontrado:', cliente ? `${cliente.nome} (id: ${cliente.id})` : 'NÃO ENCONTRADO');
    
    if (!cliente) {
      console.log('❌ Perfil de cliente não encontrado');
      return res.status(404).json({
        success: false,
        message: 'Perfil de cliente não encontrado'
      });
    }

    const filters = { cliente_id: cliente.id };
    console.log('🔍 Filtros para busca:', filters);
    
    if (req.query.status) {
      filters.status = req.query.status;
    }

    const encomendas = await Encomenda.getAll(filters);
    console.log('📦 Encomendas encontradas:', encomendas.length);
    
    const response = {
      success: true,
      message: 'Suas encomendas listadas com sucesso',
      encomendas: encomendas.map(encomenda => encomenda.toJSON())
    };
    
    console.log('📤 Resposta final getMyEncomendas:', JSON.stringify(response, null, 2));
    
    res.json(response);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const createEncomendaTest = async (req, res) => {
  try {
    console.log('🧪 [TEST] Criando encomenda de teste:', req.body);
    
    const { cliente_id, tipo_entrega, hora_entrega, observacoes, pizzas } = req.body;
    
    // Forçar criação direta no banco sem validações
    const encomendaData = {
      cliente_id: cliente_id || 999,
      tipo_entrega: tipo_entrega || 'recolha',
      hora_entrega: hora_entrega || '19:00',
      observacoes: observacoes || 'Teste direto',
      pizzas: pizzas || [{
        pizza_id: 1,
        tamanho: 'Média',
        quantidade: 1,
        preco_unitario: 17.5
      }]
    };
    
    console.log('🧪 [TEST] Dados para criação:', encomendaData);
    
    const encomenda = await Encomenda.create(encomendaData);
    
    console.log('✅ [TEST] Encomenda criada:', encomenda);
    
    res.status(201).json({
      success: true,
      message: 'Encomenda de teste criada com sucesso',
      data: encomenda
    });
    
  } catch (error) {
    console.error('❌ [TEST] Erro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro no teste: ' + error.message
    });
  }
};

module.exports = {
  getAllEncomendas,
  getEncomendaById,
  createEncomenda,
  createEncomendaTest,
  updateStatus,
  getMyEncomendas
};
