const { pool } = require('../config/database');

class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email || data.username; // Usar email se existir, senão username
    this.username = data.username;
    this.nome = data.name; // A tabela utilizadores usa name
    this.name = data.name;
    this.perfil = data.is_admin ? 'Administrador' : 'Cliente';
    this.is_admin = data.is_admin;
    this.ativo = 1; // Assumir sempre ativo para esta tabela
    
    // Estes campos vão vir da tabela clientes se necessário
    this.morada = data.morada || '';
    this.telefone = data.telefone || '';
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async findByEmail(emailOrUsername) {
    try {
      // A tabela utilizadores tem tanto username quanto email
      const [rows] = await pool.execute(
        'SELECT * FROM utilizadores WHERE username = ? OR email = ?',
        [emailOrUsername, emailOrUsername]
      );
      return rows.length > 0 ? new User(rows[0]) : null;
    } catch (error) {
      throw new Error('Erro ao buscar usuário: ' + error.message);
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM utilizadores WHERE id = ?',
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
      const isAdmin = perfil === 'Administrador' ? 1 : 0;
      
      const [result] = await pool.execute(
        `INSERT INTO utilizadores (username, email, password, name, is_admin) 
         VALUES (?, ?, ?, ?, ?)`,
        [email, email, passwordHash, nome, isAdmin]
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
        'SELECT id, username, name, is_admin FROM utilizadores'
      );
      return rows.map(row => new User(row));
    } catch (error) {
      throw new Error('Erro ao listar usuários: ' + error.message);
    }
  }

  static async findByIdWithClientData(id) {
    try {
      const [rows] = await pool.execute(`
        SELECT u.*, c.morada, c.telefone 
        FROM utilizadores u 
        LEFT JOIN clientes c ON u.email = c.email 
        WHERE u.id = ?
      `, [id]);
      
      return rows.length > 0 ? new User(rows[0]) : null;
    } catch (error) {
      throw new Error('Erro ao buscar usuário com dados do cliente: ' + error.message);
    }
  }

  static async getPasswordHash(emailOrUsername) {
    try {
      const [rows] = await pool.execute(
        'SELECT password FROM utilizadores WHERE username = ? OR email = ?',
        [emailOrUsername, emailOrUsername]
      );
      return rows.length > 0 ? rows[0].password : null;
    } catch (error) {
      throw new Error('Erro ao verificar senha: ' + error.message);
    }
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      nome: this.nome,
      morada: this.morada,
      telefone: this.telefone,
      perfil: this.perfil,
      ativo: this.ativo,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = User;