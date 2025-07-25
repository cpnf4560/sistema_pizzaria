const { pool } = require('../config/database');

class Encomenda {
  constructor(data) {
    this.id = data.id;
    this.cliente_id = data.cliente_id;
    this.usuario_id = data.usuario_id;
    this.data_hora = data.data_hora;
    this.tipo_entrega = data.tipo_entrega;
    this.hora_entrega = data.hora_entrega;
    this.taxa_entrega = data.taxa_entrega;
    this.observacoes = data.observacoes;
    this.total = data.total;
    this.status = data.status || 'Pendente';
    this.estado = data.estado || 'pendente';
    this.cliente = data.cliente;
    this.pizzas = data.pizzas || [];
  }

  static async getAll(filters = {}) {
    try {
      let sql = `
        SELECT e.*, c.nome as cliente_nome, c.telefone, c.morada,
               SUM(ep.preco_unitario * ep.quantidade) + COALESCE(e.taxa_entrega, 0) as total_calculado
        FROM encomendas e 
        LEFT JOIN clientes c ON e.cliente_id = c.id
        LEFT JOIN encomenda_pizzas ep ON e.id = ep.encomenda_id
      `;
      
      const conditions = [];
      const params = [];

      if (filters.cliente_id) {
        conditions.push('e.cliente_id = ?');
        params.push(filters.cliente_id);
      }

      if (filters.status) {
        conditions.push('e.status = ?');
        params.push(filters.status);
      }

      if (filters.data_inicio) {
        conditions.push('DATE(e.data_hora) >= ?');
        params.push(filters.data_inicio);
      }

      if (filters.data_fim) {
        conditions.push('DATE(e.data_hora) <= ?');
        params.push(filters.data_fim);
      }

      if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
      }

      sql += ' GROUP BY e.id ORDER BY e.data_hora DESC';

      const [rows] = await pool.execute(sql, params);
      return rows.map(row => new Encomenda({
        ...row,
        cliente: {
          nome: row.cliente_nome,
          telefone: row.telefone,
          morada: row.morada
        }
      }));
    } catch (error) {
      throw new Error('Erro ao listar encomendas: ' + error.message);
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.execute(`
        SELECT e.*, c.nome as cliente_nome, c.telefone, c.morada, c.email,
               SUM(ep.preco_unitario * ep.quantidade) + COALESCE(e.taxa_entrega, 0) as total_calculado
        FROM encomendas e 
        LEFT JOIN clientes c ON e.cliente_id = c.id
        LEFT JOIN encomenda_pizzas ep ON e.id = ep.encomenda_id
        WHERE e.id = ?
        GROUP BY e.id
      `, [id]);

      if (rows.length === 0) return null;

      const encomenda = new Encomenda({
        ...rows[0],
        cliente: {
          nome: rows[0].cliente_nome,
          telefone: rows[0].telefone,
          morada: rows[0].morada,
          email: rows[0].email
        }
      });

      // Buscar pizzas da encomenda
      const [pizzaRows] = await pool.execute(`
        SELECT ep.*, p.nome as pizza_nome, p.descricao
        FROM encomenda_pizzas ep
        JOIN pizza p ON ep.pizza_id = p.id
        WHERE ep.encomenda_id = ?
      `, [id]);

      encomenda.pizzas = pizzaRows.map(pizza => ({
        id: pizza.id,
        pizza_id: pizza.pizza_id,
        nome: pizza.pizza_nome,
        descricao: pizza.descricao,
        tamanho: pizza.tamanho,
        quantidade: pizza.quantidade,
        preco_unitario: parseFloat(pizza.preco_unitario),
        subtotal: parseFloat(pizza.subtotal)
      }));

      return encomenda;
    } catch (error) {
      throw new Error('Erro ao buscar encomenda: ' + error.message);
    }
  }

  static async create(encomendaData) {
    const connection = await pool.getConnection();
    console.log('🛢️ Conectado à base de dados:', connection.config.database);
    try {
      await connection.beginTransaction();

      const { cliente_id, tipo_entrega, observacoes, pizzas, hora_entrega } = encomendaData;
      
      // Calcular total
      let total = 0;
      pizzas.forEach(pizza => {
        const preco = parseFloat(pizza.preco || 0);
        total += preco;
      });

      // Taxa de entrega
      let taxa_entrega = 0;
      if (tipo_entrega === 'domicilio') {
        taxa_entrega = 3.90;
        total += taxa_entrega;
      }

      // Inserir encomenda SEM campo total (que pode não existir)
      const [result] = await connection.execute(
        'INSERT INTO encomendas (cliente_id, data_hora, tipo_entrega, hora_entrega, taxa_entrega, observacoes, status, estado) VALUES (?, NOW(), ?, ?, ?, ?, ?, ?)',
        [cliente_id, tipo_entrega, hora_entrega, taxa_entrega, observacoes, 'Pendente', 'pendente']
      );

      const encomendaId = result.insertId;
      console.log('✅ Encomenda criada com ID:', encomendaId);

      // Inserir pizzas - VERSÃO SUPER SIMPLES
      for (const pizza of pizzas) {     
        const preco = parseFloat(pizza.preco || 7.00);   
        console.log('🍕 Inserindo pizza:', pizza.pizza_id, pizza.tamanho, preco);
        
        // Tentar inserção mais básica possível
        await connection.execute(
          'INSERT INTO encomenda_pizzas (encomenda_id, pizza_id, tamanho, quantidade, preco_unitario, subtotal) VALUES (?, ?, ?, 1, ?, ?)',
          [encomendaId, pizza.pizza_id, pizza.tamanho, preco, preco]
        );
      }

      await connection.commit();
      console.log('✅ Transação confirmada');
      
      return {
        id: encomendaId,
        cliente_id,
        tipo_entrega,
        hora_entrega,
        taxa_entrega,
        observacoes,
        total,
        status: 'Pendente',
        message: 'Encomenda criada com sucesso'
      };

    } catch (error) {
      await connection.rollback();
      console.error('❌ Erro na criação:', error);
      throw new Error('Erro ao criar encomenda: ' + error.message);
    } finally {
      connection.release();
    }
  }

  static async updateStatus(id, status) {
    try {
      await pool.execute(
        'UPDATE encomendas SET status = ? WHERE id = ?',
        [status, id]
      );
      return await Encomenda.findById(id);
    } catch (error) {
      throw new Error('Erro ao atualizar status da encomenda: ' + error.message);
    }
  }

  toJSON() {
    return {
      id: this.id,
      cliente_id: this.cliente_id,
      usuario_id: this.usuario_id,
      data_hora: this.data_hora,
      tipo_entrega: this.tipo_entrega,
      hora_entrega: this.hora_entrega,
      taxa_entrega: parseFloat(this.taxa_entrega || 0),
      observacoes: this.observacoes,
      total: parseFloat(this.total || 0),
      status: this.status,
      estado: this.estado,
      cliente: this.cliente,
      pizzas: this.pizzas
    };
  }
}

module.exports = Encomenda;