const Pizza = require('../models/Pizza');

const getAllPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.getAll();
    
    res.json({
      success: true,
      message: 'Pizzas listadas com sucesso',
      data: pizzas.map(pizza => pizza.toJSON())
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getPizzaById = async (req, res) => {
  try {
    const { id } = req.params;
    const pizza = await Pizza.findById(id);

    if (!pizza) {
      return res.status(404).json({
        success: false,
        message: 'Pizza não encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Pizza encontrada',
      data: pizza.toJSON()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const createPizza = async (req, res) => {
  try {
    const pizza = await Pizza.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Pizza criada com sucesso',
      data: pizza.toJSON()
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const updatePizza = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingPizza = await Pizza.findById(id);
    if (!existingPizza) {
      return res.status(404).json({
        success: false,
        message: 'Pizza não encontrada'
      });
    }

    const pizza = await Pizza.update(id, req.body);

    res.json({
      success: true,
      message: 'Pizza atualizada com sucesso',
      data: pizza.toJSON()
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const deletePizza = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingPizza = await Pizza.findById(id);
    if (!existingPizza) {
      return res.status(404).json({
        success: false,
        message: 'Pizza não encontrada'
      });
    }

    const deleted = await Pizza.delete(id);
    
    if (!deleted) {
      return res.status(400).json({
        success: false,
        message: 'Não foi possível excluir a pizza'
      });
    }

    res.json({
      success: true,
      message: 'Pizza excluída com sucesso'
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllPizzas,
  getPizzaById,
  createPizza,
  updatePizza,
  deletePizza
};