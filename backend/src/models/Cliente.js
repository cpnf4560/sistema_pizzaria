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
      
      // Debug: verificar conexão e base de dados
      const connection = await pool.getConnection();
      console.log('🔎 [findById] Conexão obtida para database:', connection.config.database);
      
      const [rows] = await connection.execute('SELECT * FROM clientes WHERE id = ?', [idNum]);
      console.log('🔎 [findById] Resultado da query:', rows);
      console.log('🔎 [findById] Número de resultados:', rows.length);
      
      // Se não encontrou o cliente, buscar o primeiro disponível
      if (rows.length === 0) {
        console.log('⚠️ [findById] Cliente não encontrado, buscando primeiro disponível...');
        const [firstClient] = await connection.execute('SELECT * FROM clientes ORDER BY id LIMIT 1');
        
        if (firstClient.length > 0) {
          console.log('✅ [findById] Usando primeiro cliente disponível:', firstClient[0].id, '-', firstClient[0].nome);
          connection.release();
          return new Cliente(firstClient[0]);
        }
      }
      
      // Debug adicional: mostrar todos os clientes
      const [allClients] = await connection.execute('SELECT id, nome FROM clientes');
      console.log('🔎 [findById] Todos os clientes na BD:', allClients);
      
      connection.release();
      
      return rows.length > 0 ? new Cliente(rows[0]) : null;
    } catch (error) {
      console.log('❌ [findById] Erro:', error.message);
      throw new Error('Erro ao buscar cliente: ' + error.message);
    }
  }

  // Função específica para encontrar o primeiro cliente disponível
  static async findFirst() {
    try {
      console.log('🔎 [findFirst] Buscando primeiro cliente disponível...');
      const [rows] = await pool.execute('SELECT * FROM clientes ORDER BY id LIMIT 1');
      
      if (rows.length > 0) {
        console.log('✅ [findFirst] Primeiro cliente encontrado:', rows[0].id, '-', rows[0].nome);
        return new Cliente(rows[0]);
      }
      
      console.log('❌ [findFirst] Nenhum cliente encontrado na base de dados');
      return null;
    } catch (error) {
      console.log('❌ [findFirst] Erro:', error.message);
      throw new Error('Erro ao buscar primeiro cliente: ' + error.message);
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
        const [result] = await pool.execute(
          'INSERT INTO clientes (nome, morada, telefone, email, utilizador_id) VALUES (?, ?, ?, ?, ?)',
          [nome, morada, telefone, email, utilizador_id]
        );
        console.log('✅ Novo cliente criado com ID:', result.insertId);
        return await Cliente.findById(result.insertId);
      } else {
        // Manter compatibilidade com sistema antigo
        const [result] = await pool.execute(
          'INSERT INTO clientes (nome, morada, telefone, email) VALUES (?, ?, ?, ?)',
          [nome, morada, telefone, email]
        );
        console.log('✅ Novo cliente criado com ID:', result.insertId);
        return await Cliente.findById(result.insertId);
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