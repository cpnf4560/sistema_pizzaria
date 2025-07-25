const { pool } = require('../config/database');

class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.nome = data.nome;
    this.perfil = data.perfil;
    this.ativo = data.ativo;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async findByEmail(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM usuarios WHERE email = ? AND ativo = 1',
        [email]
      );
      return rows.length > 0 ? new User(rows[0]) : null;
    } catch (error) {
      throw new Error('Erro ao buscar usuário: ' + error.message);
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM usuarios WHERE id = ? AND ativo = 1',
        [id]
      );
      return rows.length > 0 ? new User(rows[0]) : null;
    } catch (error) {
      throw new Error('Erro ao buscar usuário: ' + error.message);
    }
  }

  static async create(userData) {
    try {
      const { email, passwordHash, nome, perfil = 'Cliente' } = userData;
      const [result] = await pool.execute(
        `INSERT INTO usuarios (email, password_hash, nome, perfil, ativo, created_at, updated_at) 
         VALUES (?, ?, ?, ?, 1, NOW(), NOW())`,
        [email, passwordHash, nome, perfil]
      );
      
      return await User.findById(result.insertId);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Email já cadastrado');
      }
      throw new Error('Erro ao criar usuário: ' + error.message);
    }
  }

  static async getAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT id, email, nome, perfil, ativo, created_at, updated_at FROM usuarios WHERE ativo = 1'
      );
      return rows.map(row => new User(row));
    } catch (error) {
      throw new Error('Erro ao listar usuários: ' + error.message);
    }
  }

  static async updateStatus(id, ativo) {
    try {
      await pool.execute(
        'UPDATE usuarios SET ativo = ?, updated_at = NOW() WHERE id = ?',
        [ativo, id]
      );
      return await User.findById(id);
    } catch (error) {
      throw new Error('Erro ao atualizar status do usuário: ' + error.message);
    }
  }

  static async getPasswordHash(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT password_hash FROM usuarios WHERE email = ? AND ativo = 1',
        [email]
      );
      return rows.length > 0 ? rows[0].password_hash : null;
    } catch (error) {
      throw new Error('Erro ao verificar senha: ' + error.message);
    }
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      nome: this.nome,
      perfil: this.perfil,
      ativo: this.ativo,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = User;