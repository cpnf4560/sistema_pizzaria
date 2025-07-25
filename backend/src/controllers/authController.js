const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Cliente = require('../models/Cliente');
const authConfig = require('../config/auth');

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      perfil: user.perfil 
    },
    authConfig.jwtSecret,
    { expiresIn: authConfig.jwtExpiresIn }
  );
};

const register = async (req, res) => {
  try {
    const { email, password, nome, perfil = 'Cliente' } = req.body;

    // Verificar se usuário já existe
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email já cadastrado'
      });
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(password, authConfig.saltRounds);

    // Criar usuário
    const user = await User.create({
      email,
      passwordHash,
      nome,
      perfil
    });

    // Se for cliente, criar também registro na tabela clientes
    if (perfil === 'Cliente') {
      try {
        await Cliente.create({
          nome,
          morada: '', // Será preenchido depois
          telefone: '', // Será preenchido depois
          email
        });
      } catch (error) {
        console.warn('Erro ao criar registro de cliente:', error.message);
      }
    }

    // Gerar token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso',
      data: {
        user: user.toJSON(),
        token
      }
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuário
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha inválidos'
      });
    }

    // Verificar senha
    const passwordHash = await User.getPasswordHash(email);
    const isValidPassword = await bcrypt.compare(password, passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha inválidos'
      });
    }

    // Gerar token
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        user: user.toJSON(),
        token
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

const logout = async (req, res) => {
  // Com JWT, o logout é realizado no cliente removendo o token
  res.json({
    success: true,
    message: 'Logout realizado com sucesso'
  });
};

const me = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user.toJSON()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter dados do usuário'
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const newToken = generateToken(req.user);
    
    res.json({
      success: true,
      message: 'Token renovado com sucesso',
      data: {
        token: newToken
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao renovar token'
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  me,
  refreshToken
};