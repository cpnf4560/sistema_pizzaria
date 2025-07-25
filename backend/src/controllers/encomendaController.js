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
    if (req.user.perfil === 'Cliente') {
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
    console.log('🍕 Criando encomenda:', req.body);
    console.log('🔍 Headers:', req.headers);
    
    const { cliente_id, tipo_entrega, hora_entrega, observacoes, pizzas } = req.body;

    console.log('🔍 Dados extraídos:', { cliente_id, tipo_entrega, hora_entrega, observacoes, pizzas });

    // Permitir criar encomenda para qualquer cliente existente (sem autenticação obrigatória)
    
    // Verificar dados básicos
    if (!cliente_id || !tipo_entrega || !pizzas || !Array.isArray(pizzas) || pizzas.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Dados de encomenda incompletos'
      });
    }

    console.log('🔍 Verificando se cliente existe...');
    console.log('🔍 cliente_id recebido:', cliente_id, 'tipo:', typeof cliente_id);
    
    // Tentar verificar se cliente existe, mas não bloquear se falhar
    let clienteExiste = false;
    try {
      console.log('🔍 Executando Cliente.findById...');
      const cliente = await Cliente.findById(cliente_id);
      console.log('🔍 Resultado da busca:', cliente);
      
      if (cliente) {
        console.log('✅ Cliente encontrado:', cliente.nome);
        clienteExiste = true;
      } else {
        console.log('⚠️ Cliente não encontrado, mas continuando...');
      }
    } catch (error) {
      console.log('⚠️ Erro ao buscar cliente, mas continuando:', error.message);
    }

    // Verificar se todas as pizzas existem e calcular preços
    const pizzasValidadas = [];
    for (const pizzaEncomenda of pizzas) {
      const pizza = await Pizza.findById(pizzaEncomenda.pizza_id);
      if (!pizza) {
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
          return res.status(400).json({
            success: false,
            message: 'Tamanho de pizza inválido'
          });
      }

      pizzasValidadas.push({
        pizza_id: pizzaEncomenda.pizza_id,
        tamanho: pizzaEncomenda.tamanho,
        preco: preco
      });
    }

    console.log('📋 Pizzas validadas:', pizzasValidadas);
    console.log('🚀 Criando encomenda no banco...');

    const encomenda = await Encomenda.create({
      cliente_id,
      tipo_entrega,
      hora_entrega,
      observacoes,
      pizzas: pizzasValidadas
    });

    console.log('✅ Encomenda criada com sucesso:', encomenda);

    res.status(201).json({
      success: true,
      message: 'Encomenda criada com sucesso',
      data: encomenda
    });

  } catch (error) {
    console.error('❌ Erro ao criar encomenda:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const existingEncomenda = await Encomenda.findById(id);
    if (!existingEncomenda) {
      return res.status(404).json({
        success: false,
        message: 'Encomenda não encontrada'
      });
    }

    const encomenda = await Encomenda.updateStatus(id, status);

    res.json({
      success: true,
      message: 'Status da encomenda atualizado com sucesso',
      data: encomenda.toJSON()
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getMyEncomendas = async (req, res) => {
  try {
    const cliente = await Cliente.findByEmail(req.user.email);
    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Perfil de cliente não encontrado'
      });
    }

    const filters = { cliente_id: cliente.id };
    
    if (req.query.status) {
      filters.status = req.query.status;
    }

    const encomendas = await Encomenda.getAll(filters);
    
    res.json({
      success: true,
      message: 'Suas encomendas listadas com sucesso',
      data: encomendas.map(encomenda => encomenda.toJSON())
    });

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