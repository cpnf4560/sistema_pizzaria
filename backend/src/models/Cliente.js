const { pool } = require('../config/database');

class Cliente {
  constructor(data) {
    this.id = data.id;
    this.nome = data.nome;
    this.morada = data.morada;
    this.telefone = data.telefone;
    this.email = data.email;
    this.utilizador_id = data.utilizador_id;
  }

  static async getAll() {
    try {
      const result = await pool.query('SELECT * FROM clientes ORDER BY nome');
      return result.rows.map(row => new Cliente(row));
    } catch (error) {
      throw new Error('Erro ao listar clientes: ' + error.message);
    }
  }

  static async findById(id) {
    try {
      const idNum = Number(id);
      const result = await pool.query('SELECT * FROM clientes WHERE id = $1', [idNum]);
      if (result.rows.length === 0) {
        const firstClient = await pool.query('SELECT * FROM clientes ORDER BY id LIMIT 1');
        if (firstClient.rows.length > 0) {
          return new Cliente(firstClient.rows[0]);
        }
      }
      return result.rows.length > 0 ? new Cliente(result.rows[0]) : null;
    } catch (error) {
      console.log('❌ [findById] Erro:', error.message);
      throw new Error('Erro ao buscar cliente: ' + error.message);
    }
  }

  // Função específica para encontrar o primeiro cliente disponível
  static async findFirst() {
    try {
      const result = await pool.query('SELECT * FROM clientes ORDER BY id LIMIT 1');
      if (result.rows.length > 0) {
        return new Cliente(result.rows[0]);
      }
      return null;
    } catch (error) {
      console.log('❌ [findFirst] Erro:', error.message);
      throw new Error('Erro ao buscar primeiro cliente: ' + error.message);
    }
  }

  static async findByEmail(email) {
    try {
      const result = await pool.query('SELECT * FROM clientes WHERE email = $1', [email]);
      return result.rows.length > 0 ? new Cliente(result.rows[0]) : null;
    } catch (error) {
      throw new Error('Erro ao buscar cliente por email: ' + error.message);
    }
  }

  static async create(clienteData) {
    try {
      const { nome, morada, telefone, email, utilizador_id } = clienteData;
      
      // Primeiro verificar se já existe um cliente com este email
      console.log('🔍 Verificando se cliente já existe com email:', email);
      const clienteExistente = await Cliente.findByEmail(email);
      
      if (clienteExistente) {
        console.log('✅ Cliente já existe, retornando existente:', clienteExistente.id);
        return clienteExistente;
      }
      
      console.log('➕ Cliente não existe, criando novo...');
      
      // Verificar se utilizador_id é fornecido
      if (utilizador_id) {
        const result = await pool.query(
          'INSERT INTO clientes (nome, morada, telefone, email, utilizador_id) VALUES ($1, $2, $3, $4, $5) RETURNING id',
          [nome, morada, telefone, email, utilizador_id]
        );
        return await Cliente.findById(result.rows[0].id);
      } else {
        const result = await pool.query(
          'INSERT INTO clientes (nome, morada, telefone, email) VALUES ($1, $2, $3, $4) RETURNING id',
          [nome, morada, telefone, email]
        );
        return await Cliente.findById(result.rows[0].id);
      }
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
      await pool.query(
        'UPDATE clientes SET nome = $1, morada = $2, telefone = $3, email = $4 WHERE id = $5',
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
      const result = await pool.query('DELETE FROM clientes WHERE id = $1', [id]);
      return result.rowCount > 0;
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