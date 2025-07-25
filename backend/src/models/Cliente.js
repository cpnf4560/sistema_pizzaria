const { pool } = require('../config/database');

class Cliente {
  constructor(data) {
    this.id = data.id;
    this.nome = data.nome;
    this.morada = data.morada;
    this.telefone = data.telefone;
    this.email = data.email;
  }

  static async getAll() {
    try {
      const [rows] = await pool.execute('SELECT * FROM clientes ORDER BY nome');
      return rows.map(row => new Cliente(row));
    } catch (error) {
      throw new Error('Erro ao listar clientes: ' + error.message);
    }
  }

  static async findById(id) {
    try {
      const idNum = Number(id);
      console.log('🔎 [findById] Procurando cliente com id:', id, 'convertido para:', idNum);
      const [rows] = await pool.execute('SELECT * FROM clientes WHERE id = ?', [idNum]);
      console.log('🔎 [findById] Resultado da query:', rows);
      return rows.length > 0 ? new Cliente(rows[0]) : null;
    } catch (error) {
      console.log('❌ [findById] Erro:', error.message);
      throw new Error('Erro ao buscar cliente: ' + error.message);
    }
  }

  static async findByEmail(email) {
    try {
      const [rows] = await pool.execute('SELECT * FROM clientes WHERE email = ?', [email]);
      return rows.length > 0 ? new Cliente(rows[0]) : null;
    } catch (error) {
      throw new Error('Erro ao buscar cliente por email: ' + error.message);
    }
  }

  static async create(clienteData) {
    try {
      const { nome, morada, telefone, email } = clienteData;
      const [result] = await pool.execute(
        'INSERT INTO clientes (nome, morada, telefone, email) VALUES (?, ?, ?, ?)',
        [nome, morada, telefone, email]
      );
      
      return await Cliente.findById(result.insertId);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Email já cadastrado');
      }
      throw new Error('Erro ao criar cliente: ' + error.message);
    }
  }

  static async update(id, clienteData) {
    try {
      const { nome, morada, telefone, email } = clienteData;
      await pool.execute(
        'UPDATE clientes SET nome = ?, morada = ?, telefone = ?, email = ? WHERE id = ?',
        [nome, morada, telefone, email, id]
      );
      
      return await Cliente.findById(id);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Email já cadastrado');
      }
      throw new Error('Erro ao atualizar cliente: ' + error.message);
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.execute('DELETE FROM clientes WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new Error('Não é possível excluir cliente que possui encomendas');
      }
      throw new Error('Erro ao excluir cliente: ' + error.message);
    }
  }

  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      morada: this.morada,
      telefone: this.telefone,
      email: this.email
    };
  }
}

module.exports = Cliente;