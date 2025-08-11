const { pool } = require('../config/database');

class Utilizador {
  constructor(data) {
    this.id = data.id;
    this.email = data.email || data.username;
    this.username = data.username;
    this.name = data.name; // nome no banco
    this.password = data.password; // password no banco
    // Campos opcionais
    this.morada = data.morada || '';
    this.telefone = data.telefone || '';
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async findByEmail(emailOrUsername) {
    try {
      const result = await pool.query(
        'SELECT * FROM utilizadores WHERE username = $1 OR email = $2',
        [emailOrUsername, emailOrUsername]
      );
      return result.rows.length > 0 ? new Utilizador(result.rows[0]) : null;
    } catch (error) {
      throw new Error('Erro ao buscar usuário: ' + error.message);
    }
  }

  static async findById(id) {
    try {
      const result = await pool.query(
        'SELECT * FROM utilizadores WHERE id = $1',
        [id]
      );
      return result.rows.length > 0 ? new Utilizador(result.rows[0]) : null;
    } catch (error) {
      throw new Error('Erro ao buscar usuário: ' + error.message);
    }
  }

  static async create(userData) {
    try {
      const { email, username, password, name } = userData;
      const usernameFinal = username || email;
      const result = await pool.query(
        `INSERT INTO utilizadores (email, username, password, name) 
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [email, usernameFinal, password, name]
      );
      return await Utilizador.findById(result.rows[0].id);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Email já cadastrado');
      }
      throw new Error('Erro ao criar usuário: ' + error.message);
    }
  }

  static async getAll() {
    try {
      const result = await pool.query(
        'SELECT * FROM utilizadores'
      );
      return result.rows.map(row => new Utilizador(row));
    } catch (error) {
      throw new Error('Erro ao listar usuários: ' + error.message);
    }
  }

  static async findByIdWithClientData(id) {
    try {
      const result = await pool.query(`
        SELECT u.*, c.morada, c.telefone 
        FROM utilizadores u 
        LEFT JOIN clientes c ON u.email = c.email 
        WHERE u.id = $1
      `, [id]);
      return result.rows.length > 0 ? new Utilizador(result.rows[0]) : null;
    } catch (error) {
      throw new Error('Erro ao buscar usuário com dados do cliente: ' + error.message);
    }
  }

  static async getPasswordHash(emailOrUsername) {
    try {
      const result = await pool.query(
        'SELECT password FROM utilizadores WHERE username = $1 OR email = $2',
        [emailOrUsername, emailOrUsername]
      );
      return result.rows.length > 0 ? result.rows[0].password : null;
    } catch (error) {
      throw new Error('Erro ao verificar senha: ' + error.message);
    }
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      username: this.username,
      name: this.name,
      created_at: this.created_at,
      updated_at: this.updated_at,
      morada: this.morada,
      telefone: this.telefone
    };
  }
}

module.exports = Utilizador;