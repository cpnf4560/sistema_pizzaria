const User = require('../models/User');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    
    res.json({
      success: true,
      message: 'Usuários listados com sucesso',
      data: users.map(user => user.toJSON())
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
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Usuário encontrado',
      data: user.toJSON()
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

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const user = await User.updateStatus(id, ativo);

    res.json({
      success: true,
      message: `Usuário ${ativo ? 'ativado' : 'desativado'} com sucesso`,
      data: user.toJSON()
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

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Ao invés de excluir, desativar o usuário
    await User.updateStatus(id, false);

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
    const users = await User.getAll();
    
    const stats = {
      total: users.length,
      ativos: users.filter(user => user.ativo).length,
      inativos: users.filter(user => !user.ativo).length,
      clientes: users.filter(user => user.perfil === 'Cliente').length,
      supervisores: users.filter(user => user.perfil === 'Supervisor').length
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