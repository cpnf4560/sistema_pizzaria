const { pool } = require('../config/database');

class Encomenda {
  constructor(data) {
    this.id = data.id;
    this.cliente_id = data.cliente_id;
    this.utilizador_id = data.utilizador_id;
    this.data_hora = data.data_hora;
    this.tipo_entrega = data.tipo_entrega;
    this.hora_entrega = data.hora_entrega;
    this.taxa_entrega = data.taxa_entrega;
    this.observacoes = data.observacoes;
    this.metodo_pagamento = data.metodo_pagamento || 'entrega';
    this.total = data.total;
    this.status = data.status || 'Pendente';
    this.estado = data.estado || 'pendente';
    this.cliente = data.cliente;
    this.pizzas = data.pizzas || [];
  }

  static async getAll(filters = {}) {
    try {
      console.log('📦 [Encomenda.getAll] Filtros recebidos:', filters);
      
      let sql = `
        SELECT e.*, c.nome as cliente_nome, c.telefone, c.morada,
               SUM(ep.preco) + COALESCE(e.taxa_entrega, 0) as total_calculado
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

      console.log('📦 [Encomenda.getAll] SQL:', sql);
      console.log('📦 [Encomenda.getAll] Params:', params);
      
      try {
        const result = await pool.query(sql.replace(/\?/g, (v, i) => `$${i+1}`), params);
        console.log('📦 [Encomenda.getAll] Rows encontradas:', result.rows.length);
        console.log('📦 [Encomenda.getAll] Primeira row:', result.rows[0] || 'NENHUMA');
        const encomendas = [];
        for (const row of result.rows) {
          const encomenda = new Encomenda({
            ...row,
            cliente: {
              nome: row.cliente_nome,
              telefone: row.telefone,
              morada: row.morada
            }
          });
          const pizzaResult = await pool.query(
            `SELECT ep.*, p.nome as pizza_nome, p.descricao
            FROM encomenda_pizzas ep
            JOIN pizza p ON ep.pizza_id = p.id
            WHERE ep.encomenda_id = $1`, [row.id]);
          encomenda.pizzas = pizzaResult.rows.map(pizza => ({
            id: pizza.id,
            pizza_id: pizza.pizza_id,
            nome: pizza.pizza_nome,
            descricao: pizza.descricao,
            tamanho: pizza.tamanho,
            quantidade: 1,
            preco_unitario: parseFloat(pizza.preco),
            subtotal: parseFloat(pizza.preco)
          }));
          console.log(`📦 [Encomenda.getAll] Encomenda ${row.id}: ${pizzaResult.rows.length} pizzas carregadas`);
          encomendas.push(encomenda);
        }
        console.log('📦 [Encomenda.getAll] Resultado final:', encomendas.length, 'encomendas');
        return encomendas;
      } catch (queryError) {
        console.error('📦 [Encomenda.getAll] Erro na query:', queryError.message);
        throw queryError;
      }
    } catch (error) {
      throw new Error('Erro ao listar encomendas: ' + error.message);
    }
  }

  static async findById(id) {
    try {
      const result = await pool.query(`
        SELECT e.*, c.nome as cliente_nome, c.telefone, c.morada, c.email,
               SUM(ep.preco) + COALESCE(e.taxa_entrega, 0) as total_calculado
        FROM encomendas e 
        LEFT JOIN clientes c ON e.cliente_id = c.id
        LEFT JOIN encomenda_pizzas ep ON e.id = ep.encomenda_id
        WHERE e.id = $1
        GROUP BY e.id
      `, [id]);
      if (result.rows.length === 0) return null;
      const encomenda = new Encomenda({
        ...result.rows[0],
        cliente: {
          nome: result.rows[0].cliente_nome,
          telefone: result.rows[0].telefone,
          morada: result.rows[0].morada,
          email: result.rows[0].email
        }
      });
      const pizzaResult = await pool.query(
        `SELECT ep.*, p.nome as pizza_nome, p.descricao
        FROM encomenda_pizzas ep
        JOIN pizza p ON ep.pizza_id = p.id
        WHERE ep.encomenda_id = $1`, [id]);
      encomenda.pizzas = pizzaResult.rows.map(pizza => ({
        id: pizza.id,
        pizza_id: pizza.pizza_id,
        nome: pizza.pizza_nome,
        descricao: pizza.descricao,
        tamanho: pizza.tamanho,
        quantidade: 1,
        preco_unitario: parseFloat(pizza.preco),
        subtotal: parseFloat(pizza.preco)
      }));
      return encomenda;
    } catch (error) {
      throw new Error('Erro ao buscar encomenda: ' + error.message);
    }
  }

  static async create(encomendaData) {
    const connection = await pool.getConnection();
    
    // LOG 1: Dados recebidos
    console.log('📝 === INÍCIO CRIAÇÃO ENCOMENDA ===');
    console.log('📊 Dados recebidos:', JSON.stringify(encomendaData, null, 2));
    console.log('🛢️ Conectado à base de dados:', connection.config.database);
    
    try {
      await connection.beginTransaction();
      console.log('🔄 Transação iniciada');

      const { cliente_id, tipo_entrega, observacoes, metodo_pagamento, pizzas, hora_entrega } = encomendaData;
      
      // LOG 2: Validações
      console.log('🔍 Validando dados...');
      console.log('👤 Cliente ID:', cliente_id);
      console.log('🚚 Tipo entrega:', tipo_entrega);
      console.log('💳 Método pagamento:', metodo_pagamento);
      console.log('📝 Observações:', observacoes);
      console.log('🍕 Pizzas:', pizzas?.length || 0);
      console.log('⏰ Hora entrega:', hora_entrega);
      
      // Verificar se cliente existe
      const [clienteCheck] = await connection.execute(
        'SELECT id, nome FROM clientes WHERE id = ?',
        [cliente_id]
      );
      console.log('👤 Cliente encontrado:', clienteCheck[0]?.nome || 'NÃO ENCONTRADO');
      
      if (!clienteCheck[0]) {
        throw new Error(`Cliente com ID ${cliente_id} não existe na base de dados`);
      }
      
      // Calcular total
      let total = 0;
      pizzas.forEach(pizza => {
        const preco = parseFloat(pizza.preco || 0);
        total += preco;
        console.log(`🍕 Pizza: ${pizza.nome} - €${preco}`);
      });

      // Taxa de entrega
      let taxa_entrega = 0;
      if (tipo_entrega === 'entrega') {
        taxa_entrega = 3.90;
        total += taxa_entrega;
      }
      console.log('💰 Total calculado: €' + total.toFixed(2));

      // LOG 3: Query de inserção - sem metodo_pagamento
      const insertQuery = 'INSERT INTO encomendas (cliente_id, data_hora, tipo_entrega, hora_entrega, taxa_entrega, observacoes, estado) VALUES (?, NOW(), ?, ?, ?, ?, ?)';
      const insertParams = [cliente_id, tipo_entrega, hora_entrega, taxa_entrega, observacoes, 'pendente'];
      
      console.log('📝 Query:', insertQuery);
      console.log('📝 Parâmetros:', insertParams);

      // Inserir encomenda
      const [result] = await connection.execute(insertQuery, insertParams);
      const encomendaId = result.insertId;
      console.log('✅ Encomenda criada com ID:', encomendaId);
      console.log('📊 Result object:', { insertId: result.insertId, affectedRows: result.affectedRows });

      // LOG 4: Inserir pizzas - VERSÃO COM LOGS DETALHADOS
      console.log('🍕 === INSERINDO PIZZAS ===');
      for (let i = 0; i < pizzas.length; i++) {
        const pizza = pizzas[i];
        const preco = parseFloat(pizza.preco || 7.00);   
        console.log(`🍕 Pizza ${i+1}/${pizzas.length}:`, {
          pizza_id: pizza.pizza_id,
          nome: pizza.nome,
          tamanho: pizza.tamanho,
          preco: preco
        });
        
        // Query adaptada para a estrutura real da tabela (sem quantidade, preco_unitario, subtotal)
        const quantidade = pizza.quantidade || 1;
        const pizzaQuery = 'INSERT INTO encomenda_pizzas (encomenda_id, pizza_id, tamanho, preco) VALUES (?, ?, ?, ?)';
        const pizzaParams = [encomendaId, pizza.pizza_id, pizza.tamanho, preco];
        
        console.log('📝 Pizza Query:', pizzaQuery);
        console.log('📝 Pizza Params:', pizzaParams);
        
        try {
          const [pizzaResult] = await connection.execute(pizzaQuery, pizzaParams);
          console.log(`✅ Pizza ${i+1} inserida - ID: ${pizzaResult.insertId}`);
        } catch (pizzaError) {
          console.error(`❌ Erro ao inserir pizza ${i+1}:`, pizzaError.message);
          throw pizzaError;
        }
      }

      // LOG 5: Commit
      console.log('💾 Fazendo commit da transação...');
      await connection.commit();
      console.log('✅ Transação confirmada com sucesso');
      
      // LOG 6: Verificação final
      const [verificacao] = await connection.execute(
        'SELECT COUNT(*) as total FROM encomendas WHERE id = ?',
        [encomendaId]
      );
      console.log('🔍 Verificação: encomenda existe na BD:', verificacao[0].total > 0);
      
      const [pizzasVerif] = await connection.execute(
        'SELECT COUNT(*) as total FROM encomenda_pizzas WHERE encomenda_id = ?',
        [encomendaId]
      );
      console.log('🔍 Verificação: pizzas inseridas:', pizzasVerif[0].total);
      
      console.log('🎉 === ENCOMENDA CRIADA COM SUCESSO ===');
      
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
      console.log('🔄 Fazendo rollback da transação...');
      await connection.rollback();
      console.error('❌ === ERRO NA CRIAÇÃO DA ENCOMENDA ===');
      console.error('❌ Tipo:', error.constructor.name);
      console.error('❌ Mensagem:', error.message);
      console.error('❌ Stack:', error.stack);
      console.error('❌ === FIM DO ERRO ===');
      throw new Error('Erro ao criar encomenda: ' + error.message);
    } finally {
      console.log('🔗 Libertando conexão...');
      connection.release();
      console.log('📝 === FIM CRIAÇÃO ENCOMENDA ===\n');
    }
  }

  static async updateStatus(id, status) {
    try {
      await pool.query(
        'UPDATE encomendas SET status = $1 WHERE id = $2',
        [status, id]
      );
      return await Encomenda.findById(id);
    } catch (error) {
      throw new Error('Erro ao atualizar status da encomenda: ' + error.message);
    }
  }

  // Buscar encomendas por email do cliente
  static async findByClienteEmail(email) {
    try {
      const sql = `
        SELECT e.*, 
               c.nome as cliente_nome, 
               c.telefone, 
               c.morada, 
               c.email as cliente_email,
               e.data_hora as data_encomenda,
               SUM(ep.preco) + COALESCE(e.taxa_entrega, 0) as total
        FROM encomendas e 
        LEFT JOIN clientes c ON e.cliente_id = c.id
        LEFT JOIN encomenda_pizzas ep ON e.id = ep.encomenda_id
        WHERE c.email = ?
        GROUP BY e.id
        ORDER BY e.data_hora DESC
      `;

      const result = await pool.query(sql.replace(/\?/g, (v, i) => `$${i+1}`), [email]);
      const encomendas = [];
      for (const row of result.rows) {
        const pizzasSql = `
          SELECT ep.*, p.nome, p.descricao
          FROM encomenda_pizzas ep
          JOIN pizza p ON ep.pizza_id = p.id
          WHERE ep.encomenda_id = $1
        `;
        const pizzasResult = await pool.query(pizzasSql, [row.id]);
        encomendas.push({
          id: row.id,
          data_encomenda: row.data_encomenda,
          total: parseFloat(row.total || 0),
          tipo_entrega: row.tipo_entrega,
          hora_entrega: row.hora_entrega,
          observacoes: row.observacoes,
          status: row.status || row.estado,
          cliente: {
            nome: row.cliente_nome,
            email: row.cliente_email,
            telefone: row.telefone,
            morada: row.morada
          },
          pizzas: pizzasResult.rows.map(pizza => ({
            nome: pizza.nome,
            descricao: pizza.descricao,
            tamanho: pizza.tamanho,
            quantidade: 1,
            preco: parseFloat(pizza.preco || 0)
          }))
        });
      }
      return encomendas;
    } catch (error) {
      console.error('❌ Erro ao buscar encomendas por email:', error);
      throw error;
    }
  }

  toJSON() {
    return {
      id: this.id,
      cliente_id: this.cliente_id,
      utilizador_id: this.utilizador_id,
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