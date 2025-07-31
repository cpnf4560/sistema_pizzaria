const bcrypt = require('bcryptjs');
const crypto = require('crypto');
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
    console.log('📝 === TENTATIVA DE REGISTO ===');
    console.log('📨 Body recebido:', req.body);
    
    const { email, password, nome, perfil = 'Cliente' } = req.body;
    
    // Validar dados obrigatórios
    if (!email || !password || !nome) {
      console.log('❌ Dados obrigatórios em falta');
      return res.status(400).json({
        success: false,
        message: 'Email, password e nome são obrigatórios'
      });
    }

    console.log('📧 Email:', email);
    console.log('👤 Nome:', nome);
    console.log('🔑 Password length:', password.length);

    // Verificar se usuário já existe
    console.log('🔍 Verificando se email já existe...');
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      console.log('❌ Email já cadastrado');
      return res.status(400).json({
        success: false,
        message: 'Email já cadastrado'
      });
    }

    // Hash da senha usando SHA256 (compatível com o banco)
    console.log('🔒 Gerando hash SHA256 da password...');
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    // Criar usuário
    console.log('💾 Criando utilizador...');
    const user = await User.create({
      email,
      passwordHash,
      nome,
      perfil
    });
    console.log('✅ Utilizador criado com sucesso:', user.id);

    // Se for cliente, criar também registro na tabela clientes
    if (perfil === 'Cliente') {
      try {
        console.log('👤 Criando registo de cliente...');
        await Cliente.create({
          nome,
          morada: '', // Será preenchido depois
          telefone: '', // Será preenchido depois
          email
        });
        console.log('✅ Registo de cliente criado');
      } catch (error) {
        console.warn('⚠️ Erro ao criar registro de cliente:', error.message);
      }
    }

    // Gerar token
    console.log('🎫 Gerando token...');
    const token = generateToken(user);

    console.log('✅ Registo concluído com sucesso para:', user.email);
    res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso',
      data: {
        user: user.toJSON(),
        token
      }
    });

  } catch (error) {
    console.error('❌ Erro no registo:', error);
    console.error('❌ Stack trace:', error.stack);
    res.status(400).json({
      success: false,
      message: error.message || 'Erro interno do servidor'
    });
  }
};

const login = async (req, res) => {
  try {
    console.log('🔐 === TENTATIVA DE LOGIN ===');
    console.log('📨 Body recebido:', req.body);
    
    const { email, password } = req.body; // 'email' pode ser email ou username
    console.log('📧 Email/Username:', email);
    console.log('🔑 Password length:', password ? password.length : 'undefined');

    // Buscar usuário por email ou username
    console.log('🔍 Procurando utilizador com email/username:', email);
    const user = await User.findByEmail(email); // Este método já suporta email ou username
    console.log('👤 Utilizador encontrado:', user ? `${user.nome} (${user.email || user.username})` : 'NÃO ENCONTRADO');
    
    if (!user) {
      console.log('❌ Utilizador não encontrado');
      return res.status(401).json({
        success: false,
        message: 'Email/Username ou senha inválidos'
      });
    }

    // Verificar senha
    console.log('🔑 Verificando password...');
    const passwordHash = await User.getPasswordHash(email); // Este método também suporta email ou username
    console.log('🔑 Hash da BD:', passwordHash ? passwordHash.substring(0, 20) + '...' : 'NULL');
    
    // Calcular SHA256 da password fornecida
    const crypto = require('crypto');
    const inputPasswordHash = crypto.createHash('sha256').update(password).digest('hex');
    console.log('🔑 Hash calculado:', inputPasswordHash.substring(0, 20) + '...');
    
    const isValidPassword = passwordHash === inputPasswordHash;
    console.log('🔑 Password válida:', isValidPassword);

    if (!isValidPassword) {
      console.log('❌ Password inválida');
      return res.status(401).json({
        success: false,
        message: 'Email/Username ou senha inválidos'
      });
    }

    console.log('✅ Password válida, gerando token...');

    // Buscar dados completos do utilizador incluindo dados do cliente
    const userWithClientData = await User.findByIdWithClientData(user.id);
    const finalUser = userWithClientData || user;

    // Gerar token
    const token = generateToken(finalUser);
    console.log('🎟️ Token gerado');

    const response = {
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        user: finalUser.toJSON(),
        token
      }
    };
    
    console.log('📤 Resposta final:', JSON.stringify(response, null, 2));

    res.json(response);

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
    // Buscar dados completos do utilizador incluindo dados do cliente
    const userWithClientData = await User.findByIdWithClientData(req.user.id);
    
    res.json({
      success: true,
      data: {
        user: userWithClientData ? userWithClientData.toJSON() : req.user.toJSON()
      }
    });
  } catch (error) {
    console.error('❌ Erro ao obter dados completos do usuário:', error);
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