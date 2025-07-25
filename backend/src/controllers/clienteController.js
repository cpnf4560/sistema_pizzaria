const Cliente = require('../models/Cliente');

const getAllClientes = async (req, res) => {
  try {
    const clientes = await Cliente.getAll();
    
    res.json({
      success: true,
      message: 'Clientes listados com sucesso',
      data: clientes.map(cliente => cliente.toJSON())
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getClienteById = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findById(id);

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Cliente encontrado',
      data: cliente.toJSON()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const createCliente = async (req, res) => {
  try {
    console.log('📝 Criando cliente:', req.body);
    const cliente = await Cliente.create(req.body);
    console.log('✅ Cliente criado:', cliente);

    res.status(201).json({
      success: true,
      message: 'Cliente criado com sucesso',
      data: cliente.toJSON()
    });

  } catch (error) {
    console.error('❌ Erro ao criar cliente:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se o usuário pode atualizar este cliente
    if (req.user.perfil === 'Cliente') {
      const clienteExistente = await Cliente.findByEmail(req.user.email);
      if (!clienteExistente || clienteExistente.id !== parseInt(id)) {
        return res.status(403).json({
          success: false,
          message: 'Não é possível atualizar dados de outro cliente'
        });
      }
    }

    const existingCliente = await Cliente.findById(id);
    if (!existingCliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente não encontrado'
      });
    }

    const cliente = await Cliente.update(id, req.body);

    res.json({
      success: true,
      message: 'Cliente atualizado com sucesso',
      data: cliente.toJSON()
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const deleteCliente = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingCliente = await Cliente.findById(id);
    if (!existingCliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente não encontrado'
      });
    }

    const deleted = await Cliente.delete(id);
    
    if (!deleted) {
      return res.status(400).json({
        success: false,
        message: 'Não foi possível excluir o cliente'
      });
    }

    res.json({
      success: true,
      message: 'Cliente excluído com sucesso'
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getMyProfile = async (req, res) => {
  try {
    const cliente = await Cliente.findByEmail(req.user.email);
    
    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Perfil de cliente não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Perfil encontrado',
      data: cliente.toJSON()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
  getMyProfile
};