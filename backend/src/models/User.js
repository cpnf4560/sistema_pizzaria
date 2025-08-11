const { pool } = require('../config/database');

class Utilizador {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.username = data.username;
  this.name = data.name; // CockroachDB: name
  this.password_hash = data.password_hash; // CockroachDB: password_hash
    this.is_admin = data.is_admin || false;
    this.morada = data.morada || '';
    this.telefone = data.telefone || '';
    this.created_at = data.created_at;
  }

  static async findByEmail(emailOrUsername) {
    try {
      // username OU email
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
      // passwordHash será usado apenas para password_hash
      const { email, username, passwordHash, name = '', is_admin = false } = userData;
      const usernameFinal = username || email;
      const result = await pool.query(
        `INSERT INTO utilizadores (email, username, password_hash, name, is_admin) 
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [email, usernameFinal, passwordHash, name, is_admin]
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
        'SELECT password_hash FROM utilizadores WHERE username = $1 OR email = $2',
        [emailOrUsername, emailOrUsername]
      );
      return result.rows.length > 0 ? result.rows[0].password_hash : null;
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
      is_admin: this.is_admin,
      created_at: this.created_at,
      morada: this.morada,
      telefone: this.telefone
    };
  }
}

module.exports = Utilizador;