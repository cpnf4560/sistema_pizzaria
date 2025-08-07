const Utilizador = require('../models/User');

const getAllUsers = async (req, res) => {
  try {
    const utilizadores = await Utilizador.getAll();
    
    res.json({
      success: true,
      message: 'Usuários listados com sucesso',
      data: utilizadores.map(utilizador => utilizador.toJSON())
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const utilizador = await Utilizador.findById(id);

    if (!utilizador) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Usuário encontrado',
      data: utilizador.toJSON()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { ativo } = req.body;
    
    if (typeof ativo !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Status ativo deve ser true ou false'
      });
    }

    // Não permitir desativar o próprio usuário
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Não é possível alterar o status do próprio usuário'
      });
    }

    const existingUtilizador = await Utilizador.findById(id);
    if (!existingUtilizador) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const utilizador = await Utilizador.updateStatus(id, ativo);

    res.json({
      success: true,
      message: `Usuário ${ativo ? 'ativado' : 'desativado'} com sucesso`,
      data: utilizador.toJSON()
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Não permitir excluir o próprio usuário
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Não é possível excluir o próprio usuário'
      });
    }

    const existingUtilizador = await Utilizador.findById(id);
    if (!existingUtilizador) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Ao invés de excluir, desativar o usuário
    await Utilizador.updateStatus(id, false);

    res.json({
      success: true,
      message: 'Usuário desativado com sucesso'
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getUserStats = async (req, res) => {
  try {
    const utilizadores = await Utilizador.getAll();
    
    const stats = {
      total: utilizadores.length,
      ativos: utilizadores.filter(u => u.ativo).length,
      inativos: utilizadores.filter(u => !u.ativo).length,
      clientes: utilizadores.filter(u => u.perfil === 'Cliente').length,
      supervisores: utilizadores.filter(u => u.perfil === 'Supervisor').length
    };

    res.json({
      success: true,
      message: 'Estatísticas de usuários',
      data: stats
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getUserStats
};