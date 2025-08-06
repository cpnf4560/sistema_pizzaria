const { pool } = require('../config/database');

class Pizza {
  constructor(data) {
    this.id = data.id;
    this.nome = data.nome;
    this.descricao = data.descricao;
    this.preco_pequena = data.preco_pequena;
    this.preco_media = data.preco_media;
    this.preco_grande = data.preco_grande;
  }

  static async getAll() {
    try {
      const result = await pool.query('SELECT * FROM pizza ORDER BY nome');
      return result.rows.map(row => new Pizza(row));
    } catch (error) {
      throw new Error('Erro ao listar pizzas: ' + error.message);
    }
  }

  static async findById(id) {
    try {
      const result = await pool.query('SELECT * FROM pizza WHERE id = $1', [id]);
      return result.rows.length > 0 ? new Pizza(result.rows[0]) : null;
    } catch (error) {
      throw new Error('Erro ao buscar pizza: ' + error.message);
    }
  }

  static async create(pizzaData) {
    try {
      const { nome, descricao, preco_pequena, preco_media, preco_grande } = pizzaData;
      const result = await pool.query(
        `INSERT INTO pizza (nome, descricao, preco_pequena, preco_media, preco_grande) 
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [nome, descricao, preco_pequena, preco_media, preco_grande]
      );
      return await Pizza.findById(result.rows[0].id);
    } catch (error) {
      throw new Error('Erro ao criar pizza: ' + error.message);
    }
  }

  static async update(id, pizzaData) {
    try {
      const { nome, descricao, preco_pequena, preco_media, preco_grande } = pizzaData;
      await pool.query(
        `UPDATE pizza SET nome = $1, descricao = $2, preco_pequena = $3, 
         preco_media = $4, preco_grande = $5 WHERE id = $6`,
        [nome, descricao, preco_pequena, preco_media, preco_grande, id]
      );
      return await Pizza.findById(id);
    } catch (error) {
      throw new Error('Erro ao atualizar pizza: ' + error.message);
    }
  }

  static async delete(id) {
    try {
      const result = await pool.query('DELETE FROM pizza WHERE id = $1', [id]);
      return result.rowCount > 0;
    } catch (error) {
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new Error('Não é possível excluir pizza que possui encomendas');
      }
      throw new Error('Erro ao excluir pizza: ' + error.message);
    }
  }

  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      descricao: this.descricao,
      preco_pequena: parseFloat(this.preco_pequena),
      preco_media: parseFloat(this.preco_media),
      preco_grande: parseFloat(this.preco_grande)
    };
  }
}

module.exports = Pizza;